import saveToFirebase from "../saveToFirebase";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Search, 
  AlertCircle, 
  TrendingUp, 
  Zap,
  Trash2,
  MoreVertical,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getTickets } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là Trợ lý AI của Ban KSNB PVEP. Tôi đã sẵn sàng hỗ trợ bạn tra cứu dữ liệu phiếu ý kiến. Bạn có thể hỏi tôi về trạng thái một phiếu cụ thể, hoặc nhờ tôi tổng hợp lỗi theo từng lĩnh vực dưới dạng bảng biểu.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const tickets = getTickets();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    
    try {
      const ticketsContext = JSON.stringify(
        tickets.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          field: t.field,
          unit: t.unit,
          assignee: t.assignee,
          dueDate: t.dueDate,
          reviewProgress: t.reviewProgress
        }))
      );

      const prompt = `
Bạn là Trợ lý AI chuyên sâu về Kiểm soát Nội bộ (KSNB) tại PVEP.
Dữ liệu hệ thống hiện tại: ${ticketsContext}

Yêu cầu người dùng: "${text}"

QUY TẮC TRÌNH BÀY (BẮT BUỘC):
1. Sử dụng BẢNG (Markdown table) khi liệt kê từ 2 phiếu trở lên, khi so sánh, hoặc khi trình bày các thông số kỹ thuật.
   Cột bảng nên bao gồm: Mã phiếu, Tiêu đề, Lĩnh vực, Trạng thái, Hạn xử lý.
2. Sử dụng GẠCH ĐẦU DÒNG cho các danh sách nhận xét, phân tích rủi ro hoặc kiến nghị xử lý.
3. Định dạng văn bản: **In đậm** các mã phiếu (VD: **TKT-2025-001**), các trạng thái (VD: **Quá hạn**) và các mốc thời gian.
4. Trả lời trực diện vào vấn đề, không lặp lại lời chào dài dòng nếu đã chào trước đó.
5. Nếu thông tin không có trong dữ liệu cung cấp, hãy nêu rõ "Dữ liệu hiện tại không ghi nhận..." và gợi ý người dùng kiểm tra lại mã phiếu.
6. Trình bày chuyên nghiệp, súc tích, chuẩn văn phong kiểm soát nội bộ.
      `;

      // Hướng 2: gọi API server-side (Vercel/Node) để tránh lộ API key trên trình duyệt
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error(`Chat API failed: ${res.status} ${res.statusText}`);
      }

      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();

      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date()
        }
      ]);

      // Ưu tiên stream để UI hiển thị dần; nếu server trả JSON text thường thì vẫn đọc được.
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        const data = await res.json();
        assistantContent = data?.text ?? '';
        setMessages(prev =>
          prev.map(msg => (msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg))
        );
      } else {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;

          assistantContent += chunk;
          setMessages(prev =>
            prev.map(msg => (msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg))
          );
        }
      }

      await saveTicketToFirebase(prompt, assistantContent);
    } catch} catch (error) {
      console.error('Lỗi Chatbot:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Xin lỗi, hệ thống AI đang gặp sự cố kết nối. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau ít phút.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Bảng tổng hợp phiếu Lĩnh vực Kế toán', icon: <Search size={14} /> },
    { label: 'Danh sách phiếu Quá hạn (dạng bảng)', icon: <AlertCircle size={14} /> },
    { label: 'Phân tích lỗi thường gặp nhất', icon: <TrendingUp size={14} /> },
    { label: 'Tóm tắt phiếu TKT-2025-001', icon: <Zap size={14} /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-100">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm tracking-tight">Trợ lý KSNB Thông minh</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Phản hồi thời gian thực
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMessages([{
                  id: '1',
                  role: 'assistant',
                  content: 'Hệ thống đã sẵn sàng. Bạn muốn tôi tra cứu thông tin gì?',
                  timestamp: new Date()
                }])}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Làm mới cuộc trò chuyện"
              >
                <Trash2 size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out`}>
                <div className={`flex gap-3 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-brand-500 text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm overflow-x-auto ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none prose prose-sm max-w-none prose-table:border prose-table:border-gray-200 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2'
                    }`}>
                      {msg.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                      {!msg.content && isLoading && msg.id === messages[messages.length - 1].id && (
                        <div className="flex gap-1 py-1">
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold px-1 uppercase tracking-tighter">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            {/* Quick Prompts */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {quickPrompts.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(q.label)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-brand-50 hover:text-brand-600 border border-gray-200 hover:border-brand-200 rounded-xl text-xs font-bold text-gray-600 transition-all whitespace-nowrap shadow-sm active:scale-95"
                >
                  {q.icon} {q.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Nhập nội dung tra cứu (VD: 'Lập bảng các phiếu đang rà soát')..."
                className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-brand-500 outline-none transition-all resize-none text-gray-900 font-medium placeholder:text-gray-400"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                  input.trim() && !isLoading ? 'bg-brand-500 text-white shadow-lg shadow-brand-200 hover:scale-105 active:scale-95' : 'text-gray-300 bg-gray-100'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest opacity-60">
              Công nghệ Gemini AI • Tự động hóa rà soát • PVEP Internal
            </p>
          </div>
        </div>

        {/* Right Sidebar - Analytics & Context */}
        <div className="w-80 space-y-4 hidden xl:block">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-brand-500" /> Phân tích thông minh
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-800">Insight rà soát:</p>
                <p className="text-[11px] text-emerald-700 mt-1.5 leading-relaxed font-medium">
                  "Hệ thống phát hiện **3 phiếu** trong lĩnh vực **Vận hành** đang có dấu hiệu chậm phản hồi hơn chu kỳ 2024."
                </p>
                <button className="mt-3 text-[10px] font-black text-emerald-800 flex items-center gap-1 hover:underline uppercase tracking-tight">
                  Xem chi tiết rủi ro <ChevronRight size={10} />
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Trạng thái dữ liệu</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <span className="text-lg font-black text-brand-600">{tickets.length}</span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Tổng Phiếu</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <span className="text-lg font-black text-red-500">
                      {tickets.filter(t => t.status === 'Quá hạn').length}
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Quá hạn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-500 p-6 rounded-2xl shadow-lg shadow-brand-100 text-white space-y-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-sm leading-tight">An toàn & Bảo mật</h4>
            <p className="text-[11px] text-white/80 leading-relaxed font-medium">
              Cuộc trò chuyện này được mã hóa và chỉ phục vụ mục đích hỗ trợ nghiệp vụ nội bộ tại PVEP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
