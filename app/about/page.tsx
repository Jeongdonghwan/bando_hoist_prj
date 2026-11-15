// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). lib/site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, openCities } from '../../lib/data';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { Crumbs, JsonLd, SectionHead } from '../../components/Common';
import { BRAND, BUSINESS, CONTACT, UPDATED, shareMeta, tel, smsHref } from '../../lib/site';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}은 호이스트 제작·수리와 중고 호이스트 이전 설치를 하는 곳입니다. 하는 일, 출장 지역, 연락 방법을 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  const cities = openCities();
  const of = (d: string) => cities.filter((c) => CITIES[c].do === d).join(', ');
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <section className="top top-page">
        <div className="wrap">
          <Crumbs items={[{ name: '홈', href: '/' }, { name: '소개' }]} />
          <h1>{BRAND} 소개</h1>
          <p className="lead">{BRAND}은 호이스트를 제작하고 수리하는 업체입니다.</p>
        </div>
      </section>
      <div className="wrap">
        <section className="sec">
          <SectionHead title="하는 일" />
          <p className="prose-p">호이스트 제작과 수리, 중고 호이스트 이전·설치·매매를 합니다.</p>
          <p className="prose-p">크레인 제작, 무선리모컨 설치, 모터·트로리바 제작 설치, 아이빔 행거 제작도 합니다.</p>
        </section>
        <section className="sec">
          <SectionHead title="출장 지역" />
          <p className="prose-p">충남 {of('충남')}, 충북 {of('충북')} 현장으로 방문합니다.</p>
          <p className="prose-p">강원({of('강원')})은 일정을 통화로 조율합니다. 시·군별 안내는 <Link href="/area/">출장 지역</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <SectionHead title="연락 방법" />
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a> 또는 <a href={smsHref}>문자</a>로 받습니다. 영업시간은 통화로 확인합니다.</p>
          {BUSINESS.address && <p className="prose-p">작업장 주소는 {BUSINESS.address}입니다.</p>}
          {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
          {BUSINESS.place && <p className="prose-p"><a href={BUSINESS.place} target="_blank" rel="noopener">네이버 플레이스</a>에서도 볼 수 있습니다.</p>}
          <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
        </section>
      </div>
    </main>
  );
}
