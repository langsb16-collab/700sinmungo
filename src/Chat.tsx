import { useState, useEffect, useRef } from "react";

interface ChatProps {
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

export default function Chat({ onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "실시간 채팅방에 오신 것을 환영합니다!",
      sender: "other",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // WebSocket 연결 (현재는 시뮬레이션)
    // const ws = new WebSocket("wss://huan.my/api/chat");
    // ws.onopen = () => setConnected(true);
    // ws.onmessage = (e) => {
    //   const data = JSON.parse(e.data);
    //   setMessages(prev => [...prev, {
    //     id: Date.now().toString(),
    //     text: data.message,
    //     sender: "other",
    //     timestamp: new Date()
    //   }]);
    // };
    // wsRef.current = ws;

    // 시뮬레이션: 3초 후 연결됨
    setTimeout(() => setConnected(true), 1000);

    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // WebSocket 전송
    // wsRef.current?.send(JSON.stringify({ message: input }));

    // 시뮬레이션: 자동 응답
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "메시지를 받았습니다. 실시간 채팅 기능은 WebSocket을 통해 구현됩니다.",
          sender: "other",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bgMain flex">
      {/* 사이드바 */}
      <div className="w-80 bg-white/70 backdrop-blur-md border-r border-gray-200 p-6">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition mb-6 text-textMain font-medium"
        >
          <span className="text-xl">←</span>
          홈으로 돌아가기
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-textMain mb-2">실시간 채팅</h2>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-success" : "bg-danger"}`}></div>
            <span className="text-textSub">{connected ? "연결됨" : "연결 중..."}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
            <div className="font-semibold text-textMain mb-1">일반 채팅방</div>
            <div className="text-xs text-textSub">28명 참여 중</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer transition">
            <div className="font-semibold text-textMain mb-1">해외 한인 지원</div>
            <div className="text-xs text-textSub">15명 참여 중</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer transition">
            <div className="font-semibold text-textMain mb-1">비자/이민 상담</div>
            <div className="text-xs text-textSub">9명 참여 중</div>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 px-8 py-5">
          <h1 className="text-2xl font-bold text-textMain">일반 채팅방</h1>
          <p className="text-sm text-textSub mt-1">실시간으로 대화를 나눠보세요</p>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-lg px-6 py-4 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-primary to-primaryLight text-white shadow-md"
                    : "bg-white/80 backdrop-blur-md text-textMain shadow-glass border border-gray-100"
                }`}
              >
                <div className="text-base leading-relaxed">{msg.text}</div>
                <div
                  className={`text-xs mt-2 ${
                    msg.sender === "user" ? "text-blue-100" : "text-textSub"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="bg-white/70 backdrop-blur-md border-t border-gray-200 p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="메시지를 입력하세요..."
              disabled={!connected}
              className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-textMain disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!connected || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primaryLight text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
