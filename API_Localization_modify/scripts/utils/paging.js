let currentPage = 1;
let totalPages = 10; // API 응답에서 총 페이지 수를 받아서 설정해야 함

// 페이지 버튼 업데이트
function updatePagination(totalPage) {
    totalPages = totalPage
    initPagination(totalPages)
    document.querySelectorAll(".paging button").forEach(btn => {
        if (btn.value) {
            btn.classList.toggle("on", Number(btn.value) === currentPage);
        }
    });
}

// 버튼 이벤트 리스너
function setupPagination() {
    document.querySelector(".table-prev").addEventListener("click", () => goToPage(1));
    document.querySelector(".table-back").addEventListener("click", () => goToPage(currentPage - 1));
    document.querySelector(".table-forward").addEventListener("click", () => goToPage(currentPage + 1));
    document.querySelector(".table-next").addEventListener("click", () => goToPage(totalPages));

    document.querySelectorAll(".paging button[value]").forEach(btn => {
        btn.addEventListener("click", () => goToPage(Number(btn.value)));
    });
}

// 페이지 이동 처리
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    searchFunction(page);
}

// 동적으로 페이지네이션 버튼 생성
function initPagination(pages) {

    if (!pages || isNaN(pages)) {
        pages = 1; // 기본값 설정
    }
    totalPages = pages;

    let startPage, endPage;
    if (totalPages <= 10) {
        startPage = 1;
        endPage = totalPages;
    } else if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
    
    } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
    }
   
    const buttons = document.querySelectorAll(".paging .button"); 
    let count = 0;
    for (let i = startPage; i <= endPage; i++) {
        buttons[count].value = i;
        count++;
    }
    buttons.forEach(btn => {
        if (btn.value) {
            btn.textContent = `${btn.value}`; // 
            let btnPage = Number(btn.value);
            btn.classList.toggle("on", btnPage === currentPage);
            
            if (btnPage <= totalPages) {
                btn.style.display = 'inline-block'; 
            } 
            else {
                btn.style.display = 'none';
            }
        }
    });

}

function initPaginatiosn(pages) {
    if (!pages || isNaN(pages)) {
        pages = 1; // 기본값 설정
    }

    totalPages = pages;

    let buttons = document.querySelectorAll(".paging button");

    buttons.forEach(btn => {
        if (btn.value) {
            let btnPage = Number(btn.value);
            btn.classList.toggle("on", btnPage === currentPage);
            
            if (btnPage <= totalPages) {
                btn.style.display = 'inline-block'; 
            } 
            else {
                btn.style.display = 'none';
            }
        }
    });

}

// 초기 실행
setupPagination();
initPagination(1);