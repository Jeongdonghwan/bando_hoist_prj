import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getPost, postPath, postEncodedPath, ogKey } from '../../../lib/blog';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { Actions, Crumbs, IconArrow, JsonLd, SectionHead } from '../../../components/Common';
import { BRAND, SITE_URL, shareMeta } from '../../../lib/site';

export const dynamicParams = false;

// 글이 0편이면 정적 export 가 빈 목록을 거부하므로 자리표시 1개 → notFound (deploy.sh 가 out/blog/_none 삭제)
export function generateStaticParams() {
  const posts = getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_none' }];
}

const NONE_TITLE = `호이스트 정비 노트 준비 중 | ${BRAND}`;
const NONE_DESC = '호이스트 고장 증상, 작업 전 점검, 중고 호이스트 고르는 법 같은 정비 노트를 준비하고 있습니다. 지역별 호이스트 안내 페이지를 먼저 참고해 주세요.';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (params.slug === '_none') return { title: NONE_TITLE, description: NONE_DESC, robots: { index: false, follow: true }, alternates: { canonical: '/blog/' }, ...shareMeta('blog', NONE_TITLE, { title: NONE_TITLE, description: NONE_DESC, url: '/blog/' }) };
  const p = getPost(params.slug);
  if (!p) return {};
  const url = postEncodedPath(p);
  const share = shareMeta(ogKey(p), `${p.title} - ${BRAND}`, { title: p.title, description: p.description, url });
  return {
    title: `${p.title} | ${BRAND}`, description: p.description, alternates: { canonical: url },
    ...share, openGraph: { ...share.openGraph, type: 'article', publishedTime: p.publishedAt },
  };
}

const fmt = (d: string) => d.replace(/-/g, '.');

// 본문 인라인: [글자](/경로) 만 링크로
const Inline = ({ text }: { text: string }) => (
  <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((t, i) => {
    const m = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return t;
    return m[2].startsWith('/') ? <Link key={i} href={m[2]}>{m[1]}</Link> : m[1];
  })}</>
);

export default function BlogPost({ params }: { params: { slug: string } }) {
  if (params.slug === '_none') return (
    // 글 0편일 때만 생기는 자리표시(noindex, sitemap 제외). deploy.sh 가 out/blog/_none 을 지운다
    <main>
      <section className="top top-page"><div className="wrap">
        <Crumbs items={[{ name: '홈', href: '/' }, { name: '정비 노트', href: '/blog/' }]} />
        <h1>호이스트 정비 노트 준비 중</h1>
        <p className="lead">{NONE_DESC}</p>
      </div></section>
      <div className="wrap"><section className="sec"><SectionHead k="LINKS" title="먼저 볼 안내" /><ul className="linklist"><li><Link href="/area/">호이스트 출장 지역<IconArrow /></Link></li><li><Link href="/blog/">정비 노트 목록<IconArrow /></Link></li></ul></section></div>
    </main>
  );
  const p = getPost(params.slug);
  if (!p) notFound();
  const path = postEncodedPath(p);
  const others = getPosts().filter((x) => x.slug !== p.slug).slice(0, 5);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '정비 노트', path: '/blog/' }, { name: p.title, path }]),
        {
          '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, inLanguage: 'ko',
          datePublished: p.publishedAt, dateModified: p.publishedAt, image: `${SITE_URL}/og/${encodeURIComponent(ogKey(p))}.jpg`,
          mainEntityOfPage: `${SITE_URL}${path}`, author: { '@id': `${SITE_URL}/#business` }, publisher: { '@id': `${SITE_URL}/#business` }, keywords: p.keyword,
        },
        itemListJsonLd(others.length ? others.map((x) => ({ name: x.title, path: postEncodedPath(x) })) : [{ name: '호이스트 정비 노트', path: '/blog/' }]),
      ]} />
      <section className="top top-page">
        <div className="wrap">
          <Crumbs items={[{ name: '홈', href: '/' }, { name: '정비 노트', href: '/blog/' }]} />
          <h1>{p.title}</h1>
          <p className="lead mono">{fmt(p.publishedAt)} · {BRAND}</p>
        </div>
      </section>
      <div className="wrap">
        <article className="prose post">
          {p.sections.map((s, i) => (
            <section key={s.h} data-reveal>
              <h2>{s.h}</h2>
              {s.blocks.map((b, j) => {
                if (typeof b === 'string') return <p key={j} className={i === 0 && j === 0 ? 'first' : ''}><Inline text={b} /></p>;
                const Tag = b.ol ? 'ol' : 'ul';
                return <Tag key={j} className="ticks">{b.items.map((t, k) => <li key={k}><Inline text={t} /></li>)}</Tag>;
              })}
            </section>
          ))}
        </article>
        <section className="sec">
          <SectionHead k="CONTACT" title="명판 사진과 증상을 먼저 보내 주세요" />
          <p className="prose-p">호이스트 명판, 전체 모습, 레일과 천장 사진을 문자로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </section>
        {others.length > 0 && (
          <section className="sec">
            <SectionHead k="MORE" title="다른 글" />
            <ul className="linklist">{others.map((x) => <li key={x.slug}><Link href={postPath(x)}>{x.title}<IconArrow /></Link></li>)}</ul>
          </section>
        )}
      </div>
    </main>
  );
}
