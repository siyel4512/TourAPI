//import { areas, sigungus, contentTypes, arranges } from './apidata.js';
// 검색 버튼 클릭 시 호출되는 함수
function searchFunction() {
    const areaId = document.getElementById('area').value; // 지역
    const sigunguId = document.getElementById('sigungu').value; // 시군구
    const contentTypeId = document.getElementById('contentType').value; // 컨텐츠 타입
    const arrangeId = document.getElementById('arrange').value; // 정렬방식
    
    if (!areaId || !sigunguId || !contentTypeId || !arrangeId) {
        console.error("선택한 값 중 하나가 유효하지 않습니다.");
        return;
    }
// 선택된 값에 이상 없으면 api 요청
console.log(getApiResponse);
getApiResponse(areaId,sigunguId,contentTypeId,arrangeId);  
        
}

//검색결과 페이지에 뿌릴 때
function displayResults(spots) {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    spots.forEach(spot => {
        const li = document.createElement('li');
        li.textContent = spot.name;
        resultsList.appendChild(li);
    });
}

// 지역, 시군구, 콘텐츠타입, 정렬방식 드롭다운 채우기
function populateDropdown(elementId, data) {
    const select = document.getElementById(elementId);
    select.innerHTML = ""; // 기존 옵션 제거
    for (const [key, value] of Object.entries(data)) {
        let option = document.createElement("option");
        option.value = value;
        option.textContent = key;
        select.appendChild(option);
    }
}

// // 지역 클릭시 시군구 업데이트
// function updateSigungu() {
//     const area = document.getElementById("area").value;
//     if (area === "38") { // 전라남도 
//         populateDropdown("sigungu", sigungus);
//     } else {
//         document.getElementById("sigungu").innerHTML = "<option>해당 지역 없음</option>";
//     }
// }


document.addEventListener("DOMContentLoaded", () => {
    const areaSelect = document.getElementById("area");
    const sigunguSelect = document.getElementById("sigungu");
    const contentTypeSelect = document.getElementById("contentType");
    const arrangeSelect = document.getElementById("arrange");

    // 지역 목록 추가
    for (const key in areas) {
        let option = new Option(key, areas[key]);
        areaSelect.appendChild(option);
    }

    // 콘텐츠 타입 추가
    for (const key in contentTypes) {
        let option = new Option(key, contentTypes[key]);
        contentTypeSelect.appendChild(option);
    }

    // 정렬 방식 추가
    for (const key in arranges) {
        let option = new Option(key, arranges[key]);
        arrangeSelect.appendChild(option);
    }
    
    // 지역 선택 시 시군구 업데이트
    areaSelect.addEventListener("change", () => {
        sigunguSelect.innerHTML = ""; // 기존 옵션 초기화
        for (const key in sigungus) {
            let option = new Option(key, sigungus[key]);
            sigunguSelect.appendChild(option);
        }
    });
});

// 초기화
window.onload = function() {
    populateDropdown("area", areas);
    populateDropdown("sigungu", sigungus);
    populateDropdown("contentType", contentTypes);
    populateDropdown("arrange", arranges);

};

// 버튼 클릭 이벤트 리스너 추가
document.getElementById('searchButton').addEventListener('click', searchFunction);