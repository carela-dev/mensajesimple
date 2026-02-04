"use client";

import { useEffect, useRef, useState } from "react";
import { Send, LogOut } from "lucide-react";
import { Message } from "@/types";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
    username: string;
    onLogout: () => void;
}

export function ChatInterface({ username, onLogout }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (data) {
                setMessages(data);
            }
        };

        fetchMessages();
    }, []);

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel('realtime messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new as Message;
                setMessages((prev) => [...prev, newMsg]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        const content = newMessage.trim();
        setNewMessage(""); // Optimistic clear

        const { error } = await supabase
            .from('messages')
            .insert([{ content, username }]);

        if (error) {
            console.error('Error sending message:', error);
            // In a real app, restore the message or show an error toast
            setNewMessage(content);
        }

        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 glass-dark sticky top-0 z-10 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <h2 className="font-semibold text-lg tracking-tight">Private Room</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400">
                        Logged in as <span className="text-white font-medium">{username}</span>
                    </span>
                    <button
                        onClick={onLogout}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 sm:p-6 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2">
                        <p>No messages yet.</p>
                        <p className="text-sm">Be the first to say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.username === username;
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[80%] md:max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <span className={cn("text-xs mb-1 px-1", isMe ? "text-zinc-400" : "text-zinc-500")}>
                                    {isMe ? "You" : msg.username}
                                </span>
                                <div
                                    className={cn(
                                        "px-4 py-3 rounded-2xl shadow-sm break-words",
                                        isMe
                                            ? "bg-white text-black rounded-tr-sm"
                                            : "bg-zinc-800 text-zinc-100 rounded-tl-sm border border-white/5"
                                    )}
                                >
                                    <p className="leading-relaxed">{msg.content}</p>
                                </div>
                                <span className="text-[10px] text-zinc-600 mt-1 px-1 opacity-60">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black border-t border-white/10">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="p-3.5 bg-white text-black rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
