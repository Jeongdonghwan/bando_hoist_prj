// 공통 UI — 이모지 없이 선 아이콘, 각진(0~4px) 버튼, 영문 라벨 섹션 머리(번호 없음).
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, UPDATED, tel, smsHref } from '../lib/site';
import type { Photo } from '../lib/photos';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

export const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconPin = () => <Svg d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" size={17} />;

// 로고 글리프 — 남색 사각(청록 테두리) + 아이빔 + 훅 (app/icon.png 와 같은 모양, 헤더가 짙어 색만 맞춤)
export const Mark = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="mark">
    <rect x="0.75" y="0.75" width="30.5" height="30.5" fill="#13243d" stroke="#3fcfbb" strokeWidth="1.5" />
    <path d="M6 8h20M6 11h20M16 8v3" stroke="#fff" strokeWidth="2" fill="none" />
    <path d="M16 11v7m0 0a4 4 0 1 1-4 4" stroke="#3fcfbb" strokeWidth="2.4" fill="none" strokeLinecap="square" />
  </svg>
);

// 본문 버튼 묶음 — 주 행동(전화) 슬랩 1개 + 보조 텍스트 링크
export const Actions = ({ sms = true, map = false, light = false }: { sms?: boolean; map?: boolean; light?: boolean }) => (
  <div className={light ? 'actions on-dark' : 'actions'}>
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    {sms && <a className="btn-text" href={smsHref}><IconMsg /><span>명판·현장 사진 문자로 보내기</span><IconArrow /></a>}
    {map && <a className="btn-text" href={BUSINESS.place} target="_blank" rel="noopener noreferrer"><IconPin /><span>네이버 플레이스 위치</span></a>}
  </div>
);

// 섹션 머리 — 영문 라벨 앞 청록 선이 그려지며 등장 + 제목. c = 가운데 정렬(홈 띠 섹션)
export const SectionHead = ({ k, title, sub, c }: { k?: string; title: string; sub?: string; c?: boolean }) => (
  <header className={c ? 'sh c' : 'sh'} data-reveal>
    {k && <span className="sh-k">{k}</span>}
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

// 사진 줄 — 히어로 바로 아래. 캡션은 장면 설명(스톡은 업체 작업으로 표기하지 않음)
export const PhotoStrip = ({ photos, label, home }: { photos: Photo[]; label: string; home?: boolean }) => (
  <section className={home ? 'photo-strip ps-home' : 'photo-strip'} aria-label={label}>
    <div className="wrap ps-grid">
      {photos.map((p) => (
        <figure key={p.src}>
          <img src={p.small} alt={p.alt} width={640} height={Math.round((640 * p.h) / p.w)} loading="lazy" decoding="async" />
          <figcaption>{p.alt}</figcaption>
        </figure>
      ))}
    </div>
  </section>
);

export const Crumbs = ({ items }: { items: { name: string; href?: string }[] }) => (
  <nav className="crumbs" aria-label="경로">
    {items.map((it, i) => (
      <span key={i}>{i > 0 && <i>/</i>}{it.href ? <Link href={it.href}>{it.name}</Link> : <b>{it.name}</b>}</span>
    ))}
  </nav>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <Mark />
        <span className="logo-text"><b>{BRAND}</b><small>HOIST · CRANE · 천안 성남면</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/area/" className="hide-m">출장 지역</Link>
        <Link href="/blog/" className="hide-m">호이스트 정비 노트</Link>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>호이스트 제작·수리 · 중고 호이스트 중고·이전·설치·매매 · 크레인 제작 · 무선리모컨 설치 · 모터·트로리바 제작 설치 · 아이빔 행거 제작</p>
        <p><Link href="/about/">소개</Link> · <Link href="/area/">출장 지역</Link> · <Link href="/blog/">호이스트 정비 노트</Link> · <a href="/rss.xml">RSS</a></p>
      </div>
      <dl className="foot-info">
        <div><dt>상호</dt><dd>{BRAND}</dd></div>
        {BUSINESS.bizNumber && <div><dt>사업자</dt><dd>{BUSINESS.bizNumber}</dd></div>}
        <div><dt>전화</dt><dd><a href={tel}>{CONTACT.phone}</a></dd></div>
        <div><dt>작업장</dt><dd>{BUSINESS.address}</dd></div>
        <div><dt>영업시간</dt><dd>미등록 · 통화로 확인</dd></div>
      </dl>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 최종 수정 <time dateTime={UPDATED}>{UPDATED}</time> · 상담 때 받은 연락처와 현장 주소는 방문·견적 안내에만 씁니다.</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <a href={smsHref} className="sb-sms"><IconMsg />사진 문자</a>
  </div>
);
