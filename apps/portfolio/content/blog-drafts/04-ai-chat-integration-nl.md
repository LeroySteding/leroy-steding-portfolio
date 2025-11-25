# Een AI-Gestuurde Chat Widget Bouwen met Next.js en OpenAI

**Categorie:** Tutorial  
**Tags:** AI, OpenAI, Next.js, React, TypeScript, Chatbot  
**Leestijd:** 22 min lezen  
**Auteur:** Leroy Steding

---

Een AI chat-assistent toevoegen aan je portfolio of website kan de gebruikersbetrokkenheid drastisch verbeteren en directe antwoorden geven op vragen van bezoekers. In deze uitgebreide handleiding loop ik je door het bouwen van een volledig functionele AI chat widget met Next.js 16, OpenAI's GPT API en streaming responses voor een soepele gebruikerservaring. Dit is gebaseerd op mijn productie-implementatie die duizenden gesprekken afhandelt.

## Inhoudsopgave

1. [Waarom een AI Chat Widget Toevoegen?](#waarom-een-ai-chat-widget-toevoegen)
2. [Architectuur Overzicht](#architectuur-overzicht)
3. [De Backend Opzetten](#de-backend-opzetten)
4. [De Chat Widget UI Bouwen](#de-chat-widget-ui-bouwen)
5. [Streaming Responses Implementeren](#streaming-responses-implementeren)
6. [System Prompts en Context](#system-prompts-en-context)
7. [Rate Limiting en Beveiliging](#rate-limiting-en-beveiliging)
8. [Chat Geschiedenis Opslaan](#chat-geschiedenis-opslaan)
9. [Analytics en Monitoring](#analytics-en-monitoring)
10. [Best Practices en Optimalisatie](#best-practices-en-optimalisatie)

---

## Waarom een AI Chat Widget Toevoegen?

Voordat we in de implementatie duiken, laten we de voordelen begrijpen:

### Voordelen voor Gebruikers

- **Directe Antwoorden**: Bezoekers krijgen onmiddellijk respons 24/7
- **Gepersonaliseerde Ervaring**: AI kan getraind worden op jouw specifieke content
- **Lagere Drempel**: Makkelijker dan contactformulieren invullen
- **Ontdekking**: Helpt gebruikers relevante content te vinden

### Zakelijke Voordelen

- **Lead Kwalificatie**: Begrijp bezoekersintentie voor contact
- **Tijdsbesparing**: Verminder repetitieve vragen
- **Engagement Metrics**: Volg waar bezoekers in geïnteresseerd zijn
- **Professioneel Imago**: Toont technische capaciteit

---

## Architectuur Overzicht

Ons chat systeem bestaat uit drie hoofdcomponenten:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Chat Widget   │────▶│   API Route     │────▶│   OpenAI API    │
│   (React)       │◀────│   (Next.js)     │◀────│   (GPT-4)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────────┐
        └──────────────▶│   Local Storage │
                        │   (Geschiedenis) │
                        └─────────────────┘
```

### Belangrijke Ontwerpbeslissingen

1. **Streaming Responses**: Real-time token-voor-token weergave
2. **Edge Runtime**: Snelle cold starts voor API routes
3. **Local Storage**: Client-side chat geschiedenis
4. **Rate Limiting**: Bescherming tegen misbruik
5. **System Prompt**: Pas AI persoonlijkheid en kennis aan

---

## De Backend Opzetten

### Stap 1: Dependencies Installeren

```bash
pnpm add openai ai
```

Het `ai` package van Vercel biedt uitstekende streaming utilities.

### Stap 2: Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-jouw-api-key-hier
OPENAI_MODEL=gpt-4-turbo-preview  # of gpt-3.5-turbo voor lagere kosten
```

### Stap 3: API Route Maken

```typescript
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { NextRequest } from "next/server";

// Maak OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt die de persoonlijkheid en kennis van de AI definieert
const SYSTEM_PROMPT = `Je bent een behulpzame AI-assistent voor de portfolio website van Leroy Steding.

Over Leroy:
- Full-stack developer met 10+ jaar ervaring
- Specialiseert in React, Next.js, TypeScript en Node.js
- Gevestigd in Nederland
- Beschikbaar voor freelance projecten en consulting

Jouw rol:
- Beantwoord vragen over Leroy's vaardigheden, ervaring en diensten
- Help bezoekers navigeren door het portfolio
- Geef informatie over webontwikkeling
- Wees vriendelijk, professioneel en beknopt
- Als gevraagd naar prijzen, stel voor om een consultatie te boeken
- Als je iets specifieks niet weet, stel voor om direct contact op te nemen

Houd antwoorden beknopt (max 2-3 paragrafen) tenzij meer detail wordt gevraagd.`;

// Rate limiting map (in productie, gebruik Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuut window
  const maxRequests = 20; // 20 verzoeken per minuut

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
    // Haal client IP op voor rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Controleer rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Te veel verzoeken. Probeer later opnieuw." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { messages } = await request.json();

    // Valideer berichten
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Berichten zijn vereist" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Beperk conversatiegeschiedenis om token overflow te voorkomen
    const recentMessages = messages.slice(-10);

    // Maak chat completion met streaming
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

    // Converteer naar streaming response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error("Chat API fout:", error);
    
    // Handel specifieke OpenAI fouten af
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI service is bezet. Probeer opnieuw." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ error: "Kon je bericht niet verwerken" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Configureer edge runtime voor snellere cold starts
export const runtime = "edge";
```

---

## De Chat Widget UI Bouwen

### Stap 4: Chat Widget Component Maken

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
  /** Initiële begroeting */
  greeting?: string;
  /** Placeholder tekst voor input */
  placeholder?: string;
  /** Positie op scherm */
  position?: "bottom-right" | "bottom-left";
}

export function ChatWidget({
  greeting = "Hoi! Ik ben Leroy's AI-assistent. Hoe kan ik je helpen?",
  placeholder = "Stel me een vraag...",
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

  // Scroll naar beneden bij nieuwe berichten
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Laad chat geschiedenis uit localStorage
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
        // Ongeldige data, begin opnieuw
      }
    }
  }, []);

  // Sla chat geschiedenis op in localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Voeg initiële begroeting toe wanneer chat voor het eerst wordt geopend
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setInput("");
    setError(null);

    // Voeg gebruikersbericht toe
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Bereid berichten voor API voor
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // Roep chat API aan
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kon bericht niet versturen");
      }

      // Verwerk streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Maak placeholder voor assistent bericht
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

      // Stream de response
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
      const errorMessage = err instanceof Error ? err.message : "Er ging iets mis";
      setError(errorMessage);
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chat-history");
  };

  return (
    <>
      {/* Chat Toggle Knop */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-br from-accent-primary to-accent-secondary text-white rounded-full shadow-lg"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Venster */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-bg-primary border border-border rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">AI Assistent</h3>
                  <p className="text-xs text-white/80">
                    {isLoading ? "Aan het typen..." : "Online"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Berichten */}
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
                            ? "bg-accent-primary text-white"
                            : "bg-surface text-text-primary"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-surface p-3 rounded-2xl">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
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
                      placeholder={placeholder}
                      rows={1}
                      className="flex-1 px-4 py-2 bg-surface border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="p-2 bg-accent-primary text-white rounded-xl disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs text-text-tertiary">
                    <span>Enter om te versturen</span>
                    {messages.length > 1 && (
                      <button type="button" onClick={clearHistory}>
                        Geschiedenis wissen
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

---

## Streaming Responses Implementeren

Streaming is cruciaal voor een goede gebruikerservaring. In plaats van te wachten op de complete response, zien gebruikers tekst in real-time verschijnen.

### Hoe Streaming Werkt

```typescript
// De OpenAI API retourneert chunks zoals:
// data: {"choices":[{"delta":{"content":"Hallo"}}]}
// data: {"choices":[{"delta":{"content":" daar"}}]}
// data: {"choices":[{"delta":{"content":"!"}}]}
// data: [DONE]

// We verwerken elke chunk en updaten de UI incrementeel
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  // Update bericht content met nieuwe chunk
  setMessages((prev) =>
    prev.map((m) =>
      m.id === currentMessageId
        ? { ...m, content: m.content + chunk }
        : m
    )
  );
}
```

### Voordelen van Streaming

1. **Ervaren Snelheid**: Gebruikers zien response onmiddellijk
2. **Betere UX**: Voelt meer als natuurlijk gesprek
3. **Vroege Feedback**: Gebruikers kunnen onderbreken als response verkeerd is
4. **Lager Geheugen**: Geen buffering van hele response nodig

---

## System Prompts en Context

De system prompt is cruciaal voor het definiëren van je AI's persoonlijkheid en kennis.

### Stap 5: Een Effectieve System Prompt Maken

```typescript
const SYSTEM_PROMPT = `Je bent een behulpzame AI-assistent voor [Jouw Naam]'s portfolio website.

## Over [Jouw Naam]
- Full-stack developer met X jaar ervaring
- Specialiseert in [technologieën]
- Gevestigd in [locatie]
- Beschikbaar voor [diensten]

## Jouw Persoonlijkheid
- Vriendelijk en professioneel
- Beknopt maar behulpzaam
- Enthousiast over technologie

## Richtlijnen
1. Beantwoord vragen over vaardigheden, ervaring en diensten
2. Help bezoekers navigeren door het portfolio
3. Stel voor een consultatie te boeken voor gedetailleerde discussies
4. Als onzeker, raad aan direct contact op te nemen
5. Houd antwoorden tot 2-3 paragrafen tenzij meer detail wordt gevraagd

## Kennisbank
- Diensten: Webontwikkeling, consulting, code review
- Technologieën: React, Next.js, TypeScript, Node.js
- Recente projecten: [korte beschrijvingen]

## Te Vermijden
- Informatie verzinnen die je niet hebt
- Concurrenten negatief bespreken
- Specifieke prijzen geven (stel consultatie voor)
- Persoonlijke contactgegevens delen (gebruik contactformulier)`;
```

---

## Rate Limiting en Beveiliging

### Stap 6: Productie-Klare Rate Limiting met Redis

```typescript
// lib/rate-limit.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function rateLimit(
  identifier: string,
  limit: number = 20,
  window: number = 60
): Promise<{ success: boolean; remaining: number }> {
  const key = `rate-limit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - window;

  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zcard(key);

  if (count >= limit) {
    return { success: false, remaining: 0 };
  }

  await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  await redis.expire(key, window);

  return { success: true, remaining: limit - count - 1 };
}
```

### Stap 7: Input Sanitization

```typescript
// lib/sanitize.ts
export function sanitizeInput(input: string): string {
  const cleaned = input
    .replace(/```[\s\S]*?```/g, "") // Verwijder code blocks
    .replace(/\[INST\]|\[\/INST\]/gi, "") // Verwijder instructie markers
    .replace(/system:|assistant:|user:/gi, "") // Verwijder rol markers
    .trim();

  return cleaned.slice(0, 1000);
}
```

---

## Kosten Optimalisatie

### Het Juiste Model Kiezen

| Model | Kosten per 1K tokens | Beste Voor |
|-------|---------------------|------------|
| GPT-4 Turbo | €0.01 input / €0.03 output | Complexe gesprekken |
| GPT-3.5 Turbo | €0.0005 input / €0.0015 output | Simpele Q&A |

### Geschatte Maandelijkse Kosten

Voor een portfolio met ~1000 chat interacties/maand:
- **GPT-4 Turbo**: ~€15-30/maand
- **GPT-3.5 Turbo**: ~€1-3/maand

Begin met GPT-3.5 en upgrade indien nodig.

---

## Best Practices en Optimalisatie

### 1. Typing Indicator Debounce

```typescript
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
import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/ui/ChatWidget").then((mod) => mod.ChatWidget),
  { loading: () => null, ssr: false }
);
```

### 3. Token Gebruik Optimaliseren

```typescript
function summarizeConversation(messages: Message[]): Message[] {
  if (messages.length <= 6) return messages;

  const summary = messages.slice(0, -4).map((m) => m.content).join(" ");
  
  return [
    {
      id: "summary",
      role: "assistant",
      content: `Eerdere gesprek samenvatting: ${summary.slice(0, 500)}...`,
      timestamp: new Date(),
    },
    ...messages.slice(-4),
  ];
}
```

### 4. Toegankelijkheid

```typescript
<div
  role="log"
  aria-live="polite"
  aria-label="Chat berichten"
>
  {messages.map((message) => (
    <div
      key={message.id}
      role="article"
      aria-label={`${message.role === "user" ? "Gebruiker" : "Assistent"} bericht`}
    >
      {message.content}
    </div>
  ))}
</div>
```

---

## Conclusie

Het bouwen van een AI chat widget omvat:

1. **Backend**: Beveiligde API route met streaming
2. **Frontend**: Responsive, geanimeerde chat UI
3. **UX**: Real-time streaming voor natuurlijk gevoel
4. **Beveiliging**: Rate limiting en input sanitization
5. **Persistentie**: Local storage voor geschiedenis
6. **Analytics**: Volg gebruik en fouten

Het resultaat is een professionele, engagerende feature die je portfolio onderscheidt en echte waarde biedt aan bezoekers.

---

## Bronnen

- [OpenAI API Documentatie](https://platform.openai.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Framer Motion](https://www.framer.com/motion/)
