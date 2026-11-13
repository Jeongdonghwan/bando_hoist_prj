import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, PLACES, getPage, pagePath, pageEncodedPath, cityPath, cityEncodedPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, serviceJsonLd } from '../../lib/jsonld';
import { BRAND, shareMeta } from '../../lib/site';
import { Actions, Crumbs, IconArrow, JsonLd, SectionHead } from '../../components/Common';

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

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const P = PLACES[p.place];
  const rel = related(p);
  const path = pageEncodedPath(p);
  const relList = [...rel.samePlace, ...rel.sameCity, ...rel.otherCities].map((x) => ({ name: x.kw, path: pageEncodedPath(x) }));

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '출장 지역', path: '/area/' }, { name: `${p.city} 호이스트`, path: cityEncodedPath(p.city) }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, type: c.wl, description: c.description, path, area: P.admin }),
        faqJsonLd(c.faq),
        itemListJsonLd(relList.length ? relList : [{ name: `${p.city} 출장 지역 안내`, path: cityEncodedPath(p.city) }]),
      ]} />

      <section className="top top-page">
        <div className="wrap top-in">
          <div className="top-text">
            <Crumbs items={[{ name: '홈', href: '/' }, { name: '출장 지역', href: '/area/' }, { name: p.city, href: cityPath(p.city) }, { name: c.eyebrow }]} />
            <h1>{c.h1}</h1>
            <p className="lead">{c.lead}</p>
            <Actions light />
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="answer" aria-label="요약" data-reveal>
          <span className="sh-k">SUMMARY</span>
          <p>{c.answer}</p>
          <dl>{c.summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>
      </div>

      <div className="wrap">
        <section className="sec">
          <SectionHead k="SITE" title={c.region.heading} />
          <div className="cols">
            <div className="prose" data-reveal>{c.region.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
            {c.region.spots.length > 0 && (
              <aside className="memo" data-reveal>
                <h3>{c.region.spotsTitle}</h3>
                <p>{c.region.spots.join(' · ')}</p>
              </aside>
            )}
          </div>
        </section>
      </div>

      <section className="band-steel">
        <div className="wrap sec">
          <SectionHead k="DETAIL" title={c.view.heading} />
          <div className="cols">
            <div className="prose" data-reveal>{c.view.paras.map((t, i) => <p key={i}>{t}</p>)}</div>
            <div data-reveal>
              {c.view.list && <><h3 className="h3-sub">{c.view.list.title}</h3><ul className="ticks">{c.view.list.items.map((x) => <li key={x}>{x}</li>)}</ul></>}
              {c.view.table && <table className="spec-table"><tbody>{c.view.table.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead k="SCOPE" title={c.scope.heading} sub={c.scope.sub} />
          <table className="scope" data-reveal>
            <thead><tr><th scope="col">작업</th><th scope="col">내용</th></tr></thead>
            <tbody>{c.scope.rows.map((r) => <tr key={r.name} className={r.focus ? 'focus' : ''}><th scope="row">{r.name}</th><td>{r.d}</td></tr>)}</tbody>
          </table>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-in"><p>{c.cta}</p><Actions sms={false} light /></div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead k="PROCESS" title={c.steps.heading} />
          <ol className="flow reveal-group">{c.steps.items.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </section>

        <section className="sec">
          <SectionHead k="CONTACT" title={`${p.place} 상담 안내`} />
          <dl className="info" data-reveal>{c.info.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>

        <section className="sec" id="faq">
          <SectionHead k="FAQ" title={`${p.kw} 자주 묻는 질문`} />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec">
          <SectionHead k="LINKS" title={`${p.place} 관련 안내`} />
          <div className="related">
            {rel.samePlace.length > 0 && <div><h3>{p.place} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            {rel.sameCity.length > 0 && <div><h3>{p.city} 다른 지역</h3><ul>{rel.sameCity.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
            <div><h3>다른 시·군</h3><ul>
              {rel.otherCities.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}
              <li><Link href={cityPath(p.city)}>{p.city} 출장 지역 전체<IconArrow /></Link></li>
            </ul></div>
          </div>
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
