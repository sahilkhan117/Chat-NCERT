"use client";

import { useState } from "react";
import { Book, Sparkles, Send, BookOpen, ExternalLink, X } from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Vidya, your NCERT study assistant. Ask me any question from your textbooks, and I'll find the exact answers with citations for you! 🦉",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8787/api/v1/rag/query", {
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
      // Fallback mock if server is not active
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Here is a simulated response about: **${userMessage}**. \n\nChemical reactions involve the breaking and making of bonds between atoms to produce new substances. For instance, when magnesium ribbon burns in oxygen, it gets converted to magnesium oxide. This is a classic combination reaction!`,
            citations: [
              {
                documentTitle: "Class 10 Science - Ch 1.pdf",
                page: 4,
                paragraph: "Magnesium ribbon burning in oxygen...",
              },
              {
                documentTitle: "Class 10 Science - Ch 1.pdf",
                page: 5,
                paragraph: "Combination reaction details...",
              },
            ],
          },
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] relative bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Target Book Filter Topbar */}
      <div className="p-4 bg-muted border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Book className="text-teal-accent w-5 h-5" />
          <div>
            <h3 className="font-extrabold text-sm leading-tight text-foreground">
              NCERT Class 10 Science
            </h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Active Reference Source</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold bg-teal-light text-teal-accent rounded-full border border-teal-accent/10 flex items-center gap-1.5">
          <Sparkles size={10} className="animate-pulse" /> 768-dim pgvector index active
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-border ${
                msg.role === "user" ? "bg-teal-accent text-white" : "bg-saffron text-foreground"
              }`}
            >
              {msg.role === "user" ? "S" : "🦉"}
            </div>

            {/* Message Bubble */}
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-teal-accent text-white rounded-tr-none"
                  : "bg-slate-gray text-foreground rounded-tl-none border border-border"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Citations section */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground w-full mb-1">
                    Citations referenced:
                  </span>
                  {msg.citations.map((cite, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => setActiveCitation(cite)}
                      className="px-2.5 py-1.5 bg-card hover:bg-teal-light text-[10px] font-bold text-teal-accent rounded-lg border border-teal-accent/10 shadow-sm transition-all duration-200 flex items-center gap-1"
                      type="button"
                    >
                      <BookOpen size={10} /> {cite.documentTitle} (p. {cite.page})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-9 h-9 rounded-xl bg-saffron text-foreground font-bold flex items-center justify-center animate-bounce">
              🦉
            </div>
            <div className="p-4 rounded-2xl bg-slate-gray text-muted-foreground border border-border text-sm rounded-tl-none">
              <span className="animate-pulse">Vidya is searching NCERT chapters...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Vidya anything (e.g. What is a displacement reaction?)"
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-slate-gray focus:outline-none focus:ring-2 focus:ring-teal-accent text-sm text-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-teal-accent hover:bg-teal-dark disabled:bg-muted disabled:text-muted-foreground text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            Ask <Send size={14} />
          </button>
        </div>
      </form>

      {/* Citation Preview Modal */}
      {activeCitation && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveCitation(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-transform"
              type="button"
            >
              <X size={18} />
            </button>
            <span className="text-[10px] font-bold text-teal-accent bg-teal-light px-2.5 py-1 rounded-full uppercase tracking-wider">
              Citation Context
            </span>
            <h3 className="font-extrabold text-lg mt-3 text-foreground">
              {activeCitation.documentTitle}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Reference Location: Page {activeCitation.page}</p>
            <div className="mt-4 p-4 rounded-xl bg-slate-gray border border-border text-sm leading-relaxed italic text-muted-foreground">
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
