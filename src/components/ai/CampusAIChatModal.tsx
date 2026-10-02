import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../services/store';
import { X, Send, Bot, User, Sparkles, Trash2, ArrowRight } from 'lucide-react';

export function CampusAIChatModal() {
  const { isAIChatOpen, toggleAIChat, aiMessages, sendAIMessage, clearAIChat, isAILoading } =
    useAppStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIChatOpen) {
      scrollToBottom();
    }
  }, [aiMessages, isAIChatOpen]);

  if (!isAIChatOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAILoading) return;
    const text = inputPrompt.trim();
    setInputPrompt('');
    await sendAIMessage(text);
  };

  const quickQuestions = [
    'What are the hostel curfew rules?',
    'How do I get academic duty leave?',
    'What are the dining mess timings?',
    'What is the minimum attendance required?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[88vh] max-h-[700px] bg-[#0c0c0c] border border-white/10 rounded-3xl flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-[#121212] to-purple-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">Campus AI Assistant</h3>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400">BPUT Institutional Operations & Regulations</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearAIChat}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-colors"
              title="Clear Conversation"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={toggleAIChat}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`h-7 w-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#1e1e1e] border border-white/10 text-indigo-300'
                }`}
              >
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-xs shadow-sm'
                    : 'bg-[#151515] text-slate-200 border border-white/5 rounded-2xl rounded-tl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line text-sm">{msg.content}</p>
                <span
                  className={`block text-[10px] font-mono text-right mt-1.5 ${
                    msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isAILoading && (
            <div className="flex items-center gap-2.5 text-xs text-indigo-400 bg-[#141414] border border-white/5 rounded-2xl p-3.5 max-w-[70%]">
              <Sparkles size={16} className="animate-spin text-indigo-400" />
              <span>Analyzing institutional regulations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="px-4 py-2 bg-[#0e0e0e] border-t border-white/5 overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendAIMessage(q)}
              className="text-xs whitespace-nowrap bg-[#161616] hover:bg-[#202020] text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-[#101010] border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about gate passes, leaves, or mess..."
            className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isAILoading}
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95 shadow-sm shadow-indigo-500/20"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
