import { useParams, Link } from "react-router-dom";
import { samplePosts } from "../lib/sampleData";
import { ChevronRight, MessageCircle, Plus } from "lucide-react";

export default function CategoryPage() {
  const { type } = useParams<{ type: string }>();

  const posts = type ? samplePosts[type as keyof typeof samplePosts] : [];

  if (!posts || posts.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-gray-400 text-sm">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="uppercase">{type}</span> 게시물
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-50 text-[#1428A0] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    NOTICE
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-gray-800 group-hover:text-[#1428A0] transition-colors mb-2">{post.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-400">
                  <MessageCircle size={14} />
                  <span className="text-[10px] font-bold">0</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Plus size={14} />
                  <span className="text-[10px] font-bold">0</span>
                </div>
                <div className="ml-auto text-[#1428A0] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold">
                  자세히 보기 <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
