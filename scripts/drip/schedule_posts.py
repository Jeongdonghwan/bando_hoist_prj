"""미리 써 둔 블로그 글(date 비움 = 비공개)에 오픈일부터 공개 날짜를 배정한다.

  python -I scripts/drip/schedule_posts.py <YYYY-MM-DD 오픈일> [--dry]

- 순서 = content/blog/_data/keywordQueue.json 의 done 항목 순서(publishedSlug).
- 하루 글 수 = data/drip.json 의 postsPerDay(1.5 → 1편·2편 번갈아, 30일 45편). drip_status.py 와 같은 계산.
- 각 글 프런트매터 date·publishedAt 을 채우고, 큐 publishedAt 을 기록하고, data/drip.json launch 를 오픈일로 바꾼다.
- 공개는 빌드 시점에 결정된다(lib/blog.ts: date 가 빌드일 이하인 글만). 매일 빌드·배포해야 그날 글이 열린다.
"""
import datetime as dt, json, math, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
BLOG = ROOT / 'content' / 'blog'
QUEUE = BLOG / '_data' / 'keywordQueue.json'
DRIP = ROOT / 'data' / 'drip.json'


def plan(launch, n, per_day):
    """n편에 날짜를 붙인다: k일째 = floor((k+1)p) - floor(kp) 편."""
    out, k = [], 0
    while len(out) < n:
        out += [launch + dt.timedelta(k)] * (math.floor((k + 1) * per_day) - math.floor(k * per_day))
        k += 1
    return out[:n]


def set_front(text, key, val):
    head, sep, body = text.partition('\n---\n')
    head = re.sub(rf'^{key}:.*$', f'{key}: {val}', head, flags=re.M) if re.search(rf'^{key}:', head, re.M) else head + f'\n{key}: {val}'
    return head + sep + body


def demo():
    d = plan(dt.date(2026, 12, 1), 45, 1.5)
    assert d[0] == d[0] and d.count(dt.date(2026, 12, 1)) == 1 and d.count(dt.date(2026, 12, 2)) == 2
    assert d[-1] == dt.date(2026, 12, 30) and len(d) == 45
    assert set_front('---\nslug: a\ndate:\n---\nx', 'date', '2026-12-01') == '---\nslug: a\ndate: 2026-12-01\n---\nx'
    print('demo ok')


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    if len(sys.argv) < 2:
        demo(); return
    launch = dt.date.fromisoformat(sys.argv[1])
    dry = '--dry' in sys.argv
    cfg = json.loads(DRIP.read_text(encoding='utf-8'))
    q = json.loads(QUEUE.read_text(encoding='utf-8'))
    items = [x for x in q['queue'] if x['status'] == 'done' and x.get('publishedSlug')]
    dates = plan(launch, len(items), cfg.get('postsPerDay', 1.5))
    for x, d in zip(items, dates):
        f = BLOG / f"{x['publishedSlug']}.md"
        t = f.read_text(encoding='utf-8')
        for k in ('date', 'publishedAt'):
            t = set_front(t, k, d.isoformat())
        if not dry:
            f.write_text(t, encoding='utf-8', newline='\n')
        x['publishedAt'] = d.isoformat()
        print(d.isoformat(), x['publishedSlug'])
    if not dry:
        QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=0), encoding='utf-8')
        cfg['launch'] = launch.isoformat()
        DRIP.write_text(json.dumps(cfg, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'{len(items)}편 {dates[0]} ~ {dates[-1]}' + (' (dry)' if dry else ' 저장, data/drip.json launch 갱신'))


if __name__ == '__main__':
    main()
