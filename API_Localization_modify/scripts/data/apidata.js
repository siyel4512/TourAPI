// API 데이터 저장
const API_CONFIG = {
   // serviceKey: "ZKm8lDJ3ZrIgEVlA7iWYBF1Y%2BTdr1hre2tdIh4yy9sc1m1culAi0HFyOyAyAnZ%2FOFjf9grYrvj2Ty8V1ylmEnA%3D%3D"
     serviceKey: "v%2BiTRh4RmyTrvuNjU3fgBKGf%2FetKbSoStNKapuVrLc2R%2BdBXgDDvq22Q0JyRWLBhCuDHLVjosMSoO0eLcdz3Ow%3D%3D"
};
const Default_URL = {
    kor: "https://apis.data.go.kr/B551011/KorService1/",  // 한국어
    eng: "https://apis.data.go.kr/B551011/EngService1/",  // 영어
    jpn: "https://apis.data.go.kr/B551011/JpnService1/",  // 일어
    chs: "https://apis.data.go.kr/B551011/ChsService1/",  // 중국어 간체
    cht: "https://apis.data.go.kr/B551011/ChtService1/",  // 중국어 번체
    ger: "https://apis.data.go.kr/B551011/GerService1/",  // 독일어
    fre: "https://apis.data.go.kr/B551011/FreService1/",  // 프랑스어
    spn: "https://apis.data.go.kr/B551011/SpnService1/",  // 스페인어
    rus: "https://apis.data.go.kr/B551011/RusService1/"   // 러시아어
};


const culture = {
    "한국어": "kor",
    "English": "eng",
    "日本語": "jpn",
    "简体中文": "chs",
    "繁體中文": "cht",
    "Deutsch": "ger",
    "Français": "fre",
    "Español": "spn",
    "Русский": "rus"
};

const pathType_outside = {
    "11": "열차",
    "12": "고속/시외버스",
    "13": "항공",
    "20": "시외교통 복합(열차+고속버스 등)"
  };
  
  const pathType_inside = {
    "1": "지하철",
    "2": "버스",
    "3": "버스+지하철"
  };
  
