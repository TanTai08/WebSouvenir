import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const env={...process.env,HOST:'127.0.0.1',PORT:process.env.PORT||'3000',DB_PATH:process.env.DEMO_DB_PATH||path.join(root,'data/demo.db'),ADMIN_PASSWORD:'GiftShop-Demo-2026!',COOKIE_SECURE:'0'};
const url=`http://127.0.0.1:${env.PORT}`;
console.log('CHẾ ĐỘ DEMO LOCAL — dữ liệu mẫu, không dùng cho production.');
const child=spawn(process.execPath,[path.join(root,'server.js')],{env,stdio:['inherit','pipe','inherit']});
child.stdout.pipe(process.stdout);
let exited=false;child.on('exit',code=>{exited=true;process.exitCode=code||0;});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
try{
 let ready=false;
 for(let i=0;i<60;i++){if(exited)throw Error('Server không khởi động; kiểm tra port và database.');try{const r=await fetch(url);if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}
 if(!ready)throw Error('Server chưa sẵn sàng');
 await new Promise((resolve,reject)=>{const seed=spawn(process.execPath,[path.join(root,'scripts/demo.mjs')],{env:{...env,DEMO_CONFIRM:'YES',DEMO_URL:url},stdio:'inherit'});seed.on('exit',c=>c===0?resolve():reject(Error('Không chuẩn bị được demo. Nếu đã đổi mật khẩu demo, dùng DB_PATH mới hoặc đăng nhập bằng mật khẩu đã đổi.')));});
 console.log(`\nMỞ WEBSITE: ${url}\nTài khoản: admin\nMật khẩu DEMO: ${env.ADMIN_PASSWORD}\nDừng: Ctrl+C. Dữ liệu demo được giữ tại data/demo.db.\n`);
}catch(e){console.error(e.message);child.kill();process.exitCode=1;}
