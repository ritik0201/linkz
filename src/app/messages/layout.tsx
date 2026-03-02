"use client";

import ConversationSidebar from '@/components/ConversationSidebar';
import { usePathname } from 'next/navigation';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // A chat is selected if the path is /messages/some-id
  const hasSelectedChat = /^\/messages\/.+/.test(pathname);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-20 pb-4 md:pb-10">
      <div className="container mx-auto px-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          <div className={`md:col-span-4 lg:col-span-3 h-full ${hasSelectedChat ? 'hidden md:flex' : 'flex'} flex-col`}>
            <ConversationSidebar />
          </div>
          <div className={`md:col-span-8 lg:col-span-9 h-full ${hasSelectedChat ? 'flex' : 'hidden md:flex'} flex-col`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}