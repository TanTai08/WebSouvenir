"""Rebuild PM working reports and the 10-slide deck from versioned sources.
Requires reportlab, python-docx, python-pptx (development only).
Does not invent approvals, personal details, meeting results or signatures.
"""
from pathlib import Path
from xml.sax.saxutils import escape
from urllib.parse import quote
import csv
import os
import re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

root = Path(__file__).resolve().parents[1]
out = root / 'reports'
candidates = [os.environ.get('REPORT_FONT', ''), '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
              'C:/Windows/Fonts/arial.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf']
font = next((p for p in candidates if p and Path(p).is_file()), None)
if not font:
    raise FileNotFoundError('Set REPORT_FONT to a Unicode TrueType font.')
pdfmetrics.registerFont(TTFont('PMVN', font))
styles = getSampleStyleSheet()
for st in styles.byName.values():
    st.fontName = 'PMVN'
styles['Normal'].fontSize = 9
styles['Normal'].leading = 14
styles['Heading1'].fontSize = 15
styles['Heading1'].leading = 21
styles['Heading2'].fontSize = 11
styles['Heading2'].leading = 16
styles.add(ParagraphStyle('Cell', parent=styles['Normal'], fontSize=7.5, leading=11))


def inline(text, source=None):
    text = text.replace('**', '').replace('`', '')
    parts, offset = [], 0
    for match in re.finditer(r'\[([^\]]+)\]\(([^)]+)\)', text):
        parts.append(escape(text[offset:match.start()]))
        label, target = match.groups()
        if source and not target.startswith(('https://', 'http://', '#')):
            resolved = (root/source).parent.joinpath(target).resolve().relative_to(root)
            target = 'https://github.com/TanTai08/WebSouvenir/blob/feat/giftshop-initial/' + quote(str(resolved))
        if target.startswith(('https://', 'http://')):
            parts.append('<link href="' + escape(target, {'"': '&quot;'}) + '" color="#246B54">' + escape(label) + '</link>')
        else:
            parts.append(escape(label))
        offset = match.end()
    parts.append(escape(text[offset:]))
    return ''.join(parts)


def footer(canvas, document):
    canvas.setFont('PMVN', 8)
    canvas.drawString(44, 24, 'WebSouvenir · PM TanTai08 / Codex hỗ trợ · Dự thảo, chưa phê duyệt')
    canvas.drawRightString(550, 24, str(document.page))


