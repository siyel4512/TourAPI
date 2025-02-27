// 모달 버튼 생성
function populateDropdown(elementId, data) {
    const select = document.getElementById(elementId);
    let groupDiv = null;
    let count = 0;
    for (const [key, value] of Object.entries(data)) {
        if (count % 9 === 0) {
            groupDiv = document.createElement("div");
            groupDiv.className = "btn-list";
            select.appendChild(groupDiv);
        }
        const aTag = document.createElement("a");
        aTag.href = "#";
        aTag.className = "btn btn-type4 ";
        aTag.title = "선택 해제됨";
        aTag.textContent = key;
        aTag.setAttribute("id", value);

        //이벤트 추가
        aTag.addEventListener("click", function (e) {
            e.preventDefault();

            // 단일 선택 모드 -> 기존 선택된 거 해제 
            const alreadySelected = select.querySelector(".btn-type4[title='선택됨']");
            if (alreadySelected && alreadySelected !== this) {
                alreadySelected.title = "선택 해제됨";
                alreadySelected.classList.remove("on");
            }
            // 두번 눌렀을 때 해제
            if (this.title === "선택됨") {
                this.title = "선택 해제됨"; // 선택 해제
                this.classList.remove("on");
            } else {
                this.title = "선택됨"; // 선택
                this.classList.add("on");
            }
        });

        groupDiv.appendChild(aTag);
        count++;
    }
}

// 모달 이벤트 
document.addEventListener("DOMContentLoaded", function () {
    // 모든 모달에 대한 이벤트 처리
    document.querySelectorAll(".modal").forEach((modal) => {
        const confirmBtn = modal.querySelector(".btn-check"); // 확인 버튼 찾기
        const closeBtns = modal.querySelectorAll(".modal-close, .btn-type2:not(.btn-check)"); // 닫기 버튼들

        // 확인 버튼 클릭시 선택된 항목 표시
        if (confirmBtn) {
            confirmBtn.addEventListener("click", function (e) {
                e.preventDefault();

                // 현재 모달에 연결된 필터 ID 가져오기
                const filterId = modal.getAttribute("data-filter-id");
                if (!filterId) return;

                // 해당 필터의 filter-text 찾기
                const filterText = document.querySelector(`#${filterId} .filter-text`);
                if (!filterText) return;

                // 선택된 항목 찾기
                const selectedItems = Array.from(modal.querySelectorAll(".btn-type4[title='선택됨']"))
                    .map(btn => btn.textContent.trim())
                    .join(", ");

                // 필터 텍스트 업데이트
                filterText.textContent = selectedItems;

                // 모달 닫기
                modal.classList.remove("on");
            });
        }

        // 닫기 버튼 클릭 시 모달 닫기 및 선택 초기화
        closeBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                // filter-text 요소 찾기
                const filterText = document.querySelector(`#${modal.getAttribute("data-filter-id")} .filter-text`);
                // filter-text 비어 있으면 모달 내 선택했던 버튼들 초기화
                if (filterText.textContent.trim() === "") {
                    const links = modal.querySelectorAll('a');

                    links.forEach(link => {
                        link.title = "선택해제됨"; // title 속성 변경
                        link.classList.remove("on");
                    });
                }
                // 모달 닫기
                modal.classList.remove("on");
            });
        });
    });

    //버튼 클릭시 모달 활성화
    document.querySelectorAll(".btn-type2.btn-blue").forEach((button) => {
        button.addEventListener("click", function () {
            const targetModalId = this.getAttribute("data-target"); // 연결된 모달 ID 가져오기
            const modal = document.getElementById(targetModalId);
            if (modal) {
                modal.classList.add("on"); // 모달 열기 => css에서 비활성화시키는 거라 class이름 바꾼겁니다.
                modal.setAttribute("data-filter-id", this.closest(".filter-wrap").getAttribute("id")); // 연결된 필터 ID 저장
            }
        });
    });

})

// 검색필터 목록 초기화 
window.onload = function () {
    populateDropdown("culture", culture);
    populateDropdown("sigungu", sigungus);
    populateDropdown("categoryCode1", categoryCode1);
    populateDropdown("contentType", contentTypes);

    setTimeout(addCategoryEvent, 50);
};

// 카테고리 분류
function filterCategoryByWord(categoryData, mainCategory) {
    return Object.entries(categoryData)
        .filter(([key, value]) => value.startsWith(mainCategory)) // mainCategory로 시작하는 값 필터링
        .reduce((acc, [key, value]) => {
            acc[key] = value; // 딕셔너리 형태로 다시 변환
            return acc;
        }, {});
}

// 관광타입 선택시 
async function updateContentTypeEvent() {
    // data-target="popup3" 속성을 가진 버튼 선택
    const contentTypeId = getSelectedIds("popup2");

    if (contentTypeId != "") {
        const codes = await getCategoryApiResponse(contentTypeId);

        const categoryCodes1 = document.getElementById("categoryCode1");
        const categoryCodes2 = document.getElementById("categoryCode2");
        const categoryCodes3 = document.getElementById("categoryCode3");
        const categorItems = categoryCodes1.querySelectorAll("a");

        categoryCodes2.innerHTML = "";
        categoryCodes3.innerHTML = "";

        categorItems.forEach(div => {
            div.title = "선택 해제됨";
            div.classList.remove("on");
            const filterText = document.querySelector(`#filter3 .filter-text`);
            filterText.textContent = null;
            const divId = div.id;  // div의 id 값을 가져옴
            if (codes.includes(divId)) {
                div.style.display = 'block';  // 표시
            } else {
                div.style.display = 'none';   // 숨김
            }
        });

    }
};

// 대분류 클릭 시 중분류 표시
 function addCategoryEvent() {
    const categoryCodes1 = document.getElementById("categoryCode1");
    // 대분류 버튼 가져와서 이벤트 추가
    const mainCategoryButtons = categoryCodes1.querySelectorAll("a");
    mainCategoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            const mainCategory = this.id;
            updateSubCategories(mainCategory);
        });
    });
}
// 중분류 생성 업데이트
async function updateSubCategories(mainCategory) {
    const categoryCodes2 = document.getElementById("categoryCode2");
    const categoryCodes3 = document.getElementById("categoryCode3");
    categoryCodes2.innerHTML = "";
    categoryCodes3.innerHTML = ""; // 중분류 선택 시 소분류 초기화
    if (mainCategory) {
        const contentTypeId = getSelectedIds("popup2");
        let category = await getCategory2ApiResponse(contentTypeId, mainCategory);
        populateDropdown("categoryCode2", category);
        const mainCategoryButtons = categoryCodes2.querySelectorAll("a");
        mainCategoryButtons.forEach(button => {
            button.addEventListener("click", function () {
                const subCategory = this.id;
                updateSubSubCategories(mainCategory, subCategory);
            });
        });
    }
}
// 소분류 생성 업데이트
async function updateSubSubCategories(mainCategory, subCategory) {
    const categoryCodes3 = document.getElementById("categoryCode3");
    categoryCodes3.innerHTML = "";

    if (subCategory) {
        const contentTypeId = getSelectedIds("popup2");
        let category = await getCategory2ApiResponse(contentTypeId,  `${mainCategory}&cat2=${subCategory}`);
        populateDropdown("categoryCode3", category);
    }
}



