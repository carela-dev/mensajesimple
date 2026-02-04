"use client";

import { useState, useEffect } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear existing session to force password check for testing
    localStorage.removeItem("chat_username");
    setIsLoading(false);
  }, []);

  const handleJoin = (name: string, pass: string) => {
    const correctPassword = process.env.NEXT_PUBLIC_ROOM_PASSWORD;

    if (!correctPassword) {
      console.error("ERROR: NEXT_PUBLIC_ROOM_PASSWORD no está configurado en .env.local");
      setError("Error de configuración del servidor. Por favor, revisa el archivo .env.local.");
      return;
    }

    if (pass === correctPassword) {
      localStorage.setItem("chat_username", name);
      setUsername(name);
      setError(null);
    } else {
      setError("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chat_username");
    setUsername(null);
    setError(null);
  };

  if (isLoading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!username) {
    return <LoginScreen onJoin={handleJoin} error={error} />;
  }

  return <ChatInterface username={username} onLogout={handleLogout} />;
}
