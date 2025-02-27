//기본 검색 api 요청
async function getApiResponse(sigungu, contentType, cat1, cat2, cat3, numOfRows = 20, arrangeId = "A", pageNum = 1) {
    const serviceKey = API_CONFIG.serviceKey
    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?` +
        `numOfRows=${numOfRows}&pageNo=${pageNum}&MobileOS=ETC&MobileApp=AppTest&` +
        `&ServiceKey=${serviceKey}&listYN=Y&arrange=${arrangeId}&contentTypeId=${contentType}&areaCode=38&sigunguCode=${sigungu}` +
        `&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}&_type=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        renderData(numOfRows,data);
url
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

//검색어 입력 검색 api 요청
async function getSearchApiResponse(sigungu, cat1, cat2, cat3, numOfRows = 20, arrangeId = "A", keyword, pageNum = 1) {
    const serviceKey = API_CONFIG.serviceKey;
    const url = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?` +
        `numOfRows=${numOfRows}&pageNo=${pageNum}&MobileOS=ETC&MobileApp=AppTest` +
        `&ServiceKey=${serviceKey}&listYN=Y&arrange=${arrangeId}` +
        `&areaCode=38&sigunguCode=${sigungu}` +
        `&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}` +
        `&keyword=${encodeURIComponent(keyword)}&_type=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        
        renderData(numOfRows,data);

    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

//api 데이터 처리
function renderData(itemsPerPage, data) {
    // 데이터 가져오기
    const items = data.response.body.items.item;
    const totalCount = data.response.body.totalCount;  // 총 카운트
    const displayItems = items.map(item => {
        const title = item.title; // 관광지 이름
        const contentId = item.contentid;
        const image = item.firstimage || item.firstimage2; // 이미지
        return { title, contentId, image };
    });
    let totalPages = Math.ceil(totalCount / itemsPerPage); 

    updatePagination(totalPages);
    displayResults(totalCount, displayItems);

}

// 관광타입 선택후 서비스 분류 api 요청
async function getCategoryApiResponse(contentType) {
    const serviceKey = API_CONFIG.serviceKey
    //let type = contentType.tostring();
    const url = `http://apis.data.go.kr/B551011/KorService1/categoryCode1?` +
        `serviceKey=${serviceKey}` +
        `&contentTypeId=${contentType}` +
        `&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest
                &_type=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        const items = data.response.body.items.item;
        const codes = items.map(item => item.code);
        return codes;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }

}


// 서비스 중분류 api 요청
async function getCategory2ApiResponse(contentType,cat1) {
    const serviceKey = API_CONFIG.serviceKey
    //let type = contentType.tostring();
    const url = `http://apis.data.go.kr/B551011/KorService1/categoryCode1?` +
        `serviceKey=${serviceKey}` +
        `&contentTypeId=${contentType}` +
        `&cat1=${cat1}` +
        `&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest
                &_type=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        const items = data.response.body.items.item;
        const codesDict = items.reduce((acc, item) => {
            acc[item.name] = item.code;
            return acc;
        }, {});
        return codesDict;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }

}