def export(stem, title, sources, dictionary=False):
    story = []
    current_source = None
    doc = Document()
    doc.core_properties.title = title
    doc.core_properties.author = 'PM TanTai08; assisted by OpenAI Codex'
    doc.sections[0].header.paragraphs[0].text = 'WEBSOUVENIR — HỒ SƠ LÀM VIỆC, CHƯA PHÊ DUYỆT'

    def paragraph(text, style='Normal'):
        story.extend([Paragraph(inline(text, current_source), styles[style]), Spacer(1, 5)])
        if style.startswith('Heading'):
            doc.add_heading(text.lstrip('#').strip(), 1 if style == 'Heading1' else 2)
        else:
            doc.add_paragraph(text)

    def table(rows):
        cells = [[Paragraph(inline(v, current_source), styles['Cell']) for v in row] for row in rows]
        tbl = Table(cells, colWidths=[507/len(rows[0])] * len(rows[0]), repeatRows=1)
        tbl.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E7F0E8')),
            ('GRID', (0, 0), (-1, -1), .35, colors.HexColor('#C7D7CA')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.extend([tbl, Spacer(1, 8)])
        dt = doc.add_table(rows=0, cols=len(rows[0]))
        dt.style = 'Table Grid'
        for row in rows:
            for cell, value in zip(dt.add_row().cells, row):
                cell.text = value

    for index, source in enumerate(sources):
        current_source = source
        if index:
            story.append(PageBreak())
            doc.add_page_break()
        pending = []
        def flush():
            if pending:
                table(pending[:])
                pending.clear()
        for raw in (root / source).read_text().splitlines():
            line = raw.strip()
            if line.startswith('|'):
                cells = [v.strip() for v in line.strip('|').split('|')]
                if not all(set(v) <= set('-: ') for v in cells):
                    pending.append(cells)
                continue
            flush()
            if not line or line.startswith('```'):
                continue
            if line.startswith('#'):
                paragraph(line.lstrip('#').strip(), 'Heading1' if not line.startswith('##') else 'Heading2')
            else:
                paragraph(line)
        flush()
    if dictionary:
        story.append(PageBreak())
        doc.add_page_break()
        paragraph('Từ điển chi tiết20 gói — baseline đề xuất', 'Heading1')
        rows = list(csv.DictReader((root/'docs/pm/WBS_DICTIONARY.csv').open(encoding='utf-8-sig', newline='')))
        for row in rows:
            heading = f"{row['Work package']} / {row['Story']} / {row['Issue']} — {row['Đầu ra']}"
            block = [Paragraph(inline(heading), styles['Heading2'])]
            doc.add_heading(heading, 2)
            for line in [
                f"Owner: {row['Owner đề xuất']}; {row['Sprint dự kiến']}; {row['Ngày lịch dự kiến']} ngày lịch; {row['Điểm đề xuất']} điểm đề xuất.",
                'Phụ thuộc: ' + (row['Phụ thuộc dự kiến'] or 'không có trong baseline đề xuất'),
                'Tiêu chí: ' + row['Tiêu chí chấp nhận'],
                'Evidence: ' + row['Bằng chứng cần có'],
            ]:
                block.append(Paragraph(inline(line), styles['Normal']))
                doc.add_paragraph(line)
            block.append(Spacer(1, 12))
            story.append(KeepTogether(block))
    SimpleDocTemplate(str(out/(stem+'.pdf')), leftMargin=44, rightMargin=44, topMargin=38,
                      bottomMargin=45, title=title,
                      author='PM TanTai08; assisted by OpenAI Codex').build(story, onFirstPage=footer, onLaterPages=footer)
    doc.save(out/(stem+'.docx'))
    print('Built', stem)


export('01_Project_Charter_DRAFT', 'Điều lệ dự án WebSouvenir — Draft', ['docs/01_Project_Charter_DRAFT.md'])
export('02_WBS_Dictionary_DRAFT', 'WBS & Dictionary WebSouvenir — Draft',
       ['docs/02_WBS_Dictionary_DRAFT.md', 'docs/pm/WBS_COVERAGE.md'], dictionary=True)
export('05_Rubric_Self_Assessment_DRAFT', 'Rubric tự đối chiếu — chưa chấm điểm', ['docs/05_Rubric_Self_Assessment_DRAFT.md'])
export('07_PM_Management_Pack_DRAFT', 'Bộ quản trị và evidence PM TanTai08 — Draft', [
    'docs/pm/README.md', 'docs/roles/PM.md', 'docs/pm/SCOPE_ACCEPTANCE_DRAFT.md',
    'docs/pm/STAKEHOLDER_INTERVIEW_DRAFT.md', 'docs/pm/SPRINT1_REVIEW_RETRO_DRAFT.md',
    'docs/pm/SPRINT2_PLAN_PROPOSED.md', 'docs/pm/RISK_CHANGE_CONTROL.md',
    'docs/pm/EVIDENCE_INDEX.md', 'docs/pm/DEFENSE_RUNBOOK.md',
])

text = (root/'docs/pm/DEFENSE_SLIDES_DRAFT.md').read_text()
slides = []
for block in re.split(r'(?m)^#(?=\d+ — )', text):
    if not block.strip():
        continue
    lines = block.strip().splitlines()
    number, title = lines[0].split(' — ', 1)
    body = [line for line in lines[1:] if line.strip() and not line.startswith('Ghi chú:')]
    notes = next(line.removeprefix('Ghi chú:').strip() for line in lines if line.startswith('Ghi chú:'))
    slides.append((int(number), title, body, notes))
assert [s[0] for s in slides] == list(range(1, 11))
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
for number, title, body, notes in slides:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = RGBColor.from_string('F3F6F1')
    content = [(.7, .45, 12, .45, 'WEBSOUVENIR / QLDA VKU · DỰ THẢO · SNAPSHOT15/11/2026', 12, False),
               (.7, 1.35, 12, .95, title, 32, True),
               (.7, 2.7, 11.8, 3.7, '\n'.join(body), 22, False),
               (.7, 6.85, 12, .35, f'{number:02d}/10 · PM TanTai08 / Codex hỗ trợ · Chưa nghiệm thu', 11, False)]
    for x, y, width, height, value, size, bold in content:
        box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(width), Inches(height))
        frame = box.text_frame
        frame.word_wrap = True
        for j, line in enumerate(value.splitlines()):
            p = frame.paragraphs[0] if j == 0 else frame.add_paragraph()
            p.text = line
            p.font.name = 'Arial'
            p.font.size = Pt(size)
            p.font.bold = bold
            p.font.color.rgb = RGBColor.from_string('246B54')
            p.space_after = Pt(14)
    slide.notes_slide.notes_text_frame.text = notes
prs.save(out/'05_Presentation_DRAFT.pptx')
styles['Title'].fontSize = 26
styles['Title'].leading = 34
styles['Heading2'].fontSize = 17
styles['Heading2'].leading = 25
story = []
for number, title, body, notes in slides:
    if number > 1:
        story.append(PageBreak())
    story.extend([Paragraph(f'{number}/10 · DỰ THẢO / SNAPSHOT15/11/2026', styles['Normal']),
                  Spacer(1, 25), Paragraph(inline(title), styles['Title']), Spacer(1, 25)])
    for line in body:
        story.extend([Paragraph(inline(line), styles['Heading2']), Spacer(1, 14)])
SimpleDocTemplate(str(out/'05_Presentation_DRAFT.pdf'), pagesize=(960, 540), leftMargin=55,
                  rightMargin=55, topMargin=35, bottomMargin=35,
                  title='WebSouvenir — 10 slide dự thảo').build(story)
print('Built 10 slides with speaker notes and PDF.')
