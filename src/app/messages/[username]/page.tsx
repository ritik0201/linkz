"use client";

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, MoreVertical, Phone, Video, Image, Mic, Send, Plus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  avatar?: string;
  profileImage?: string;
  online?: boolean;
}

export default function ChatPage({ params }: { params: Promise<{ username: string }> }) {
  // Unwrap params using React.use() for Next.js 15
  const { username } = use(params);
  
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?._id || (session?.user as any)?.id;
  
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Use the username from params to fetch user details
  const paramId = username;

  useEffect(() => {
    const fetchUser = async () => {
      if (!paramId) return;
      setLoading(true);
      try {
        // Fetch user details (API handles both ID and username lookup)
        const userRes = await fetch(`/api/users/${paramId}`);
        if (userRes.ok) {
            setOtherUser(await userRes.json());
        } else {
            console.error("User not found");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [paramId]);

  useEffect(() => {
    const fetchMessages = async () => {
      // Only fetch messages if we have the other user's _id (resolved from username)
      if (!otherUser?._id || !currentUserId) return;
      
      try {
        const messagesRes = await fetch(`/api/message?userId=${currentUserId}&otherUserId=${otherUser._id}`);
        if (messagesRes.ok) setChatMessages(await messagesRes.json());
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, [otherUser, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentUserId || !otherUser?._id) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      _id: tempId,
      sender: currentUserId,
      receiver: otherUser._id,
      message: messageInput,
      createdAt: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, newMessage]);
    const currentMessage = messageInput;
    setMessageInput("");

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentUserId, receiverId: otherUser._id, message: currentMessage }),
      });

      if (res.ok) {
        const savedMessage = await res.json();
        setChatMessages(prev => prev.map(msg => msg._id === tempId ? savedMessage : msg));
      } else {
        setChatMessages(prev => prev.filter(msg => msg._id !== tempId));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-zinc-500">Loading chat...</div>;
  }

  if (!otherUser) {
    return <div className="flex items-center justify-center h-full text-zinc-500">User not found</div>;
  }

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="relative">
            <img src={otherUser.profileImage || otherUser.avatar || `https://i.pravatar.cc/150?u=${otherUser._id}`} alt={otherUser.username} className="w-10 h-10 rounded-full object-cover" />
            {otherUser.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>}
          </div>
          <div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-sm md:text-base">{otherUser.username}</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">{otherUser.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"><Phone size={20} /></button>
          <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"><Video size={20} /></button>
          <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-black/20">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Start a new conversation</h3>
            <p className="text-sm max-w-xs mx-auto mt-1">
              Say hello to start chatting with {otherUser.username}.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.sender === currentUserId;
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-bl-none'}`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-zinc-400'}`}>{format(new Date(msg.createdAt), 'p')}</p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block"><Plus size={20} /></button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full py-3 pl-4 pr-12 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><Image size={18} /></button>
          </div>
          {messageInput.trim() ? (
            <button onClick={handleSendMessage} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors shadow-lg shadow-indigo-500/30">
              <Send size={18} />
            </button>
          ) : (
            <button className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-full transition-colors">
              <Mic size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
