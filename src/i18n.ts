import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      common: {
        language: "언어",
        submit: "제출",
        cancel: "취소",
        loading: "로딩 중...",
        success: "성공",
        error: "오류"
      },
      nav: {
        home: "홈",
        complaint: "민원 접수",
        discussion: "공론장",
        stats: "통계",
        jobs: "구인·구직",
        realestate: "부동산",
        promotion: "홍보",
        business: "비즈니스"
      },
      auth: {
        title: "간편 인증",
        nationality: "국적",
        residence: "거주 국가",
        phone: "현지 전화번호",
        sendOtp: "인증번호 발송",
        verify: "인증하기",
        placeholderPhone: "전화번호 입력",
        nat_korean: "대한민국 국적",
        nat_mixed2: "한국계 혼혈 2세",
        nat_mixed3: "한국계 혼혈 3세",
        nat_overseas: "기타 재외동포",
        nat_foreign: "외국 국적 한인",
        selectCountry: "국가 선택",
        authRequired: "이 작업은 휴대폰 인증이 필요합니다.",
        authRequiredDesc: "게시물 작성, 민원 접수 등은 현지 휴대폰 인증 후 이용 가능합니다.",
        noLoginTitle: "회원가입 없음 · 100% 무료",
        noLoginDesc: "비인증 자유 열람 시스템"
      },
      report: {
        mofaTitle: "외교부 직통 신고",
        mofaDesc: "영사·대사관 업무 불만 전용 Fast-Track",
        missionName: "공관명 (대사관/영사관)",
        complaintType: "불만 유형",
        description: "상세 내용",
        anonymous: "익명 신고",
        submit: "신고 제출",
        success: "신고가 접수되었습니다.",
        types: {
          delay_service: "영사 업무 지연",
          rude_behavior: "민원 응대 태도",
          no_response: "업무 절차 불투명",
          emergency_fail: "긴급 상황 대응 미흡",
          administrative_abuse: "행정 편의주의",
          other: "기타"
        }
      },
      countries: {
        "GH": "가나", "GY": "가이아나", "GM": "감비아", "GT": "과테말라", "GR": "그리스", "GN": "기니", "GW": "기니비사우", "NA": "나미비아",
        "NG": "나이지리아", "ZA": "남아프리카공화국", "NL": "네덜란드", "NP": "네팔", "NO": "노르웨이", "NZ": "뉴질랜드", "NE": "니제르", "NI": "니카라과",
        "DK": "덴마크", "DO": "도미니카공화국", "DE": "독일", "TL": "동티모르", "LA": "라오스", "LR": "라이베리아", "LV": "라트비아", "RU": "러시아",
        "RO": "루마니아", "LU": "룩셈부르크", "RW": "르완다", "LY": "리비아", "LT": "리투아니아", "MG": "마다가스카르", "MY": "말레이시아", "MX": "멕시코",
        "MA": "모로코", "MN": "몽골", "MZ": "모잠비크", "MD": "몰도바", "MT": "몰타", "US": "미국", "MM": "미얀마", "BH": "바레인", "BB": "바베이도스",
        "VA": "바티칸", "BD": "방글라데시", "VE": "베네수엘라", "VN": "베트남", "BE": "벨기에", "BY": "벨라루스", "BA": "보스니아헤르체고비나", "BO": "볼리비아",
        "BR": "브라질", "BN": "브루나이", "BG": "불가리아", "SA": "사우디아라비아", "SN": "세네갈", "RS": "세르비아", "SO": "소말리아", "LK": "스리랑카",
        "SE": "스웨덴", "CH": "스위스", "ES": "스페인", "SK": "슬로바키아", "SI": "슬로베니아", "SG": "싱가포르", "AE": "아랍에미리트", "AR": "아르헨티나",
        "IS": "아이슬란드", "HT": "아이티", "IE": "아일랜드", "AZ": "아제르바이잔", "AF": "아프가니스탄", "DZ": "알제리", "AL": "알바니아", "EE": "에스토니아",
        "EC": "에콰도르", "ET": "에티오피아", "SV": "엘살바도르", "GB": "영국", "YE": "예멘", "OM": "오만", "AT": "오스트리아", "HN": "온두라스",
        "JO": "요르단", "UG": "우간다", "UY": "우루과이", "UZ": "우즈베키스탄", "UA": "우크라이나", "IR": "이란", "IQ": "이라크", "IL": "이스라엘",
        "EG": "이집트", "IT": "이탈리아", "IN": "인도", "ID": "인도네시아", "JP": "일본", "ZM": "잠비아", "CN": "중국", "CL": "칠레", "KZ": "카자흐스탄",
        "CA": "캐나다", "TH": "태국"
      },
      chat: {
        title: "실시간 번역 채팅",
        placeholder: "메시지를 입력하세요",
        videoCall: "영상 통화",
        voiceCall: "음성 통화",
        sendPhoto: "사진 전송",
        recordVoice: "30초 녹음"
      },
      faq: {
        title: "AI 플랫폼 안내",
        q1: "이 플랫폼은 무엇인가요?",
        a1: "전세계 재외동포를 위한 디지털 신문고입니다.",
        q2: "해외에서도 민원 접수가 가능한가요?",
        a2: "국적과 현지 전화번호 인증만으로 가능합니다."
      }
    }
  },
  en: {
    translation: {
      common: {
        language: "Language",
        submit: "Submit",
        cancel: "Cancel",
        loading: "Loading...",
        success: "Success",
        error: "Error"
      },
      nav: {
        home: "Home",
        complaint: "Report",
        discussion: "Forum",
        stats: "Stats"
      },
      auth: {
        title: "Simple Auth",
        nationality: "Nationality",
        residence: "Residence",
        phone: "Local Phone",
        sendOtp: "Send OTP",
        verify: "Verify",
        placeholderPhone: "Enter phone number",
        nat_korean: "Korean National",
        nat_mixed2: "2nd Gen Mixed",
        nat_mixed3: "3rd Gen Mixed",
        nat_overseas: "Overseas Korean",
        nat_foreign: "Foreign Korean",
        selectCountry: "Select Country",
        authRequired: "Authentication Required",
        authRequiredDesc: "Actions like posting or reporting require local phone verification.",
        noLoginTitle: "No Sign-up · 100% Free",
        noLoginDesc: "Free Access System"
      },
      report: {
        mofaTitle: "Direct Report to MOFA",
        mofaDesc: "Fast-Track for Embassy/Consulate Complaints",
        missionName: "Mission Name (Embassy/Consulate)",
        complaintType: "Complaint Type",
        description: "Details",
        anonymous: "Anonymous Report",
        submit: "Submit Report",
        success: "Report submitted successfully.",
        types: {
          delay_service: "Service Delay",
          rude_behavior: "Rude Behavior",
          no_response: "Lack of Transparency",
          emergency_fail: "Emergency Response Failure",
          administrative_abuse: "Administrative Abuse",
          other: "Other"
        }
      },
      countries: {
        "GH": "Ghana", "GY": "Guyana", "GM": "Gambia", "GT": "Guatemala", "GR": "Greece", "GN": "Guinea", "GW": "Guinea-Bissau", "NA": "Namibia",
        "NG": "Nigeria", "ZA": "South Africa", "NL": "Netherlands", "NP": "Nepal", "NO": "Norway", "NZ": "New Zealand", "NE": "Niger", "NI": "Nicaragua",
        "DK": "Denmark", "DO": "Dominican Republic", "DE": "Germany", "TL": "Timor-Leste", "LA": "Laos", "LR": "Liberia", "LV": "Latvia", "RU": "Russia",
        "RO": "Romania", "LU": "Luxembourg", "RW": "Rwanda", "LY": "Libya", "LT": "Lithuania", "MG": "Madagascar", "MY": "Malaysia", "MX": "Mexico",
        "MA": "Morocco", "MN": "Mongolia", "MZ": "Mozambique", "MD": "Moldova", "MT": "Malta", "US": "United States", "MM": "Myanmar", "BH": "Bahrain",
        "BB": "Barbados", "VA": "Vatican City", "BD": "Bangladesh", "VE": "Venezuela", "VN": "Vietnam", "BE": "Belgium", "BY": "Belarus", "BA": "Bosnia and Herzegovina",
        "BO": "Bolivia", "BR": "Brazil", "BN": "Brunei", "BG": "Bulgaria", "SA": "Saudi Arabia", "SN": "Senegal", "RS": "Serbia", "SO": "Somalia",
        "LK": "Sri Lanka", "SE": "Sweden", "CH": "Switzerland", "ES": "Spain", "SK": "Slovakia", "SI": "Slovenia", "SG": "Singapore", "AE": "United Arab Emirates",
        "AR": "Argentina", "IS": "Iceland", "HT": "Haiti", "IE": "Ireland", "AZ": "Azerbaijan", "AF": "Afghanistan", "DZ": "Algeria", "AL": "Albania",
        "EE": "Estonia", "EC": "Ecuador", "ET": "Ethiopia", "SV": "El Salvador", "GB": "United Kingdom", "YE": "Yemen", "OM": "Oman", "AT": "Austria",
        "HN": "Honduras", "JO": "Jordan", "UG": "Uranda", "UY": "Uruguay", "UZ": "Uzbekistan", "UA": "Ukraine", "IR": "Iran", "IQ": "Iraq",
        "IL": "Israel", "EG": "Egypt", "IT": "Italy", "IN": "India", "ID": "Indonesia", "JP": "Japan", "ZM": "Zambia", "CN": "China", "CL": "Chile",
        "KZ": "Kazakhstan", "CA": "Canada", "TH": "Thailand"
      },
      chat: {
        title: "Live Translation Chat",
        placeholder: "Type a message...",
        videoCall: "Video Call",
        voiceCall: "Voice Call",
        sendPhoto: "Send Photo",
        recordVoice: "Record (30s)"
      },
      faq: {
        title: "AI Guide",
        q1: "What is this platform?",
        a1: "It is a digital voice for overseas Koreans worldwide.",
        q2: "Can I report from abroad?",
        a2: "Yes, with nationality and local phone verification."
      }
    }
  }
  // Add other languages (zh, ja, ru, hi, pt-BR, id) similarly
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
