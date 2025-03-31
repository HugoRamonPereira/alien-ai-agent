"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  thresholdMessages: Doc<"messages">[];
}

const ChatInterface = ({ chatId, thresholdMessages }: ChatInterfaceProps) => {
  const [messages, setMessages] =
    useState<Doc<"messages">[]>(thresholdMessages);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="flex flex-col h-[calc(100vh-theme(spacing.14))]">
      {/* Messages */}
      <section className="flex-1"></section>
      {/* Footer input */}
      <footer className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={submitMessage} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              placeholder="Enter a message to the Alien AI Agent..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent pr-12 bg-gray-50 placeholder:text-gray-500 transition-all duration-300 ease-in-out"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-1.5 rounded-xl w-9 h-9 p-0 flex items-center justify-center transition-all 
                ${
                  input.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 border border-gray-400/50"
                }`}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </form>
      </footer>
    </main>
  );
};

export default ChatInterface;
