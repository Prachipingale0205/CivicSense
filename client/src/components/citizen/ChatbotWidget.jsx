import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
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
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await api.post('/api/complaints/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply || 'No response received.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-2xl shadow-float flex items-center justify-center hover:bg-primary-700 hover:scale-105 hover:shadow-lg transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                aria-label="Open chat"
            >
                <MessageSquare className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[520px] bg-white rounded-2xl shadow-float flex flex-col z-50 border border-gray-200/60 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="h-[64px] bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-between px-5 flex-shrink-0">
                            <div className="flex items-center gap-3 text-white">
                                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                    <Sparkles className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-semibold leading-tight">AI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                        <p className="text-[11px] text-blue-100 font-medium">Online</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: 0.05 }}
                                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {msg.role === 'bot' ? (
                                        <div className="w-7 h-7 rounded-lg bg-primary-100 flex-shrink-0 flex items-center justify-center">
                                            <Bot className="w-3.5 h-3.5 text-primary-600" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                            <User className="w-3.5 h-3.5 text-gray-500" />
                                        </div>
                                    )}
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[78%] text-[13.5px] leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white chat-bubble-user shadow-sm'
                                        : 'bg-white border border-gray-200/80 text-gray-700 chat-bubble-bot shadow-soft-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-primary-100 flex-shrink-0 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 text-primary-600" />
                                    </div>
                                    <div className="px-5 py-3.5 rounded-2xl bg-white border border-gray-200/80 chat-bubble-bot flex items-center justify-center shadow-soft-sm">
                                        <div className="flex gap-1.5 pt-0.5">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-600/10 rounded-xl pl-4 pr-12 py-3 text-[13.5px] text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all duration-200 hover:border-gray-300"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-1.5 w-9 h-9 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent"
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
