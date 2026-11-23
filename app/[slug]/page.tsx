import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, cityPath, cityEncodedPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, Crumbs, IconArrow, JsonLd } from '../../components/Common';
import { pagePhotos } from '../../lib/photos';

export const dynamicParams = false;

// 순차 오픈: lib/site.ts 의 OPEN_WAVE 이하 페이지만 생성
export function generateStaticParams() {
  return OPEN_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = pageEncodedPath(p);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    ...shareMeta(p.slug, `${p.kw} - ${BRAND}`, { title: c.title, description: c.description, url }),
  };
}

// 레이 모범 구조(2026-11-24): 분류 줄 → h1(키워드 + 수식어) → 설명 → 핵심 요약 → 번호 절 6개 → FAQ → 관련 링크
export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const P = PLACES[p.place];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const ph = pagePhotos(p.slug);
  const groups = [
    { h: `${p.place} 다른 안내`, items: rel.samePlace.slice(0, 5) },
    { h: `${p.city} 다른 지역`, items: rel.sameCity.slice(0, 5) },
    { h: '다른 시·군', items: rel.otherCities.slice(0, 4) },
  ].filter((g) => g.items.length);
  const relList = groups.flatMap((g) => g.items).map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '출장 지역', path: '/area/' }, { name: `${p.city} 호이스트`, path: cityEncodedPath(p.city) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, type: c.wl, description: c.description, path, area: P.admin }),
        faqJsonLd(c.faq),
        itemListJsonLd(relList.length ? relList : [{ name: `${p.city} 출장 지역 안내`, path: cityEncodedPath(p.city) }]),
      ]} />

      <section className="top top-page top-kw">
        <figure className="kw-photo"><img src={ph.hero.src} alt={ph.hero.alt} width={ph.hero.w} height={ph.hero.h} fetchPriority="high" /></figure>
        <div className="wrap top-in">
          <div className="top-text">
            <Crumbs items={[{ name: '홈', href: '/' }, { name: '출장 지역', href: '/area/' }, { name: p.city, href: cityPath(p.city) }, { name: p.kw }]} />
            <div className="x-cat">{c.cat}</div>
            <h1><span>{p.kw}</span>{' '}<span className="hero-sub">{c.h1sub}</span></h1>
            <p className="lead">{c.lead}</p>
            <Actions light />
          </div>
        </div>
      </section>

      <div className="wrap x-grid">
        <div className="x-main">
          <section className="x-sum" data-reveal>
            <h2>{p.kw} 핵심 요약</h2>
            <p>{c.summary}</p>
            <dl>{c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </section>
          <article className="x-article">
            {c.sections.map((x) => <section key={x.h}><h2>{x.h}</h2><p>{x.p}</p></section>)}
          </article>
          <div className="x-photos">
            {ph.strip.map((x) => <figure key={x.src}><img src={x.small} alt={x.alt} width={640} height={Math.round((640 * x.h) / x.w)} loading="lazy" decoding="async" /></figure>)}
          </div>
          <section className="x-faq faq" id="faq">
            <h2>{p.kw} 자주 묻는 질문</h2>
            {c.faq.map((f) => <details key={f.q}><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}
          </section>
        </div>
        <aside className="x-side">
          <h3>바로 확인</h3>
          <dl>{c.facts.slice(2, 4).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <Actions />
        </aside>
      </div>

      <div className="wrap">
        <section className="sec related">
          {groups.map((g) => <div key={g.h}><h3>{g.h}</h3><ul>{g.items.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>)}
          {groups.length === 0 && <div><h3>출장 지역</h3><ul><li><Link href={cityPath(p.city)}>{p.city} 출장 지역 전체<IconArrow /></Link></li></ul></div>}
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions light />
        </div>
      </section>
    </main>
  );
}
