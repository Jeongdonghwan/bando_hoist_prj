# 반도기술 SEO 사이트 — 기획·운영

천안시 동남구 성남면 반도기술 — 호이스트 제작·수리, 중고 호이스트(중고·이전·설치·매매), 크레인 제작, 무선리모컨 설치, 모터·트로리바 제작 설치, 아이빔 행거 제작. Next.js 14 정적 export. 코드 구조는 `woori_prj` 재사용, 디자인은 새 템플릿(도면 톤).
`node_modules` 는 `C:\side_Prj\woori_prj\node_modules` 로 junction.

## 구조
| 경로 | 내용 |
|---|---|
| `/` | 도면 격자 히어로(선 그림 + 표제란), 작업 사양표 7행, 부품 구성(강청색 띠), 증상→먼저 볼 곳 표, 빨강 상담 띠, 진행 순서, 출장 지역 표, 작업장(거리뷰 1장), FAQ, 정비 노트 |
| `/area/`, `/area/<시군>/` | 출장 지역 허브 21곳. 시·군 허브가 그 시·군의 열린 키워드 페이지 전부로 가는 크롤 경로 |
| `/<키워드>/` | 키워드 페이지 1,000 (`lib/compose.ts` 조합기) |
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
- 대표번호 010-8819-9119 (사용자 확정).
- 업체 홈페이지 010-8819-9119.114web.kr — 2026-11-12 curl 1회, 호스팅 만료 안내 페이지(제목만 "충북 충남 천안호이스트"). 내용 없음 → `source/homepage/index.html` 만 보관.
- 사진: 플레이스 2장 중 **작업장 외관(거리뷰) 1장만** 사용(`public/img/workshop.jpg`). 다른 1장은 광고 배너이고 가운데 사진이 스톡으로 의심돼 쓰지 않음. 나머지 시각 요소는 직접 그린 선 도면(`components/Drawing.tsx`, 구조 설명용·치수 없음).
- 출장: 충남·충북 = 플레이스 대표키워드 + 사용자 확정 지역. 강원 6곳은 "출장 일정은 통화로 조율".
- 지역 사실(`scripts/places_src.py`): 확실한 것만. 산업단지 정식 명칭 확인 필요 곳(제천제1·2, 당진 송산2일반, 천안북부BIT, 진천송두, 음성성본, 동화첨단의료기기)은 본문에서 이름을 쓰지 않음 — `천안북부BIT산업단지` 키워드 3쪽은 제목에만 이름이 있고 본문은 "천안시 공장 지대" 일반 문장.
- 호이스트 일반 지식(구성·고장 증상·점검 항목)은 일반 설명으로만. 가격·경력·실적·정격하중·톤수·법정 검사 주기 숫자 없음(안전검사 대상 여부는 "검사기관·안전보건공단에 확인").

## 디자인 (테크·B2B 변형 — 도면 톤)
- 색: 흰 #fff · 연회색 #edf0f3(격자 상단·띠) · 짙은 강청색 #12324f(부품 띠·버튼·마무리 #0b2238) · 신호 빨강 #e5322d(중간 상담 띠, 치수선, 모서리 표시, 마커). 다른 사이트(비계 그라파이트+노랑, 스카이 검정+주황, 누수 흰+청록)와 안 겹침.
- 글꼴: Pretendard + ui-monospace 라벨(섹션 라벨·표 머리·빵부스러기·전화번호).
- 히어로: 24px 도면 격자 위 왼쪽 제목, 오른쪽 선 도면(아이빔·트롤리·호이스트·양정 치수선, 빨간 모서리 마크). 아래 도면 표제란(dl). 모바일은 도면이 제목 위.
- 서비스는 사양표(table), 부품 구성은 1큰+5 목록, 고장은 증상 표. 버튼: 각진 강청색 슬랩(왼쪽 빨간 5px) + 밑줄 텍스트 링크.
- 금지 지킴: 이모지·알약 버튼·라벨 칩·숫자 띠·섹션 번호·베이지·마키 없음. 파비콘 = 강청색 사각 + 흰 아이빔 + 빨간 훅.
- 참고: web-design tones §6(테크·B2B) 토큰 구조, 기술 도면 표제란·치수선 관례, crain_prj 단계 오픈 구조.

## 받아야 할 정보 → `lib/site.ts`
- [ ] 도메인 (지금 SITE_URL = http://127.0.0.1:18993, `data/drip.json` siteUrl 도 임시)
- [ ] 오픈일 → `schedule_posts.py <오픈일>` (지금 launch null → WAVE=0)
- [ ] 서치어드바이저·서치콘솔 소유확인 코드 (NAVER_VERIFY·GOOGLE_VERIFY 비어 있음)
- [ ] 영업시간, 사업자등록번호
- [ ] 실제 작업 사진(있으면 히어로·og 보강)
- [ ] 천안북부BIT 등 산업단지 정식 명칭 확인
- [ ] GitHub 저장소(deploy 브랜치용 remote)
