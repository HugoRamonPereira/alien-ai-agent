"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ChatRequestBody } from "@/types/types";

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  thresholdMessages: Doc<"messages">[];
}

const ChatInterface = ({ chatId, thresholdMessages }: ChatInterfaceProps) => {
  const [messages, setMessages] =
    useState<Doc<"messages">[]>(thresholdMessages);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [currentTool, setCurrentTool] = useState<{
    name: string;
    input: unknown;
  } | null>(null);

  // The variable below is supposed to take me to the bottom of the chat with the submission of a message to always see the latest message sent
  const messagesBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // In case there are empty Space_Grotesk, trim them
    const trimmedInputMessage = input.trim();
    if (!trimmedInputMessage || isLoading) return;

    // After sending a message always clear UI state for the new upcoming messages
    setInput("");
    setStreamedResponse("");
    setCurrentTool(null);
    setIsLoading(true);

    // Optimistic UI Update - Add user messages immediately for better user experience
    const optimisticUserMessage: Doc<"messages"> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInputMessage,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, optimisticUserMessage]);

    //Keep track of the complete response to save in the database
    let fullResponse = "";

    // Start streaming the response
    try {
      // Prepare the request body to send to the backend
      const requestBody: ChatRequestBody = {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        newMessage: trimmedInputMessage,
        chatId,
      };

      // Initialize a SSE Connection
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(await response.text());
      if (!response.body) throw new Error("No response body available");
      // Handle the stream
    } catch (error) {
      // Handle any errors during streaming
      console.error("Error sending message:", error);
      // Remove the optimistic user message if there was an error
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticUserMessage._id)
      );
      setStreamedResponse(
        "error"
        // formatTerminalOutput(
        //   "error",
        //   "Failed to process message",
        //   error instanceof Error ? error.message : "Unknonwn error"
        // )
      );
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Messages */}
      <section className="flex-1">
        {/* Messages */}
        <div>
          {messages.map((message) => (
            <div key={message._id}>{message.content}</div>
          ))}
        </div>
        {/* Last message */}
        <div ref={messagesBottomRef} />
      </section>
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
