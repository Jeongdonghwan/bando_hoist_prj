"""지역 사실 → data/places.json  (python -I scripts/places_src.py)

원칙: 확실한 것만 적는다. 수치(거리·시간·인구·업체 수) 없음.
- 산업단지 이름은 정식 명칭을 확인한 것만 complexes 에 둔다. 엑셀 보고서에서 '정식 명칭 확인 필요'로 표시된 곳
  (제천제1·2, 당진 송산2일반, 천안북부BIT, 진천송두, 음성성본, 동화첨단의료기기)은 본문에서 이름을 쓰지 않는다
  → 생활권 페이지는 verified=False 이면 지역 일반 문장으로 쓴다.
- 출장 근거: 네이버 플레이스 대표키워드(충북·충남·천안 호이스트) + 사용자 확정 지역. 강원은 '출장 일정은 통화로 조율'.
- 동·읍·면 목록은 키워드 엑셀 '지역목록' 시트(행정동 원본)에서 읽는다.
"""
import json, re, sys
from pathlib import Path
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / 'keywords' / '반도기술_키워드.xlsx'

# tier: home = 작업장 소재 시 / cn = 충남 / cb = 충북 / gw = 강원(통화로 일정 조율)
CITIES = {
    '천안': dict(full='천안시', do='충남', tier='home', traits='충남 북부의 산업·교통 중심 도시', work='산업단지와 농공단지, 도로변 소규모 제조 공장과 창고가 시 전역에 퍼져 있다', roads='경부고속도로 천안IC·북천안IC와 천안논산고속도로', spots=['성환읍', '직산읍', '목천읍'],
               complexes=['천안제2산업단지', '천안제3산업단지', '천안제4산업단지', '천안제5산업단지', '천안테크노파크산업단지', '천안백석농공단지', '천안풍세산업단지']),
    '공주': dict(full='공주시', do='충남', tier='cn', traits='백제 유적과 공주대학교가 있는 충남 중부 도시', work='탄천면 산업단지와 읍·면의 농산물 창고, 소규모 제조 공장이 섞여 있다', roads='당진영덕고속도로·서천공주고속도로와 공주IC', spots=['신관동', '유구읍', '탄천면'], complexes=['공주탄천산업단지']),
    '아산': dict(full='아산시', do='충남', tier='cn', traits='탕정 디스플레이 단지와 인주면 자동차 공장이 있는 산업 도시', work='둔포·인주·탕정 일대 산업단지와 그 주변 협력 업체 공장이 많다', roads='KTX 천안아산역이 있는 배방읍과 온양 원도심', spots=['배방읍', '탕정면', '둔포면'], complexes=['아산테크노밸리', '아산인주산업단지']),
    '논산': dict(full='논산시', do='충남', tier='cn', traits='연무읍 육군훈련소와 딸기·젓갈로 알려진 충남 남부 도시', work='농산물 저장 창고와 식품·제조 공장, 농기계 정비소가 읍·면마다 있다', roads='호남고속도로 지선과 천안논산고속도로', spots=['강경읍', '연무읍', '취암동'], complexes=[]),
    '당진': dict(full='당진시', do='충남', tier='cn', traits='제철소와 석문국가산업단지가 있는 서해안 철강 도시', work='철강·부품 공장과 그 협력 업체 작업장이 송악·석문 일대에 모여 있다', roads='서해안고속도로 송악IC·당진IC', spots=['송악읍', '석문면', '합덕읍'], complexes=['석문국가산업단지']),
    '부여': dict(full='부여군', do='충남', tier='cn', traits='백제 왕도 유적이 있는 관광·농업 군', work='농산물 창고, 농기계 정비소, 읍내 소규모 공장이 주된 현장이다', roads='서천공주고속도로 부여IC', spots=['부여읍', '규암면', '홍산면'], complexes=[]),
    '청양': dict(full='청양군', do='충남', tier='cn', traits='칠갑산과 고추로 알려진 산간 군', work='농산물 저장·가공 창고와 소규모 작업장이 읍·면에 흩어져 있다', roads='청양읍을 중심으로 정산·비봉 같은 면 지역이 국도로 이어진 길', spots=['청양읍', '정산면', '비봉면'], complexes=[]),
    '홍성': dict(full='홍성군', do='충남', tier='cn', traits='충남도청이 있는 내포신도시가 걸쳐 있는 군', work='홍성읍·광천읍 주변 공장과 축산·농업 시설 창고가 많다', roads='서해안고속도로 홍성IC와 장항선 홍성역', spots=['홍성읍', '광천읍', '홍북읍'], complexes=[]),
    '예산군': dict(full='예산군', do='충남', tier='cn', traits='사과와 덕산온천으로 알려졌고 내포신도시 일부가 걸친 군', work='농산물 창고와 삽교·예산읍 주변 제조 공장이 주된 현장이다', roads='당진영덕고속도로 예산수덕사IC', spots=['예산읍', '삽교읍', '덕산면'], complexes=[]),
    '청주': dict(full='청주시', do='충북', tier='cb', traits='충북도청과 오창·오송 산업단지가 있는 충북 중심 도시', work='청주산업단지·테크노폴리스·오창 일대의 제조 공장과 물류 창고가 많다', roads='경부·중부고속도로 청주IC·서청주IC·오창IC와 KTX 오송역', spots=['오창읍', '오송읍', '옥산면'],
               complexes=['청주산업단지', '오창과학산업단지', '오송생명과학단지', '청주테크노폴리스']),
    '제천': dict(full='제천시', do='충북', tier='cb', traits='청풍호와 한방 산업으로 알려진 충북 북부 도시', work='시내 산업단지와 봉양읍 주변 공장, 시멘트·골재 관련 작업장이 있다', roads='중앙고속도로 제천IC와 평택제천고속도로', spots=['봉양읍', '청풍면', '의림지동'], complexes=[]),
    '증평': dict(full='증평군', do='충북', tier='cb', traits='청주와 맞닿은 충북 중부의 작은 군', work='증평읍 주변 산업단지와 식품·제조 공장이 주된 현장이다', roads='중부고속도로 증평IC', spots=['증평읍', '도안면'], complexes=['증평일반산업단지']),
    '진천': dict(full='진천군', do='충북', tier='cb', traits='충북혁신도시와 여러 산업단지가 있는 군', work='진천읍·덕산읍·광혜원면 일대에 제조 공장이 넓게 들어서 있다', roads='중부고속도로 진천IC', spots=['진천읍', '덕산읍', '광혜원면'], complexes=['진천산수산업단지', '진천신척산업단지']),
    '괴산': dict(full='괴산군', do='충북', tier='cb', traits='산과 계곡이 많은 충북 중부의 농업 군', work='괴산읍 주변 산업단지와 농산물 가공 창고가 주된 현장이다', roads='중부내륙고속도로 괴산IC·연풍IC', spots=['괴산읍', '청천면', '연풍면'], complexes=['괴산대제산업단지']),
    '음성군': dict(full='음성군', do='충북', tier='cb', traits='금왕·대소 일대에 공장이 많고 충북혁신도시 일부가 있는 군', work='금왕읍·대소읍·삼성면에 제조 공장과 물류 창고가 몰려 있다', roads='중부고속도로 음성IC·대소IC와 평택제천고속도로', spots=['금왕읍', '대소읍', '맹동면'], complexes=['금왕테크노밸리']),
    '춘천': dict(full='춘천시', do='강원', tier='gw', traits='강원특별자치도청이 있는 호반 도시', work='후평산업단지와 농공단지, 시 외곽 창고·정비 작업장이 주된 현장이다', roads='서울양양고속도로와 중앙고속도로 춘천IC', spots=['후평동', '퇴계동', '동내면'], complexes=['춘천 후평산업단지', '춘천 거두농공단지', '춘천 퇴계농공단지']),
    '홍천': dict(full='홍천군', do='강원', tier='gw', traits='면적이 넓고 홍천강이 흐르는 강원 서부 군', work='홍천읍 주변 공장과 농축산 시설 창고가 읍·면에 흩어져 있다', roads='서울양양고속도로 홍천IC·내촌IC', spots=['홍천읍', '화촌면', '북방면'], complexes=[]),
    '원주': dict(full='원주시', do='강원', tier='gw', traits='기업도시·혁신도시가 있는 강원 남부 거점 도시', work='문막·우산·태장 일대 산업단지와 기업도시 공장이 많다', roads='영동·중앙고속도로 원주IC·남원주IC·문막IC', spots=['문막읍', '지정면', '태장동'],
               complexes=['원주 문막산업단지', '원주기업도시', '원주 우산산업단지', '원주 태장농공단지']),
    '횡성': dict(full='횡성군', do='강원', tier='gw', traits='한우로 알려진 원주 북쪽의 농업 군', work='우천면 산업단지와 횡성읍 주변 작업장, 축산 시설이 주된 현장이다', roads='영동고속도로 횡성IC·둔내IC', spots=['횡성읍', '우천면', '둔내면'], complexes=['횡성우천산업단지']),
    '평창': dict(full='평창군', do='강원', tier='gw', traits='동계올림픽을 치른 고원 지대 군', work='고랭지 농산물 저장 창고와 리조트·시설 정비 작업장이 많다', roads='영동고속도로 평창IC·진부IC·대관령IC', spots=['대관령면', '진부면', '봉평면'], complexes=[]),
    '강릉': dict(full='강릉시', do='강원', tier='gw', traits='KTX 강릉선이 닿는 영동 지역 중심 도시', work='강릉과학산업단지와 옥계면 산업단지, 주문진 수산 가공 작업장이 있다', roads='영동고속도로 강릉IC와 동해고속도로', spots=['주문진읍', '옥계면', '사천면'], complexes=['강릉과학산업단지', '강릉 옥계산업단지']),
}

