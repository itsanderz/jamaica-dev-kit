"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import QuickActions from "@/components/QuickActions";
import TypingIndicator from "@/components/TypingIndicator";
import { sendMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to the **Jamaica Government Assistant**! I can help you with:\n\n" +
    "- Passport applications and fees\n" +
    "- Business registration\n" +
    "- TRN (Taxpayer Registration Number)\n" +
    "- Driver's licence information\n" +
    "- Birth certificates\n" +
    "- And other government services\n\n" +
    "How can I help you today?",
  timestamp: formatTime(new Date()),
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = (text || inputValue).trim();
      if (!messageText || isLoading) return;

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: messageText,
        timestamp: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await sendMessage(messageText, sessionId);

        // Store session ID for conversation continuity
        if (response.session_id) {
          setSessionId(response.session_id);
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response.response,
          timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        // Show error message in chat
        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: formatTime(new Date()),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        // Re-focus input on desktop
        inputRef.current?.focus();
      }
    },
    [inputValue, isLoading, sessionId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto chat-scrollbar px-4 pt-4 pb-2"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom bar: quick actions + input */}
      <div className="shrink-0 border-t border-gray-200 bg-white">
        {/* Quick action chips */}
        <QuickActions onAction={handleQuickAction} disabled={isLoading} />

        {/* Input area */}
        <div className="flex items-center gap-2 px-4 pb-4 pt-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about government services..."
            disabled={isLoading}
            className="flex-1 bg-jamaica-gray border border-gray-200 rounded-full
                       px-4 py-2.5 text-sm text-gray-900
                       placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-jamaica-green/40
                       focus:border-jamaica-green
                       disabled:opacity-50 transition-all duration-150"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-jamaica-green
                       flex items-center justify-center
                       hover:bg-green-700 active:bg-green-800
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors duration-150 shadow-sm"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
