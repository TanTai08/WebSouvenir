"""Chạy sau khi có quyền ghi: python scripts/create_issues.py
Không tạo Projects, không giả lập lịch sử và không tự gán bốn người chưa xác nhận.
"""
import csv,json,subprocess
repo='TanTai08/WebSouvenir'
def gh(*args):
    return subprocess.check_output(['gh',*args],text=True)
existing=json.loads(gh('issue','list','--repo',repo,'--state','all','--limit','1000','--json','title'))
seen={i['title'] for i in existing}
with open('docs/Backlog.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        title=r['ID']+' '+r['Task']
        if title in seen: continue
        body=f"## WBS\n{r['WBS']}\n## Vai trò dự kiến\n{r['Role']}\n## Sprint\n{r['Sprint']}\n## Tiêu chí chấp nhận\n{r['Acceptance']}\n## Ước lượng\n{r['Points']} điểm dự kiến, nhóm phải Planning Poker lại.\n## Bằng chứng\nĐiền PR, test và review khi hoàn thành."
        args=['issue','create','--repo',repo,'--title',title,'--body',body]
        if r['Role']=='PM': args+=['--assignee','TanTai08']
        print(gh(*args))
