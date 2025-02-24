//mport { API_CONFIG } from './apidata.js';

//api 요청
async function getApiResponse(area, sigungu, contentType, arrange) {
    const numOfRows = "20";
    const serviceKey = API_CONFIG.serviceKey 
    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?` +
                `numOfRows=${numOfRows}&pageNo=1&MobileOS=ETC&MobileApp=WebTest` +
                `&ServiceKey=${serviceKey}&listYN=Y&arrange=${arrange}` +
                `&contentTypeId=${contentType}&areaCode=${area}&sigunguCode=${sigungu}` +
                `&cat1=&cat2=&cat3=&_type=json`;
    try {
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) throw new Error("API 요청 실패: " + response.status);

        const data = await response.json();

        //가져온 값 처리
        console.log(data);
        const items = data.response.body.items.item;
        items.forEach(item => {
            const title = item.title; // 관광지 이름
            const image = item.firstimage || item.firstimage2; // 첫 번째 이미지

            console.log("이름:", title);
            console.log("이미지:", image);
        });


    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

