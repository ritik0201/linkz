"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "ai";
    content: string;
}

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hi! I'm CollaBharat AI. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map((m) => ({
                        role: m.role === "user" ? "user" : "model",
                        content: m.content,
                    })),
                }),
            });

            const data = await response.json();
            if (data.text) {
                setMessages((prev) => [...prev, { role: "ai", content: data.text }]);
            } else {
                setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { role: "ai", content: "Failed to connect to AI. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Transparent Backdrop for click-away */}
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={onClose}
                    />

                    {/* Chat Popover */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-3 w-[320px] sm:w-[380px] h-[500px] bg-[#0d0d0d] border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[70] flex flex-col overflow-hidden ring-1 ring-white/10"
                    >
                        {/* Arrow */}
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-[#0d0d0d] border-l border-t border-zinc-800 rotate-45 transform" />

                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                                    <Sparkles className="text-indigo-400 w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-bold tracking-tight">AI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest">Online</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-linear-to-b from-zinc-950/20 to-black/40">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-zinc-900/80 text-zinc-200 rounded-tl-none border border-zinc-800 backdrop-blur-sm"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5 opacity-60">
                                            {msg.role === "ai" ? <Bot size={12} className="text-indigo-400" /> : <User size={12} />}
                                            <span className="text-[9px] font-black uppercase tracking-tighter">
                                                {msg.role === "ai" ? "CollaBharat AI" : "You"}
                                            </span>
                                        </div>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-900/50 p-3 rounded-2xl rounded-tl-none border border-zinc-800 flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Thinking</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="How can I help with CollaBharat?"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-600"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white rounded-lg transition-all shadow-lg active:scale-95"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 mt-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                <Sparkles size={10} className="text-zinc-500" />
                                <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest text-center">
                                    CollaBharat AI Assistant
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Chatbot;
