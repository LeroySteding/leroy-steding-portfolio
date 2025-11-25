"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "@/hooks/useTranslation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: t.chat.error.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStarterPrompt = (prompt: string) => {
    setUsedPrompts((prev) => new Set([...prev, prompt]));
    sendMessage(prompt);
  };

  // Get available prompts (not yet used)
  const getAvailablePrompts = () => {
    const allPrompts =
      messages.length === 0 ? t.chat.starterPrompts : t.chat.followUpPrompts;
    return allPrompts.filter((prompt) => !usedPrompts.has(prompt)).slice(0, 3);
  };

  const availablePrompts = getAvailablePrompts();

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full shadow-2xl hover:shadow-accent-primary/50 transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[600px] max-h-[80vh] flex flex-col"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl" />

            {/* Chat Container */}
            <div className="relative card overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">
                      {t.chat.header.title}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      {t.chat.header.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-block p-3 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-full mb-3">
                        <Sparkles className="w-8 h-8 text-accent-primary" />
                      </div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">
                        {t.chat.welcome.title}
                      </h4>
                      <p className="text-sm text-text-secondary mb-4">
                        {t.chat.welcome.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {t.chat.starterPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleStarterPrompt(prompt)}
                          className="text-left p-3 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border transition-colors duration-200 text-sm text-text-secondary hover:text-text-primary"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-accent-primary to-accent-secondary text-white"
                              : "bg-bg-secondary text-text-primary border border-border"
                          }`}
                        >
                          {message.role === "user" ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                          ) : (
                            <div className="text-sm prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => (
                                    <p className="mb-2 last:mb-0">{children}</p>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="mb-2 ml-4 list-disc">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="mb-2 ml-4 list-decimal">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="mb-1">{children}</li>
                                  ),
                                  a: ({ href, children }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent-primary hover:underline"
                                    >
                                      {children}
                                    </a>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-semibold">
                                      {children}
                                    </strong>
                                  ),
                                  em: ({ children }) => (
                                    <em className="italic">{children}</em>
                                  ),
                                  code: ({ children }) => (
                                    <code className="bg-bg-tertiary px-1 py-0.5 rounded text-xs font-mono">
                                      {children}
                                    </code>
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-bg-secondary rounded-2xl px-4 py-3 border border-border">
                          <Loader2 className="w-5 h-5 text-accent-primary animate-spin" />
                        </div>
                      </div>
                    )}

                    {/* Show suggestion prompts after messages */}
                    {messages.length > 0 &&
                      !isLoading &&
                      availablePrompts.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs text-text-tertiary">
                            {t.chat.suggestions.title}
                          </p>
                          {availablePrompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => handleStarterPrompt(prompt)}
                              className="w-full text-left p-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border transition-colors duration-200 text-xs text-text-secondary hover:text-text-primary"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.chat.input.placeholder}
                    rows={1}
                    className="flex-1 px-4 py-2 bg-bg-secondary border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-primary placeholder-text-tertiary"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg hover:shadow-accent-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
                <p className="text-xs text-text-tertiary mt-2 text-center">
                  {t.chat.disclaimer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
