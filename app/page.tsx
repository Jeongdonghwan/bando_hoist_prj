import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES, OPEN_PAGES, openCities, cityPath, pagePath, pageEncodedPath } from '../lib/data';
import { getPosts, postPath } from '../lib/blog';
import { BRAND, CONTACT, BUSINESS, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead, PhotoStrip } from '../components/Common';
import { STOCK } from '../lib/photos';

const HOME_TITLE = `${BRAND} | 호이스트 제작·수리, 중고 호이스트 이전 설치`;
const HOME_DESC = '천안 성남면 반도기술. 호이스트 제작·수리·이전·설치, 중고 호이스트 매매, 크레인 제작, 무선리모컨 설치. 충남·충북 출장.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 호이스트 제작·수리`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 플레이스 소개글 7줄 그대로 → 사양표. ask = 상담 때 알려 주실 것(일반 정보), word = 연결할 키워드 페이지 단어
const SCOPE = [
  { t: '호이스트 제작', d: '들 무게·양정(들어 올릴 높이)·오갈 범위·전원을 듣고 현장 사양에 맞춰 본체와 레일, 조작 장치를 짭니다', ask: '가장 무거운 물건, 천장 높이, 레일 길이', word: '호이스트제작' },
  { t: '호이스트 수리', d: '브레이크 밀림, 상승·하강 불량, 소음, 리모컨 끊김을 전기 쪽과 기계 쪽으로 나눠 원인부터 찾습니다', ask: '증상, 명판 사진, 짐을 건 상태였는지', word: '호이스트수리' },
  { t: '중고 호이스트', d: '중고·이전·설치·매매. 쓰던 호이스트를 떼어 새 작업장에 다시 달거나, 현장에 맞는 중고를 찾아 답니다', ask: '명판, 새 현장의 레일 폭과 전원', word: '호이스트' },
  { t: '크레인 제작', d: '작업장 전체를 오가며 들어야 하는 곳에 거더와 주행 장치를 포함한 크레인을 만듭니다', ask: '작업장 폭, 기둥 간격, 천장 구조', word: '호이스트제작' },
  { t: '무선리모컨 설치', d: '펜던트 스위치 대신 무선리모컨을 달아 작업자가 짐에서 떨어져 조작하게 합니다', ask: '지금 쓰는 조작 방식, 호이스트 대수', word: '호이스트' },
  { t: '모터 · 트로리바 제작 설치', d: '호이스트를 가로로 옮기는 트롤리(트로리)와 주행 모터를 만들거나 바꿔 답니다', ask: '레일 모습, 바퀴 마모·쏠림 증상', word: '호이스트수리' },
  { t: '아이빔 행거 제작', d: '레일을 걸 아이빔이 없는 창고·공장 천장 보에 행거를 만들어 아이빔을 매답니다', ask: '천장 보 사진, 레일을 놓을 위치', word: '호이스트제작' },
];

// 구성 요소 — 어디가 탈 나고 무엇을 하는지(일반 설명)
const PARTS = [
  { k: 'I-BEAM · HANGER', t: '아이빔과 행거', d: '레일이 되는 형강과 그것을 천장 보에 매다는 행거. 없으면 행거부터 제작합니다.' },
  { k: 'TROLLEY', t: '트롤리(트로리바)', d: '레일을 따라 호이스트를 옮기는 바퀴 장치. 바퀴 마모·쏠림이 생기면 수리하거나 새로 만듭니다.' },
  { k: 'HOIST BODY', t: '호이스트 본체', d: '모터·감속기·브레이크·드럼. 짐이 내려오면 브레이크, 소음이 크면 감속기부터 봅니다.' },
  { k: 'ROPE · CHAIN · HOOK', t: '와이어·체인·훅', d: '꼬임, 끊어진 가닥, 늘어난 체인, 벌어진 훅과 해지장치를 확인합니다.' },
  { k: 'CONTROL', t: '펜던트 · 무선리모컨', d: '버튼 불량, 수신 끊김, 비상정지. 펜던트를 무선리모컨으로 바꿔 달기도 합니다.' },
  { k: 'GIRDER', t: '크레인 거더', d: '작업장 전체를 덮는 크레인의 보와 주행 장치. 현장 폭에 맞춰 제작합니다.' },
];

const SIGNS: [string, string][] = [
  ['짐을 멈췄는데 조금씩 내려온다', '브레이크 라이닝·간극'],
  ['상승은 되는데 하강이 안 된다', '접점(마그네트)·리미트 스위치'],
  ['버튼을 눌러도 반응이 없다', '전원·퓨즈·조작 회로'],
  ['버튼과 반대 방향으로 움직인다', '전원 상(相) 바뀜'],
  ['감기는 소리가 거칠어졌다', '감속기 기어·베어링'],
  ['리모컨이 가끔 끊긴다', '수신기·배터리·안테나'],
  ['트롤리가 덜컹거리거나 쏠린다', '바퀴 마모·레일 상태'],
];

