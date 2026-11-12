import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITIES, PLACES, openCities, cityPages, cityEncodedPath, pagePath, pageEncodedPath } from '../../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { Actions, Crumbs, JsonLd, SectionHead } from '../../../components/Common';
import { BRAND, shareMeta } from '../../../lib/site';
import { j } from '../../../lib/ko';

export const dynamicParams = false;
export function generateStaticParams() {
  return openCities().map((city) => ({ city }));
}
const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
const KIND: Record<string, string> = { 시군: '시·군 전체', 구: '구', 생활권: '산업단지', 동읍면: '동·읍·면' };
const TRIP: Record<string, string> = {
  home: '반도기술 작업장이 있는 시입니다. 현장 확인 일정을 잡기 쉬운 권역입니다.',
  cn: '충남 출장 지역입니다. 방문 날짜는 작업 내용을 듣고 통화로 정합니다.',
  cb: '충북 출장 지역입니다. 증상과 현장 위치를 먼저 듣고 일정을 맞춥니다.',
  gw: '강원 지역은 거리가 있어 출장 일정을 통화로 조율합니다.',
};

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = dec(params.city);
  const C = CITIES[city];
  if (!C) return {};
  const title = `${city} 호이스트 제작·수리 출장 지역 | ${BRAND}`;
  const description = `${C.do} ${C.full} 호이스트 제작·수리, 중고 호이스트 이전 설치 안내 페이지 모음. ${TRIP[C.tier]}`;
  return { title, description, alternates: { canonical: cityEncodedPath(city) }, ...shareMeta(`area-${city}`, `${city} 호이스트 출장 지역`, { title, description, url: cityEncodedPath(city) }) };
}

// 시·군 허브 — 그 시·군의 열린 키워드 페이지 전부로 가는 크롤 경로
export default function CityHub({ params }: { params: { city: string } }) {
  const city = dec(params.city);
  const C = CITIES[city];
  if (!C) notFound();
  const pages = cityPages(city);
  const keys = Array.from(new Set(pages.map((p) => p.place)));
  const kinds = ['시군', '구', '생활권', '동읍면'].filter((k) => keys.some((x) => PLACES[x].kind === k));
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '출장 지역', path: '/area/' }, { name: `${city} 호이스트`, path: cityEncodedPath(city) }]),
        itemListJsonLd(pages.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="top top-page">
        <div className="wrap">
          <Crumbs items={[{ name: '홈', href: '/' }, { name: '출장 지역', href: '/area/' }, { name: city }]} />
          <h1>{city} 호이스트 제작·수리 출장 지역</h1>
          <p className="lead">{j(C.full, '은')} {C.traits}입니다. {TRIP[C.tier]} 아래에서 지역과 궁금한 내용(수리·제작·비용·설치·점검)을 고르세요.</p>
          <Actions />
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead k="SITE" title={`${city} 현장 여건`} />
          <dl className="info" data-reveal>
            <div><dt>지역</dt><dd>{C.do} {C.full}</dd></div>
            <div><dt>작업장 성격</dt><dd>{C.work}</dd></div>
            <div><dt>길</dt><dd>{C.roads}</dd></div>
            {C.complexes.length > 0 && <div><dt>산업단지</dt><dd>{C.complexes.join(' · ')}</dd></div>}
          </dl>
        </section>
        {kinds.map((k) => (
          <section key={k} className="sec">
            <SectionHead k="PAGES" title={`${city} ${KIND[k]}`} />
            {keys.filter((x) => PLACES[x].kind === k).map((key) => (
              <div key={key} className="area-block" id={key} data-reveal>
                <h3>{PLACES[key].name}</h3>
                <ul className="area-list">{pages.filter((p) => p.place === key).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
              </div>
            ))}
          </section>
        ))}
        <p className="more-line"><Link href="/area/" className="btn-text">다른 시·군 보기</Link></p>
      </div>
    </main>
  );
}
