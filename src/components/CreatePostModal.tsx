"use client";
import React, { useState } from 'react';
import { X, Image, Calendar, MoreHorizontal, Globe } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: string) => void;
  user: {
    name: string;
    avatar: string;
    headline: string;
  };
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost, user }: CreatePostModalProps) => {
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content);
      setContent("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1b1f23] w-full max-w-xl rounded-3xl shadow-2xl border border-zinc-700 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
            <div className="flex items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{user.name}</h3>
                    <button className="text-xs text-zinc-400 border border-zinc-600 rounded-full px-2 py-0.5 mt-0.5 hover:bg-zinc-700 transition-colors flex items-center gap-1 font-medium">
                        <Globe size={12} /> Anyone <MoreHorizontal size={12} />
                    </button>
                </div>
            </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Text Area */}
        <div className="px-6 py-4">
          <textarea
            className="w-full bg-transparent text-lg text-white placeholder-zinc-500 resize-none focus:outline-none min-h-[200px]"
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-700/50">
            <div className="flex gap-2 text-zinc-400">
                <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-200"><Image size={20} /></button>
                <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-200"><Calendar size={20} /></button>
                <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-200"><MoreHorizontal size={20} /></button>
            </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-1.5 px-6 rounded-full transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;