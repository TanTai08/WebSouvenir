import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {readFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(root,'data'),{recursive:true});
const db=new DatabaseSync(process.env.DB_PATH||path.join(root,'data/giftshop.db'));
db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL,salt TEXT NOT NULL,hash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','staff')));
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER REFERENCES users(id),expires INTEGER);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,sku TEXT UNIQUE NOT NULL,name TEXT NOT NULL,category TEXT NOT NULL,price INTEGER NOT NULL CHECK(price>=0),stock INTEGER NOT NULL DEFAULT 0 CHECK(stock>=0),active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY,created TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),user_id INTEGER REFERENCES users(id),total INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'paid');
CREATE TABLE IF NOT EXISTS items(order_id INTEGER REFERENCES orders(id),product_id INTEGER REFERENCES products(id),name TEXT NOT NULL,qty INTEGER NOT NULL,price INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS movements(id INTEGER PRIMARY KEY,product_id INTEGER REFERENCES products(id),qty INTEGER NOT NULL,note TEXT NOT NULL,user_id INTEGER REFERENCES users(id),created TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));`);
function createUser(username,password,role){const salt=randomBytes(16).toString('hex');db.prepare('INSERT INTO users(username,salt,hash,role) VALUES(?,?,?,?)').run(username,salt,scryptSync(password,salt,64).toString('hex'),role);}
if(!db.prepare('SELECT id FROM users LIMIT 1').get()){
 if(!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<12)throw Error('Set ADMIN_PASSWORD to at least 12 characters on first start.');
 createUser('admin',process.env.ADMIN_PASSWORD,'admin');
}
db.exec(`CREATE TABLE IF NOT EXISTS checkout_requests(user_id INTEGER REFERENCES users(id),request_key TEXT NOT NULL,payload TEXT NOT NULL,order_id INTEGER REFERENCES orders(id),PRIMARY KEY(user_id,request_key));`);
const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.trim().length<=max;
const positive=n=>Number.isSafeInteger(n)&&n>0&&n<=1000000000;
function fail(message,status=400){throw Object.assign(Error(message),{status});}
function tx(fn){db.exec('BEGIN IMMEDIATE');try{const r=fn();db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}}
async function body(req){let data='';for await(const c of req){data+=c;if(data.length>100000)fail('Dữ liệu quá lớn',413);}try{const parsed=JSON.parse(data||'{}');if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))fail('Nội dung phải là JSON object');return parsed;}catch{fail('JSON không hợp lệ');}}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
const attempts=new Map();
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost'), p=url.pathname;
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'");
 if(!p.startsWith('/api/')){const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};if(!files[p])return json(res,404,{error:'Không tìm thấy'});res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript; charset=utf-8':p.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');res.end(readFileSync(path.join(root,'public',files[p])));return;}
 if(!['GET','HEAD'].includes(req.method)&&req.headers.origin&&req.headers.origin!==`${process.env.COOKIE_SECURE==='1'?'https':'http'}://${req.headers.host}`)fail('Nguồn yêu cầu không hợp lệ',403);
 if(p==='/api/login'&&req.method==='POST'){
  const key=req.socket.remoteAddress,now=Date.now();let a=attempts.get(key);if(!a||now-a.start>900000){a={start:now,count:0};attempts.set(key,a);}if(a.count>=15)fail('Thử lại sau 15 phút',429);a.count++;
  const b=await body(req),u=typeof b.username==='string'?db.prepare('SELECT * FROM users WHERE username=?').get(b.username):null;
  if(typeof b.password!=='string'||b.password.length>256||!u||!timingSafeEqual(Buffer.from(u.hash,'hex'),scryptSync(b.password,u.salt,64)))fail('Sai tài khoản hoặc mật khẩu',401);
  attempts.delete(key);const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(token,u.id,now+28800000);
  res.setHeader('Set-Cookie',`session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.COOKIE_SECURE==='1'?'; Secure':''}`);return json(res,200,{username:u.username,role:u.role});
 }
 const token=(req.headers.cookie||'').match(/(?:^|;\s*)session=([a-f0-9]{64})(?:;|$)/)?.[1];
 const u=token&&db.prepare('SELECT u.id,u.username,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE token=? AND expires>?').get(token,Date.now());if(!u)fail('Vui lòng đăng nhập',401);
 const admin=()=>{if(u.role!=='admin')fail('Chỉ quản trị viên được thực hiện',403);};
 if(p==='/api/me')return json(res,200,u);
 if(p==='/api/logout'&&req.method==='POST'){db.prepare('DELETE FROM sessions WHERE token=?').run(token);res.setHeader('Set-Cookie','session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return json(res,200,{ok:true});}
 if(p==='/api/users'&&req.method==='POST'){admin();const b=await body(req);if(typeof b.username!=='string'||!/^[a-zA-Z0-9_-]{3,30}$/.test(b.username)||typeof b.password!=='string'||b.password.length<12||b.password.length>256||!['admin','staff'].includes(b.role))fail('Tài khoản 3–30 ký tự, mật khẩu ít nhất 12 ký tự, vai trò admin/staff');createUser(b.username,b.password,b.role);return json(res,201,{ok:true});}
 if(p==='/api/products'&&req.method==='GET')return json(res,200,db.prepare('SELECT * FROM products WHERE active=1 ORDER BY id DESC').all());
 if(p==='/api/products'&&req.method==='POST'){admin();const b=await body(req);if(!text(b.name,160)||!text(b.sku,40)||!text(b.category,80)||!Number.isSafeInteger(b.price)||b.price<0||b.price>1000000000)fail('Thông tin sản phẩm không hợp lệ');const r=db.prepare('INSERT INTO products(sku,name,category,price) VALUES(?,?,?,?)').run(b.sku.trim(),b.name.trim(),b.category.trim(),b.price);return json(res,201,{id:Number(r.lastInsertRowid)});}
 if(/^\/api\/products\/\d+$/.test(p)&&req.method==='PATCH'){admin();const b=await body(req),id=Number(p.split('/').pop());if(!text(b.name,160)||!text(b.category,80)||!Number.isSafeInteger(b.price)||b.price<0||b.price>1000000000)fail('Thông tin không hợp lệ');const r=db.prepare('UPDATE products SET name=?,category=?,price=? WHERE id=? AND active=1').run(b.name.trim(),b.category.trim(),b.price,id);if(!r.changes)fail('Không tìm thấy',404);return json(res,200,{ok:true});}
 if(/^\/api\/products\/\d+$/.test(p)&&req.method==='DELETE'){admin();const r=db.prepare('UPDATE products SET active=0 WHERE id=? AND stock=0').run(Number(p.split('/').pop()));if(!r.changes)fail('Chỉ lưu trữ sản phẩm có tồn kho bằng 0');return json(res,200,{ok:true});}
 if(p==='/api/stock'&&req.method==='POST'){admin();const b=await body(req);if(!positive(b.product_id)||!positive(b.qty)||!text(b.note,500))fail('Nhập số lượng nguyên dương và lý do');tx(()=>{const product=db.prepare('SELECT * FROM products WHERE id=? AND active=1').get(b.product_id);if(!product||product.stock+b.qty>1000000000)fail('Sản phẩm hoặc số lượng không hợp lệ');db.prepare('UPDATE products SET stock=stock+? WHERE id=?').run(b.qty,b.product_id);db.prepare('INSERT INTO movements(product_id,qty,note,user_id) VALUES(?,?,?,?)').run(b.product_id,b.qty,b.note,u.id);});return json(res,200,{ok:true});}
 if(p==='/api/movements'&&req.method==='GET')return json(res,200,db.prepare('SELECT m.*,p.name FROM movements m JOIN products p ON p.id=m.product_id ORDER BY m.id DESC LIMIT 200').all());
 if(p==='/api/orders'&&req.method==='GET')return json(res,200,db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 200').all());
 if(p==='/api/orders'&&req.method==='POST'){const b=await body(req);if(!Array.isArray(b.items)||!b.items.length||b.items.length>100)fail('Giỏ hàng không hợp lệ');const key=req.headers['idempotency-key'];if(typeof key!=='string'||!/^[A-Za-z0-9_-]{16,100}$/.test(key))fail('Thiếu mã xác nhận đơn hợp lệ');const payload=JSON.stringify(b.items);const id=tx(()=>{const prior=db.prepare('SELECT * FROM checkout_requests WHERE user_id=? AND request_key=?').get(u.id,key);if(prior){if(prior.payload!==payload)fail('Mã xác nhận đã dùng cho giỏ hàng khác',409);return prior.order_id;}let total=0;const seen=new Set();const rows=b.items.map(i=>{if(!i||!positive(i.qty)||!positive(i.product_id)||seen.has(i.product_id))fail('Số lượng hoặc dòng hàng không hợp lệ');seen.add(i.product_id);const product=db.prepare('SELECT * FROM products WHERE id=? AND active=1').get(i.product_id);if(!product||product.stock<i.qty)fail('Không đủ tồn kho');total+=product.price*i.qty;if(!Number.isSafeInteger(total))fail('Giá trị đơn quá lớn');return {...i,product};});const id=Number(db.prepare('INSERT INTO orders(user_id,total) VALUES(?,?)').run(u.id,total).lastInsertRowid);for(const i of rows){db.prepare('INSERT INTO items VALUES(?,?,?,?,?)').run(id,i.product_id,i.product.name,i.qty,i.product.price);db.prepare('UPDATE products SET stock=stock-? WHERE id=?').run(i.qty,i.product_id);db.prepare('INSERT INTO movements(product_id,qty,note,user_id) VALUES(?,?,?,?)').run(i.product_id,-i.qty,`Bán đơn #${id}`,u.id);}db.prepare('INSERT INTO checkout_requests VALUES(?,?,?,?)').run(u.id,key,payload,id);return id;});return json(res,201,{id});}
 if(/^\/api\/orders\/\d+\/cancel$/.test(p)&&req.method==='POST'){admin();const id=Number(p.split('/')[3]);tx(()=>{const o=db.prepare('SELECT * FROM orders WHERE id=?').get(id);if(!o||o.status!=='paid')fail('Đơn không tồn tại hoặc đã hủy');for(const i of db.prepare('SELECT * FROM items WHERE order_id=?').all(id)){const current=db.prepare('SELECT stock FROM products WHERE id=?').get(i.product_id);if(current.stock+i.qty>1000000000)fail('Tồn kho sau hoàn hàng vượt giới hạn');db.prepare('UPDATE products SET stock=stock+?,active=1 WHERE id=?').run(i.qty,i.product_id);db.prepare('INSERT INTO movements(product_id,qty,note,user_id) VALUES(?,?,?,?)').run(i.product_id,i.qty,`Hủy đơn #${id}`,u.id);}db.prepare("UPDATE orders SET status='cancelled' WHERE id=?").run(id);});return json(res,200,{ok:true});}
 if(p==='/api/stats'&&req.method==='GET'){admin();return json(res,200,{revenue:db.prepare("SELECT COALESCE(SUM(total),0) AS value FROM orders WHERE status='paid'").get().value,orders:db.prepare("SELECT COUNT(*) AS value FROM orders WHERE status='paid'").get().value,products:db.prepare('SELECT COUNT(*) AS value FROM products WHERE active=1').get().value,low:db.prepare('SELECT * FROM products WHERE stock<5 AND active=1').all(),daily:db.prepare("SELECT date(created,'+7 hours') AS day,SUM(total) AS total FROM orders WHERE status='paid' GROUP BY day ORDER BY day DESC LIMIT 30").all(),top:db.prepare("SELECT i.name,SUM(i.qty) AS qty FROM items i JOIN orders o ON o.id=i.order_id WHERE o.status='paid' GROUP BY i.product_id ORDER BY qty DESC LIMIT 5").all()});}

 if(p==='/api/password'&&req.method==='POST'){
  const b=await body(req),record=db.prepare('SELECT * FROM users WHERE id=?').get(u.id);
  if(typeof b.current_password!=='string'||b.current_password.length>256||typeof b.new_password!=='string'||b.new_password.length<12||b.new_password.length>256)fail('Mật khẩu mới phải dài 12–256 ký tự');
  if(!timingSafeEqual(Buffer.from(record.hash,'hex'),scryptSync(b.current_password,record.salt,64)))fail('Mật khẩu hiện tại không đúng',403);
  const salt=randomBytes(16).toString('hex');tx(()=>{db.prepare('UPDATE users SET salt=?,hash=? WHERE id=?').run(salt,scryptSync(b.new_password,salt,64).toString('hex'),u.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id);});
  res.setHeader('Set-Cookie','session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return json(res,200,{ok:true});
 }
 if(/^\/api\/orders\/\d+$/.test(p)&&req.method==='GET'){
  const id=Number(p.split('/').pop()),order=db.prepare('SELECT * FROM orders WHERE id=?').get(id);if(!order)fail('Không tìm thấy đơn',404);return json(res,200,{...order,items:db.prepare('SELECT * FROM items WHERE order_id=?').all(id)});
 }
 if(p==='/api/users'&&req.method==='GET'){admin();return json(res,200,db.prepare('SELECT id,username,role FROM users ORDER BY id').all());}
 return json(res,404,{error:'Không tìm thấy'});
}catch(e){if(e.code?.startsWith('ERR_SQLITE')&&e.message.includes('UNIQUE'))return json(res,409,{error:'Mã hoặc tài khoản đã tồn tại'});if(!e.status)console.error(e);json(res,e.status||500,{error:e.status?e.message:'Lỗi hệ thống'});}});
server.listen(Number(process.env.PORT||3000),process.env.HOST||'0.0.0.0',()=>console.log('GiftShop listening on port '+(process.env.PORT||3000)));
