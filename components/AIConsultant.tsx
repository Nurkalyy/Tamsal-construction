
import React, { useState, useRef, useEffect } from 'react';
import { consultGemini } from '../services/geminiService';
import { Message, Language } from '../types';
import { translations } from '../translations';

interface AIConsultantProps {
  language: Language;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ language }) => {
  const t = translations[language].ai;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Re-initialize welcome message on language change if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: t.welcome }]);
    }
  }, [language, t.welcome, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const result = await consultGemini(userMsg, history, language);
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: result.text, 
      isGrounding: result.grounding.length > 0,
      groundingData: result.grounding 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <i className="fas fa-robot text-2xl group-hover:rotate-12 transition-transform"></i>
          <span className="absolute -top-2 -right-2 bg-red-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <i className="fas fa-hard-hat"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">{t.header}</h3>
                <p className="text-[10px] text-slate-400">{t.status}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                  {/* Displaying grounding links (Search and Maps) if available */}
                  {msg.groundingData && msg.groundingData.length > 0 && (
                    <div className="mt-2 text-[10px] text-slate-500 border-t pt-2 border-slate-100">
                      <div className="flex items-center gap-1 mb-2">
                        <i className="fas fa-check-circle text-green-500"></i> {t.fact_check}
                      </div>
                      <div className="flex flex-col gap-1">
                        {msg.groundingData.map((chunk, idx) => {
                          const link = chunk.web || chunk.maps;
                          if (link && link.uri) {
                            return (
                              <a 
                                key={idx} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-orange-600 hover:underline flex items-center gap-1 truncate"
                              >
                                <i className={`fas fa-${chunk.web ? 'globe' : 'map-marker-alt'} w-3`}></i>
                                {link.title || (chunk.web ? 'Source' : 'Location info')}
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.input_ph}
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-orange-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConsultant;
