"""페이지별 og 이미지(1200x630 JPEG) → public/og/<key>.jpg  (home, area, blog, area-<시군>, <키워드 슬러그>, blog-<글 슬러그>)
   python -I scripts/make_og.py           # 없는 것만 생성
   python -I scripts/make_og.py --force   # 전부 다시
사진이 적어(작업장 외관 1장) 배경은 사이트와 같은 도면 톤: 강청색 바탕 + 격자 + 빨간 모서리 표시, 글자 = 굵은 키워드.
네이버는 og 이미지를 가운데 정사각형으로 잘라 보여 주므로 글자는 가운데 630px 안쪽에 둔다.
"""
import datetime, json, os, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'og'
W, H = 1200, 630
SAFE_L, SAFE_W = 300, 600
BRAND, PHONE = '반도기술', '010-4894-4795'  # lib/site.ts 와 맞출 것
NAVY, RED, GRID = (18, 50, 79), (229, 50, 45), (38, 70, 99)
_FONTS = [(r'C:\Windows\Fonts\malgunbd.ttf', r'C:\Windows\Fonts\malgun.ttf', r'C:\Windows\Fonts\consola.ttf'),
          ('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf')]
BOLD, REG, MONO = next((f for f in _FONTS if Path(f[0]).exists()), _FONTS[0])


def background():
    im = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 30):
        d.line((x, 0, x, H), fill=GRID)
    for y in range(0, H, 30):
        d.line((0, y, W, y), fill=GRID)
    # 도면 테두리 + 빨간 모서리
    d.rectangle((24, 24, W - 25, H - 25), outline=(120, 150, 178), width=2)
    for (x, y, sx, sy) in ((24, 24, 1, 1), (W - 25, H - 25, -1, -1)):
        d.line((x, y, x + 40 * sx, y), fill=RED, width=5); d.line((x, y, x, y + 40 * sy), fill=RED, width=5)
    # 아이빔 + 훅 글리프 (오른쪽 바깥)
    d.rectangle((960, 120, 1140, 130), outline='white', width=2); d.rectangle((960, 150, 1140, 160), outline='white', width=2)
    d.line((1050, 130, 1050, 150), fill='white', width=2); d.rectangle((1020, 170, 1080, 220), outline='white', width=3)
    d.line((1050, 220, 1050, 330), fill='white', width=3); d.arc((1030, 320, 1070, 360), 270, 180, fill=RED, width=5)
    return im


def wrap(d, text, font, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur] if cur else lines


def render(bg, key, title, sub):
    im = bg.copy()
    d = ImageDraw.Draw(im)
    size = 76
    while True:
        f = ImageFont.truetype(BOLD, size)
        lines = wrap(d, title, f, SAFE_W)
        if (len(lines) <= 3 and all(d.textlength(x, font=f) <= SAFE_W for x in lines)) or size <= 40:
            break
        size -= 4
    y = 300 - len(lines) * size * 0.62
    d.text((SAFE_L, y - 50), 'HOIST · CRANE', font=ImageFont.truetype(MONO, 22), fill=(255, 138, 128))
    for ln in lines:
        d.text((SAFE_L, y), ln, font=f, fill='white'); y += size * 1.2
    d.text((SAFE_L, y + 14), sub, font=ImageFont.truetype(REG, 28), fill=(205, 218, 230))
    d.rectangle((SAFE_L, 528, SAFE_L + 8, 568), fill=RED)
    d.text((SAFE_L + 22, 530), f'{BRAND}  {PHONE}', font=ImageFont.truetype(BOLD, 30), fill='white')
    im.save(OUT / f'{key}.jpg', 'JPEG', quality=82, optimize=True, progressive=True)


def blog_posts():  # lib/blog.ts 와 같은 공개 규칙 ('_' 비공개, date 없거나 미래면 제외)
    today = os.environ.get('BUILD_DATE') or (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=9)).strftime('%Y-%m-%d')
    out = []
    for f in sorted((ROOT / 'content' / 'blog').glob('[!_]*.md')):
        head = f.read_text(encoding='utf-8').split('\n---', 1)[0]
        meta = dict(re.findall(r'^(\w+):[ \t]*(.*?)[ \t]*$', head, re.M))
        date = meta.get('date') or meta.get('publishedAt') or ''
        if meta.get('slug') and meta.get('title') and re.fullmatch(r'\d{4}-\d{2}-\d{2}', date) and date <= today:
            out.append((meta['slug'], meta['title'].strip('\'"')))
    return out


WL = {'호이스트': '호이스트 제작·수리 · 중고 이전 설치', '호이스트수리': '증상부터 확인 · 부품 수리 · 시운전', '호이스트제작': '현장 실측 · 사양 맞춤 제작 · 설치'}


def main():
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data' / 'site-pages.json').read_text(encoding='utf-8'))['pages']
    cities = json.loads((ROOT / 'data' / 'places.json').read_text(encoding='utf-8'))['cityOrder']
    jobs = [('home', '호이스트 제작·수리, 중고 호이스트 이전 설치', '천안 성남면 · 충남·충북 출장'),
            ('area', '호이스트 출장 지역', '충남 · 충북 · 강원(일정 조율)'),
            ('blog', '호이스트 정비 노트', '고장 증상 · 점검 · 중고 고르는 법')] + \
           [(f'area-{c}', f'{c} 호이스트 제작·수리', '출장 지역 안내') for c in cities] + \
           [(p['slug'], p['kw'], WL[p['word']]) for p in pages] + \
           [(f'blog-{s}', t, '호이스트 정비 노트') for s, t in blog_posts()]
    jobs = [j for j in jobs if force or not (OUT / f'{j[0]}.jpg').exists()]
    bg = background()
    for i, (key, title, sub) in enumerate(jobs, 1):
        render(bg, key, title, sub)
        if i % 250 == 0:
            print(i, '/', len(jobs))
    print('생성', len(jobs))


if __name__ == '__main__':
    main()