# 구 — 엑셀 동·읍면 목록 + 한 줄
GU_NOTE = {
    '천안 동남구': '반도기술 작업장이 있는 성남면이 속한 구로, 목천·병천·풍세 같은 읍·면과 원도심 동이 함께 있다',
    '천안 서북구': '성환·직산·성거 같은 북부 읍과 백석·불당 도심이 함께 있는 구다',
    '청주 상당구': '용암·금천 같은 도심 동과 미원·낭성·가덕 같은 동쪽 면 지역이 함께 있는 구다',
    '청주 서원구': '분평·산남·개신 같은 주거 동과 남이·현도 같은 남쪽 면이 함께 있는 구다',
    '청주 흥덕구': '청주산업단지가 있는 복대·송정 일대와 오송읍·옥산면이 속한 구다',
    '청주 청원구': '오창읍과 내수읍, 율량·오근장 같은 북쪽 생활권이 속한 구다',
}

# 생활권(산업단지) — 정식 명칭 확인한 것만 verified. where = 위치를 확실히 아는 것만
ZONES = {
    '천안제2산업단지': dict(verified=True, where=''), '천안제3산업단지': dict(verified=True, where=''),
    '천안제4산업단지': dict(verified=True, where=''), '천안제5산업단지': dict(verified=True, where=''),
    '천안테크노파크산업단지': dict(verified=True, where='서북구 직산읍'), '천안백석농공단지': dict(verified=True, where='서북구 백석동'),
    '천안풍세산업단지': dict(verified=True, where='동남구 풍세면'), '천안북부BIT산업단지': dict(verified=False, where=''),
    '공주탄천산업단지': dict(verified=True, where='탄천면'), '아산테크노밸리': dict(verified=True, where='둔포면'),
    '아산인주산업단지': dict(verified=True, where='인주면'),
}

