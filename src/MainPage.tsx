import { useState } from "react";
import ComplaintPage from "./ComplaintPage";
import Chat from "./Chat";
import AdminPage from "./AdminPage";

type PageType = 'home' | 'complaint' | 'chat' | 'admin';

export default function MainPage() {
  const [lang, setLang] = useState("한국어");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // 페이지 라우팅
  if (currentPage === 'complaint') return <ComplaintPage onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'chat') return <Chat onBack={() => setCurrentPage('home')} />;
  if (currentPage === 'admin') return <AdminPage onBack={() => setCurrentPage('home')} />;

  return (
    <div className="min-h-screen bg-bgMain">
      
      {/* Top Bar */}
      <div className="bg-danger text-white text-center py-2 text-sm font-medium shadow-sm">
        🚨 외교부 직통 신고 | 긴급 연락: +82-2-2100-7500
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primaryLight rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            G
          </div>
          <div>
            <div className="font-bold text-lg text-textMain">700신문고</div>
            <div className="text-xs text-textSub">GLOBAL KOREAN VOICE</div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-textMain font-medium"
          >
            🌍 {lang}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-glass rounded-2xl w-44 z-20 border border-gray-100 overflow-hidden">
              {["한국어","English","中文","日本語","Русский","हिंदी","Português","Bahasa"].map((l) => (
                <div
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setMenuOpen(false);
                  }}
                  className="px-5 py-3 hover:bg-primaryLight hover:text-white cursor-pointer transition border-b border-gray-50 last:border-b-0"
                >
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-sm text-textSub hover:text-primary font-medium transition">공론·민원</button>
          <button className="text-sm text-textSub hover:text-primary font-medium transition">구인·구직</button>
          <button className="text-sm text-textSub hover:text-primary font-medium transition">부동산</button>
          <button className="text-sm text-textSub hover:text-primary font-medium transition">홍보</button>
          <button className="text-sm text-textSub hover:text-primary font-medium transition">비즈니스</button>
          <button onClick={() => setCurrentPage('admin')} className="text-sm text-textSub hover:text-danger font-medium transition">관리자</button>
          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm text-textSub">Guest</span>
            <button className="bg-primary hover:bg-primaryLight text-white px-5 py-2 rounded-xl text-sm font-semibold transition shadow-md">
              Verify Now
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary via-primaryLight to-primary text-white p-10 rounded-3xl shadow-2xl">
          <div className="mb-3 text-sm bg-white/20 backdrop-blur-sm inline-block px-4 py-1.5 rounded-lg font-medium">
            ✨ 회원가입 없음 - 100% 무료
          </div>
          
          <div className="text-5xl font-bold mb-5 leading-tight">
            전 세계 700만 한인을 위한<br />디지털 신문고
          </div>

          <div className="text-lg mb-8 opacity-95 leading-relaxed">
            사진, 영상, 음성을 포함한 민원을 접수하고 정책 토론에 참여하세요.<br />
            국적과 관계없이 전세계 어디서든 사용할 수 있습니다.
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentPage('complaint')}
              className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span className="text-xl">📝</span>
              민원 접수하기
            </button>

            <button 
              onClick={() => alert('토론 참여 페이지로 이동합니다')}
              className="bg-primaryDark/80 backdrop-blur-sm border-2 border-white/50 px-8 py-4 rounded-xl font-semibold hover:bg-primaryDark transition shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">💬</span>
              토론 참여하기
            </button>

            <button 
              onClick={() => setCurrentPage('chat')}
              className="bg-accent px-8 py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span className="text-xl">🎙️</span>
              실시간 채팅
            </button>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-3 gap-6 px-8 mb-8 max-w-7xl mx-auto">
        <GlassCard 
          title="사진 민원" 
          icon="📷" 
          description="이미지로 증거 제출"
          onClick={() => setCurrentPage('complaint')} 
        />
        <GlassCard 
          title="영상 민원" 
          icon="🎥" 
          description="동영상으로 생생하게"
          onClick={() => setCurrentPage('complaint')} 
        />
        <GlassCard 
          title="음성 민원" 
          icon="🎤" 
          description="목소리로 전달"
          onClick={() => setCurrentPage('complaint')} 
        />
      </div>

      {/* Stats & AI Section */}
      <div className="grid grid-cols-2 gap-6 px-8 mb-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-textMain flex items-center gap-2">
              <span className="text-2xl">📊</span>
              민원 현황 통계
            </h3>
            <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-textMain focus:outline-none focus:ring-2 focus:ring-primary">
              <option>이번 주</option>
              <option>이번 달</option>
              <option>올해</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <div className="text-4xl font-bold text-textMain mb-1">1,284</div>
              <div className="text-sm text-textSub font-medium">총 접수</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-4xl font-bold text-primary mb-1">942</div>
              <div className="text-sm text-textSub font-medium">처리 완료</div>
            </div>
          </div>
        </div>

        {/* AI Report */}
        <div className="bg-gradient-to-br from-success/10 to-info/10 backdrop-blur-md p-8 rounded-3xl border-2 border-success/30 shadow-glass">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🤖</span>
            <h3 className="font-bold text-xl text-textMain">AI 정책 요약</h3>
          </div>
          <p className="text-textMain leading-relaxed mb-6">
            최근 24시간 동안 <strong>해외 한인 안전</strong> 관련 민원이 <span className="text-danger font-bold">15% 증가</span>했으며,<br />
            주요 키워드는 <span className="text-primary font-semibold">'영사 지원'</span>, <span className="text-primary font-semibold">'현지 의료'</span>입니다.
          </p>
          <div>
            <div className="flex justify-between items-center text-sm text-textSub mb-2">
              <span className="font-medium">긍정 여론</span>
              <span className="font-bold text-success">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-success to-info h-3 rounded-full transition-all duration-500" style={{width: '72%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Discussion Section */}
      <div className="px-8 mb-12 max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💭</span>
              <h3 className="font-bold text-xl text-textMain">공론 민원</h3>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition">최신순</button>
              <button className="px-4 py-2 text-textSub rounded-xl text-sm font-medium hover:bg-gray-100 transition">인기순</button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl hover:shadow-md cursor-pointer transition border border-gray-100">
              <div className="text-base font-semibold text-textMain mb-2">해외 체류 한인을 위한 원격 의료 지원 확대 요청</div>
              <div className="flex items-center gap-4 text-sm text-textSub">
                <span className="flex items-center gap-1">👍 128</span>
                <span className="flex items-center gap-1">💬 34</span>
                <span>2시간 전</span>
              </div>
            </div>
            <div className="p-5 bg-gradient-to-r from-gray-50 to-green-50/50 rounded-2xl hover:shadow-md cursor-pointer transition border border-gray-100">
              <div className="text-base font-semibold text-textMain mb-2">현지 한국어 교육 기관 지원 방안 논의</div>
              <div className="flex items-center gap-4 text-sm text-textSub">
                <span className="flex items-center gap-1">👍 95</span>
                <span className="flex items-center gap-1">💬 22</span>
                <span>5시간 전</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button 
          onClick={() => setCurrentPage('admin')}
          className="w-16 h-16 bg-gradient-to-br from-danger to-red-600 rounded-full text-white shadow-2xl hover:shadow-3xl transition transform hover:scale-110 flex items-center justify-center text-3xl"
          title="관리자 페이지"
        >
          🛡
        </button>
        <button 
          onClick={() => setCurrentPage('chat')}
          className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-full text-white shadow-2xl hover:shadow-3xl transition transform hover:scale-110 flex items-center justify-center text-3xl"
          title="실시간 채팅"
        >
          💬
        </button>
      </div>
    </div>
  );
}

function GlassCard({ title, icon, description, onClick }: { title: string; icon: string; description: string; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-glass hover:shadow-xl transition cursor-pointer text-center border border-white/40 hover:border-primary/30 transform hover:-translate-y-1"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <div className="font-bold text-xl text-textMain mb-2">{title}</div>
      <div className="text-sm text-textSub">{description}</div>
    </div>
  );
}
