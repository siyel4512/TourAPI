const mapKey = "jGw7VornE6yMeZ1IjRMg";

let map;
let userMarker;
let attractionMarkers = [];

//맵초기화
function initMap(latitude = 37.5665, longitude = 126.9780) {
    map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(latitude, longitude),
        zoom: 14
    });

    userMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(latitude, longitude),
        map: map,
        icon: {
            content: '<div class="my_pin" style="cursor: pointer;"><img src="../Images/defaultCircle.png" class="markerIcon"><div class="markerLabel">현위치</div></div>',
            anchor: new naver.maps.Point(12, 12)
        }
    });

    getNearbyAttractions("ko", longitude, latitude, 3000);

    naver.maps.Event.addListener(map, "dragend", function () {
        const center = map.getCenter();
        getNearbyAttractions("ko", center.lng(), center.lat(), 3000);
    });
}

//현위지 찾고 해당위치 주변 관광지 표출
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            map.setCenter(new naver.maps.LatLng(latitude, longitude));
            userMarker.setPosition(new naver.maps.LatLng(latitude, longitude));
            getNearbyAttractions("ko", longitude, latitude, 3000);
        }, () => {
            alert("위치를 가져올 수 없습니다.");
        });
    } else {
        alert("브라우저가 위치 정보를 지원하지 않습니다.");
    }
}

let currentInfoWindow = null;  // 현재 열린 infoWindow를 추적할 변수
async function loadLocale(lang) {
    const response = await fetch(`../locales/${lang}.json`);
    return response.json();
}

// 마커 표시 및 이벤트
async function updateAttractionMarkers(attractions) {
    // 기존 마커 제거
    attractionMarkers.forEach(marker => marker.setMap(null));
    attractionMarkers = [];

    // 언어 설정을 한 번만 처리
    let lang = localStorage.language || "kor"; // 기본값 설정
    const wordMap = await loadLocale(lang);

    // 새로운 마커 추가
    for (const attraction of attractions) {
        // 콘텐츠 타입에 맞는 아이콘 설정
        let iconUrl = getIconForContentType(attraction.contentTypeId);

        // 커스텀 마커 HTML 생성
        const markerElement = document.createElement('div');
        markerElement.className = 'customMarker';

        // 아이콘 이미지 추가
        const iconImage = document.createElement('img');
        iconImage.src = iconUrl;
        iconImage.className = 'markerIcon';
        markerElement.appendChild(iconImage);

        // 마커 이름 추가
        const label = document.createElement('div');
        label.className = 'markerLabel';
        label.innerText = attraction.name;
        markerElement.appendChild(label);

        // 마커 생성
        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(attraction.lat, attraction.lng),
            map: map,
            icon: {
                content: markerElement,
                anchor: new naver.maps.Point(15, 30) // 원의 아래쪽이 마커 위치에 맞게 조정
            }
        });

        // 콘텐츠 타입
        
        const url = `../html/detail.html?id=${encodeURIComponent(attraction.contentid)}`;
        const contentTypeKey = Object.entries(wordMap.contentType).find(([key, val]) => val === attraction.contentTypeId)?.[0] || "Unknown";
        // 인포윈도우 생성
        const infoWindow = new naver.maps.InfoWindow({
            content: `<div class = "info-box">${attraction.name} (${contentTypeKey}) <div class= "info-content"><img src="${attraction.firstImage}" class = "info-image" alt=""><div>주소 : ${attraction.address}<br> 전화번호 : ${attraction.tel}<br><a href=" ${url}"> 상세페이지 바로가기</a></div></div></div>`
        });

        // 클릭 이벤트 추가
        naver.maps.Event.addListener(marker, "click", function () {
            if (currentInfoWindow && currentInfoWindow.getMap()) {
                currentInfoWindow.close();
            }
            infoWindow.open(map, marker);
            currentInfoWindow = infoWindow;
        });

        attractionMarkers.push(marker);
    }
}


// 콘텐츠 타입 ID에 따른 아이콘 URL 반환
function getIconForContentType(contentTypeId) {
    switch (contentTypeId) {
        case "12": // 예시 콘텐츠 타입 1
            return '../Images/defaultCircle.png'
        case "14": // 예시 콘텐츠 타입 2
            return '../Images/defaultCircle.png'
        case "15": // 예시 콘텐츠 타입 1
            return '../Images/defaultCircle.png'
        case "25": // 예시 콘텐츠 타입 2
            return '../Images/corse.png'
        case "28": // 예시 콘텐츠 타입 1
            return '../Images/default-image.png'
        case "32": // 예시 콘텐츠 타입 2
            return '../Images/lodging.png'
        case "38": // 예시 콘텐츠 타입 2
            return '../Images/shopping.png'
        case "39": // 예시 콘텐츠 타입 2
            return '../Images/restaurant.png'
        default:
            return '../Images/defaultCircle.png'; // 기본 아이콘
    }
}

// 내 주변 관광지 찾기
async function getNearbyAttractions(language, mapX, mapY, radius) {
    const serviceKey = API_CONFIG.serviceKey;
    const languageurl = getUrlByLanguage(language);
    const url = `${languageurl}locationBasedList1?` +
        `ServiceKey=${serviceKey}&mapX=${mapX}&mapY=${mapY}&radius=${radius}` +
        `&listYN=Y&MobileOS=ETC&MobileApp=AppTest&arrange=A&numOfRows=12&pageNo=1&_type=json`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error("API 요청 실패: " + response.status);
        const data = await response.json();
        const items = data?.response?.body?.items?.item;

        if (!items || items.length === 0) {
            console.warn("관광지 데이터를 찾을 수 없습니다.");
            return;
        }

        const filtered_data = items.map(item => ({
            name: item.title,  // 기존 "이름" -> "name"
            address: item.addr1,  // 기존 "주소" -> "address"
            lat: parseFloat(item.mapy),  // 기존 "위도" -> "lat"
            lng: parseFloat(item.mapx),  // 기존 "경도" -> "lng"
            contentTypeId: item.contenttypeid,
            firstImage: item.firstimage,
            contentid: item.contentid,
            tel: item.tel ? item.tel : "정보 없음"
        }));

        updateAttractionMarkers(filtered_data);
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
    }
}

// 언어별로 url 설정
function getUrlByLanguage(language) {
    return Default_URL[language] || Default_URL.kor;  // 기본값으로 한국어 URL을 사용
}

window.onload = () => initMap();
