import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { OPEN_PAGES, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, Crumbs, IconArrow, JsonLd, SectionHead } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `호이스트 정비 노트 | ${BRAND}`;
const DESC = '호이스트 고장 증상, 작업 전 점검, 중고 호이스트 고르는 법, 체인·와이어 호이스트 차이처럼 상담 때 자주 받는 질문을 한 편에 하나씩 정리합니다.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('blog', `${BRAND} 호이스트 정비 노트`, { title: TITLE, description: DESC, url: '/blog/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');

export default function BlogIndex() {
  const posts = getPosts();
  const hubs = OPEN_PAGES.filter((p) => p.unit === '시군' && !p.mod).slice(0, 9);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '정비 노트', path: '/blog/' }]),
        itemListJsonLd(posts.length ? posts.map((p) => ({ name: p.title, path: postEncodedPath(p) })) : hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="top top-page">
        <div className="wrap">
          <Crumbs items={[{ name: '홈', href: '/' }, { name: '정비 노트' }]} />
          <h1>호이스트 정비 노트</h1>
          <p className="lead">고장 증상, 점검, 중고 호이스트 고르는 법처럼 현장마다 공통인 내용을 적습니다. 현장마다 다른 비용 숫자와 규격 수치는 단정하지 않습니다.</p>
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead k="POSTS" title="최근 글" />
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => <li key={p.slug} data-reveal><Link href={postPath(p)}><span className="meta">{fmt(p.publishedAt)}</span><h3>{p.title}</h3><p>{p.description}</p></Link></li>)}
            </ol>
          ) : (
            <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 아래 지역별 호이스트 안내 페이지를 참고해 주세요.</p>
          )}
        </section>
        <section className="sec">
          <SectionHead k="LINKS" title="지역별 호이스트 안내" />
          <ul className="linklist cols3">{hubs.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
