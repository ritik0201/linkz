"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
  createdAt?: string;
};

interface ChatPanelProps {
  projectId: string;
}

export default function ChatPanel({ projectId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const res = await fetch(`/api/workspace/chat/${projectId}`);
        const data = await res.json();

        const messagesFromAPI = Array.isArray(data.messages)
          ? data.messages
          : [];
        setMessages(
          messagesFromAPI.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender === "me" ? "me" : "other",
            text: msg.text,
            createdAt: msg.createdAt,
          })),
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [projectId]);

  // Send message
  async function sendMessage() {
    if (!input.trim()) return;

    const newMsg: Message = { id: Date.now(), sender: "me", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setSending(true);

    try {
      await fetch(`/api/workspace/chat/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="flex flex-col h-[70vh] bg-[#0B0D16] border border-white/10 rounded-xl shadow-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading ? (
          <div className="text-white/50 text-sm text-center">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-white/50 text-sm text-center">
            No messages yet. Say hi! 👋
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] px-4 py-2 rounded-xl text-sm wrap-break ${
                msg.sender === "me"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-[#0B0D16] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          className={`bg-blue-600 hover:bg-blue-500 px-5 rounded-lg text-sm font-medium transition ${
            sending ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={sending}
        >
          Send
        </button>
      </div>
    </div>
  );
}
