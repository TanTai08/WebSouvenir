import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const plan=JSON.parse(readFileSync(path.join(root,'config/project-plan.json'),'utf8'));
const r=spawnSync('gh',['project','item-list',String(plan.number),'--owner',plan.owner,'--limit','100','--format','json'],{encoding:'utf8',windowsHide:true});
if(r.error||r.status!==0){console.error(r.error?.message||r.stderr);process.exit(1);}
const items=JSON.parse(r.stdout).items;
function value(i,name){const key=Object.keys(i).find(k=>k.replace(/\s/g,'').toLowerCase()===name.replace(/\s/g,'').toLowerCase());return key?i[key]:null;}
const captured_at=new Date().toISOString();
const rows=items.map(i=>({issue:i.content?.number,url:i.content?.url,status:i.status||null,assignees:i.assignees||[],sprint:value(i,'Sprint'),story_points:value(i,'Story Points')}));
const data={captured_at,project:`https://github.com/users/${plan.owner}/projects/${plan.number}`,note:'Snapshot thực tại thời điểm ghi. Null là chưa có dữ liệu; không thay bằng số0 hoặc ghi lùi ngày.',rows};
const dir=path.join(root,'docs/project_snapshots');mkdirSync(dir,{recursive:true});const file=path.join(dir,captured_at.replace(/[:.]/g,'-')+'.json');writeFileSync(file,JSON.stringify(data,null,2)+'\n');console.log(`Đã ghi ${rows.length} Issue thực tế: ${path.relative(root,file)}`);