# 동·읍·면 — 확실히 아는 것만 한 줄 (없으면 본문에서 읍·면·동 일반 문장)
DONG_NOTE = {
    '광덕면': '광덕산 자락의 산간 면', '목천읍': '독립기념관이 있는 읍', '문성동': '천안 원도심의 동', '병천면': '아우내장터와 순대거리로 알려진 면',
    '성남면': '반도기술 작업장이 있는 면(석곡리)', '신방동': '아파트 단지가 많은 주거 동', '신안동': '안서동 대학가가 속한 행정동', '원성동': '천안 원도심의 동',
    '중앙동': '원도심 상가가 모인 동', '풍세면': '풍세산업단지가 있는 면', '백석동': '백석농공단지와 아파트 단지가 함께 있는 동', '불당동': '불당 신도시 아파트와 상권이 있는 동',
    '성거읍': '서북구 북쪽의 읍', '성환읍': '성환 배 과수원이 많은 천안 최북단 읍', '입장면': '거봉포도 농가가 많은 면', '직산읍': '천안테크노파크산업단지가 있는 읍',
    '쌍용동': '아파트 단지가 밀집한 동', '계룡면': '갑사가 있는 면', '반포면': '동학사가 있고 세종과 맞닿은 면', '사곡면': '마곡사가 있는 면',
    '신관동': '금강 북쪽 신시가지로 공주대학교가 있는 동', '유구읍': '직물·섬유 공장이 모여 있는 읍', '정안면': '밤 농가가 많은 면', '탄천면': '공주탄천산업단지가 있는 면',
    '도고면': '도고온천이 있는 면', '둔포면': '아산테크노밸리가 있는 면', '배방읍': 'KTX 천안아산역과 신도시 아파트가 있는 읍', '송악면': '외암민속마을이 있는 면',
    '신창면': '순천향대학교가 있는 면', '염치읍': '현충사가 있는 읍', '온양동': '온양온천 원도심', '인주면': '자동차 공장과 인주산업단지가 있는 면',
    '탕정면': '디스플레이 단지가 있는 면', '강경읍': '젓갈 시장으로 알려진 금강변 읍', '노성면': '명재고택이 있는 면',
}


