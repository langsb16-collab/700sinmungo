import { useState, useEffect } from "react";

interface AdminPageProps {
  onBack: () => void;
}

interface Complaint {
  id: number;
  title: string;
  content: string;
  type: string;
  file_url: string | null;
  created_at: string;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (!res.ok) throw new Error("데이터 로딩 실패");
      const data = await res.json();
      setComplaints(data);
    } catch (error) {
      console.error("민원 목록 로딩 오류:", error);
      // 시뮬레이션 데이터
      setComplaints([
        {
          id: 1,
          title: "해외 체류 한인 의료 지원 요청",
          content: "현지에서 의료 서비스 이용 시 언어 장벽으로 인한 어려움이 있습니다. 원격 의료 상담 서비스를 확대해 주시기 바랍니다.",
          type: "photo",
          file_url: null,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "한글 교육 기관 지원 확대",
          content: "자녀들의 한글 교육을 위한 지원이 부족합니다. 온라인 한글 교육 프로그램 지원을 요청드립니다.",
          type: "video",
          file_url: null,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo": return "📷";
      case "video": return "🎥";
      case "audio": return "🎤";
      default: return "📄";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "photo": return "from-blue-500 to-blue-600";
      case "video": return "from-purple-500 to-purple-600";
      case "audio": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-bgMain">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-12 h-12 bg-white rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center text-2xl"
            >
              ←
            </button>
            <div>
              <h1 className="text-3xl font-bold text-textMain flex items-center gap-3">
                <span className="text-4xl">🛡</span>
                관리자 대시보드
              </h1>
              <p className="text-textSub mt-1">접수된 민원을 확인하고 관리하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-6 py-3 bg-primary/10 rounded-xl">
              <div className="text-2xl font-bold text-primary">{complaints.length}</div>
              <div className="text-xs text-textSub font-medium">총 민원</div>
            </div>
            <button className="px-6 py-3 bg-success text-white rounded-xl font-semibold hover:bg-success/90 transition">
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <div className="text-xl text-textSub">데이터 로딩 중...</div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-3xl shadow-glass">
            <div className="text-7xl mb-6">📭</div>
            <div className="text-2xl font-bold text-textMain mb-2">접수된 민원이 없습니다</div>
            <div className="text-textSub">새로운 민원이 접수되면 여기에 표시됩니다</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => setSelectedComplaint(complaint)}
                className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/40 hover:shadow-xl transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 bg-gradient-to-r ${getTypeColor(complaint.type)} text-white rounded-lg text-sm font-semibold flex items-center gap-1`}>
                        {getTypeIcon(complaint.type)}
                        {complaint.type === "photo" ? "사진" : complaint.type === "video" ? "영상" : "음성"}
                      </span>
                      <span className="text-sm text-textSub">{formatDate(complaint.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-textMain mb-2">{complaint.title}</h3>
                    <p className="text-textSub leading-relaxed line-clamp-2">{complaint.content}</p>
                  </div>
                  {complaint.file_url && (
                    <div className="ml-4">
                      <a
                        href={complaint.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-info/10 text-info rounded-xl text-sm font-medium hover:bg-info/20 transition flex items-center gap-2"
                      >
                        📎 첨부파일
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 bg-gradient-to-r ${getTypeColor(selectedComplaint.type)} text-white rounded-xl font-semibold flex items-center gap-2`}>
                  {getTypeIcon(selectedComplaint.type)}
                  {selectedComplaint.type === "photo" ? "사진" : selectedComplaint.type === "video" ? "영상" : "음성"} 민원
                </span>
                <span className="text-sm text-textSub">{formatDate(selectedComplaint.created_at)}</span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-xl transition"
              >
                ✕
              </button>
            </div>

            <h2 className="text-3xl font-bold text-textMain mb-4">{selectedComplaint.title}</h2>
            <p className="text-textMain leading-relaxed mb-6 whitespace-pre-wrap">{selectedComplaint.content}</p>

            {selectedComplaint.file_url && (
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📎</span>
                    <div>
                      <div className="font-semibold text-textMain">첨부 파일</div>
                      <div className="text-sm text-textSub">{selectedComplaint.file_url}</div>
                    </div>
                  </div>
                  <a
                    href={selectedComplaint.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primaryLight transition"
                  >
                    파일 보기
                  </a>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button className="flex-1 px-6 py-4 bg-success text-white rounded-xl font-semibold hover:bg-success/90 transition">
                처리 완료
              </button>
              <button className="flex-1 px-6 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition">
                보류
              </button>
              <button className="flex-1 px-6 py-4 bg-danger text-white rounded-xl font-semibold hover:bg-danger/90 transition">
                거부
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
