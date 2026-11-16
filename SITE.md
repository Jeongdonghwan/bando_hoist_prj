# 반도기술 SEO 사이트 — 기획·운영

천안시 동남구 성남면 반도기술 — 호이스트 제작·수리, 중고 호이스트(중고·이전·설치·매매), 크레인 제작, 무선리모컨 설치, 모터·트로리바 제작 설치, 아이빔 행거 제작. Next.js 14 정적 export. 코드 구조는 `woori_prj` 재사용, 디자인은 기업형 남색·청록(레퍼런스 trading).
`node_modules` 는 `C:\side_Prj\woori_prj\node_modules` 로 junction.

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 남색 히어로(오른쪽 사선 작업장 사진) + 바로 아래 사진 4장 줄 + 업체 정보 줄, 작업 사양표 7행(연청록 띠), 부품 구성(남색 띠), 작업장 정보 판, 증상→먼저 볼 곳 표(연청록 띠), 청록 상담 띠, 진행 순서, 출장 지역(연청록 띠), FAQ, 정비 노트, 남색 마무리 |
| `/area/`, `/area/<시군>/` | 출장 지역 허브 21곳. 시·군 허브가 그 시·군의 열린 키워드 페이지 전부로 가는 크롤 경로 |
| `/<키워드>/` | 키워드 페이지 1,000 (`lib/compose.ts` 조합기). 히어로 오른쪽(모바일은 제목 위) 사진 1장 + 요약 상자 아래 사진 3장 (`lib/photos.ts` pagePhotos, 슬러그로 돌림·한 페이지 안 중복 없음) |
| `/blog/`, `/blog/<슬러그>/` | 호이스트 정비 노트 — `content/blog/*.md` 45편, **date 비움 = 비공개**. 글 0편일 때 `/blog/_none/` 자리표시(noindex, deploy.sh 가 삭제) |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | 열린 묶음만 |

## 키워드·오픈 묶음
원본 `keywords/반도기술_키워드.xlsx`(region_kw_prj 복사본) '키워드' 시트, **'생성 대상' 열 = O** 인 1,000행. 순서 = 우선순위 → 순번.
| 묶음 | 페이지 | 누적 | 내용 |
|---|---|---|---|
| 1 | 250 | 25% | 시·군 180 + 구 70 (21개 시·군 기본 3종 전부 포함) |
| 2 | 250 | 50% | 시·군 146 + 구 104 |
| 3 | 250 | 75% | 시·군 250 |
| 4 | 250 | 100% | 시·군 33 + 산업단지 33 + 동·읍·면 184 |

나머지 12,499행은 엑셀에서 '생성 대상'을 O 로 더 표시하고 `build_pages.py` 를 다시 돌리면 묶음 5, 6 …(400행씩)으로 붙는다 → `data/drip.json` `extra: [{"wave":5,"date":"YYYY-MM-DD"}]`.

```bash
python -I scripts/places_src.py      # 지역 사실 → data/places.json
python -I scripts/build_pages.py     # 엑셀 → data/site-pages.json + keywords/반도기술_키워드_페이지.xlsx
python -I scripts/make_og.py         # og (public/og, git 제외)
OPEN_WAVE=4 npx next build           # 미리보기: cd out && python -m http.server 18993
python -I ~/.claude/skills/site-launch/scripts/check_all.py C:/side_Prj/bando_hoist_prj
python -I scripts/drip/schedule_posts.py <오픈일>   # 블로그 45편 날짜 배정(하루 1·2편, 30일) + drip.json launch
python -I scripts/drip/drip_status.py data/drip.json  # 오늘 열 묶음 (launch null → WAVE=0)
bash scripts/deploy.sh <묶음> <URL>  # git remote(origin) 필요 — 아직 없음
```

