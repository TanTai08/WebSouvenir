"""Plot only observed, in-sprint remaining points; no invented historical days.
Requires matplotlib for report generation only. Points remain proposed until approved.
"""
from pathlib import Path
from datetime import date, timedelta
import csv
import os
import tempfile
os.environ.setdefault('MPLCONFIGDIR', str(Path(tempfile.gettempdir())/'giftshop-matplotlib-cache'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

root = Path(__file__).resolve().parents[1]
rows = list(csv.DictReader((root/'docs/pm/BURNDOWN_OBSERVED.csv').open(encoding='utf-8-sig', newline='')))
fig, axes = plt.subplots(1, 2, figsize=(11.7, 4.6), constrained_layout=True)
for ax, title, start in zip(axes, ['Sprint 1', 'Sprint 2'], [date(2026, 11, 8), date(2026, 11, 22)]):
    end = start + timedelta(days=13)
    series = sorted((date.fromisoformat(r['Ngày UTC quan sát']), float(r['Remaining points đề xuất']))
                    for r in rows if r['Sprint'] == title
                    and start <= date.fromisoformat(r['Ngày UTC quan sát']) <= end)
    if series:
        x, y = zip(*series)
        ax.plot(x, y, 'o-', color='#246B54', label=f'{len(series)} observed day(s)')
        for day, points in series:
            ax.annotate(f'{points:g}', (day, points), xytext=(0, 9), textcoords='offset points', ha='center')
        ax.set_ylim(0, max(y)*1.25+1)
        ax.legend(loc='lower left')
    else:
        ax.text(.5, .5, 'No in-sprint observations yet', ha='center', va='center', transform=ax.transAxes)
        ax.set_ylim(0, 40)
    ax.set_xlim(start-timedelta(days=1), end+timedelta(days=1))
    ax.xaxis.set_major_locator(mdates.DayLocator(interval=4))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m'))
    ax.set_title(title+' — observed remaining')
    ax.set_xlabel('Planned sprint dates (2026)')
    ax.set_ylabel('Proposed story points (not yet approved)')
    ax.grid(alpha=.2)
fig.suptitle('WebSouvenir — evidence snapshot, not reconstructed semester history')
fig.savefig(root/'docs/pm/BURNDOWN_OBSERVED.png', dpi=160)
fig.savefig(root/'reports/Burndown_Observed_Current.pdf')
print('Plotted actual in-sprint observations; future sprint scope snapshots excluded.')
