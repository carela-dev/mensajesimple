"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface LoginScreenProps {
    onJoin: (username: string, password: string) => void;
    error?: string | null;
}

export function LoginScreen({ onJoin, error }: LoginScreenProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            onJoin(username.trim(), password.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-black to-zinc-900 text-white">
            <div className="w-full max-w-md p-8 glass-dark rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 rounded-full bg-white/5 mb-4 border border-white/10">
                        <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Private Access
                    </h1>
                    <p className="text-zinc-400 mt-2 text-center">
                        Enter your name and the room password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-zinc-300">
                            Your Name
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. Alex"
                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all placeholder:text-zinc-600 text-white"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                            Room Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all placeholder:text-zinc-600 text-white"
                        />
                    </div>

                    {error && (
                        <p className="text-rose-500 text-sm font-medium animate-in shake-in duration-300">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!username.trim() || !password.trim()}
                        className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                        Access Room
                    </button>
                </form>
            </div>
        </div>
    );
}
