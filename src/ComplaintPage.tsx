import { useState } from "react";

interface ComplaintPageProps {
  onBack: () => void;
}

export default function ComplaintPage({ onBack }: ComplaintPageProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("photo");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = "";

      // 파일 업로드 (R2)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("파일 업로드 실패");
        
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
      }

      // 민원 제출 (D1)
      const complaintRes = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          type,
          file_url: fileUrl,
        }),
      });

      if (!complaintRes.ok) throw new Error("민원 제출 실패");

      setSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (error) {
      alert("오류: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bgMain flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-glass text-center border border-success/30">
          <div className="text-7xl mb-6">✅</div>
          <div className="text-3xl font-bold text-success mb-3">민원 접수 완료!</div>
          <div className="text-textSub">홈으로 돌아갑니다...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgMain p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center text-2xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-textMain">민원 접수하기</h1>
            <p className="text-textSub mt-1">사진, 영상, 음성을 포함하여 제출할 수 있습니다</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-glass border border-white/40">
          
          {/* 민원 유형 */}
          <div className="mb-6">
            <label className="block text-textMain font-semibold mb-3">민원 유형</label>
            <div className="flex gap-3">
              {[
                { value: "photo", label: "📷 사진", color: "from-blue-500 to-blue-600" },
                { value: "video", label: "🎥 영상", color: "from-purple-500 to-purple-600" },
                { value: "audio", label: "🎤 음성", color: "from-green-500 to-green-600" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition ${
                    type === t.value
                      ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                      : "bg-gray-100 text-textSub hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-textMain font-semibold mb-3">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="민원 제목을 입력하세요"
              required
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-textMain"
            />
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <label className="block text-textMain font-semibold mb-3">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="민원 내용을 상세히 작성해 주세요"
              required
              rows={8}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-textMain resize-none"
            />
          </div>

          {/* 파일 첨부 */}
          <div className="mb-8">
            <label className="block text-textMain font-semibold mb-3">파일 첨부 (선택)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                accept={
                  type === "photo" 
                    ? "image/*" 
                    : type === "video" 
                    ? "video/*" 
                    : "audio/*"
                }
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-5xl mb-3">📎</div>
                <div className="text-textMain font-medium mb-1">
                  {file ? file.name : "파일을 선택하거나 드래그하세요"}
                </div>
                <div className="text-sm text-textSub">
                  {type === "photo" && "이미지 파일 (JPG, PNG, GIF)"}
                  {type === "video" && "영상 파일 (MP4, MOV, AVI)"}
                  {type === "audio" && "음성 파일 (MP3, WAV, M4A)"}
                </div>
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-8 py-4 border-2 border-gray-300 text-textSub rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-8 py-4 rounded-xl font-bold text-white transition shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-primaryLight hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "제출 중..." : "민원 접수하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
