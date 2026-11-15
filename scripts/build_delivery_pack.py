"""Build the editable/PDF delivery appendix from the versioned Markdown and UAT CSV.
Needs reportlab and python-docx. Does not fill results or sign for anyone.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import csv
import os
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document

root = Path(__file__).resolve().parents[1]
paths = [os.environ.get('REPORT_FONT', ''), '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
         'C:/Windows/Fonts/arial.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf']
font = next((p for p in paths if p and Path(p).is_file()), None)
if not font:
    raise FileNotFoundError('Set REPORT_FONT to a Unicode TrueType font.')
pdfmetrics.registerFont(TTFont('DeliveryVN', font))
styles = getSampleStyleSheet()
for st in styles.byName.values():
    st.fontName = 'DeliveryVN'
styles['Normal'].fontSize = 9
styles['Normal'].leading = 14
styles['Heading1'].fontSize = 15
styles['Heading1'].leading = 21
styles['Heading2'].fontSize = 11
styles['Heading2'].leading = 16
story = []
doc = Document()
doc.sections[0].header.paragraphs[0].text = 'WEBSOUVENIR — PHỤ LỤC BÀN GIAO / UAT — CHƯA NGHIỆM THU'

def paragraph(text, style='Normal'):
    story.extend([Paragraph(escape(text), styles[style]), Spacer(1, 5)])
    if style == 'Heading1':
        doc.add_heading(text, 1)
    elif style == 'Heading2':
        doc.add_heading(text, 2)
    else:
        doc.add_paragraph(text)

def table(rows):
    grid = [[Paragraph(escape(cell), styles['Normal']) for cell in row] for row in rows]
    t = Table(grid, colWidths=[507 / len(rows[0])] * len(rows[0]), repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E7F0E8')),
        ('GRID', (0, 0), (-1, -1), .35, colors.HexColor('#C7D7CA')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.extend([t, Spacer(1, 8)])
    dt = doc.add_table(rows=0, cols=len(rows[0]))
    dt.style = 'Table Grid'
    for row in rows:
        for cell, value in zip(dt.add_row().cells, row):
            cell.text = value

sources = ['DELIVERY_READINESS.md', 'USER_GUIDE.md', 'FREE_HTTPS_DEMO.md',
           'UAT_SIGNOFF_DRAFT.md', 'SUBMISSION_CHECKLIST.md']
for i, filename in enumerate(sources):
    if i:
        story.append(PageBreak())
        doc.add_page_break()
    pending = []
    def flush():
        if pending:
            table(pending[:])
            pending.clear()
    for raw in (root / 'docs' / filename).read_text().splitlines():
        line = raw.strip()
        if line.startswith('|'):
            cells = [x.strip() for x in line.strip('|').split('|')]
            if not all(set(x) <= set('-: ') for x in cells):
                pending.append(cells)
            continue
        flush()
        if not line or line.startswith('```'):
            continue
        paragraph(line.lstrip('#').strip() if line.startswith('#') else line.replace('`', ''),
                  'Heading1' if line.startswith('# ') else 'Heading2' if line.startswith('## ') else 'Normal')
    flush()

cases = list(csv.DictReader((root / 'docs/UAT_PLAN.csv').open(encoding='utf-8-sig', newline='')))
for index, case in enumerate(cases):
    if index % 2 == 0:
        story.append(PageBreak())
        doc.add_page_break()
        paragraph('Phiếu chạy UAT — ghi kết quả thực tế', 'Heading1')
    paragraph(case['ID'] + ' — ' + case['Mục tiêu'], 'Heading2')
    for label in ['Tiền điều kiện', 'Các bước và dữ liệu', 'Kết quả mong đợi']:
        paragraph(label + ': ' + case[label])
    for label in ['Kết quả thực tế / PASS, FAIL hoặc BLOCKED', 'Người kiểm / thời điểm', 'Issue lỗi / bằng chứng']:
        paragraph(label + ': __________________________________________________')
    story.append(Spacer(1, 13))

def footer(canvas, document):
    canvas.setFont('DeliveryVN', 8)
    canvas.drawString(44, 24, 'Phụ lục chuẩn bị bởi Codex · Chưa có kết quả UAT / chữ ký thật')
    canvas.drawRightString(550, 24, str(document.page))

out = root / 'reports'
out.mkdir(exist_ok=True)
SimpleDocTemplate(str(out / '06_UAT_Delivery_Pack_DRAFT.pdf'), leftMargin=44, rightMargin=44,
                  topMargin=38, bottomMargin=45).build(story, onFirstPage=footer, onLaterPages=footer)
doc.save(out / '06_UAT_Delivery_Pack_DRAFT.docx')
print('Built delivery appendix from 5 documents and 15 UAT cases; results left blank.')
