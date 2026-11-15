"""Điền thành viên vào slot và gán Issue theo role. Không thay tác giả commit.
Ví dụ: python scripts/assign_member.py --role Backend --github USER --name 'Họ tên' --student-id MSSV
Mặc định chỉ cập nhật local và in kế hoạch. --apply gọi GitHub; --invite gửi lời mời cộng tác (cần quyền quản lý).
"""
import argparse,csv,json,re,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--role',required=True,choices=['PM','Tech Lead','Backend','Frontend','QA'])
p.add_argument('--github',required=True);p.add_argument('--name');p.add_argument('--student-id');p.add_argument('--apply',action='store_true');p.add_argument('--invite',action='store_true')
a=p.parse_args();user=a.github.removeprefix('@')
if not re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?',user):p.error('Username không hợp lệ')
file=root/'config/team.json';team=json.loads(file.read_text());repo=team['repository'];member=next(m for m in team['members'] if m['role']==a.role)
if any(m['github'].lower()==user.lower() and m is not member for m in team['members'] if m['github']):p.error('Tài khoản đã ở vị trí khác; hãy kiểm tra phân công')
def gh(*args):return subprocess.check_output(['gh',*args],text=True)
if a.apply:
 gh('api',f'users/{user}')
 if a.invite:gh('api','--method','PUT',f'repos/{repo}/collaborators/{user}','-f','permission=push')
 issues=json.loads(gh('issue','list','--repo',repo,'--state','all','--limit','1000','--json','number,title'))
 with (root/'docs/Backlog.csv').open(encoding='utf-8-sig') as f:tasks={r['ID'] for r in csv.DictReader(f) if r['Role']==a.role}
 for i in issues:
  if i['title'].split()[0] in tasks:gh('issue','edit',str(i['number']),'--repo',repo,'--add-assignee',user)
member['github']=user
if a.name is not None:member['name']=a.name
if a.student_id is not None:member['student_id']=a.student_id
file.write_text(json.dumps(team,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Đã cập nhật slot {member["slot"]}: {a.role} → @{user}. '+('Đã gửi yêu cầu gán Issue.' if a.apply else 'Chưa gửi thay đổi lên GitHub; dùng --apply khi sẵn sàng.'))
print('Commit config/team.json qua PR. Chưa tự cập nhật PDF đã xuất; xuất lại hồ sơ trước nộp.')
