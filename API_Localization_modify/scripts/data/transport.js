const serviceKeyODsay = "IQW1ipRLAyv8MW8lBnCxqQ";// 교통서비스 웹키
const serverKeyODsay = "yvUP4A/N04YTurO8qrKIa8AD5wiF1gFK22vmkZWhg40";// 교통서비스 서버키

// 출발지, 도착지 변수 - 맵 그리기 용
var sx = 0;
var sy = 0;
var ex = 0;
var ey = 0;

// 맵관련
const mapKey = "jGw7VornE6yMeZ1IjRMg";

//맵 기본설정
var map = new naver.maps.Map('map', {
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
    zoomControl: true,
    minZoom: 6
});
//경로 폴리라인
var polyline = new naver.maps.Polyline({
    map: map,
    path: [],  // 초기 경로 설정
    strokeColor: '#5347AA',
    strokeWeight: 2
});

//마커
var markers = [];

//데이터 조회
//내 위치 가져오기
function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                callback({ latitude, longitude });
            },
            (error) => {
                console.error("위치 정보를 가져올 수 없습니다:", error);
                alert("위치 정보를 가져올 수 없습니다. 위치 서비스를 허용해주세요.");
            }
        );
    } else {
        alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
    }
}
// 출발지,목적지 받아와서 가는법 찾기

async function setCoordinates(input_sx, input_sy, input_ex, input_ey) {
    sx = input_sx;
    sy = input_sy;
    ex = input_ex;
    ey = input_ey;
}

async function searchTransportation(input_sx, input_sy, input_ex, input_ey) {
    try {
        var url = "https://api.odsay.com/v1/api/searchPubTransPathT?"
        url += `SX=${input_sx}`; //출발지 X좌표 (경도좌표)
        url += `&SY=${input_sy}`; //출발지 Y좌표 (위도좌표)
        url += `&EX=${input_ex}`; //도착지 X좌표 (경도좌표)
        url += `&EY=${input_ey}`; //도착지 Y좌표 (위도좌표)
        url += "&OPT=0";// 0: 추천경로, 1 타입별정렬  ex) 지하철, 버스, 버스+지하철, 지하철+버스, 버스+지하철+버스	
        url += "&SearchPathType=0";//도시내 이동
        url += `&apiKey=${serverKeyODsay}`;
        console.log(url);
        // fetch() 사용
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data != null) return data;
    } catch (error) {
        console.error("Error fetching transport data:", error);
    }
}


//데이터 가공
// 결과 표시 함수 - 같은 시/군/구
async function displayTransportResults(paths) {

    let dataMap = [];
    paths.forEach((path, index) => {
        // 기본 정보 출력
        const info = path.info;
        console.log(info);
        const pathType = path.pathType;
        let detailPath = ""; // 세부 경로를 저장할 변수
        path.subPath.forEach((step, stepIndex) => {

            if (step.trafficType === 1) {
                // 지하철
                const subwayName = step.lane?.[0]?.name || "알 수 없음";
                detailPath += `<strong>[지하철]</strong> ${step.startName} → ${step.endName} (${subwayName}) <br>`;
            } else if (step.trafficType === 2) {
                // 버스
                const busNumbers = step.lane?.map(l => l.busNo).join(", ") || "알 수 없음";
                detailPath += `<strong>[버스]</strong> ${step.startName} → ${step.endName} (${busNumbers}) <br>`;
            } else if (step.trafficType === 3) {
                // 도보
                detailPath += `<strong>[도보]</strong> ${step.distance}m 이동`;
            }

        });
        dataMap.push({
            "경로": `
             <strong>[${pathType_inside[pathType]}] ${info.firstStartStation} → ${info.lastEndStation}  </strong><br>
            총 거리: ${info.totalDistance}m <br>
            예상 시간: ${info.totalTime}분 <br>
        `,
            "세부경로": {
                "detailPath": detailPath,
                "mapObj": info.mapObj
            },
        })
    })
    return dataMap;
};

// 결과 표시 함수 - 다른 시/군/구 시외 대중교통 찾기
async function displayTransportData(paths) {
    let dataMap = [];
    paths.forEach((path, index) => {
        const info = path.info;
        const pathType = path.pathType;

        path.subPath.forEach((step, stepIndex) => {
            dataMap.push({  // 객체를 배열에 추가
                "경로": `
                   <strong> [${pathType_outside[pathType]}] ${step.startName} → ${step.endName}</strong><br>
                    소요 시간: ${info.totalTime} 분<br>
                    거리: ${step.distance} 미터 <br>
                    금액: ${info.totalPayment} 원 <br>
                   `,
                "station": {
                    "sx": sx,
                    "sy": sy,
                    "startX": step.startX,
                    "startY": step.startY,
                    "endX": step.endX,
                    "endY": step.endY,
                    "ex": ex,
                    "ey": ey
                }
            });
        });
    });
    return dataMap;
}


//맵 초기화
function resetMap() {
    console.log("맵초기화");
    
    // 기존 마커 제거
    if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    // 기존 폴리라인 제거 후 재생성
    map = new naver.maps.Map('map', {
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: true,
        minZoom: 6
    });
    // 새로운 경로 그리기
    polyline = new naver.maps.Polyline({
        map: map,
        path: [],  // 새로운 경로
        strokeColor: '#5347AA',
        strokeWeight: 2
    });

    // 지도 기본 위치로 초기화
    map.setCenter(new naver.maps.LatLng(ey, ex));
    map.setZoom(10);


    naver.maps.Event.addListener(map, 'zoom_changed', function (zoom) {
        console.log(zoom);
    });

}

