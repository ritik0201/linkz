"use client";

import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Image, Mic, Send, Plus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for UI demonstration
const conversations = [
  { id: 1, name: "Sarah Wilson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", lastMessage: "Hey, how's the project going?", time: "2m", unread: 2, online: true },
  { id: 2, name: "Tech Startup Inc.", avatar: "https://images.unsplash.com/photo-1572044162444-ad6021194360?w=150", lastMessage: "We'd love to schedule a call.", time: "1h", unread: 0, online: false },
  { id: 3, name: "David Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", lastMessage: "Thanks for the update!", time: "3h", unread: 0, online: true },
  { id: 4, name: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", lastMessage: "Can you send the files?", time: "1d", unread: 0, online: false },
  { id: 5, name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", lastMessage: "Let's meet at 5.", time: "2d", unread: 0, online: true },
];

const initialMessages = [
  { id: 1, senderId: 2, text: "Hi there! I saw your profile and I'm interested in your work.", time: "10:00 AM" },
  { id: 2, senderId: 1, text: "Hello! Thanks for reaching out. What specifically caught your eye?", time: "10:05 AM" },
  { id: 3, senderId: 2, text: "Your recent project on AI integration looks fascinating. We are looking for something similar.", time: "10:07 AM" },
  { id: 4, senderId: 1, text: "That sounds great! I'd be happy to discuss it further.", time: "10:10 AM" },
  { id: 5, senderId: 2, text: "Perfect. Are you available for a quick call tomorrow?", time: "10:12 AM" },
];

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState(initialMessages);

  const activeChat = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      senderId: 1, // Assuming '1' is the current user
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-20 pb-4 md:pb-10">
      <div className="container mx-auto px-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          
          {/* Sidebar - Chat List */}
          <div className={`md:col-span-4 lg:col-span-3 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${selectedChat ? 'hidden md:flex' : 'flex'} h-full`}>
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Messages</h1>
                <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {conversations.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 ${selectedChat === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-l-4 border-l-transparent'}`}
                >
                  <div className="relative shrink-0">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-semibold truncate ${selectedChat === chat.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-900 dark:text-white'}`}>{chat.name}</h3>
                      <span className="text-xs text-zinc-500">{chat.time}</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`md:col-span-8 lg:col-span-9 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${!selectedChat ? 'hidden md:flex' : 'flex'} h-full`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                      <img src={activeChat?.avatar} alt={activeChat?.name} className="w-10 h-10 rounded-full object-cover" />
                      {activeChat?.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>}
                    </div>
                    <div>
                      <h2 className="font-bold text-zinc-900 dark:text-white text-sm md:text-base">{activeChat?.name}</h2>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        {activeChat?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors">
                      <Video size={20} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-black/20">
                  {chatMessages.map((msg) => {
                    const isMe = msg.senderId === 1; // Assuming user ID 1 is 'me'
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-bl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-zinc-400'}`}>{msg.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block">
                      <Plus size={20} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full py-3 pl-4 pr-12 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <Image size={18} />
                      </button>
                    </div>
                    {messageInput.trim() ? (
                      <button 
                        onClick={handleSendMessage}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors shadow-lg shadow-indigo-500/30"
                      >
                        <Send size={18} />
                      </button>
                    ) : (
                      <button className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-full transition-colors">
                        <Mic size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
                  <Send size={32} />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Your Messages</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                  Select a conversation from the sidebar to start chatting or start a new conversation.
                </p>
                <button className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-indigo-500/20">
                  Start New Chat
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}