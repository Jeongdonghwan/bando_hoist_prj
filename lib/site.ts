// 사이트 설정 — 연락처·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: 네이버 플레이스 1854586411(source/facts.md) — 상호 반도기술, 소개글(호이스트 제작·수리 전문, 중고 호이스트 중고·이전·설치·매매,
//   크레인 제작, 무선리모컨 설치, 모터·트로리바 제작 설치, 아이빔행거 제작), 대표키워드(충북·충남·천안 호이스트). 대표번호는 사용자 확정.
//   주소 뒤의 '구보다농기계충남동부대리점'은 같은 건물 표기라 쓰지 않는다. 영업시간 미등록.

// 도메인 미정 — 지금은 로컬 미리보기 주소. 정해지면 SITE_URL 환경변수 또는 이 기본값을 바꾼다.
export const SITE_URL = process.env.SITE_URL || 'http://127.0.0.1:18993';
export const BRAND = '반도기술';
export const SITE_NAME = `${BRAND} | 호이스트 제작·수리 · 중고 호이스트 이전 설치`;

export const CONTACT = { phone: '010-4894-4795' }; // 영업시간 미등록 → 통화로 확인

export const BUSINESS = {
  name: BRAND,
  streetAddress: '성남면 석곡1길 2-4',
  address: '충남 천안시 동남구 성남면 석곡1길 2-4',
  geo: { lat: 36.7412647, lng: 127.2220703 },
  place: 'https://m.place.naver.com/place/1854586411/home',
  bizNumber: '', // TODO 사업자등록번호
};

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다 (data/drip.json, scripts/drip/)
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);
export const UPDATED = '2026-11-16'; // content revision date - bump when page text changes

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.phone.replace(/[^0-9]/g, '')}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만 (도메인 확정 후 받아 넣기)
export const NAVER_VERIFY = '';
export const GOOGLE_VERIFY = '';
