import { useParams, useNavigate } from "react-router-dom";
import { samplePosts } from "../lib/sampleData";
import { ChevronLeft, MessageCircle, Plus, ShieldCheck, Globe } from "lucide-react";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const allPosts = Object.values(samplePosts).flat();
  const post = allPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-gray-400 text-sm">게시글을 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 text-[#1428A0] font-bold text-sm hover:underline flex items-center gap-1 mx-auto"
        >
          <ChevronLeft size={16} /> 뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-bold text-gray-900">상세 보기</h3>
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-50 text-[#1428A0] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              POST ID: {post.id}
            </span>
            <span className="text-[10px] text-gray-400 font-bold">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
          
          <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle size={18} />
              <span className="text-sm font-bold">댓글 0</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Plus size={18} />
              <span className="text-sm font-bold">공감 0</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Info Card */}
      <div className="bg-gradient-to-br from-[#1428A0] to-[#1F3CCF] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-3 border border-white/20">
              <ShieldCheck size={12} />
              GKV Platform Security
            </div>
            <h4 className="font-bold mb-1">안전한 커뮤니티 가이드라인</h4>
            <p className="text-blue-100/70 text-xs">비방이나 허위 사실 유포 시 제재를 받을 수 있습니다.</p>
          </div>
          <Globe size={48} className="text-white/10" />
        </div>
      </div>
    </div>
  );
}
