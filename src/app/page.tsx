"use client";

import { useState, useEffect } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem("chat_username");
    if (storedUser) {
      setUsername(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleJoin = (name: string) => {
    localStorage.setItem("chat_username", name);
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("chat_username");
    setUsername(null);
  };

  if (isLoading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!username) {
    return <LoginScreen onJoin={handleJoin} />;
  }

  return <ChatInterface username={username} onLogout={handleLogout} />;
}
