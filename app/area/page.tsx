import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, OPEN_PAGES, openCities, cityPath, cityEncodedPath, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, Crumbs, IconArrow, JsonLd, SectionHead } from '../../components/Common';
import { BRAND, shareMeta } from '../../lib/site';

const TITLE = `호이스트 출장 지역 - 충남·충북·강원 | ${BRAND}`;
const DESC = '천안 성남면 반도기술의 호이스트 제작·수리·중고 이전 설치 출장 지역. 충남 9곳, 충북 6곳은 출장 지역이고 강원 6곳은 일정을 통화로 조율합니다.';
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/area/' },
  ...shareMeta('area', '호이스트 출장 지역', { title: TITLE, description: DESC, url: '/area/' }),
};

const DOS = [
  { d: '충남', note: '작업장이 있는 천안을 포함한 출장 지역입니다.' },
  { d: '충북', note: '플레이스 대표 키워드(충북 호이스트)에 맞춘 출장 지역입니다.' },
  { d: '강원', note: '거리가 있어 작업 내용을 듣고 출장 일정을 통화로 조율합니다.' },
];

export default function AreaIndex() {
  const cities = openCities();
  const top = OPEN_PAGES.filter((p) => p.unit === '시군' && !p.mod);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '출장 지역', path: '/area/' }]),
        itemListJsonLd([...cities.map((c) => ({ name: `${c} 호이스트 출장 지역`, path: cityEncodedPath(c) })), ...top.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))]),
      ]} />
      <section className="top top-page">
        <div className="wrap">
          <Crumbs items={[{ name: '홈', href: '/' }, { name: '출장 지역' }]} />
          <h1>호이스트 출장 지역</h1>
          <p className="lead">천안시 동남구 성남면 작업장에서 충남·충북으로 출장합니다. 강원 춘천·홍천·원주·횡성·평창·강릉은 출장 일정을 통화로 조율합니다.</p>
          <Actions />
        </div>
      </section>
      <div className="wrap">
        {DOS.map(({ d, note }) => (
          <section key={d} className="sec">
            <SectionHead k={d === '충남' ? 'CHUNGNAM' : d === '충북' ? 'CHUNGBUK' : 'GANGWON'} title={`${d} 시·군`} sub={note} />
            <table className="area-table" data-reveal>
              <tbody>
                {cities.filter((c) => CITIES[c].do === d).map((c) => (
                  <tr key={c}>
                    <th scope="row"><Link href={cityPath(c)}>{CITIES[c].full}</Link></th>
                    <td>
                      <span className="area-trait">{CITIES[c].traits}</span>
                      {top.filter((p) => p.city === c).map((p) => <Link key={p.slug} href={pagePath(p)}>{p.kw}</Link>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
        <p className="more-line"><Link href="/" className="btn-text">작업 사양표로 돌아가기 <IconArrow /></Link></p>
      </div>
    </main>
  );
}
