"""키워드 엑셀 → data/site-pages.json (사이트 라우트의 단일 출처) + keywords/반도기술_키워드_페이지.xlsx

  python -I scripts/places_src.py   # 먼저 (data/places.json)
  python -I scripts/build_pages.py

원본: keywords/반도기술_키워드.xlsx '키워드' 시트. '생성 대상' 열이 O 인 행만 페이지가 된다(열 이름으로 읽는다).
순서 = 우선순위 → 순번.
- 처음 BASE 행(1,000) = 오픈 묶음 1~4 (누적 25·50·75·100%, scripts/drip/rebatch.py --plan 과 같은 방식)
- 나중에 엑셀에서 '생성 대상'을 O 로 더 표시하면 그 행들은 묶음 5, 6 … (EXTRA_SIZE 행씩) — data/drip.json 의 extra 로 날짜를 준다.
"""
import json, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / 'drip'))
from rebatch import rebatch  # noqa: E402

ROOT = HERE.parent
SRC = ROOT / 'keywords' / '반도기술_키워드.xlsx'
OUT_XLSX = ROOT / 'keywords' / '반도기술_키워드_페이지.xlsx'
SITE_URL = 'http://127.0.0.1:18993'  # 도메인 정해지면 lib/site.ts 와 같이 바꾼다
BASE, EXTRA_SIZE = 1000, 400

sys.stdout.reconfigure(encoding='utf-8')
places = json.loads((ROOT / 'data' / 'places.json').read_text(encoding='utf-8'))['places']
rows = list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))
ci = {h: i for i, h in enumerate(rows[0])}
col = lambda r, k: r[ci[k]]
sel = [r for r in rows[1:] if col(r, '키워드') and col(r, '생성 대상') == 'O']
sel.sort(key=lambda r: (col(r, '우선순위'), col(r, '순번')))

pages = []
for i, r in enumerate(sel, 1):
    label = col(r, '지역(대표)')
    assert label in places, label
    pages.append(dict(n=col(r, '순번'), no=i, kw=col(r, '키워드'), slug=col(r, '슬러그'), place=label, city=places[label]['city'],
                      unit=places[label]['kind'], word=col(r, '단어'), mod=col(r, '수식어') or '', prio=col(r, '우선순위'), wave=1))
assert len({p['slug'] for p in pages}) == len(pages)
base, extra = pages[:BASE], pages[BASE:]
rebatch(base, plan=[25, 50, 75, 100])
for i, p in enumerate(extra):
    p['wave'] = 5 + i // EXTRA_SIZE
json.dump({'pages': pages}, open(ROOT / 'data' / 'site-pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# 키워드 엑셀 (첫 시트 = 키워드 시트, 요약 시트 없음). 페이지 순서 그대로
wb = Workbook()
ws = wb.active
ws.title = '키워드'
ws.append(['순번', '키워드', '우선순위', '지역', '지역 단위', '시·군', '단어', '수식어', 'URL', '오픈 묶음'])
for p in pages:
    ws.append([p['n'], p['kw'], p['prio'], p['place'], p['unit'], p['city'], p['word'], p['mod'], f"{SITE_URL}/{p['slug']}/", p['wave']])
for c in ws[1]:
    c.font = Font(bold=True, color='FFFFFF')
    c.fill = PatternFill('solid', fgColor='12324F')
    c.alignment = Alignment(horizontal='center')
for k, w in zip('ABCDEFGHIJ', [7, 30, 8, 20, 9, 8, 13, 8, 52, 9]):
    ws.column_dimensions[k].width = w
ws.freeze_panes = 'A2'
ws.auto_filter.ref = f'A1:J{len(pages) + 1}'
wb.save(OUT_XLSX)

c = Counter(p['wave'] for p in pages)
acc = 0
for w in sorted(c):
    acc += c[w]
    print(f'묶음 {w}: {c[w]} (누적 {acc}) {dict(Counter(p["unit"] for p in pages if p["wave"] == w))}')
print('엑셀:', OUT_XLSX.name, len(pages), '행')
