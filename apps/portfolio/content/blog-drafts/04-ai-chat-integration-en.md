# Building an AI-Powered Chat Widget with Next.js and OpenAI

**Category:** Tutorial  
**Tags:** AI, OpenAI, Next.js, React, TypeScript, Chatbot  
**Reading Time:** 22 min read  
**Author:** Leroy Steding

---

Adding an AI chat assistant to your portfolio or website can dramatically improve user engagement and provide instant answers to visitor questions. In this comprehensive guide, I'll walk you through building a fully functional AI chat widget using Next.js 16, OpenAI's GPT API, and streaming responses for a smooth user experience. This is based on my production implementation that handles thousands of conversations.

## Table of Contents

1. [Why Add an AI Chat Widget?](#why-add-an-ai-chat-widget)
2. [Architecture Overview](#architecture-overview)
3. [Setting Up the Backend](#setting-up-the-backend)
4. [Building the Chat Widget UI](#building-the-chat-widget-ui)
5. [Implementing Streaming Responses](#implementing-streaming-responses)
6. [System Prompts and Context](#system-prompts-and-context)
7. [Rate Limiting and Security](#rate-limiting-and-security)
8. [Persisting Chat History](#persisting-chat-history)
9. [Analytics and Monitoring](#analytics-and-monitoring)
10. [Best Practices and Optimization](#best-practices-and-optimization)

---

## Why Add an AI Chat Widget?

Before diving into implementation, let's understand the benefits:

### User Benefits

- **Instant Answers**: Visitors get immediate responses 24/7
- **Personalized Experience**: AI can be trained on your specific content
- **Lower Barrier**: Easier than filling out contact forms
- **Exploration Aid**: Helps users discover relevant content

### Business Benefits

- **Lead Qualification**: Understand visitor intent before contact
- **Time Savings**: Reduce repetitive questions
- **Engagement Metrics**: Track what visitors are interested in
- **Professional Image**: Shows technical capability

---

## Architecture Overview

Our chat system consists of three main components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Chat Widget   │────▶│   API Route     │────▶│   OpenAI API    │
│   (React)       │◀────│   (Next.js)     │◀────│   (GPT-4)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────────┐
        └──────────────▶│   Local Storage │
                        │   (History)     │
                        └─────────────────┘
```

### Key Design Decisions

1. **Streaming Responses**: Real-time token-by-token display
2. **Edge Runtime**: Fast cold starts for API routes
3. **Local Storage**: Client-side chat history persistence
4. **Rate Limiting**: Protect against abuse
5. **System Prompt**: Customize AI personality and knowledge

---

## Setting Up the Backend

### Step 1: Install Dependencies

```bash
pnpm add openai ai
```

The `ai` package from Vercel provides excellent streaming utilities.

### Step 2: Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview  # or gpt-3.5-turbo for lower cost
```

### Step 3: Create the API Route

```typescript
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { NextRequest } from "next/server";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt that defines the AI's personality and knowledge
const SYSTEM_PROMPT = `You are a helpful AI assistant for Leroy Steding's portfolio website. 

About Leroy:
- Full-stack developer with 10+ years of experience
- Specializes in React, Next.js, TypeScript, and Node.js
- Based in the Netherlands
- Available for freelance projects and consulting

Your role:
- Answer questions about Leroy's skills, experience, and services
- Help visitors navigate the portfolio
- Provide information about web development
- Be friendly, professional, and concise
- If asked about pricing, suggest they book a consultation
- If you don't know something specific, suggest contacting Leroy directly

Keep responses concise (2-3 paragraphs max) unless more detail is requested.`;

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // 20 requests per minute

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { messages } = await request.json();

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Limit conversation history to prevent token overflow
    const recentMessages = messages.slice(-10);

    // Create chat completion with streaming
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...recentMessages,
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // Convert to streaming response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI service is busy. Please try again." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ error: "Failed to process your message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Configure edge runtime for faster cold starts
export const runtime = "edge";
```

---

## Building the Chat Widget UI

### Step 4: Create the Chat Widget Component

```typescript
// components/ui/ChatWidget.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  /** Initial greeting message */
  greeting?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Position on screen */
  position?: "bottom-right" | "bottom-left";
}

export function ChatWidget({
  greeting = "Hi! I'm Leroy's AI assistant. How can I help you today?",
  placeholder = "Ask me anything...",
  position = "bottom-right",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      } catch {
        // Invalid data, start fresh
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Add initial greeting when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, greeting]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Clear input and error
    setInput("");
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude greeting)
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // Call chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Create placeholder for assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

      // Stream the response
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: m.content + chunk }
                : m
            )
          );
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      
      // Remove the loading message on error
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chat-history");
  };

  const positionClasses = position === "bottom-right" 
    ? "right-4 sm:right-6" 
    : "left-4 sm:left-6";

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50 p-4 bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow`}
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50 w-[calc(100vw-2rem)] sm:w-96 bg-bg-primary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-white/80">
                    {isLoading ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? "Expand" : "Minimize"}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-br-md"
                            : "bg-surface text-text-primary rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === "user"
                              ? "text-white/70"
                              : "text-text-tertiary"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-surface p-3 rounded-2xl rounded-bl-md">
                        <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholder}
                      rows={1}
                      className="flex-1 px-4 py-2 bg-surface border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-primary placeholder-text-tertiary"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="p-2 bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
                    <span>Press Enter to send</span>
                    {messages.length > 1 && (
                      <button
                        type="button"
                        onClick={clearHistory}
                        className="hover:text-accent-primary transition-colors"
                      >
                        Clear history
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

### Step 5: Add to Layout

```typescript
// app/[locale]/layout.tsx
import { ChatWidget } from "@/components/ui/ChatWidget";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget 
          greeting="Hi! I'm Leroy's AI assistant. Ask me about his skills, experience, or how he can help with your project!"
          placeholder="Type your question..."
        />
      </body>
    </html>
  );
}
```

---

## Implementing Streaming Responses

Streaming is crucial for a good user experience. Instead of waiting for the complete response, users see text appear in real-time.

### How Streaming Works

```typescript
// The OpenAI API returns chunks like:
// data: {"choices":[{"delta":{"content":"Hello"}}]}
// data: {"choices":[{"delta":{"content":" there"}}]}
// data: {"choices":[{"delta":{"content":"!"}}]}
// data: [DONE]

// We process each chunk and update the UI incrementally
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  // Update message content with new chunk
  setMessages((prev) =>
    prev.map((m) =>
      m.id === currentMessageId
        ? { ...m, content: m.content + chunk }
        : m
    )
  );
}
```

### Benefits of Streaming

1. **Perceived Speed**: Users see response immediately
2. **Better UX**: Feels more like natural conversation
3. **Early Feedback**: Users can interrupt if response is wrong
4. **Lower Memory**: Don't need to buffer entire response

---

## System Prompts and Context

The system prompt is crucial for defining your AI's personality and knowledge.

### Step 6: Crafting an Effective System Prompt

```typescript
const SYSTEM_PROMPT = `You are a helpful AI assistant for [Your Name]'s portfolio website.

## About [Your Name]
- Full-stack developer with X years of experience
- Specializes in [technologies]
- Based in [location]
- Available for [services]

## Your Personality
- Friendly and professional
- Concise but helpful
- Enthusiastic about technology

## Guidelines
1. Answer questions about skills, experience, and services
2. Help visitors navigate the portfolio
3. Suggest booking a consultation for detailed discussions
4. If unsure, recommend contacting directly
5. Keep responses to 2-3 paragraphs unless more detail is requested

## Knowledge Base
- Services: Web development, consulting, code review
- Technologies: React, Next.js, TypeScript, Node.js
- Recent projects: [brief descriptions]

## Things to Avoid
- Making up information you don't have
- Discussing competitors negatively
- Providing specific pricing (suggest consultation instead)
- Sharing personal contact details (use the contact form)`;
```

### Step 7: Dynamic Context Injection

For more advanced use cases, inject real-time context:

```typescript
// app/api/chat/route.ts
async function buildContextPrompt() {
  // Fetch recent projects
  const projects = await getRecentProjects();
  
  // Fetch availability
  const availability = await getAvailability();
  
  return `
## Current Context
- Availability: ${availability}
- Recent Projects: ${projects.map(p => p.title).join(", ")}
- Current Date: ${new Date().toLocaleDateString()}
  `;
}

// Add to system prompt
const contextPrompt = await buildContextPrompt();
const fullSystemPrompt = SYSTEM_PROMPT + contextPrompt;
```

---

## Rate Limiting and Security

### Step 8: Production-Ready Rate Limiting with Redis

```typescript
// lib/rate-limit.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  limit: number = 20,
  window: number = 60
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - window;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in current window
  const count = await redis.zcard(key);

  if (count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: windowStart + window,
    };
  }

  // Add current request
  await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  await redis.expire(key, window);

  return {
    success: true,
    remaining: limit - count - 1,
    reset: windowStart + window,
  };
}
```

### Step 9: Input Sanitization

```typescript
// lib/sanitize.ts
export function sanitizeInput(input: string): string {
  // Remove potential prompt injection attempts
  const cleaned = input
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/\[INST\]|\[\/INST\]/gi, "") // Remove instruction markers
    .replace(/system:|assistant:|user:/gi, "") // Remove role markers
    .trim();

  // Limit length
  return cleaned.slice(0, 1000);
}

// Usage in API route
const { messages } = await request.json();
const sanitizedMessages = messages.map((m: Message) => ({
  ...m,
  content: sanitizeInput(m.content),
}));
```

---

## Persisting Chat History

### Step 10: Enhanced Local Storage with Compression

```typescript
// lib/chat-storage.ts
import { compress, decompress } from "lz-string";

interface StoredChat {
  messages: Message[];
  lastUpdated: number;
}

const STORAGE_KEY = "chat-history";
const MAX_MESSAGES = 50;
const MAX_AGE_DAYS = 7;

export function saveChat(messages: Message[]): void {
  try {
    const data: StoredChat = {
      messages: messages.slice(-MAX_MESSAGES),
      lastUpdated: Date.now(),
    };
    const compressed = compress(JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY, compressed);
  } catch (error) {
    console.error("Failed to save chat:", error);
  }
}

export function loadChat(): Message[] {
  try {
    const compressed = localStorage.getItem(STORAGE_KEY);
    if (!compressed) return [];

    const data: StoredChat = JSON.parse(decompress(compressed) || "{}");
    
    // Check if data is too old
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - data.lastUpdated > maxAge) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return data.messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch (error) {
    console.error("Failed to load chat:", error);
    return [];
  }
}

export function clearChat(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

---

## Analytics and Monitoring

### Step 11: Track Chat Interactions

```typescript
// lib/analytics.ts
export function trackChatEvent(
  event: "chat_opened" | "message_sent" | "message_received" | "error",
  properties?: Record<string, string | number | boolean>
) {
  // Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, {
      event_category: "chat",
      ...properties,
    });
  }

  // Or your preferred analytics service
  // posthog.capture(event, properties);
  // mixpanel.track(event, properties);
}

// Usage in chat widget
const handleSubmit = async () => {
  trackChatEvent("message_sent", {
    message_length: input.length,
    conversation_length: messages.length,
  });
  
  // ... send message
  
  trackChatEvent("message_received", {
    response_time: Date.now() - startTime,
  });
};
```

### Step 12: Error Monitoring

```typescript
// lib/error-tracking.ts
export function trackChatError(
  error: Error,
  context: Record<string, unknown>
) {
  console.error("Chat error:", error, context);

  // Sentry
  // Sentry.captureException(error, { extra: context });

  // Or custom logging
  fetch("/api/log-error", {
    method: "POST",
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }),
  });
}
```

---

## Best Practices and Optimization

### 1. Debounce Typing Indicator

```typescript
// Show typing indicator without flooding state updates
const [isTyping, setIsTyping] = useState(false);
const typingTimeoutRef = useRef<NodeJS.Timeout>();

const showTyping = () => {
  setIsTyping(true);
  clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
};
```

### 2. Preload Chat Component

```typescript
// Preload the chat widget for faster opening
import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/ui/ChatWidget").then((mod) => mod.ChatWidget),
  {
    loading: () => null,
    ssr: false,
  }
);
```

### 3. Optimize Token Usage

```typescript
// Summarize long conversations to reduce tokens
function summarizeConversation(messages: Message[]): Message[] {
  if (messages.length <= 6) return messages;

  const summary = messages.slice(0, -4).map((m) => m.content).join(" ");
  
  return [
    {
      id: "summary",
      role: "assistant",
      content: `Previous conversation summary: ${summary.slice(0, 500)}...`,
      timestamp: new Date(),
    },
    ...messages.slice(-4),
  ];
}
```

### 4. Graceful Degradation

```typescript
// Fallback when AI is unavailable
const [aiAvailable, setAiAvailable] = useState(true);

const handleError = (error: Error) => {
  if (error.message.includes("rate limit") || error.message.includes("unavailable")) {
    setAiAvailable(false);
    // Show contact form instead
  }
};
```

### 5. Accessibility

```typescript
// Ensure chat is accessible
<div
  role="log"
  aria-live="polite"
  aria-label="Chat messages"
>
  {messages.map((message) => (
    <div
      key={message.id}
      role="article"
      aria-label={`${message.role} message`}
    >
      {message.content}
    </div>
  ))}
</div>
```

---

## Cost Optimization

### Choosing the Right Model

| Model | Cost per 1K tokens | Best For |
|-------|-------------------|----------|
| GPT-4 Turbo | $0.01 input / $0.03 output | Complex conversations |
| GPT-3.5 Turbo | $0.0005 input / $0.0015 output | Simple Q&A |

### Estimated Monthly Costs

For a portfolio with ~1000 chat interactions/month:
- **GPT-4 Turbo**: ~$15-30/month
- **GPT-3.5 Turbo**: ~$1-3/month

Start with GPT-3.5 and upgrade if needed.

---

## Conclusion

Building an AI chat widget involves:

1. **Backend**: Secure API route with streaming
2. **Frontend**: Responsive, animated chat UI
3. **UX**: Real-time streaming for natural feel
4. **Security**: Rate limiting and input sanitization
5. **Persistence**: Local storage for history
6. **Analytics**: Track usage and errors

The result is a professional, engaging feature that sets your portfolio apart and provides real value to visitors.

---

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Framer Motion](https://www.framer.com/motion/)
