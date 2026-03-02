import { Send } from 'lucide-react';

export default function MessagesIndexPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
        <Send size={32} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Your Messages</h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
        Select a conversation from the sidebar to start chatting.
      </p>
    </div>
  );
}