## 사실 근거 (지어낸 수치 없음)
- 네이버 플레이스 1854586411 (`source/facts.md`, `source/place_1854586411.json`): 상호, 소개글 7줄, 대표키워드(충북·충남·천안 호이스트), 주소 성남면 석곡1길 2-4(지번 석곡리 421-1). 주소 뒤 '구보다농기계충남동부대리점'은 같은 건물 표기라 쓰지 않음. 영업시간 미등록 → "통화로 확인".
- 대표번호 010-4894-4795 (사용자 확정).
- 업체 홈페이지 010-4894-4795.114web.kr — 2026-11-12 curl 1회, 호스팅 만료 안내 페이지(제목만 "충북 충남 천안호이스트"). 내용 없음 → `source/homepage/index.html` 만 보관.
- 사진: 플레이스 2장 중 **작업장 외관(거리뷰) 1장만** 실제 사진(`public/img/workshop.jpg`). 다른 1장은 광고 배너라 안 씀. 그 외 6장은 Unsplash 무료 라이선스 사진(`public/img/stock/`, 출처·작가 `data/stock.json`) — 업체 작업 사진이 아니므로 alt·캡션은 장면 설명만("현장"·"시공 사례" 금지).
- 출장: 충남·충북 = 플레이스 대표키워드 + 사용자 확정 지역. 강원 6곳은 "출장 일정은 통화로 조율".
- 지역 사실(`scripts/places_src.py`): 확실한 것만. 산업단지 정식 명칭 확인 필요 곳(제천제1·2, 당진 송산2일반, 천안북부BIT, 진천송두, 음성성본, 동화첨단의료기기)은 본문에서 이름을 쓰지 않음 — `천안북부BIT산업단지` 키워드 3쪽은 제목에만 이름이 있고 본문은 "천안시 공장 지대" 일반 문장.
- 호이스트 일반 지식(구성·고장 증상·점검 항목)은 일반 설명으로만. 가격·경력·실적·정격하중·톤수·법정 검사 주기 숫자 없음(안전검사 대상 여부는 "검사기관·안전보건공단에 확인").

## 디자인 (테크·B2B 변형 — 기업형 남색·청록, 2026-11-13 개편)
- 레퍼런스: `C:\side_Prj\web_Agency\public\references\trading\` (index·about·services·contact). 빌린 것: 반투명 흐림 고정 헤더 + 오른쪽 전화 슬랩, 남색 전체 히어로 + 오른쪽 사선으로 자른 사진에 남색 그라데이션, 하위 페이지 남색 page-hero, 띠 리듬(흰 → 연청록 → 남색 → 흰 → 청록 CTA → 남색 마무리 → 더 짙은 푸터), 가운데 정렬 섹션 머리(홈 띠), 사진+카드 trust 배치(→ 작업장 정보 판 2×2), Montserrat 영문 라벨. 레퍼런스의 스톡 사진·숫자 띠·알약 태그·이모지 국기·파트너 로고는 안 씀.
- 색: 흰 #fff · 연청록 #eef5f4(사양표·증상·출장 띠) · 남색 #0a1628(헤더·히어로·부품 띠·마무리) · #13243d(정보 줄·부품 칸) · 푸터 #060d17 · 청록 #0e8f84(버튼·중간 상담 띠·라벨) / 어두운 면 위 #3fcfbb.
- 글꼴: Pretendard(본문·제목) + Montserrat(영문 라벨·전화번호). 모서리 0~4px, 버튼은 각진 청록 슬랩 + 밑줄 텍스트 링크.
- 사진: 홈 히어로 = 작업장 외관 + 히어로 바로 아래 스톡 4장 줄. 키워드 = 히어로 스톡 1장 + 요약 아래 3장. 허브·블로그 히어로 오른쪽 배경은 작업장 외관(데스크톱만). 예전 선 도면(`Drawing.tsx`, 지어낸 치수선 그림)은 삭제. `lib/compose.ts` 의 `drawing` 필드는 쓰지 않음.
- 문구: 업체가 "어디서 출발"·"거리가 있어"·"먼 지역" 식 표현 금지(멀어 보임) — "○○ 현장 방문"·"방문 일정 조율"로 씀. 주소는 푸터·작업장 정보·LocalBusiness 에만.
- 금지 지킴: 이모지·알약 버튼·라벨 칩·숫자 띠·섹션 번호·베이지·마키·지어낸 도표 없음.

## 받아야 할 정보 → `lib/site.ts`
- [ ] 도메인 (지금 SITE_URL = https://xn--ok0bu9hz2hsog.kr, `data/drip.json` siteUrl 도 임시)
- [ ] 오픈일 → `schedule_posts.py <오픈일>` (지금 launch null → WAVE=0)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 (NAVER_VERIFY·GOOGLE_VERIFY 비어 있음)
- [ ] 영업시간, 사업자등록번호
- [ ] 실제 작업 사진(있으면 히어로·og 보강)
- [ ] 천안북부BIT 등 산업단지 정식 명칭 확인
- [ ] GitHub 저장소(deploy 브랜치용 remote)
