// 데이터 로더 — data/site-pages.json(키워드 페이지), data/places.json(지역). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import { OPEN_WAVE } from './site';

export interface Page { n: number; no: number; kw: string; slug: string; place: string; city: string; unit: string; word: string; mod: string; prio: number; wave: number }
export interface Place {
  key: string; unit: string; parent: string; city: string; kind: string; name: string; admin: string; note: string; subs: string[];
  verified?: boolean; where?: string; dong?: string; dkind?: string;
}
export interface City { full: string; do: string; tier: string; traits: string; work: string; roads: string; spots: string[]; complexes: string[] }

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);

export const PLACES = placesData.places as Record<string, Place>;
export const CITIES = placesData.cities as Record<string, City>;
export const CITY_ORDER = placesData.cityOrder as string[];

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const cityPath = (city: string) => `/area/${city}/`;
export const cityEncodedPath = (city: string) => `/area/${encodeURIComponent(city)}/`;

const bySlug = new Map(OPEN_PAGES.map((p) => [p.slug, p]));
export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return bySlug.get(key);
}

export const openCities = () => CITY_ORDER.filter((c) => OPEN_PAGES.some((p) => p.city === c));
export const cityPages = (city: string) => OPEN_PAGES.filter((p) => p.city === city);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 관련 페이지 — 열린 페이지만. 같은 장소 다른 키워드 / 같은 시·군 다른 장소 / 다른 시·군 같은 단어·수식어
const byPlace = new Map<string, Page[]>();
for (const x of OPEN_PAGES) { const a = byPlace.get(x.place) || []; a.push(x); byPlace.set(x.place, a); }
export function related(p: Page) {
  const samePlace = rotate((byPlace.get(p.place) || []).filter((x) => x.slug !== p.slug), p.slug, 'sp').slice(0, 6);
  const sameCity = rotate(OPEN_PAGES.filter((x) => x.city === p.city && x.place !== p.place && x.word === p.word && !x.mod), p.slug, 'rel').slice(0, 6);
  const otherCities = rotate(OPEN_PAGES.filter((x) => x.city !== p.city && x.unit === '시군' && x.word === p.word && x.mod === p.mod), p.slug, 'oc').slice(0, 6);
  return { samePlace, sameCity, otherCities };
}
