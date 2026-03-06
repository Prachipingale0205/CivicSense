import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I'm Civic Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        const updatedMessages = [...messages, { role: 'user', text: userMsg }];
        setMessages(updatedMessages);
        setInput('');
        setIsTyping(true);

        // Build history from all messages except the initial bot greeting and the new user message
        const history = updatedMessages
            .slice(1)
            .slice(0, -1)
            .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

        try {
            const res = await api.post('/api/complaints/chat', { message: userMsg, history });
            const reply = res.data.data?.reply || res.data.reply || res.data.data?.message || 'No response received.';
            setMessages(prev => [...prev, { role: 'bot', text: reply }]);
        } catch (err) {
            const status = err.response?.status;
            const errText = status === 429
                ? 'Too many messages. Please wait a moment before trying again.'
                : 'Sorry, I encountered an error. Please try again.';
            setMessages(prev => [...prev, { role: 'bot', text: errText }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-[#2563EB] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1D4ED8] hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <MessageSquare className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-48px)] h-[500px] bg-white rounded-2xl shadow-xl flex flex-col z-50 border border-[#E5E7EB] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="h-[60px] bg-[#2563EB] flex items-center justify-between px-5 flex-shrink-0">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-semibold">Civic Assistant</h3>
                                    <p className="text-[11px] text-blue-100 font-medium tracking-wide">AI SUPPORT ⚡</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 bg-[#F9FAFB] space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {msg.role === 'bot' ? (
                                        <div className="w-7 h-7 rounded-full bg-[#DBEAFE] flex-shrink-0 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-[#2563EB]" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex-shrink-0 flex items-center justify-center">
                                            <User className="w-4 h-4 text-[#4B5563]" />
                                        </div>
                                    )}
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-[14px] leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-[#2563EB] text-white rounded-tr-sm'
                                        : 'bg-white border border-[#E5E7EB] text-[#374151] rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-full bg-[#DBEAFE] flex-shrink-0 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-[#2563EB]" />
                                    </div>
                                    <div className="px-5 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] rounded-tl-sm flex items-center justify-center shadow-sm">
                                        <div className="flex gap-1.5 pt-1">
                                            <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-[#E5E7EB]">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] rounded-full pl-5 pr-12 py-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 w-9 h-9 flex items-center justify-center text-[#2563EB] hover:bg-[#DBEAFE] rounded-full transition-colors disabled:opacity-40"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
