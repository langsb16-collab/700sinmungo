import { useState } from "react";

export default function MainPage() {
  const [lang, setLang] = useState("한국어");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleComplaint = () => {
    alert("민원 접수 페이지로 이동합니다");
  };

  const handleDiscussion = () => {
    alert("토론 참여 페이지로 이동합니다");
  };

  const handleCreateRoom = () => {
    alert("토론방 생성 페이지로 이동합니다");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Bar */}
      <div className="bg-red-600 text-white text-center py-2 text-sm">
        외교부 직통 신고 | 신고 제출
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            G
          </div>
          <div>
            <div className="font-bold">GKV Platform</div>
            <div className="text-xs text-gray-400">GLOBAL KOREAN VOICE</div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            🌍 {lang}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-10">
              {["한국어","English","中文","日本語","Русский","हिंदी","Português","Bahasa"].map((l) => (
                <div
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                >
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900">공론·민원</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">구인·구직</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">부동산</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">홍보</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">비즈니스</button>
          <div className="flex items-center gap-2">
            <span className="text-sm">Guest</span>
            <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">Verify Now</button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-3xl shadow-xl">
          <div className="mb-2 text-sm bg-blue-800 bg-opacity-50 inline-block px-3 py-1 rounded">
            회원가입 없음 - 100% 무료
          </div>
          
          <div className="text-4xl font-bold mb-4">
            전 세계 700만 한인을 위한<br />디지털 신문고
          </div>

          <div className="text-base mb-6 opacity-90">
            국적과 관계 없이 전세계 어느 곳에든 살고 있는 사진, 영상, 음성을 포함한 민원을 접수하고<br />
            실시간 정책 토론에 참여하세요.
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleComplaint}
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              + 민원 접수하기
            </button>

            <button 
              onClick={handleDiscussion}
              className="bg-blue-600 border-2 border-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              토론 참여하기
            </button>

            <button 
              onClick={handleCreateRoom}
              className="bg-orange-500 px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2"
            >
              <span>📢</span> 토론방 생성
            </button>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-3 gap-4 px-6 mb-6">
        <Card title="사진 민원" icon="📷" />
        <Card title="영상 민원" icon="🎥" />
        <Card title="음성 민원" icon="🎤" />
      </div>

      {/* Stats & Charts */}
      <div className="px-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">📊 민원 현황 통계</h3>
            <select className="border rounded px-3 py-1 text-sm">
              <option>이번 주</option>
              <option>이번 달</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">1,284</div>
              <div className="text-sm text-gray-500">총 접수</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">942</div>
              <div className="text-sm text-gray-500">처리 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Section */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✅</span>
            <h3 className="font-bold text-lg">AI 정책 요약 리포트</h3>
          </div>
          <p className="text-sm text-gray-700">
            "최근 24시간 동안 박사 활동 관련 민원이 15% 증가했으며<br />
            나라 주요 키워드는 '식품 건강식', '저작 기관'입니다."
          </p>
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1">긍정 여론</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '72%'}}></div>
            </div>
            <div className="text-right text-xs text-gray-600 mt-1">72%</div>
          </div>
        </div>
      </div>

      {/* Public Discussion Section */}
      <div className="px-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <h3 className="font-bold">공론 민원</h3>
            </div>
            <button className="text-blue-600 text-sm">최신순 · 인기순</button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="text-sm font-semibold">제시물 작성 시에만 김라본 술라본 입문이 보입니다.</div>
              <div className="text-xs text-gray-500 mt-1">토론 참여하기</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button className="w-14 h-14 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition flex items-center justify-center text-2xl">
          🛡
        </button>
        <button className="w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg hover:bg-orange-600 transition flex items-center justify-center text-2xl">
          ?
        </button>
      </div>
    </div>
  );
}

function Card({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <div className="font-semibold text-gray-700">{title}</div>
    </div>
  );
}
