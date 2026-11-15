// Chỉ chạy với database demo riêng. Không tạo giao dịch để làm bằng chứng người dùng thật.
if(process.env.DEMO_CONFIRM!=='YES')throw Error('Dùng database demo riêng, đặt DEMO_CONFIRM=YES và ADMIN_PASSWORD.');
const base=process.env.DEMO_URL||'http://localhost:3000';
const login=await fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:process.env.ADMIN_PASSWORD})});
if(!login.ok)throw Error('Đăng nhập demo thất bại');const cookie=login.headers.get('set-cookie').split(';')[0];
async function post(endpoint,data){const r=await fetch(base+'/api/'+endpoint,{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify(data)});const b=await r.json();if(!r.ok)throw Error(b.error);return b;}
try{
 const existing=await (await fetch(base+'/api/products',{headers:{Cookie:cookie}})).json();
 for(const [sku,name,category,price] of [['DEMO-KEY','Móc khóa Đà Nẵng [DEMO]','Móc khóa',25000],['DEMO-CUP','Ly gốm lưu niệm [DEMO]','Gốm sứ',85000],['DEMO-CARD','Bưu thiếp phố cổ [DEMO]','Bưu thiếp',15000]]){
  if(existing.some(p=>p.sku===sku))continue;
  const p=await post('products',{sku,name,category,price});await post('stock',{product_id:p.id,qty:20,note:'Dữ liệu DEMO, không phải nhập hàng thật'});
 }
 console.log('Đã chuẩn bị 3 sản phẩm DEMO; không tạo đơn bán giả.');
}finally{await fetch(base+'/api/logout',{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:'{}'});}
