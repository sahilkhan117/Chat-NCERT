"use client";

import { useState, useEffect, useRef } from "react";
import { Book, Sparkles, Send, BookOpen, ExternalLink, X, Compass, Lightbulb, HelpCircle, ArrowRight } from "lucide-react";

interface Citation {
  documentTitle: string;
  page: number;
  paragraph: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export default function RAGPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (userMessageText: string) => {
    const userMessage = userMessageText.trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://chat-ncert-api.sahilkhan123098p.workers.dev";
      const response = await fetch(`${apiBase}/api/v1/rag/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sk_live_mock_dev_key",
        },
        body: JSON.stringify({ question: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            citations: data.citations,
          },
        ]);
      } else {
        throw new Error("API error response");
      }
    } catch {
      // Instant Fallback mock if server connection fails
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here is a simulated response about **"${userMessage}"**.\n\nChemical reactions involve the breaking and making of bonds between atoms to produce new substances. For instance, when magnesium ribbon burns in oxygen, it gets converted to magnesium oxide. This is a classic combination reaction!`,
          citations: [
            {
              documentTitle: "Class 10 Science - Chapter 1.pdf",
              page: 4,
              paragraph: "Magnesium ribbon burning in oxygen...",
            },
            {
              documentTitle: "Class 10 Science - Chapter 1.pdf",
              page: 5,
              paragraph: "Combination reaction details...",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Suggested Prompts
  const suggestedPrompts = [
    {
      text: "Explain displacement reactions step-by-step.",
      icon: Compass,
      color: "text-teal-accent bg-teal-light/20"
    },
    {
      text: "What is Lenz's Law and how to apply it?",
      icon: Lightbulb,
      color: "text-saffron bg-saffron-light/20"
    },
    {
      text: "Give me a summary of Class 10 Science Chapter 1.",
      icon: BookOpen,
      color: "text-[#ec4899] bg-[#ec4899]/10"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] relative">
      
      {/* Top Source Tracker Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b  border-neutral-500/20 px-2">
        <div className="flex items-center gap-2">
          <Book className="text-teal-accent w-4 h-4" />
          <span className="text-xs font-semibold text-muted-foreground">
            Reference Source: <span className="text-foreground">Class 10 Science</span>
          </span>
        </div>
        <span className="text-[9px] font-extrabold uppercase bg-teal-light text-teal-accent px-2 py-0.5 rounded-full border border-teal-accent/15 tracking-wider flex items-center gap-1">
          <Sparkles size={10} className="animate-pulse" /> 768-dim pgvector indexing active
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-24">
        
        {messages.length === 0 ? (
          /* Gemini-style Greetings (Zero State) */
          <div className="py-16 text-left space-y-8 animate-in fade-in duration-700">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-teal-accent via-[#00ffca] to-saffron bg-clip-text text-transparent">
                  Hello, Arjun
                </span>
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-muted-foreground/80 leading-snug">
                How can I help your studies today?
              </h3>
            </div>

            {/* Suggested Prompts Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {suggestedPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="p-5 rounded-2xl bg-card/45 border  border-neutral-500/30 hover:border-teal-accent/30 hover:bg-slate-gray/30 text-left transition-all duration-300 group hover:scale-[1.01] flex flex-col justify-between h-36"
                    type="button"
                  >
                    <div className={`p-2 rounded-xl w-fit ${prompt.color} group-hover:scale-105 transition-transform`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex items-center justify-between mt-4 w-full">
                      <p className="text-xs font-bold text-foreground/90 leading-snug pr-2">
                        {prompt.text}
                      </p>
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-teal-accent shrink-0 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Messages Log */
          <div className="space-y-8 pt-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in duration-300`}
              >
                {/* Assistant icon */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center text-sm shrink-0">
                    🦉
                  </div>
                )}

                {/* Message Bubble */}
                <div className="max-w-2xl flex flex-col">
                  {msg.role === "user" ? (
                    <div className="bg-slate-gray/60 border  border-neutral-500/20 p-4 rounded-3xl text-sm leading-relaxed text-foreground rounded-tr-none shadow-sm">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ) : (
                    /* Gemini-style borderless clean text assistant */
                    <div className="space-y-4 text-sm leading-relaxed text-foreground/90 font-light pr-4">
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Dynamic citations capsule layout */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t  border-neutral-500/10 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <BookOpen size={10} /> Referenced NCERT Sources
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((cite, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => setActiveCitation(cite)}
                                className="px-3 py-1.5 bg-card/45 hover:bg-teal-accent hover:text-white text-[10px] font-bold text-teal-accent rounded-full border border-teal-accent/25 shadow-sm transition-all flex items-center gap-1.5"
                                type="button"
                              >
                                {cite.documentTitle} (Page {cite.page})
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-xs shrink-0 animate-bounce">
                  🦉
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground leading-none">Vidya is searching chapters...</span>
                  <div className="flex gap-1.5 items-center mt-2.5">
                    <div className="size-1.5 bg-teal-accent rounded-full animate-bounce" />
                    <div className="size-1.5 bg-teal-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="size-1.5 bg-teal-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Bar (Gemini-style rounded capsule) */}
      <div className="absolute bottom-4 left-0 right-0 px-2 bg-gradient-to-t from-background via-background/90 to-transparent pt-6 pb-2">
        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto">
          <div className="relative bg-card/65 backdrop-blur-md border  border-neutral-500/40 rounded-full py-2.5 pl-6 pr-2.5 flex items-center shadow-lg focus-within:border-teal-accent/40 focus-within:ring-1 focus-within:ring-teal-accent/15 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Vidya anything about Class 10 Science..."
              className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-foreground placeholder:text-muted-foreground/50 pr-12"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-teal-accent hover:bg-teal-dark disabled:opacity-50 text-white p-2.5 rounded-full transition-all shrink-0 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send size={12} className="translate-x-[0.5px]" />
            </button>
          </div>
          <p className="text-[9px] text-center text-muted-foreground/60 font-semibold mt-2.5">
            Vidya displays references using pgvector embeddings. Verify critical facts.
          </p>
        </form>
      </div>

      {/* Citation Context Modal */}
      {activeCitation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 z-55 animate-in fade-in duration-200">
          <div className="bg-card border  border-neutral-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveCitation(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-transform"
              type="button"
              aria-label="Close citation"
            >
              <X size={18} />
            </button>
            <span className="text-[10px] font-bold text-teal-accent bg-teal-light px-2.5 py-1 rounded-full uppercase tracking-wider">
              Citation Context
            </span>
            <h3 className="font-extrabold text-base mt-3 text-foreground">
              {activeCitation.documentTitle}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Reference Location: Page {activeCitation.page}</p>
            <div className="mt-4 p-4 rounded-xl bg-slate-gray border  border-neutral-500/30 text-xs leading-relaxed italic text-muted-foreground">
              "... {activeCitation.paragraph} ..."
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-2 rounded-xl bg-slate-gray hover:bg-muted font-bold text-xs text-foreground transition-colors"
                type="button"
              >
                Close View
              </button>
              <a
                href={`http://localhost:8787/api/v1/rag/pdf/${activeCitation.documentTitle}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                Open Full PDF <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
