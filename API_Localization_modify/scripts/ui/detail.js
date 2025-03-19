
let content = "";
const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const lang = localStorage.language;


//탭 버튼 클릭시 해당 정보 디스플레이
function openTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    document.getElementById(tabName).classList.add("active");

    document.querySelectorAll(".tab-button").forEach(btn => {
        btn.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
}


//테이블 생성 (공통)
function appendDataToTable(tbody, dataMap) {

    for (const [label, value] of Object.entries(dataMap)) {
        if (value && value !== "0") {
            const tr = document.createElement("tr");

            const th = document.createElement("th");
            th.textContent = label;

            const td = document.createElement("td");
            const apiText = value === "1" ? "○" : value;
            td.innerHTML = apiText;

            tr.appendChild(th);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }
}




// 기본정보 받아와서 세팅
async function displayContent(contentId) {
    const result = await Check_CommonInformation(contentId);
    if (!result || result.length === 0) return;
    const item = result[0];
    const tbody = document.querySelector("#basic table tbody");
    tbody.innerHTML = "";

    if (!lang) lang = localStorage.language;
    const wordMap = await loadLocale(lang);
    let mappedValues = {};

    Object.keys(wordMap.details).forEach((key) => {
        const wordMapKey = wordMap.details[key];

        // item에서 해당 key의 value 값을 찾음
        if (item[key] && key != "overview") {
            mappedValues[wordMapKey] = item[key];
        }
    });

    appendDataToTable(tbody, mappedValues);
    const contentTypeId = item.contenttypeid;
    document.getElementById("title").textContent = item.title;
    document.getElementById("description").innerHTML = item.overview;
    const img = document.getElementById("main-image");
    const imagesResult = await Check_ImageInformation(contentId, 'Y');
    displayGuidContent(contentTypeId, contentId);
    displayRepeatContent(contentTypeId, contentId);
    displayPetContent(contentId);
    if (localStorage.language == "kor")
        displayTransportContent(item.mapx, item.mapy);
    if (!imagesResult || imagesResult.length === 0) {
        if (item.firstimage) img.src = item.firstimage;
        else img.src = "../Images/default-image.png";
        img.alt = "대표 이미지";
        img.className = "scale-image";
        return;
    }
    images = imagesResult;
    displayImages(images);
}
// 이용안내 받아와서 세팅
async function displayGuidContent(contentTypeId, contentId) {
    const result = await Check_IntroductionInformation(contentTypeId, contentId);
    if (!result || result.length === 0) return;
    const item = result[0];
    const tbody = document.querySelector("#guide table tbody");
    tbody.innerHTML = "";
    if (contentTypeId == "") return;


    if (!lang) lang = params.get("lang");
    const wordMap = await loadLocale(lang);

    //데이터 맵핑
    let mappedValues = {};

    Object.keys(wordMap[contentTypeId]).forEach((key) => {
        const wordMapKey = wordMap[contentTypeId][key];
        // item에서 해당 key의 value 값을 찾음
        if (item[key]) {
            mappedValues[wordMapKey] = item[key];
        }
    });

    if (mappedValues) appendDataToTable(tbody, mappedValues);

}
// 상세정보 받아와서 세팅
async function displayRepeatContent(contentTypeId, contentId) {
    const result = await Check_RepeatedInformation(contentTypeId, contentId);
    if (!result || result.length === 0) {
        const tabButton = document.querySelector("#repeat-button").closest('li');
        tabButton.className += " off";
        return;
    }
    let dataMap = {};

    const tbody = document.querySelector("#repeat table tbody");
    tbody.innerHTML = "";

    if (contentTypeId == 25) {
        result.forEach(item => {
            dataMap = {
                "코스명": item.subname,
                "코스이미지": item.subdetailimg ? `<img src="${item.subdetailimg}" class = "scale-image" alt="${item.subdetailalt}">` : "",
                "코스개요": item.subdetailoverview
            }
            appendDataToTable(tbody, dataMap);
            const tr = document.createElement("tr");
            tbody.appendChild(tr);
        });

    }
    if (contentTypeId == 32) {
        result.forEach(item => {
            dataMap = {
                "객실명칭": item.roomtitle,
                "객실크기(평)": item.roomsize1,
                "객실크기(평방미터)": item.roomsize2,
                "객실수": item.roomcount,
                "기준인원": item.roombasecount,
                "최대인원": item.roommaxcount,

                "비수기주중최소": item.roomoffseasonminfee1,
                "비수기주말최소": item.roomoffseasonminfee2,
                "성수기주중최소": item.roompeakseasonminfee1,
                "성수기주말최소": item.roompeakseasonminfee2,

                "객실소개": item.roomintro,
                "목욕시설여부": item.roombathfacility,
                "욕조여부": item.roombath,
                "홈시어터여부": item.roomhometheater,
                "에어컨여부": item.roomaircondition,
                "TV 여부": item.roomtv,
                "PC 여부": item.roompc,
                "케이블설치여부": item.roomcable,
                "인터넷여부": item.roominternet,
                "냉장고여부": item.roomrefrigerator,
                "세면도구여부": item.roomtoiletries,
                "소파여부": item.roomsofa,
                "취사용품여부": item.roomcook,
                "테이블여부": item.roomtable,
                "드라이기여부": item.roomhairdryer,
                "객실사진": [
                    item.roomimg1 ? `<img src="${item.roomimg1}" class="scale-image" alt="${item.roomimg1alt}">` : "",
                    item.roomimg2 ? `<img src="${item.roomimg2}" class="scale-image" alt="${item.roomimg2alt}">` : "",
                    item.roomimg3 ? `<img src="${item.roomimg3}" class="scale-image" alt="${item.roomimg3alt}">` : "",
                    item.roomimg4 ? `<img src="${item.roomimg4}" class="scale-image" alt="${item.roomimg4alt}">` : "",
                    item.roomimg5 ? `<img src="${item.roomimg5}" class="scale-image" alt="${item.roomimg5alt}">` : ""
                ].filter(Boolean).join("")


            }
            appendDataToTable(tbody, dataMap);
            const tr = document.createElement("tr");
            tbody.appendChild(tr);
        });

    } else {
        result.forEach(item => {
            dataMap[item.infoname] = item.infotext;
            appendDataToTable(tbody, dataMap);
        });
    }
}
// 반려견정보 받아와서 세팅
async function displayPetContent(contentId) {
    const result = await Check_PetTravelInformation(contentId);
    if (!result || result.length === 0) {
        const tabButton = document.querySelector("#pet-button").closest('li');
        tabButton.className += " off";
        return;
    }
    let dataMap = {};
    const tbody = document.querySelector("#pet table tbody");
    tbody.innerHTML = "";
    const item = result[0];
    dataMap = {
        "관련 사고 대비사항": item.relaAcdntRiskMtr,
        "동반유형코드(동반구분)": item.acmpyTypeCd,
        "관련 구비 시설": item.relaPosesFclty,
        "관련 비치 품목": item.relaFrnshPrdlst,
        "기타 동반 정보": item.etcAcmpyInfo,
        "관련 구매 품목": item.relaPurcPrdlst,
        "동반가능동물": item.acmpyPsblCpam,
        "관련 렌탈 품목": item.relaRntlPrdlst,
        "동반시 필요사항": item.acmpyNeedMtr
    };
    appendDataToTable(tbody, dataMap);
}


// 교통정보 받아와서 세팅
async function displayTransportContent(ex, ey) {  
    var sx = 126.3922;
    var sy = 34.8118;
    setCoordinates(sx, sy, ex, ey);
    const data = await searchTransportation(sx, sy, ex, ey);

    //데이터 없으면 교통정보 칸 자체가 안보이게
    if (!data || !data.result) {
        const tabButton = document.querySelector("#transport-button").closest('li');
        tabButton.className += " off";
        return;
    }

    const maindiv = document.querySelector("#transport table");
    const paths = data.result.path;
    let dataMap = [];

    //맵데이터 있을 때
    if (paths[0].info.mapObj) callMapObjApiAJAX(paths[0].info.mapObj,sx,sy,ex,ey);
    else {
        callSimpleMap();
    }
    // 데이터 가공
    if (paths[0].pathType in pathType_outside) {
        dataMap = await displayTransportData(paths);
    }
    else dataMap = await displayTransportResults(paths);

    // 가공된 데이터 표출
    dataMap.forEach((data, index) => {
        appendDataToList(maindiv, data, index);
    })
    
    // 카메라 줌 및 중심 설정
    updateMapView();


}

// 리스트 생성 (교통)
function appendDataToList(maindiv, dataMap, index) {
    const ul = document.createElement("ul");
    let routeLi = null; // 경로 li 저장
    for (const [label, value] of Object.entries(dataMap)) {
        if (value && value !== "0") {
            const li = document.createElement("li");
            if (label === "경로") {
                li.innerHTML = value;
                routeLi = li;
                ul.appendChild(li);
            } else if (label === "세부경로") {
                li.innerHTML = value.detailPath;
                if (index === 0) {
                    index = 1;
                } else {
                    li.classList.add("off");
                }

                ul.appendChild(li);
                if (routeLi) {
                    routeLi.addEventListener("click", function () {
                        if (li.classList.contains("off")) {
                            li.classList.remove("off"); // 보이게 변경

                            //맵초기화
                            resetMap();
                            callMapObjApiAJAX(value.mapObj);
                        }
                        else li.classList.toggle("off");
                    });
                }
            } else if (label === "station") {
                li.innerHTML = value;
                if (index === 0) {
                    index = 1;
                } else {
                    li.classList.add("off");
                }
                li.innerHTML = "";
                ul.appendChild(li);
                if (routeLi) {
                    routeLi.addEventListener("click", () => {
                        if (li.classList.contains("off")) {
                            li.classList.remove("off"); // 보이게 변경
                            onClickSearchEvent(routeLi.innerHTML, li, value.sx, value.sy, value.startX, value.startY, value.endX, value.endY, value.ex, value.ey);
                        } else {
                            li.classList.add("off"); // 다시 숨김
                        }
                    });
                }
            }
        }
    }

    maindiv.appendChild(ul); // 생성된 ul을 maindiv에 추가
}


//도시간 이동 클릭 이벤트
async function onClickSearchEvent(outsidTransport, li, sx, sy, startX, startY, endX, endY, ex, ey) {
   //이미 데이터 가져왔으면 리턴
    if( li.innerHTML!="" )return;

    let displayData = "";
    const startData = await searchTransportation(sx, sy, startX, startY); //출발지->출발역 api 호출
    const endData = await searchTransportation(endX, endY, ex, ey); //도착역->도착지 api 호출

    if (!startData || !startData.result || !endData || !endData.result) return;

    // 데이터 가공
    const displayStartData = await processTransportData(startData);
    const displayEndData = await processTransportData(endData);
    const startMap = startData.result.path[0].info.mapObj; //맵데이터
    const endMap = endData.result.path[0].info.mapObj; //맵데이터

    displayData += displayStartData;
    displayData += outsidTransport.split("총")[0];
    displayData += displayEndData;

    //데이터 넣을 곳 가져오기
    li.className = "";
    li.innerHTML = displayData;

    //맵초기화
    resetMap();
    //맵그리기
    callMapObjApiAJAX(startMap,sx, sy, startX, startY);
    callMapObjApiAJAX(endMap,endX, endY, ex, ey);
    callMapObj(startX, startY, endX, endY);

    updateMapView(sx, sy, ex, ey);
}

//데이터 가공
async function processTransportData(startData) {
    const path = startData.result.path[0];

    const pathType = path.pathType;
    let detailPath = ""; // 세부 경로를 저장할 변수
    path.subPath.forEach((step, stepIndex) => {
        if (step.trafficType === 1) {
            // 지하철
            const subwayName = step.lane?.[0]?.name || "알 수 없음";
            detailPath += `<strong>[지하철]</strong> ${step.startName} → ${step.endName} (${subwayName}호선) <br>`;
        } else if (step.trafficType === 2) {
            // 버스
            const busNumbers = step.lane?.map(l => l.busNo).join(", ") || "알 수 없음";
            detailPath += `<strong>[버스]</strong> ${step.startName} → ${step.endName} (${busNumbers}번 버스) <br>`;
        } else if (step.trafficType === 3) {
            // 도보
            detailPath += `<strong>[도보]</strong> ${step.distance}m 이동 <br>`;
        }

    });
    const displayData =
        `<strong>[${pathType_inside[pathType]}] ${path.info.firstStartStation} → ${path.info.lastEndStation}  </strong> (예상 : ${path.info.totalTime}분) <br>
            ${detailPath}`;
    return displayData;
}