const FLOW = [
  { t: '상담', d: '고칠지, 새로 만들지, 중고를 옮겨 달지 정합니다. 명판·현장 사진이 있으면 함께 보내 주세요.' },
  { t: '현장 확인', d: '호이스트와 레일, 천장 구조, 전원을 함께 보고 작업 범위를 말씀드립니다.' },
  { t: '제작 · 수리', d: '정한 범위대로 부품을 손보거나 행거·트롤리·본체를 만들어 답니다.' },
  { t: '시운전', d: '짐 없이, 그다음 실제 짐으로 상승·하강·주행과 멈춤 장치를 확인합니다.' },
];

const FAQ = [
  { q: '어느 지역까지 출장하나요?', a: '충남(천안·공주·아산·논산·당진·부여·청양·홍성·예산)과 충북(청주·제천·증평·진천·괴산·음성)으로 출장합니다. 강원 춘천·홍천·원주·횡성·평창·강릉은 작업 내용을 듣고 일정을 통화로 조율합니다.' },
  { q: '비용은 어떻게 정해지나요?', a: '정해 둔 단가표는 없습니다. 고장 부위와 바꿀 부품, 설치 높이, 작업 시간대에 따라 달라 명판·현장 사진을 보고 범위를 안내합니다.' },
  { q: '다른 곳에서 설치한 호이스트도 고치나요?', a: '상담합니다. 명판으로 제조사와 형식을 확인하고, 부품을 구할 수 있는지 먼저 알려 드립니다.' },
  { q: '쓰던 호이스트를 새 공장으로 옮길 수 있나요?', a: '중고 호이스트 이전 설치를 합니다. 철거, 운반, 새 현장 레일 확인, 설치, 시운전 순서로 진행합니다.' },
  { q: '영업시간은 어떻게 되나요?', a: `등록된 영업시간이 없습니다. ${CONTACT.phone}로 전화해 확인해 주세요.` },
];

const DO_ORDER = [['충남', '출장 지역'], ['충북', '출장 지역'], ['강원', '일정은 통화로 조율']] as const;
const fmt = (d: string) => d.replace(/-/g, '.');

