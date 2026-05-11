import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAssistant } from '../services/gemini';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function ChatAssistant() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "Hello! I'm your AI Interior Designer. How can I help you transform your space today? You can ask me about furniture styles, color palettes, or space-saving tips." 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAssistant([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting to my design database. Please try again soon!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-2">
            AI Assistant <Sparkles className="w-6 h-6 text-brand-accent" />
          </h1>
          <p className="text-stone-500">Real-time design advice and inspiration.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl shadow-stone-200 border border-stone-100 flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                msg.role === 'bot' ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-dark text-white"
              )}>
                {msg.role === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-4 rounded-[1.5rem]",
                msg.role === 'bot' 
                  ? "bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100" 
                  : "bg-brand-dark text-white rounded-tr-none shadow-lg shadow-stone-100"
              )}>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4 max-w-[85%] animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="bg-stone-50 p-4 rounded-[1.5rem] rounded-tl-none border border-stone-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <form onSubmit={handleSend} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about design..."
              className="w-full bg-white border border-stone-200 rounded-[2rem] py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={cn(
                "absolute right-2 top-2 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                input.trim() ? "bg-brand-accent text-white hover:bg-orange-600 scale-110" : "bg-stone-100 text-stone-300"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-stone-400 text-center mt-2 uppercase tracking-widest font-bold">Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  );
}
