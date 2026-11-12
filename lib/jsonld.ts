import { SITE_URL, SITE_NAME, BRAND, CONTACT, BUSINESS } from './site';

// 업체 — 플레이스 주소·좌표. 영업시간은 미등록이라 넣지 않는다.
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/workshop.jpg`,
  telephone: CONTACT.phone,
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '충청남도', addressLocality: '천안시 동남구', streetAddress: BUSINESS.streetAddress },
  geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
  sameAs: [BUSINESS.place],
  areaServed: ['충청남도', '충청북도', '강원특별자치도'],
  knowsAbout: ['호이스트 제작', '호이스트 수리', '중고 호이스트 이전 설치', '중고 호이스트 매매', '크레인 제작', '무선리모컨 설치', '모터 제작', '트로리바 제작 설치', '아이빔 행거 제작'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
  name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: 'ko', publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org', '@type': 'Service', name: o.name, serviceType: o.type, description: o.description,
  url: `${SITE_URL}${o.path}`, areaServed: { '@type': 'Place', name: o.area }, provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL, path 는 인코딩된 경로
export const itemListJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name })),
});