export default function Home() {
  const cities = openCities();
  const posts = getPosts().slice(0, 4);
  const carousel = OPEN_PAGES.filter((p) => p.unit === '시군' && !p.mod).slice(0, 30);
  const link = (word: string) => OPEN_PAGES.find((p) => p.city === '천안' && p.unit === '시군' && p.word === word && !p.mod);
  const base = (city: string) => OPEN_PAGES.find((p) => p.city === city && p.unit === '시군' && p.word === '호이스트' && !p.mod);

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(carousel.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />

      <section className="top top-home">
        <div className="wrap top-in">
          <div className="top-text">
            <p className="kicker">HOIST · CRANE — 충남 · 충북 출장 제작·수리</p>
            <h1><span>호이스트 제작·수리,</span><span>중고 호이스트 이전 설치</span></h1>
            <p className="lead">{BRAND}은 호이스트 본체부터 트롤리·모터, 아이빔 행거, 무선리모컨까지 직접 만들고 고칩니다. 쓰던 호이스트를 새 공장으로 옮겨 다는 일과 중고 매매도 함께 합니다.</p>
            <Actions light />
          </div>
          <figure className="hero-photo">
            <img src="/img/workshop.jpg" alt={`${BRAND} 작업장 외관 - 천안 동남구 성남면 석곡1길`} width={800} height={400} fetchPriority="high" />
            <figcaption>성남면 석곡리 작업장 외관 · 네이버 플레이스 거리뷰</figcaption>
          </figure>
        </div>
      </section>
      <PhotoStrip photos={[STOCK[1], STOCK[5], STOCK[0], STOCK[2]]} label="호이스트·크레인 사진" home />
      <div className="facts">
        <div className="wrap">
          <dl className="titleblock">
            <div><dt>상호</dt><dd>{BRAND}</dd></div>
            <div><dt>작업장</dt><dd>{BUSINESS.address}</dd></div>
            <div><dt>전화</dt><dd><a href={`tel:${CONTACT.phone.replace(/-/g, '')}`}>{CONTACT.phone}</a></dd></div>
            <div><dt>출장</dt><dd>충남 · 충북 · 강원(일정 조율)</dd></div>
          </dl>
        </div>
      </div>

      <section className="band-steel scope-band">
        <div className="wrap sec">
          <SectionHead c k="SCOPE" title="작업 사양표" sub="네이버 플레이스 소개에 적은 작업 일곱 가지입니다. 규격과 수량은 현장마다 실측해 정합니다." />
          <table className="scope scope-home" data-reveal>
            <thead><tr><th scope="col">작업</th><th scope="col">내용</th><th scope="col">상담 때 알려 주실 것</th></tr></thead>
            <tbody>
              {SCOPE.map((s) => {
                const p = link(s.word);
                return (
                  <tr key={s.t}>
                    <th scope="row">{p ? <Link href={pagePath(p)}>{s.t}</Link> : s.t}</th>
                    <td>{s.d}</td>
                    <td className="ask">{s.ask}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="band-navy">
        <div className="wrap sec">
          <SectionHead c k="PARTS" title="호이스트를 이루는 부분과 손보는 곳" sub="본체만 보지 않고 레일·트롤리·조작 장치까지 같이 봅니다." />
          <ul className="parts reveal-group">
            {PARTS.map((x) => <li key={x.k}><span className="pk">{x.k}</span><h3>{x.t}</h3><p>{x.d}</p></li>)}
          </ul>
        </div>
      </section>

      <div className="wrap">
        <section className="sec workshop">
          <SectionHead k="WORKSHOP" title="작업장" sub="작업장에서 제작하고, 현장에 방문해 설치·수리합니다." />
          <dl className="info trust" data-reveal>
            <div><dt>주소</dt><dd>{BUSINESS.address}</dd></div>
            <div><dt>지번</dt><dd>성남면 석곡리 421-1</dd></div>
            <div><dt>전화</dt><dd>{CONTACT.phone}</dd></div>
            <div><dt>영업시간</dt><dd>미등록 · 방문 전 통화로 확인</dd></div>
          </dl>
          <p className="more-line"><a className="btn-text" href={BUSINESS.place} target="_blank" rel="noopener noreferrer">네이버 플레이스에서 위치 보기 <IconArrow /></a></p>
        </section>
      </div>

      <section className="band-steel">
        <div className="wrap sec">
          <SectionHead k="TROUBLE" title="증상별로 먼저 보는 곳" sub="일반적인 진단 순서입니다. 짐을 든 채 멈췄다면 버튼을 반복해 누르지 말고 주변을 통제한 뒤 연락하세요." />
          <table className="spec-table signs" data-reveal>
            <thead><tr><th scope="col">증상</th><th scope="col">먼저 보는 곳</th></tr></thead>
            <tbody>{SIGNS.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody>
          </table>
          {link('호이스트수리') && <p className="more-line"><Link href={pagePath(link('호이스트수리')!)} className="btn-text">천안 호이스트 수리 안내 <IconArrow /></Link></p>}
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-in"><p>명판 사진과 증상, 현장 주소를 알려 주시면 방문 일정을 정합니다.</p><Actions sms={false} light /></div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead k="PROCESS" title="진행 순서" />
          <ol className="flow reveal-group">{FLOW.map((x) => <li key={x.t}><strong>{x.t}</strong><p>{x.d}</p></li>)}</ol>
        </section>
      </div>

      <section className="band-steel">
        <div className="wrap sec" id="area">
          <SectionHead k="AREA" title="출장 지역" sub="플레이스 대표 키워드(충북·충남·천안 호이스트) 기준입니다." />
          <table className="area-table" data-reveal>
            <tbody>
              {DO_ORDER.map(([d, note]) => (
                <tr key={d}>
                  <th scope="row">{d}<small>{note}</small></th>
                  <td>{cities.filter((c) => CITIES[c].do === d).map((c) => <Link key={c} href={cityPath(c)}>{c}</Link>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="linklist cols3">
            {cities.map((c) => base(c)).filter(Boolean).map((p) => <li key={p!.slug}><Link href={pagePath(p!)}>{p!.kw}<IconArrow /></Link></li>)}
          </ul>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead k="FAQ" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec">
          <SectionHead k="NOTE" title="호이스트 정비 노트" />
          {posts.length > 0 ? (
            <ol className="post-list">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}><span className="meta">{fmt(p.publishedAt)}</span><h3>{p.title}</h3></Link></li>)}</ol>
          ) : (
            <p className="prose-p">고장 증상, 점검, 중고 호이스트 고르는 법 같은 글을 차례로 올립니다. <Link href="/blog/">정비 노트 보기</Link></p>
          )}
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>현장 주소와 호이스트 사진만 알려 주세요</h2>
          <p>제작·수리·중고 이전 설치 중 무엇이 필요한지 정해지지 않았어도 됩니다. 상황을 듣고 함께 정합니다.</p>
          <Actions light map />
        </div>
      </section>
    </main>
  );
}
