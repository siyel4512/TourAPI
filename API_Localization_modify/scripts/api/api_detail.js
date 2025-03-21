
const numOfRows = "50";
const serviceKey = API_CONFIG.serviceKey;
let url;

// 공통 정보 조회
async function Check_CommonInformation(contentId) {

    if (!lang) lang = localStorage.language;
    if (!url) {
        url = Default_URL[lang];
    }
    var queryParams = url
    queryParams += "detailCommon1?";
    queryParams += `serviceKey=${serviceKey}`;
    queryParams += `&contentId=${contentId}`;
    queryParams += '&MobileOS=ETC';
    queryParams += '&MobileApp=WebTest';
    queryParams += '&defaultYN=Y'; // 기본정보 조회 여부
    queryParams += '&firstImageYN=Y'; // 원본, 썸네일 대표 이미지 조회 여부
    queryParams += '&areacodeYN=Y'; // 지역코드, 시군구코드 조회 여부
    queryParams += '&catcodeYN=Y'; // 대, 중, 소 분류코드 조회 여부
    queryParams += '&addrinfoYN=Y'; // 주소, 상세주소 조회 여부
    queryParams += '&mapinfoYN=Y'; // 좌표 x, y 조회 여부
    queryParams += '&overviewYN=Y'; // 콘텐츠 개요 조회 여부
    queryParams += '&_type=json';

    try {
        const response = await fetch(queryParams);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);

        const data = await response.json();
        //가져온 값 처리
        // const items = data?.response?.body?.items?.item;
        const items = data.response.body.items.item;
        if (!items || items.length === 0) {
            return;
        }
        return items;
        items.forEach(item => {
            const resultCode = item.resultCode; // 결과코드
            const resultMsg = item.resultMsg; // 결과메시지
            const numOfRows = item.numOfRows; // 한페이지 결과 수
            const pageNo = item.pageNo; // 페이지번호
            const totalCount = item.totalCount; // 전체 결과 수

            const contentId = item.contentid; // 콘텐츠ID
            const contentTypeId = item.contenttypeid; // 콘텐츠타입ID

            const homepage = item.homepage; // 홈페이지주소
            const tel = item.tel; // 전화번호
            const telname = item.telname; // 전화번호명

            const title = item.title; // 콘텐츠명(제목)
            const firstimage = item.firstimage; // 대표이미지(원본)
            const firstimage2 = item.firstimage2; // 대표이미지(썸네일)

            const addr1 = item.addr1; // 주소
            const addr2 = item.addr2; // 상세주소
            const zipcode = item.zipcode; // 우편번호

            const mapx = item.mapx; // GPS X좌표
            const mapy = item.mapy; // GPS Y좌표
            const mlevel = item.mlevel; // Map Level

            const overview = item.overview; // 개요

            return { overview };
        });


    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

// 소개 정보 조회
async function Check_IntroductionInformation(contentTypeId, contentId) {
    var queryParams = url
    queryParams += "detailIntro1?";
    queryParams += `serviceKey=${serviceKey}`;
    queryParams += `&numOfRows=${numOfRows}`;
    queryParams += '&pageNo=1';
    queryParams += '&MobileOS=ETC';
    queryParams += '&MobileApp=WebTest';
    queryParams += `&contentTypeId=${contentTypeId}`;
    queryParams += `&contentId=${contentId}`;
    queryParams += '&_type=json';
    try {
        const response = await fetch(queryParams);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);

        const data = await response.json();
        //가져온 값 처리
        // const items = data?.response?.body?.items?.item;
        const items = data.response.body.items.item;
        if (!items || items.length === 0) {
            return;
        }
        return items;
        items.forEach(item => {
            const resultCode = item.resultCode; // 결과코드
            const resultMsg = item.resultMsg; // 결과메시지
            const numOfRows = item.numOfRows; // 한페이지 결과 수
            const pageNo = item.pageNo; // 페이지번호
            const totalCount = item.totalCount; // 전체 결과 수

            const contentId = item.contentid; // 콘텐츠ID
            const contentTypeId = item.contenttypeid; // 콘텐츠타입ID

            //---- 관광지 (12) ----//
            const accomcount = item.accomcount; // 수용인원
            const chkbabycarriage = item.chkbabycarriage; // 유모차대여정보
            const chkcreditcard = item.chkcreditcard; // 신용카드가능정보
            const chkpet = item.chkpet; // 애완동물동반가능정보
            const expagerange = item.expagerange; // 체험가능연령
            const expguide = item.expguide; // 체험안내
            const heritage1 = item.heritage1; // 세계 문화 유산 유무

            const heritage2 = item.heritage2; // 세계 자연 유산 유무 -> 영문에는 없음
            const heritage3 = item.heritage3; // 세계 기록 유산 유무 -> 영문에는 없음

            const infocenter = item.infocenter; // 문의및안내
            const opendate = item.opendate; // 개장일
            const parking = item.parking; // 주차시설
            const restdate = item.restdate; // 쉬는날
            const useseason = item.useseason; // 이용시기
            const usetime = item.usetime; // 이용시간
            //---------------------//

            //---- 문화시설 (14) ----//
            const accomcountculture = item.accomcountculture; // 수용인원

            const chkbabycarriageculture = item.chkbabycarriageculture; // 유모차대여정보 -> 영문에는 없음
            const chkcreditcardculture = item.chkcreditcardculture; // 신용카드가능정보 -> 영문에는 없음
            const chkpetculture = item.chkpetculture; // 애완동물동반가능정보 -> 영문에는 없음
            const discountinfo = item.discountinfo; // 할인정보 -> 영문에는 없음

            const infocenterculture = item.infocenterculture; // 문의및안내
            const parkingculture = item.parkingculture; // 주차시설
            const parkingfee = item.parkingfee; // 주차요금
            const restdateculture = item.restdateculture; // 쉬는날
            const usefee = item.usefee; // 이용요금
            const usetimeculture = item.usetimeculture; // 이용시간
            const scale = item.scale; // 규모
            const spendtime = item.spendtime; // 관람소요시간
            //-----------------------//

            //---- 행사/공연/축제 (15) ----//
            const agelimit = item.agelimit; // 관람가능연령
            const bookingplace = item.bookingplace; // 예매처
            const discountinfofestival = item.discountinfofestival; // 할인정보
            const eventenddate = item.eventenddate; // 행사종료일
            const eventhomepage = item.eventhomepage; // 행사홈페이지
            const eventplace = item.eventplace; // 행사장소
            const eventstartdate = item.eventstartdate; // 행사시작일

            const festivalgrade = item.festivalgrade; // 축제등급 -> 영문에는 없음

            const placeinfo = item.placeinfo; // 행사장위치안내
            const playtime = item.playtime; // 공연시간
            const program = item.program; // 행사프로그램
            const spendtimefestival = item.spendtimefestival; // 관람소요시간
            const sponsor1 = item.sponsor1; // 주최자정보
            const sponsor1tel = item.sponsor1tel; // 주최자연락처
            const sponsor2 = item.sponsor2; // 주관사정보
            const sponsor2tel = item.sponsor2tel; // 주관사연락처
            const subevent = item.subevent; // 부대행사내용
            const usetimefestival = item.usetimefestival; // 이용요금
            //----------------------------//

            //---- 여행코스 (25) ----//
            const distance = item.distance; // 코스총거리 -> 영문에는 없음
            const infocentertourcourse = item.infocentertourcourse; // 문의및안내 -> 영문에는 없음
            const schedule = item.schedule; // 코스일정 -> 영문에는 없음
            const taketime = item.taketime; // 코스총소요시간  -> 영문에는 없음
            const theme = item.theme; // 코스테마 -> 영문에는 없음
            //-----------------------//

            //---- 레포츠 (28) ----//
            const accomcountleports = item.accomcountleports; // 수용인원

            const chkbabycarriageleports = item.chkbabycarriageleports; // 유모차대여정보 -> 영문에는 없음
            const chkcreditcardleports = item.chkcreditcardleports; // 신용카드가능정보 -> 영문에는 없음
            const chkpetleports = item.chkpetleports; // 애완동물동반가능정보  -> 영문에는 없음

            const expagerangeleports = item.expagerangeleports; // 체험가능연령
            const infocenterleports = item.infocenterleports; // 문의및안내
            const openperiod = item.openperiod; // 개장기간
            const parkingfeeleports = item.parkingfeeleports; // 주차요금
            const parkingleports = item.parkingleports; // 주차시설 
            const reservation = item.reservation; // 예약안내
            const restdateleports = item.restdateleports; // 쉬는날
            const scaleleports = item.scaleleports; // 규모
            const usefeeleports = item.usefeeleports; // 입장료
            const usetimeleports = item.usetimeleports; // 이용시간
            //---------------------//

            //---- 숙박 (32) ----//
            const accomcountlodging = item.accomcountlodging; // 수용가능인원
            const benikia = item.benikia; // 베니키아여부
            const checkintime = item.checkintime; // 입실시간
            const checkouttime = item.checkouttime; // 퇴실시간 
            const chkcooking = item.chkcooking; // 객실내취사여부
            const foodplace = item.foodplace; // 식음료장
            const goodstay = item.goodstay; // 굿스테이여부
            const hanok = item.hanok; // 한옥여부
            const infocenterlodging = item.infocenterlodging; // 문의및안내 
            const parkinglodging = item.parkinglodging; // 주차시설
            const pickup = item.pickup; // 픽업서비스
            const roomcount = item.roomcount; // 객실수
            const reservationlodging = item.reservationlodging; // 예약안내
            const reservationurl = item.reservationurl; // 예약안내홈페이지
            const roomtype = item.roomtype; // 객실유형
            const scalelodging = item.scalelodging; // 규모
            const subfacility = item.subfacility; // 부대시설 (기타)

            const barbecue = item.barbecue; // 바비큐장여부  -> 영문에는 없음
            const beauty = item.beauty; // 뷰티시설정보 -> 영문에는 없음
            const beverage = item.beverage; // 식음료장여부 -> 영문에는 없음
            const bicycle = item.bicycle; // 자전거대여여부 -> 영문에는 없음
            const campfire = item.campfire; // 캠프파이어여부 -> 영문에는 없음
            const fitness = item.fitness; // 휘트니스센터여부  -> 영문에는 없음
            const karaoke = item.karaoke; // 노래방여부 -> 영문에는 없음
            const publicbath = item.publicbath; // 공용 샤워실여부 -> 영문에는 없음
            const publicpc = item.publicpc; // 공용 PC실여부 -> 영문에는 없음
            const sauna = item.sauna; // 사우나실여부 -> 영문에는 없음
            const seminar = item.seminar; // 세미나실여부 -> 영문에는 없음
            const sports = item.sports; // 스포츠시설여부 -> 영문에는 없음
            const refundregulation = item.refundregulation; // 환불규정 -> 영문에는 없음
            //-------------------//

            //---- 쇼핑 (38) ----//
            const chkbabycarriageshopping = item.chkbabycarriageshopping; // 유모차대여정보 -> 영문에는 없음
            const chkcreditcardshopping = item.chkcreditcardshopping; // 신용카드가능정보 -> 영문에는 없음
            const chkpetshopping = item.chkpetshopping; // 애완동물동반가능정보 -> 영문에는 없음
            const culturecenter = item.culturecenter; // 문화센터바로가기 -> 영문에는 없음
            const fairday = item.fairday; // 장서는날
            const infocentershopping = item.infocentershopping; // 문의및안내
            const opendateshopping = item.opendateshopping; // 개장일
            const opentime = item.opentime; // 영업시간
            const parkingshopping = item.parkingshopping; // 주차시설
            const restdateshopping = item.restdateshopping; // 쉬는날
            const restroom = item.restroom; // 화장실설명
            const saleitem = item.saleitem; // 판매품목

            const saleitemcost = item.saleitemcost; // 판매품목별가격 -> 영문에는 없음

            const scaleshopping = item.scaleshopping; // 규모
            const shopguide = item.shopguide; // 매장안내
            //-------------------//

            //---- 음시점 (39) ----//
            const chkcreditcardfood = item.chkcreditcardfood; // 신용카드가능정보 -> 영문에는 없음
            const discountinfofood = item.discountinfofood; // 할인정보 -> 영문에는 없음

            const firstmenu = item.firstmenu; // 대표메뉴
            const infocenterfood = item.infocenterfood; // 문의및안내
            const kidsfacility = item.kidsfacility; // 어린이놀이방여부 -> 영문에는 없음
            const opendatefood = item.opendatefood; // 개업일
            const opentimefood = item.opentimefood; // 영업시간
            const packing = item.packing; // 포장가능 -> 영문에는 없음
            const parkingfood = item.parkingfood; // 주차시설
            const reservationfood = item.reservationfood; // 예약안내
            const restdatefood = item.restdatefood; // 쉬는날
            const scalefood = item.scalefood; // 규모
            const seat = item.seat; // 좌석수
            const smoking = item.smoking; // 금연/흡연여부
            const treatmenu = item.treatmenu; // 취급메뉴
            const lcnsno = item.lcnsno; // 인허가번호

            //---- 교통 (77) ----//
            //-------------------//
            // 다국어만 있음
            const chkcreditcardtraffic = item.chkcreditcardtraffic; // 신용카드가능여부
            const conven = item.conven; // 편의시설
            const disablefacility = item.disablefacility; // 장애인편의시설
            const foreignerinfocenter = item.foreignerinfocenter; // 외국인문의및안내
            const infocentertraffic = item.infocentertraffic; // 문의및안내
            const mainroute = item.mainroute; // 주요노선
            const operationtimetraffic = item.operationtimetraffic; // 운영시간
            const parkingtraffic = item.parkingtraffic; // 주차시설
            const restroomtraffic = item.restroomtraffic; // 화장실
            const shipinfo = item.shipinfo; // 여객선정보
        });


    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

// 반복 정보 조회
async function Check_RepeatedInformation(contentTypeId, contentId) {
    var queryParams = url
    queryParams += "detailInfo1?";
    queryParams += `serviceKey=${serviceKey}`;
    queryParams += `&numOfRows=${numOfRows}`;
    queryParams += '&pageNo=1';
    queryParams += '&MobileOS=ETC';
    queryParams += '&MobileApp=WebTest';
    queryParams += `&contentTypeId=${contentTypeId}`;
    queryParams += `&contentId=${contentId}`;
    queryParams += '&_type=json';

    try {
        const response = await fetch(queryParams);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);

        const data = await response.json();

        //가져온 값 처리
        // const items = data?.response?.body?.items?.item;
        const items = data.response.body.items.item;
        if (!items || items.length === 0) {
            return;
        }
        return items;
        items.forEach(item => {
            const resultCode = item.resultCode; // 결과코드
            const resultMsg = item.resultMsg; // 결과메시지
            const numOfRows = item.numOfRows; // 한페이지 결과 수
            const pageNo = item.pageNo; // 페이지번호
            const totalCount = item.totalCount; // 전체 결과 수

            const contentId = item.contentid; // 콘텐츠ID
            const contentTypeId = item.contenttypeid; // 콘텐츠타입ID

            //---- 숙박, 여행코스를 제외한 타입 ----//
            const fldgubun = item.fldgubun; // 일련번호
            const infoname = item.infoname; // 제목
            const infotext = item.infotext; // 내용
            const serialnum = item.serialnum; // 반복일련번호
            //------------------------------------//

            //---- 여행코스 (25) ----//
            //---- 영문에는 없음 ----//
            const subcontentid = item.subcontentid; // 하위콘텐츠
            const subdetailalt = item.subdetailalt; // 코스이미지설명
            const subdetailimg = item.subdetailimg; // 코스이미지
            const subdetailoverview = item.subdetailoverview; // 코스개요
            const subname = item.subname; // 코스명
            const subnum = item.subnum; // 반복일련번호
            //----------------------//

            //---- 숙박 (32) ----//
            //---- 영문에는 없음 ----//
            const roomcode = item.roomcode; // 객실코드
            const roomtitle = item.roomtitle; // 객실명칭
            const roomsize1 = item.roomsize1; // 객실크기(평)
            const roomcount = item.roomcount; // 객실수
            const roombasecount = item.roombasecount; // 기준인원
            const roommaxcount = item.roommaxcount; // 최대인원

            const roomoffseasonminfee1 = item.roomoffseasonminfee1; // 비수기주중최소
            const roomoffseasonminfee2 = item.roomoffseasonminfee2; // 비수기주말최소
            const roompeakseasonminfee1 = item.roompeakseasonminfee1; // 성수기주중최소
            const roompeakseasonminfee2 = item.roompeakseasonminfee2; // 성수기주말최소

            const roomintro = item.roomintro; // 객실소개
            const roombathfacility = item.roombathfacility; // 목욕시설여부
            const roombath = item.roombath; // 욕조여부
            const roomhometheater = item.roomhometheater; // 홈시어터여부
            const roomaircondition = item.roomaircondition; // 에어컨여부
            const roomtv = item.roomtv; // TV 여부
            const roompc = item.roompc; // PC 여부
            const roomcable = item.roomcable; // 케이블설치여부
            const roominternet = item.roominternet; // 인터넷여부
            const roomrefrigerator = item.roomrefrigerator; // 냉장고여부
            const roomtoiletries = item.roomtoiletries; // 세면도구여부
            const roomsofa = item.roomsofa; // 소파여부
            const roomcook = item.roomcook; // 취사용품여부
            const roomtable = item.roomtable; // 테이블여부
            const roomhairdryer = item.roomhairdryer; // 드라이기여부

            const roomsize2 = item.roomsize2; // 객실크기(평방미터)
            const roomimg1 = item.roomimg1; // 객실사진1
            const roomimg1alt = item.roomimg1alt; // 객실사진1 설명
            const roomimg2 = item.roomimg2; // 객실사진2
            const roomimg2alt = item.roomimg2alt; // 객실사진2 설명
            const roomimg3 = item.roomimg3; // 객실사진3
            const roomimg3alt = item.roomimg3alt; // 객실사진3 설명
            const roomimg4 = item.roomimg4; // 객실사진4
            const roomimg4alt = item.roomimg4alt; // 객실사진4 설명
            const roomimg5 = item.roomimg5; // 객실사진5
            const roomimg5alt = item.roomimg5alt; // 객실사진5 설명
        });


    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

// 이미지 정보 조회
async function Check_ImageInformation(contentId, imageYN) {
    var queryParams = url
    queryParams += "detailImage1?";
    queryParams += `serviceKey=${serviceKey}`;
    queryParams += `&numOfRows=${numOfRows}`;
    queryParams += '&pageNo=1';
    queryParams += '&MobileOS=ETC';
    queryParams += '&MobileApp=WebTest';
    queryParams += `&contentId=${contentId}`;
    queryParams += `&imageYN=${imageYN}`; // Y=콘텐츠이미지조회, N="음식점"타입의음식메뉴이미지
    queryParams += '&subImageYN=Y'; // Y=원본,썸네일이미지조회, N=Null
    queryParams += '&_type=json';

    try {
        const response = await fetch(queryParams);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);

        const data = await response.json();

        //가져온 값 처리
        // const items = data?.response?.body?.items?.item;
        const items = data.response.body.items.item;
        if (!items || items.length === 0) {
            return;
        }
        const image = []
        items.forEach(item => {
            const resultCode = item.resultCode; // 결과코드
            const resultMsg = item.resultMsg; // 결과메시지
            const numOfRows = item.numOfRows; // 한페이지 결과 수
            const pageNo = item.pageNo; // 페이지번호
            const totalCount = item.totalCount; // 전체 결과 수

            const contentId = item.contentid; // 콘텐츠ID

            const imgname = item.imgname; // 이미지명
            const originimgurl = item.originimgurl; // 원본이미지
            image.push(originimgurl);
            const serialnum = item.serialnum; // 이미지일련번호
            const smallimageurl = item.smallimageurl; // 썸네일이미지
        });

        return image;

    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

// 반려동물 동반여행 조회 (상세)
async function Check_PetTravelInformation(contentId) {
    var queryParams = "http://apis.data.go.kr/B551011/KorPetTourService/detailPetTour?"
    queryParams += `serviceKey=${serviceKey}`;
    queryParams += `&contentId=${contentId}`;
    queryParams += '&MobileOS=ETC';
    queryParams += '&MobileApp=WebTest';
    queryParams += '&_type=json';

    try {
        const response = await fetch(queryParams);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);

        const data = await response.json();

        //   return items;
        //가져온 값 처리
        // const items = data?.response?.body?.items?.item;
        const items = data.response.body.items.item;
        return items;
        if (!items || items.length === 0) {
            console.log("검색 결과 없음");
            return;
        }
        items.forEach(item => {
            const resultCode = item.resultCode; // 결과코드
            const resultMsg = item.resultMsg; // 결과메시지
            const numOfRows = item.numOfRows; // 한페이지 결과 수
            const pageNo = item.pageNo; // 페이지번호
            const totalCount = item.totalCount; // 전체 결과 수

            const contentId = item.contentid; // 콘텐츠ID

            const relaAcdntRiskMtr = item.relaAcdntRiskMtr; // 관련 사고 대비사항
            const acmpyTypeCd = item.acmpyTypeCd; // 동반유형코드(동반구분)

            const relaPosesFclty = item.relaPosesFclty; // 관련 구비 시설
            const relaFrnshPrdlst = item.relaFrnshPrdlst; // 관련 비치 품목
            const etcAcmpyInfo = item.etcAcmpyInfo; // 기타 동반 정보
            const relaPurcPrdlst = item.relaPurcPrdlst; // 관련 구매 품목
            const acmpyPsblCpam = item.acmpyPsblCpam; // 동반가능동물
            const relaRntlPrdlst = item.relaRntlPrdlst; // 관련 렌탈 품목
            const acmpyNeedMtr = item.acmpyNeedMtr; // 동반시 필요사항
        });

    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}


