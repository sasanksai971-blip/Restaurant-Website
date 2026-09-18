import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, PhoneCall, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '👋 Hello! I am your PizzaRush AI Support Assistant. How can I assist you with your order, pizza menu, coupons or delivery today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Track my current order',
        'Check latest coupon codes',
        'Pizza delivery time policy',
        'Veg & Jain pizza options',
        'Refund & cancellation help'
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await api.post('/support/chat', {
        message: query,
        history: messages.map((m) => ({ sender: m.sender, text: m.text })),
      });

      if (res.data.success && res.data.data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: res.data.data.reply || 'Thanks for reaching out! Is there anything else I can help with?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: res.data.data.suggestions || ['Track Order', 'Menu', 'Connect to Care'],
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Our AI agent is currently busy, but our customer care team is available 24/7 at 1800-PIZZA-NOW.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Connect to Customer Care'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 h-[85vh] sm:h-[650px] flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E53935] to-[#FF6B6B] flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base">PizzaRush AI Care</h3>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-gray-300">Instant answers 24/7</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[#E53935] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <span
                      className={`text-[9px] mt-1.5 block ${
                        m.sender === 'user' ? 'text-red-200 text-right' : 'text-gray-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s)}
                          className="px-2.5 py-1 bg-white hover:bg-red-50 hover:border-red-200 text-[#E53935] border border-gray-200 rounded-full text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl w-fit border border-gray-100 shadow-2xs">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Connect to Human Care Button (Spec Requirement) */}
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-center justify-between text-xs">
              <span className="text-amber-800 font-medium">Need immediate human help?</span>
              <a
                href="tel:18007499266"
                className="font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 bg-amber-200/80 px-2.5 py-1 rounded-lg"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Connect to Customer Care</span>
              </a>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about pizzas, orders, coupons..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:bg-white border border-transparent focus:border-red-300"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-[#E53935] hover:bg-red-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