def main():
    wb = load_workbook(XLSX, read_only=True)
    region_rows = list(wb['지역목록'].iter_rows(values_only=True))[1:]
    subs = {r[0]: [re.sub(r'\(.*?\)', '', x).strip() for x in (r[6] or '').split(',') if x.strip()] for r in region_rows}
    kw = list(wb['키워드'].iter_rows(values_only=True))
    head = kw[0]
    ci = {h: i for i, h in enumerate(head)}
    units = {}
    for r in kw[1:]:
        units.setdefault(r[ci['지역(대표)']], (r[ci['지역단위']], r[ci['상위지역']]))

    def top(label):
        u, parent = units[label]
        return label if u == '시·군' else top(parent)

    places = {}
    for label, (unit, parent) in units.items():
        city = top(label)
        C = CITIES[city]
        if unit == '시·군':
            P = dict(kind='시군', name=label, admin=f"{C['do']} {C['full']}", note=C['traits'], subs=subs.get(label, []))
        elif unit == '구':
            gu = label.split()[-1]
            P = dict(kind='구', name=label, admin=f"{C['do']} {C['full']} {gu}", note=GU_NOTE[label], subs=subs.get(label, []))
        elif unit == '생활권':
            z = ZONES.get(label, dict(verified=False, where=''))
            P = dict(kind='생활권', name=label, admin=f"{C['do']} {C['full']}" + (f" {z['where']}" if z['where'] else ''), note='', verified=z['verified'], where=z['where'], subs=[])
        else:  # 동·읍면 — 라벨이 '천안 광덕면' 또는 '문성동'
            dong = label.split()[-1]
            gu = parent.split()[-1] if units[parent][0] == '구' else ''
            sib = [x for x in subs.get(parent, []) if x != dong]
            P = dict(kind='동읍면', name=label, dong=dong, admin=' '.join(x for x in (C['do'], C['full'], gu, dong) if x),
                     note=DONG_NOTE.get(dong, ''), dkind=dong[-1], subs=sib)
        places[label] = dict(key=label, unit=unit, parent=parent, city=city, **P)
    order = list(CITIES)
    out = dict(cities=CITIES, cityOrder=order, places=places)
    (ROOT / 'data' / 'places.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    sys.stdout.reconfigure(encoding='utf-8')
    from collections import Counter
    print('places', len(places), Counter(p['kind'] for p in places.values()))


if __name__ == '__main__':
    main()
