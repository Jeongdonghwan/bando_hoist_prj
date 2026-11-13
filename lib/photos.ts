// 사진 — 작업장 외관(플레이스 거리뷰, 실제) 1장 + Unsplash 무료 사진 6장(data/stock.json).
// 스톡은 반도기술 작업 사진이 아니므로 alt·캡션은 장면 설명만 쓴다("현장"·"시공 사례" 금지).
import stock from '../data/stock.json';
import { rotate } from './data';

export type Photo = { src: string; small: string; w: number; h: number; alt: string };

export const WORKSHOP: Photo = { src: '/img/workshop.jpg', small: '/img/workshop.jpg', w: 800, h: 400, alt: '반도기술 작업장 외관 - 천안 동남구 성남면 석곡1길' };

export const STOCK: Photo[] = stock.photos.map((p) => ({
  src: `/img/stock/${p.id}.jpg`, small: `/img/stock/${p.id}-s.jpg`, w: p.w, h: p.h, alt: p.alt,
}));

// 키워드 페이지: 히어로 1장(스톡) + 요약 아래 3장(남은 스톡 + 작업장) — 한 페이지 안에서 겹치지 않음
export const pagePhotos = (seed: string) => {
  const [hero, ...rest] = rotate(STOCK, seed, 'ph');
  return { hero, strip: rotate([...rest, WORKSHOP], seed, 'ps').slice(0, 3) };
};
