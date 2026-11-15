import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('One-command demo starts, seeds once and preserves records across restart',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'giftshop-demo-')),port=55000+Math.floor(Math.random()*5000),base=`http://127.0.0.1:${port}`;let child;
 async function stop(){if(!child||child.exitCode!==null)return;child.kill('SIGTERM');await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Demo shutdown timeout')),5000);child.once('exit',()=>{clearTimeout(timeout);resolve();});});}
 async function start(){child=spawn(process.execPath,['scripts/run-demo.mjs'],{env:{...process.env,PORT:String(port),DEMO_DB_PATH:path.join(dir,'demo.db')},stdio:['ignore','pipe','pipe']});await new Promise((resolve,reject)=>{let logs='';const timeout=setTimeout(()=>reject(Error('Demo readiness timeout: '+logs)),10000);child.stdout.on('data',b=>{logs+=b;if(logs.includes('MỞ WEBSITE:')){clearTimeout(timeout);resolve();}});child.once('exit',code=>{clearTimeout(timeout);reject(Error('Demo exited '+code+': '+logs));});});}
 async function products(){const response=await fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:'GiftShop-Demo-2026!'})});assert.equal(response.status,200);const cookie=response.headers.get('set-cookie').split(';')[0];return (await fetch(base+'/api/products',{headers:{Cookie:cookie}})).json();}
 try{await start();const before=await products();assert.equal(before.length,3);assert.ok(before.every(p=>p.sku.startsWith('DEMO-')&&p.stock===20));await stop();await start();const after=await products();assert.deepEqual(after,before);}finally{await stop();rmSync(dir,{recursive:true,force:true});}
});
