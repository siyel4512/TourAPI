//기본 검색 api 요청
async function getApiResponse(language, sigungu, contentType, cat1, cat2, cat3, numOfRows = 20, arrangeId = "A", pageNum = 1) {
    const serviceKey = API_CONFIG.serviceKey
    const languageurl = getUrlByLanguage(language);
    const url = languageurl + `areaBasedList1?numOfRows=${numOfRows}&pageNo=${pageNum}&MobileOS=ETC&MobileApp=AppTest&` +
        `&ServiceKey=${serviceKey}&listYN=Y&arrange=${arrangeId}&contentTypeId=${contentType}&areaCode=38&sigunguCode=${sigungu}` +
        `&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}&_type=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        if (data)
            renderData(numOfRows, data);

    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

//검색어 입력 검색 api 요청
async function getSearchApiResponse(language, sigungu, cat1, cat2, cat3, numOfRows = 20, arrangeId = "A", keyword, pageNum = 1) {
    const serviceKey = API_CONFIG.serviceKey;
    const languageurl = getUrlByLanguage(language);
    const url = languageurl +
        `searchKeyword1?numOfRows=${numOfRows}&pageNo=${pageNum}&MobileOS=ETC&MobileApp=AppTest` +
        `&ServiceKey=${serviceKey}&listYN=Y&arrange=${arrangeId}` +
        `&areaCode=38&sigunguCode=${sigungu}` +
        `&cat1=${cat1}&cat2=${cat2}&cat3=${cat3}` +
        `&keyword=${encodeURIComponent(keyword)}&_type=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();

        renderData(numOfRows, data);

    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

//api 데이터 처리
function renderData(itemsPerPage, data) {
    // 데이터 가져오기
    const items = data.response.body.items.item;
    if (!items || items == null) {
        updatePagination(0);
        displayResults(0, null);
        return;
    }
    const totalCount = data.response.body.totalCount;  // 총 카운트
    const displayItems = items.map(item => {
        const title = item.title; // 관광지 이름
        const contentId = item.contentid;
        const image = item.firstimage || item.firstimage2 || "../Images/default-image.png"; // 이미지
        return { title, contentId, image };
    });
    let totalPages = Math.ceil(totalCount / itemsPerPage);

    updatePagination(totalPages);
    displayResults(totalCount, displayItems);

}
// 관광타입 선택후 서비스 분류 api 요청
async function getCategoryApiResponse(language, contentType) {
    const serviceKey = API_CONFIG.serviceKey
    //let type = contentType.tostring();

    const languageurl = getUrlByLanguage(language);
    const url = languageurl + `categoryCode1?` +
        `serviceKey=${serviceKey}` +
        `&contentTypeId=${contentType}` +
        `&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest
                &_type=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        const items = data.response.body.items.item;
        const codes = items.reduce((acc, item) => {
            acc[item.name] = item.code;
            return acc;
        }, {});
        return codes;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }

}

// 서비스 중분류/ 소분류 api 요청
async function getCategory2ApiResponse(language, contentType, cat1) {
    const serviceKey = API_CONFIG.serviceKey;
    const languageurl = getUrlByLanguage(language);
    const url = languageurl + `categoryCode1?` +
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

// 언어에 따른 지역 api 요청
async function getRegionApiResponse(language) {
    const serviceKey = API_CONFIG.serviceKey
    const languageurl = getUrlByLanguage(language);
    const url = languageurl + `areaCode1?` +
        `serviceKey=${serviceKey}` +
        `&numOfRows=200&pageNo=1&MobileOS=ETC&MobileApp=AppTest&areaCode=38
                &_type=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        const items = data.response.body.items.item;
        const codes = items.reduce((acc, item) => {
            acc[item.name] = item.code;
            return acc;
        }, {});
        return codes;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }

}



//언어별로 url 설정
function getUrlByLanguage(language) {
    // 언어 코드에 해당하는 URL을 반환 
    return Default_URL[language] || Default_URL.kor;  // 기본값으로 한국어 URL을 사용
}