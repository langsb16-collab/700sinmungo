import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  MessageCircle, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Users, 
  Camera, 
  Mic, 
  Video, 
  Send, 
  X, 
  ChevronRight, 
  Plus,
  PlusCircle,
  Phone,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './i18n';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Category {
  id: string;
  code: string;
  label_ko: string;
}

interface Post {
  id: string;
  category_id: string;
  category_code: string;
  title: string;
  content: string;
  country_code: string;
  country_name: string;
  nationality: string;
  price?: string;
  meta?: string;
  created_at: string;
  media: { file_url: string; file_type: string }[];
}

interface Country {
  code: string;
  name_ko: string;
  continent: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  type: 'text' | 'image' | 'audio';
  created_at: string;
}

// --- Components ---

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: '히न्दी' },
    { code: 'pt-BR', name: 'Português' },
    { code: 'id', name: 'Bahasa' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
        <Languages size={16} />
        <span className="text-sm font-medium">{languages.find(l => l.code === i18n.language)?.name || 'Language'}</span>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={cn(
              "w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors",
              i18n.language === lang.code ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"
            )}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatWindow = ({ isOpen, onClose, isAuthenticated, setIsAuthOpen }: { 
  isOpen: boolean; 
  onClose: () => void;
  isAuthenticated: boolean;
  setIsAuthOpen: (val: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // HTTP Polling instead of WebSocket (Cloudflare Pages compatible)
  useEffect(() => {
    if (!isOpen) return;

    // Poll for messages every 3 seconds
    const pollInterval = setInterval(async () => {
      try {
        // This would fetch messages from your API
        // For now, we'll skip the actual API call since the endpoint isn't implemented yet
        // const response = await fetch('/api/messages?room=global&since=' + lastMessageId);
        // const newMessages = await response.json();
        // setMessages(prev => [...prev, ...newMessages]);
      } catch (error) {
        console.log('Message polling disabled');
      }
    }, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'User',
      text: input,
      type: 'text',
      created_at: new Date().toISOString()
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Send to API (optional - implement when ready)
    try {
      // await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ room: 'global', ...newMessage })
      // });
    } catch (error) {
      console.log('Message send failed - showing locally only');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-24 left-6 w-96 h-[50vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-40"
        >
          <div className="bg-[#1428A0] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('chat.title')}</h3>
                <p className="text-[10px] opacity-70">Telegram Style UI</p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex flex-col", msg.sender === 'User' ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                  msg.sender === 'User' ? "bg-[#1428A0] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                )}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Plus size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button 
              onClick={handleSend} 
              className="p-2 rounded-full transition-colors bg-[#1428A0] text-white hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FAQBot = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: "익명 민원이 가능한가요?", a: "네, 민원 접수 시 익명/실명/부분 익명 중 선택이 가능합니다." },
    { q: "처리 기간은 얼마나 걸리나요?", a: "평균 7일 이내에 담당 부처가 지정되며, 실시간으로 진행 상태를 확인할 수 있습니다." },
    { q: "영상이나 음성 파일도 되나요?", a: "네, 30초 음성 녹음 및 영상 첨부를 지원하여 현장감 있는 민원 접수가 가능합니다." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-40"
        >
          <div className="bg-[#FF6A00] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <HelpCircle size={20} />
              <h3 className="font-semibold text-sm">{t('faq.title')}</h3>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 bg-orange-50 border-b border-orange-100">
            <p className="text-[10px] text-orange-700 font-bold leading-tight">
              💡 GKV는 회원가입 없이 모든 정보를 자유롭게 열람할 수 있습니다. 게시물 작성 시에만 간단한 인증이 필요합니다.
            </p>
          </div>
          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b last:border-0">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-3 hover:bg-gray-50 flex justify-between items-center transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{faq.q}</span>
                  <ChevronRight size={16} className={cn("transition-transform", activeFaq === i && "rotate-90")} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="p-3 text-xs text-gray-500 bg-gray-50 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AuthModal = ({ isOpen, onClose, onAuthenticated, countries }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAuthenticated: () => void;
  countries: Country[];
}) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const countryOptions = countries.map(c => ({
    value: c.code,
    label: t(`countries.${c.code}`) || c.name_ko
  }));

  const handleSendOtp = async () => {
    if (!phone) return;
    await fetch('/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    setOtpSent(true);
  };

  const handleVerify = () => {
    // Simulated verification
    onAuthenticated();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-[#1428A0] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <h3 className="font-bold">{t('auth.authRequired')}</h3>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-gray-500 text-center">
                {t('auth.authRequiredDesc')}
              </p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.residence')}</label>
                  <Select
                    options={countryOptions}
                    placeholder={t('auth.selectCountry')}
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        borderColor: "#E5E7EB",
                        backgroundColor: "#F9FAFB",
                        padding: "2px"
                      })
                    }}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">{t('auth.phone')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('auth.placeholderPhone')}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    <button 
                      onClick={handleSendOtp}
                      className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl text-xs font-bold hover:bg-gray-200"
                    >
                      {t('auth.sendOtp')}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase">OTP</label>
                    <input 
                      type="text" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={handleVerify}
                className="w-full bg-[#1428A0] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                {t('auth.verify')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DebateCreateModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("politics");
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debateTopics = [
    { value: "politics", label: "정치" },
    { value: "economy", label: "경제" },
    { value: "society", label: "사회" },
    { value: "culture", label: "문화" },
    { value: "education", label: "교육" },
    { value: "immigration", label: "이민" },
    { value: "business", label: "비즈니스" },
    { value: "other", label: "기타" }
  ];

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/debate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, topic, max_participants: maxParticipants })
      });
      if (res.ok) {
        onClose();
        alert("토론방이 개설되었습니다.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-[#FF6A00] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PlusCircle size={20} />
                <h3 className="font-bold">🗳 토론방 개설</h3>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">주제 선택</label>
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  {debateTopics.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">토론 제목</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="토론의 주제가 될 제목을 입력하세요"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">최대 인원 (10~1000명)</label>
                <input 
                  type="number"
                  min={10}
                  max={1000}
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#FF6A00] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "개설 중..." : "개설하기"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DirectReportModal = ({ isOpen, onClose, countries }: { 
  isOpen: boolean; 
  onClose: () => void;
  countries: Country[];
}) => {
  const { t } = useTranslation();
  const [countryCode, setCountryCode] = useState('US');
  const [missionName, setMissionName] = useState('');
  const [complaintType, setComplaintType] = useState('delay_service');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryOptions = countries.map(c => ({
    value: c.code,
    label: t(`countries.${c.code}`) || c.name_ko
  }));

  const handleSubmit = async () => {
    if (!missionName || !description) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/diplomatic-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: countryCode,
          mission_name: missionName,
          complaint_type: complaintType,
          description,
          is_anonymous: isAnonymous
        })
      });
      if (res.ok) {
        alert(t('report.success'));
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-red-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <h3 className="font-bold">{t('report.mofaTitle')}</h3>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-2">
                <p className="text-xs text-red-800 leading-relaxed font-medium">
                  {t('report.mofaDesc')}
                </p>
                <p className="text-[10px] text-red-600 mt-1 font-bold">
                  * 본 신고는 외교부 본부로 직접 전달되는 패스트트랙 시스템입니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t('auth.residence')}</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(o => o.value === countryCode)}
                    onChange={(opt) => opt && setCountryCode(opt.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t('report.complaintType')}</label>
                  <select 
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    {Object.keys(t('report.types', { returnObjects: true })).map(key => (
                      <option key={key} value={key}>{t(`report.types.${key}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t('report.missionName')}</label>
                <input
                  type="text"
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  placeholder="예: 주미국 대한민국 대사관"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t('report.description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="불만 사항을 상세히 입력해주세요..."
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="anonymous-report" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-red-600"
                />
                <label htmlFor="anonymous-report" className="text-sm text-gray-600 font-medium">
                  {t('report.anonymous')}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100">
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "제출 중..." : t('report.submit')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ComplaintModal = ({ isOpen, onClose, categories, selectedCategory, onPostCreated, countries }: { 
  isOpen: boolean; 
  onClose: () => void; 
  categories: Category[];
  selectedCategory: string;
  onPostCreated: () => void;
  countries: Country[];
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [nationality, setNationality] = useState('korean');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cat = categories.find(c => c.code === selectedCategory);
    if (cat) setCategoryId(cat.id);
  }, [selectedCategory, categories]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSubmit = async () => {
    if (!title || !content || !categoryId) return;
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category_id', categoryId);
    formData.append('country_code', countryCode);
    formData.append('nationality', nationality);
    formData.append('price', price);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        onPostCreated();
        onClose();
        setTitle('');
        setContent('');
        setPrice('');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryOptions = countries.map(c => ({
    value: c.code,
    label: t(`countries.${c.code}`) || c.name_ko
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#1428A0] p-6 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg">게시물 등록</h3>
              <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">카테고리</label>
                  <select 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label_ko}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">국가</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(o => o.value === countryCode)}
                    onChange={(opt) => opt && setCountryCode(opt.value)}
                    placeholder={t('auth.selectCountry')}
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        borderColor: "#E5E7EB",
                        backgroundColor: "#F9FAFB",
                        padding: "2px"
                      })
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">신분 (국적/세대)</label>
                <select 
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="korean">{t('auth.nat_korean')}</option>
                  <option value="mixed2">{t('auth.nat_mixed2')}</option>
                  <option value="mixed3">{t('auth.nat_mixed3')}</option>
                  <option value="overseas">{t('auth.nat_overseas')}</option>
                  <option value="foreign">{t('auth.nat_foreign')}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              {(selectedCategory === 'realestate' || selectedCategory === 'business') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">금액/가격</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="금액 정보를 입력하세요"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="상세 내용을 입력해주세요..."
                  className="w-full h-32 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <Camera size={24} className="text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500">사진 첨부</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <Video size={24} className="text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500">영상 첨부</span>
                </button>
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border border-dashed transition-all",
                    isRecording ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                  )}
                >
                  <Mic size={24} className={isRecording ? "text-red-500 animate-pulse" : "text-gray-400"} />
                  <span className={cn("text-[10px] font-bold", isRecording ? "text-red-500" : "text-gray-500")}>
                    {isRecording ? `${30 - recordingTime}s 남음` : "음성 녹음"}
                  </span>
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 shrink-0">
                <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors">
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#1428A0] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "등록 중..." : "게시물 등록"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMofaOpen, setIsMofaOpen] = useState(false);
  const [isDebateCreateOpen, setIsDebateCreateOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('public');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      callback();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setApiError(null);
    
    Promise.all([
      fetch('/api/categories').then(res => {
        if (!res.ok) throw new Error('Categories API failed');
        return res.json();
      }),
      fetch('/api/countries').then(res => {
        if (!res.ok) throw new Error('Countries API failed');
        return res.json();
      })
    ])
    .then(([categoriesData, countriesData]) => {
      setCategories(categoriesData || []);
      setCountries(countriesData || []);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('API Error:', error);
      setApiError(error.message);
      setIsLoading(false);
      // Set default data as fallback
      setCategories([
        { id: 'cat-001', code: 'public', label_ko: '공론·민원' },
        { id: 'cat-002', code: 'job', label_ko: '구인·구직' },
        { id: 'cat-003', code: 'realestate', label_ko: '부동산' },
        { id: 'cat-004', code: 'promotion', label_ko: '홍보' },
        { id: 'cat-005', code: 'business', label_ko: '비즈니스' }
      ]);
      setCountries([
        { code: 'GH', name_ko: '가나', continent: 'Africa' },
        { code: 'US', name_ko: '미국', continent: 'North America' },
        { code: 'KR', name_ko: '한국', continent: 'Asia' }
      ]);
    });
  }, []);

  const fetchPosts = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category_code', selectedCategory);
    if (selectedCountry) params.append('country_code', selectedCountry);
    
    fetch(`/api/posts?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          // Fallback sample data if API is empty
          const samples: Record<string, Post[]> = {
            public: Array(5).fill(null).map((_, i) => ({
              id: `p${i}`, category_id: '1', title: `[공론] 재외동포 권익 향상을 위한 제언 ${i+1}`, 
              content: '내용입니다...', country_code: 'US', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '미국', category_code: 'public', media: []
            })),
            job: Array(5).fill(null).map((_, i) => ({
              id: `j${i}`, category_id: '2', title: `[구인] IT 개발자 채용 공고 ${i+1}`, 
              content: '내용입니다...', country_code: 'VN', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '베트남', category_code: 'job', media: []
            })),
            realestate: Array(5).fill(null).map((_, i) => ({
              id: `r${i}`, category_id: '3', title: `[부동산] 시내 중심가 아파트 임대 ${i+1}`, 
              content: '내용입니다...', country_code: 'DE', nationality: 'korean', price: '1500 EUR', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '독일', category_code: 'realestate', media: []
            })),
            promotion: Array(5).fill(null).map((_, i) => ({
              id: `pr${i}`, category_id: '4', title: `[홍보] 한인 커뮤니티 행사 안내 ${i+1}`, 
              content: '내용입니다...', country_code: 'JP', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '일본', category_code: 'promotion', media: []
            })),
            business: Array(5).fill(null).map((_, i) => ({
              id: `b${i}`, category_id: '5', title: `[비즈니스] 현지 시장 진출 파트너 모집 ${i+1}`, 
              content: '내용입니다...', country_code: 'CA', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '캐나다', category_code: 'business', media: []
            }))
          };
          setPosts(samples[selectedCategory] || []);
        }
      })
      .catch(err => {
        console.error(err);
        // Fallback on error too
        const samples: Record<string, Post[]> = {
          public: Array(5).fill(null).map((_, i) => ({
            id: `p${i}`, category_id: '1', title: `[공론] 재외동포 권익 향상을 위한 제언 ${i+1}`, 
            content: '내용입니다...', country_code: 'US', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '미국', category_code: 'public', media: []
          })),
          job: Array(5).fill(null).map((_, i) => ({
            id: `j${i}`, category_id: '2', title: `[구인] IT 개발자 채용 공고 ${i+1}`, 
            content: '내용입니다...', country_code: 'VN', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '베트남', category_code: 'job', media: []
          })),
          realestate: Array(5).fill(null).map((_, i) => ({
            id: `r${i}`, category_id: '3', title: `[부동산] 시내 중심가 아파트 임대 ${i+1}`, 
            content: '내용입니다...', country_code: 'DE', nationality: 'korean', price: '1500 EUR', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '독일', category_code: 'realestate', media: []
          })),
          promotion: Array(5).fill(null).map((_, i) => ({
            id: `pr${i}`, category_id: '4', title: `[홍보] 한인 커뮤니티 행사 안내 ${i+1}`, 
            content: '내용입니다...', country_code: 'JP', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '일본', category_code: 'promotion', media: []
          })),
          business: Array(5).fill(null).map((_, i) => ({
            id: `b${i}`, category_id: '5', title: `[비즈니스] 현지 시장 진출 파트너 모집 ${i+1}`, 
            content: '내용입니다...', country_code: 'CA', nationality: 'korean', price: '', meta: '', status: 'active', created_at: new Date().toISOString(), country_name: '캐나다', category_code: 'business', media: []
          }))
        };
        setPosts(samples[selectedCategory] || []);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedCountry]);

  const chartData = [
    { name: 'Mon', count: 40 },
    { name: 'Tue', count: 30 },
    { name: 'Wed', count: 60 },
    { name: 'Thu', count: 45 },
    { name: 'Fri', count: 70 },
    { name: 'Sat', count: 20 },
    { name: 'Sun', count: 15 },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1428A0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900 flex flex-col">
      {/* Top Banner */}
      <div className="bg-red-600 text-white py-2 px-6 text-center text-xs font-bold flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck size={14} />
          {t('report.mofaTitle')}
        </span>
        <button 
          onClick={() => requireAuth(() => setIsMofaOpen(true))}
          className="bg-white text-red-600 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
        >
          {t('report.submit')}
        </button>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1428A0] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10">
            <Globe size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[#1428A0]">GKV Platform</h1>
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-100">
                {t('auth.noLoginTitle')}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Global Korean Voice</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.code)}
              className={cn(
                "text-sm font-semibold transition-colors whitespace-nowrap",
                selectedCategory === cat.code ? "text-[#1428A0] border-b-2 border-[#1428A0] pb-1" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {cat.label_ko}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
              isAuthenticated ? "bg-blue-50 text-[#1428A0] border border-blue-100" : "bg-gray-50 text-gray-400 border border-gray-100"
            )}>
              {isAuthenticated ? "JD" : "?"}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-gray-800 leading-none">
                {isAuthenticated ? "Verified User" : "Guest"}
              </p>
              {!isAuthenticated && (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="text-[9px] text-blue-600 font-bold hover:underline"
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint & Discussion */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-[#1428A0] to-[#1F3CCF] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-4 border border-white/20">
                <ShieldCheck size={12} />
                {t('auth.noLoginTitle')}
              </div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">전 세계 700만 한인을 위한<br />디지털 신문고</h2>
              <p className="text-blue-100/80 text-sm mb-6 leading-relaxed">
                국적과 현지 전화번호 인증만으로 사진, 영상, 음성을 포함한 민원을 접수하고 실시간 정책 토론에 참여하세요.
              </p>
              <div className="flex gap-3">
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => requireAuth(() => setIsComplaintOpen(true))}
                    className="bg-white text-[#1428A0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    민원 접수하기
                  </button>
                  <p className="text-[10px] text-blue-100/60 font-medium px-1">
                    * 게시물 작성 시에만 간단한 휴대폰 인증이 필요합니다.
                  </p>
                </div>
                <button 
                  onClick={() => requireAuth(() => {})}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
                >
                  토론 참여하기
                </button>
              </div>
            </div>
            
            {/* 🔥 스샷 위치에 추가되는 버튼 */}
            <div className="absolute right-10 bottom-10 hidden md:block">
              <button
                onClick={() => requireAuth(() => setIsDebateCreateOpen(true))}
                className="bg-[#FF6A00] hover:bg-[#ff7f26] transition px-8 py-4 rounded-2xl shadow-xl text-lg font-semibold text-white flex items-center gap-2"
              >
                <PlusCircle size={24} />
                🗳 토론방 생성
              </button>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Camera />, label: "사진 민원", color: "bg-emerald-50 text-emerald-600" },
              { icon: <Video />, label: "영상 민원", color: "bg-purple-50 text-purple-600" },
              { icon: <Mic />, label: "음성 민원", color: "bg-orange-50 text-orange-600" },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => requireAuth(() => setIsComplaintOpen(true))}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Recent Discussions / Posts */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-[#1428A0]" />
                {categories.find(c => c.code === selectedCategory)?.label_ko || "최신 게시물"}
              </h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-gray-400 hover:text-gray-900">최신순</button>
                <button className="text-xs font-bold text-gray-400 hover:text-gray-900">인기순</button>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {posts.length > 0 ? posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-50 text-[#1428A0] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {post.country_name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {t(`auth.nat_${post.nationality}`)}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 group-hover:text-[#1428A0] transition-colors mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                    {post.content}
                  </p>
                  {post.price && (
                    <p className="text-sm font-bold text-[#1428A0] mb-3">
                      금액: {post.price}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle size={14} />
                      <span className="text-[10px] font-bold">12</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Plus size={14} />
                      <span className="text-[10px] font-bold">45</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm">게시물이 없습니다. 첫 번째 게시물을 작성해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & AI */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#1428A0]" />
                민원 현황 통계
              </h3>
              <select className="text-xs font-bold text-gray-400 bg-transparent outline-none">
                <option>이번 주</option>
                <option>이번 달</option>
              </select>
            </div>
            <div className="h-48 w-full min-h-[192px]">
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#F8F9FC' }}
                  />
                  <Bar dataKey="count" fill="#1428A0" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">총 접수</p>
                <p className="text-xl font-bold text-gray-900">1,284</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-[#1428A0] uppercase mb-1">처리 완료</p>
                <p className="text-xl font-bold text-[#1428A0]">942</p>
              </div>
            </div>
          </div>

          {/* AI Report Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-emerald-500" />
              AI 정책 요약 리포트
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  "최근 24시간 동안 <strong>비자 발급</strong> 관련 민원이 15% 증가했습니다. 주요 키워드는 '서류 간소화', '처리 기간'입니다."
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 px-1">
                  <span>긍정 여론</span>
                  <span>72%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[72%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FileText size={18} className="text-[#1428A0]" />
              나의 민원 추적
            </h3>
            <div className="space-y-4">
              {[
                { title: "여권 갱신 관련 문의", status: "검토 중", date: "2024.03.01" },
                { title: "현지 영사 서비스 개선 건의", status: "처리 완료", date: "2024.02.25" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.date}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-md",
                    item.status === "처리 완료" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
        <button 
          onClick={() => requireAuth(() => setIsChatOpen(!isChatOpen))}
          className="w-14 h-14 bg-[#1428A0] text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group relative"
        >
          <MessageCircle size={24} />
          <span className="absolute left-16 bg-white text-[#1428A0] px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100">
            실시간 채팅
          </span>
        </button>
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button 
          onClick={() => requireAuth(() => setIsMofaOpen(true))}
          className="w-14 h-14 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group relative"
        >
          <ShieldCheck size={24} />
          <span className="absolute right-16 bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100">
            {t('report.mofaTitle')}
          </span>
        </button>
        <button 
          onClick={() => setIsFaqOpen(!isFaqOpen)}
          className="w-14 h-14 bg-[#FF6A00] text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group relative"
        >
          <HelpCircle size={24} />
          <span className="absolute right-16 bg-white text-[#FF6A00] px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100">
            AI 가이드
          </span>
        </button>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthenticated={() => setIsAuthenticated(true)}
        countries={countries}
      />
      <DirectReportModal 
        isOpen={isMofaOpen} 
        onClose={() => setIsMofaOpen(false)} 
        countries={countries}
      />
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        isAuthenticated={isAuthenticated}
        setIsAuthOpen={setIsAuthOpen}
      />
      <DebateCreateModal 
        isOpen={isDebateCreateOpen} 
        onClose={() => setIsDebateCreateOpen(false)} 
      />
      <FAQBot isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
      <ComplaintModal 
        isOpen={isComplaintOpen} 
        onClose={() => setIsComplaintOpen(false)} 
        categories={categories}
        selectedCategory={selectedCategory}
        onPostCreated={fetchPosts}
        countries={countries}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 p-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <Globe size={20} />
            <span className="text-sm font-bold tracking-tighter">GLOBAL KOREAN VOICE</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            © 2024 GKV Platform. All rights reserved. Built for the 7 million overseas Koreans.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map(item => (
              <a key={item} href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
