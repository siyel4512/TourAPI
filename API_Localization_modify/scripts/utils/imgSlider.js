
let currentIndex = 0;  // 현재 메인 이미지 인덱스
let thumbnailIndex = 0; // 썸네일 시작 인덱스
const thumbnailsPerPage = 3; // 한 번에 보여줄 썸네일 개수
let images = [];

// 이미지 변경 함수 (메인 이미지 변경)
function changeImage(index) {
    currentIndex = index;
    updateImage();
}

// 이미지 슬라이드 - 가져온 이미지 세팅
function displayImages(items) {
    document.querySelector(".prev").classList.add("on");
    document.querySelector(".next").classList.add("on");
    images = items;
    currentIndex = 0;
    thumbnailIndex = 0;

    const dotContainer = document.querySelector(".dots");
    dotContainer.innerHTML = '';

    // dot 생성
    images.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.addEventListener("click", () => changeImage(index));
        dotContainer.appendChild(dot);
    });

    updateImage();
}

// 이미지 업데이트 (메인 이미지 + 썸네일)
function updateImage() {
    const img = document.getElementById("main-image");
    img.src = images[currentIndex]; // 메인 이미지 변경

    // 활성화된 dot 업데이트
    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });

    // 썸네일 업데이트
    updateThumbnails();
}

// 썸네일 업데이트 (3개씩 보이게)
function updateThumbnails() {
    const thumbnailContainer = document.querySelector(".thumbnails");
    thumbnailContainer.innerHTML = '';

    for (let i = thumbnailIndex; i < thumbnailIndex + thumbnailsPerPage && i < images.length; i++) {
        const thumbnail = document.createElement("img");
        thumbnail.src = images[i];
        thumbnail.classList.add("thumbnail");
        if (i === currentIndex) {
            thumbnail.classList.add("active"); // 현재 메인 이미지와 동일한 썸네일 강조
        }
        thumbnail.addEventListener("click", () => changeImage(i));
        thumbnailContainer.appendChild(thumbnail);
    }
}

// 썸네일 슬라이드 버튼
document.querySelector(".prev").addEventListener("click", () => {
    if (thumbnailIndex > 0) {
        thumbnailIndex -= thumbnailsPerPage;
        updateThumbnails();
    }
});
document.querySelector(".next").addEventListener("click", () => {
    if (thumbnailIndex + thumbnailsPerPage < images.length) {
        thumbnailIndex += thumbnailsPerPage;
        updateThumbnails();
    }
});



// // 이미지 슬라이더 - 메인이미지만 변경
// function changeImage(index) {
//     currentIndex = index;
//     updateImage();
// }
// // 이미지 슬라이드 - 가져온 이미지 세팅
// function displayImages(items) {
//     document.querySelector(".prev").classList.add("on");
//     document.querySelector(".next").classList.add("on");
//     images = items;
//     currentIndex = 0;
//     const dotContainer = document.querySelector(".dots");
//     dotContainer.innerHTML = '';

//     // dot 생성
//     images.forEach((_, index) => {
//         const dot = document.createElement("span");
//         dot.classList.add("dot");
//         dot.addEventListener("click", () => {
//             changeImage(index);
//         });
//         dotContainer.appendChild(dot);
//     });

//     updateImage();
// }
// // 이미지 슬라이드 - 이미지 display
// function updateImage() {
//     const img = document.getElementById("main-image");
//     img.src = images[currentIndex]; // Set the image source to the current index
//     document.querySelectorAll(".dot").forEach((dot, index) => {
//         dot.classList.toggle("active", index === currentIndex); // Update dots
//     });
// }

// //이미지 슬라이드 버튼 설정
// document.querySelector(".prev").addEventListener("click", () => {
//     currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
//     updateImage(); // Update image when clicking previous
// });
// document.querySelector(".next").addEventListener("click", () => {
//     currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
//     updateImage(); // Update image when clicking next
// });


//목록으로 돌아가기
document.querySelector(".back-button").addEventListener("click", function () {
    window.location.href = "../html/index.html";
});


//현지화
async function reloadLocation() {
    const translations = await loadLocale(localStorage.language);

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

// 초기화면에서 불러오기
if (itemId) {
    reloadLocation();
    displayContent(itemId);
}
