"use client";

import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPageProps {
  translations: {
    title: string;
    subtitle: string;
    placeholder: string;
    starterPrompts: string[];
    followUpPrompts: string[];
    suggestionsLabel: string;
    emptyStateTitle: string;
    emptyStateSubtitle: string;
  };
  locale: string;
}

export default function ChatPage({ translations, locale }: ChatPageProps) {
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
          locale,
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
        content:
          locale === "nl"
            ? "Sorry, er is een fout opgetreden. Probeer het opnieuw of neem direct contact op met Leroy via leroysteding@gmail.com."
            : "Sorry, I encountered an error. Please try again or contact Leroy directly at leroysteding@gmail.com.",
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

  const getAvailablePrompts = () => {
    const allPrompts =
      messages.length === 0
        ? translations.starterPrompts
        : translations.followUpPrompts;
    return allPrompts.filter((prompt) => !usedPrompts.has(prompt)).slice(0, 3);
  };

  const availablePrompts = getAvailablePrompts();

  return (
    <div className="min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6">
          <MessageCircle className="w-12 h-12 text-accent-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
          {translations.title}
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          {translations.subtitle}
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 card p-6 md:p-8 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4 min-h-[400px]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <div className="inline-block p-3 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-full mb-4">
                  <Sparkles className="w-12 h-12 text-accent-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  {translations.emptyStateTitle}
                </h3>
                <p className="text-text-secondary mb-6">
                  {translations.emptyStateSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {translations.starterPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterPrompt(prompt)}
                    className="text-left p-4 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border transition-all duration-200 text-sm text-text-secondary hover:text-text-primary hover:border-accent-primary/50"
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
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-accent-primary to-accent-secondary text-white"
                        : "bg-bg-secondary text-text-primary border border-border"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="text-base whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0 text-base">
                                {children}
                              </p>
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
                  <div className="bg-bg-secondary rounded-2xl px-6 py-4 border border-border">
                    <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {messages.length > 0 &&
                !isLoading &&
                availablePrompts.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <p className="text-sm text-text-tertiary">
                      {translations.suggestionsLabel}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {availablePrompts.map((prompt, index) => (
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
                )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={translations.placeholder}
            rows={1}
            className="flex-1 px-6 py-4 bg-bg-secondary border-2 border-border rounded-xl resize-none focus:outline-none focus:border-accent-primary text-text-primary placeholder-text-tertiary transition-colors duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg hover:shadow-accent-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
