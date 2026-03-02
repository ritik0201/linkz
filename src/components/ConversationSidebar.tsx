"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

// Define types for conversation and user
interface User {
  _id: string;
  username: string;
  avatar?: string;
  online?: boolean;
}

interface Conversation {
  otherUser: User;
  lastMessage: string;
  time: string;
  unread?: number;
}

interface SearchResultUser {
  _id: string;
  username: string;
  profileImage?: string; // Updated to match API response
}

export default function ConversationSidebar() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?._id || (session?.user as any)?.id;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const previousConversationsRef = useRef<Conversation[]>([]);

  useEffect(() => {
    previousConversationsRef.current = conversations;
  }, [conversations]);

  const showNotification = (title: string, userId: string, options: NotificationOptions) => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    const createNotification = () => {
      const notification = new Notification(title, options);
      notification.onclick = () => {
        window.focus();
        router.push(`/messages/${userId}`);
      };
    };

    if (Notification.permission === 'granted') {
       createNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
           createNotification();
        }
      });
    }
  };

  const checkForNewMessages = (newConvos: Conversation[], oldConvos: Conversation[]) => {
    // Don't show notifications on initial load or if the tab is focused
    if (oldConvos.length === 0 || document.hasFocus()) return;

    const selectedUserId = pathname.split('/').pop();

    for (const newConvo of newConvos) {
      const oldConvo = oldConvos.find(c => c.otherUser._id === newConvo.otherUser._id);
      
      // Don't show notification for the chat the user is currently viewing
      if (newConvo.otherUser._id === selectedUserId) {
        continue;
      }

      // A new message is detected if a conversation is new, or its unread count has increased.
      if (!oldConvo || (newConvo.unread && oldConvo && newConvo.unread > (oldConvo.unread || 0))) {
        showNotification(
          `New message from ${newConvo.otherUser.username}`,
          newConvo.otherUser._id,
          {
            body: newConvo.lastMessage,
            icon: newConvo.otherUser.avatar || '/logo.png', // Use a default icon
            tag: newConvo.otherUser._id, // Use user ID as tag to stack notifications
          }
        );
      }
    }
  };

  useEffect(() => {
    if (!currentUserId) return;
    // TODO: For a production app, replace polling with a WebSocket connection (e.g., Socket.IO) for better performance.
    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/conversations?userId=${currentUserId}`);
        if (res.ok) {
          const newConversations: Conversation[] = await res.json();
          setConversations(newConversations);
          checkForNewMessages(newConversations, previousConversationsRef.current);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [currentUserId, pathname]); // Refetch when user or path changes

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      try {
        const res = await fetch(`/api/users?search=${searchQuery}`);
        if (res.ok) setSearchResults(await res.json());
      } catch (error) {
        console.error("Failed to search users", error);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectUser = (userId: string) => {
    setSearchQuery('');
    setSearchResults([]);
    router.push(`/messages/${userId}`);
  };

  const selectedUserId = pathname.split('/').pop();

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden h-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Messages</h1>
          <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {searchQuery.trim() ? (
          searchResults.filter(user => user._id !== currentUserId).map((user) => (
            <div key={user._id} onClick={() => handleSelectUser(user._id)} className="p-4 flex items-center gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50">
              <img src={user.profileImage || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate text-zinc-900 dark:text-white">{user.username}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Start a new conversation</p>
              </div>
            </div>
          ))
        ) : (
          conversations.map((chat) => (
            <Link href={`/messages/${chat.otherUser._id}`} key={chat.otherUser._id} className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 ${selectedUserId === chat.otherUser._id ? 'bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-l-4 border-l-transparent'}`}>
              <div className="relative shrink-0">
                <img src={chat.otherUser.avatar || `https://i.pravatar.cc/150?u=${chat.otherUser._id}`} alt={chat.otherUser.username} className="w-12 h-12 rounded-full object-cover" />
                {chat.otherUser.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-semibold truncate ${selectedUserId === chat.otherUser._id ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-900 dark:text-white'}`}>{chat.otherUser.username}</h3>
                  <span className="text-xs text-zinc-500">{formatDistanceToNow(new Date(chat.time), { addSuffix: true })}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread && chat.unread > 0 && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">{chat.unread}</div>}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}