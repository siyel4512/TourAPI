// 검색 버튼 클릭 시 호출되는 함수 api 호출
function searchFunction(page = 1) {
    const searchValue = document.getElementById("title").value;
    const itemCount = document.getElementById('itemCount').value; // 표출 아이템 갯수
    const arrangeId = document.getElementById('arrange').value; // 정렬방식
    const language = getSelectedIds("popup1");
    const contentTypeId = getSelectedIds("popup2");
    const categorys = getSelectedIds("popup3", true);
    const sigunguId = getSelectedIds("popup4");
    const [cat1 = "", cat2 = "", cat3 = ""] = categorys;

    // 검색 조건을 세션 스토리지에 저장
    const searchData = {
        searchValue,
        itemCount,
        arrangeId,
        language,
        contentTypeId,
        categorys,
        sigunguId,
        page
    };
    sessionStorage.setItem("searchData", JSON.stringify(searchData));

    // API 호출
    if (searchValue.trim()) getSearchApiResponse(language, sigunguId, cat1, cat2, cat3, itemCount, arrangeId, searchValue, page);
    else getApiResponse(language, sigunguId, contentTypeId, cat1, cat2, cat3, itemCount, arrangeId, page);
}

//모달에서 id추출
function getSelectedIds(modalId, isArrage = false) {
    const modal = document.getElementById(modalId); // 모달 찾기
    if (!modal) return null;

    let selectedIds = Array.from(modal.querySelectorAll(".btn-type4[title='선택됨']")) // 선택된 요소들 찾기
        .map(btn => btn.id) 
        .filter(id => id); // 빈 값 제거

    if (!isArrage) {
        selectedIds = selectedIds.join(", ");
        return selectedIds;
    }
    return selectedIds.length > 0 ? selectedIds : "";
}

//검색결과 페이지에 뿌릴 때
function displayResults(count, items) {

    if(count==0 || items == null){
        
        displayNone();
        return;
    }
    //총 갯수
    const totalCount = document.getElementById('total-count');
    totalCount.textContent = count;

    //불러온 목록 display
    displayResult(items);
}

//검색결과 없을 때
function displayNone() {

    //총 갯수
    const totalCount = document.getElementById('total-count');
    totalCount.textContent = "0";

    //불러온 목록 display
   const resultsContainer = document.querySelector(".gallery-list");
   resultsContainer.innerHTML = "";
   resultsContainer.textContent = "검색결과가 없습니다.";
 

}
//이미지랑 제목 목록 형태로 나타내기
function displayResult(items) {
    const resultsContainer = document.querySelector(".gallery-list");
    resultsContainer.textContent="";
    // 기존 리스트 가져오기
    const existingItems = resultsContainer.querySelectorAll("li");

    items.forEach((item, index) => {
        let li;
        // 기존 항목이 있으면 재사용
        if (existingItems[index]) {
            li = existingItems[index];
        } else {
            // 없으면 새로 생성
            li = document.createElement("li");
            resultsContainer.appendChild(li);
        }
        // 링크 생성 (재사용 가능)
        let link = li.querySelector("a");
        if (!link) {
            link = document.createElement("a");
            link.className = "link";
            li.appendChild(link);
        }

        // 링크의 ID 설정
        link.id = item.contentId;

        // 상세 페이지로 이동하도록 href 설정
        const url = `../html/detail.html?id=${encodeURIComponent(item.contentId)}`;

        link.href = url;

        // 이미지 업데이트
        let imgWrapper = link.querySelector(".test-img");
        if (!imgWrapper) {
            imgWrapper = document.createElement("span");
            imgWrapper.className = "test-img";
            link.appendChild(imgWrapper);
        }

        let img = imgWrapper.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            img.loading = "lazy";
            imgWrapper.appendChild(img);
        }
        img.src = item.image || "../Images/default-image.png";
        img.alt = item.title;
        img.name = item.title;
        img.id = `img_${index}`;

        // 제목 업데이트
        let strong = link.querySelector(".subject");
        if (!strong) {
            strong = document.createElement("strong");
            strong.className = "subject";
            link.appendChild(strong);
        }
        strong.id = `ttl_${index}`;
        strong.textContent = item.title;
    });

    // 불필요한 요소 삭제 (새로운 검색 결과보다 기존 요소가 많을 경우)
    while (resultsContainer.children.length > items.length) {
        resultsContainer.removeChild(resultsContainer.lastChild);
    }
}


//현지화
async function reloadLocation() {
   const savedLang = localStorage.language;
    const translations = await loadLocale(savedLang); 

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');

        const keys = key.split('.');
        let value = translations;

        // Traverse through nested keys
        keys.forEach(k => {
            value = value && value[k];
        });

        if (value !== undefined) {
            element.textContent = value;
        }
    });
}
async function loadLocale(lang) {
    const response = await fetch(`../locales/${lang}.json`);
    return response.json();
}

// 버튼 클릭 이벤트 리스너 추가s
document.getElementById('search-btn').addEventListener('click', searchFunction);// 기본 검색버튼에 검색기능 추가
document.querySelector('button[name="searchCnt"]').addEventListener('click', searchFunction);// 몇개씩 표출할건지
document.querySelector('button[name="arrange"]').addEventListener('click', searchFunction);// 정렬방식

document.addEventListener("DOMContentLoaded", function () {
    reloadLocation();
});