//도시간 경로 표시 -축약
async function callSimpleMap() {
    // 마커 그리기
    drawNaverMarker(ex, ey);
    drawNaverMarker(sx, sy);

    // 경로 그리기
    let point = new naver.maps.LatLng(sy, sx);
    let point2 = new naver.maps.LatLng(ey, ex);
    var path = [point, point2];
    polyline.setPath(path); // 기존 코드에서 polyline.path = path; → setPath()로 수정

    new naver.maps.Marker({
        map: map,
        position: point
    });

}


//도시간 경로 표시
function callMapObj(startX, startY, endX, endY) {
    //마크 그리기
    drawNaverMarker(startX, startY);
    drawNaverMarker(endX, endY);

    //경로 그리기
    let point = new naver.maps.LatLng(startY, startX);
    let point2 = new naver.maps.LatLng(endY, endX);
    var path = [point, point2];
    polyline.path = path;
    new naver.maps.Marker({
        map: map,
        position: point
    });
}

//맵데이터로 맵불러오기
function callMapObjApiAJAX(mabObj, originX, originY, destinationX, destinationY) {
    var xhr = new XMLHttpRequest();
    document.getElementById("map").className = "";
    var url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mabObj}&apiKey=${serverKeyODsay}`;

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);

            // 출발지, 도착지 마커 표시
            drawNaverMarker(originX, originY);
            drawNaverMarker(destinationX, destinationY);

            // 경로 선 그리기
            drawNaverPolyLine(resultJsonData, originX, originY, destinationX, destinationY);

            // boundary(경계) 정보가 있으면 지도 이동
            // if (resultJsonData.result.boundary) {
            //     var boundary = new naver.maps.LatLngBounds(
            //         new naver.maps.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.left),
            //         new naver.maps.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.right)
            //     );
            //     map.fitBounds(boundary);  // 좌표 경계 이동
            // } else {
            //     // boundary가 없을 경우, 출발지/도착지 중간으로 이동
            //     updateMapView();
            // }
        }
    };
}

// 맵 센터 위치 조정 및 줌 설정
function updateMapView() {
    const mapCenterLat = (parseFloat(sy) + parseFloat(ey)) / 2;
    const mapCenterLng = (parseFloat(sx) + parseFloat(ex)) / 2;

    map.setCenter(new naver.maps.LatLng(mapCenterLat, mapCenterLng));

    //타임아웃 안하면 동시실행되서 안먹힘
    setTimeout(() => {
        map.setZoom(9, false);
    }, 100);

}

// 지도위 마커 표시해주는 함수
function drawNaverMarker(x, y) {
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(y, x),
        map: map
    });
    markers.push(marker); // 마커 배열에 추가
}

// 지도 위 경로 표시해주는 함수
function drawNaverPolyLine(data, originX, originY, destinationX, destinationY) {
    console.log(data);
    var lineArray = [];   // 기존 경로를 위한 배열
    var previousPoint = null;  // 이전 점 저장
    var originPos = new naver.maps.LatLng(originY, originX);
    var destinationPos = new naver.maps.LatLng(destinationY, destinationX);
    for (var i = 0; i < data.result.lane.length; i++) {
        var lane = data.result.lane[i];

        for (var j = 0; j < lane.section.length; j++) {
            var section = lane.section[j];

            if (section.graphPos.length === 0) continue;

            for (var k = 0; k < section.graphPos.length; k++) {
                var currentPoint = new naver.maps.LatLng(
                    section.graphPos[k].y,
                    section.graphPos[k].x
                );

                // 첫 번째 섹션, 첫 번째 포인트 -> 출발지 연결 (초록)
                if (i === 0 && j === 0 && k === 0) {
                    new naver.maps.Polyline({
                        map: map,
                        path: [originPos, currentPoint],
                        strokeColor: "#008000",  // 초록색
                        strokeWeight: 3
                    });
                }

                // 두 점을 일반 경로로 연결
                if (previousPoint) {
                    new naver.maps.Polyline({
                        map: map,
                        path: [previousPoint, currentPoint],
                        strokeColor: "#0000FF",  // 기본 파란색
                        strokeWeight: 3
                    });
                }

                previousPoint = currentPoint;
            }
        }

        // 현재 lane의 마지막 점 찾기
        var lastSection = lane.section[lane.section.length - 1];
        var lastPoint = new naver.maps.LatLng(
            lastSection.graphPos[lastSection.graphPos.length - 1].y,
            lastSection.graphPos[lastSection.graphPos.length - 1].x
        );

        // 다음 lane이 존재하면 환승 연결 (초록)
        if (i < data.result.lane.length - 1) {
            var nextLane = data.result.lane[i + 1];
            var nextFirstSection = nextLane.section[0];
            var nextFirstPoint = new naver.maps.LatLng(
                nextFirstSection.graphPos[0].y,
                nextFirstSection.graphPos[0].x
            );

            new naver.maps.Polyline({
                map: map,
                path: [lastPoint, nextFirstPoint], // 현재 lane의 마지막 점 -> 다음 lane의 첫 점
                strokeColor: "#008000",  // 초록색 (환승 구간)
                strokeWeight: 3
            });
        }
    }

    // 목적지 연결 (초록)
    new naver.maps.Polyline({
        map: map,
        path: [previousPoint, destinationPos],
        strokeColor: "#008000",  // 초록색
        strokeWeight: 3
    });
}

naver.maps.Event.addListener(map, 'zoom_changed', function (zoom) {
    console.log(zoom);
});
