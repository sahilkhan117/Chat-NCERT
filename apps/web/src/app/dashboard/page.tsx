"use client";

import Link from "next/link";
import { useState, MouseEvent } from "react";
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Brain,
  Calculator,
  Compass,
  HelpCircle,
  Search,
  X,
  ExternalLink
} from "lucide-react";

interface TiltStyle {
  transform: string;
}

export default function StudentDashboard() {
  const [studyStreak] = useState(7);
  const [hoverStyles, setHoverStyles] = useState<{ [key: string]: TiltStyle }>({});
  
  // pgvector Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchAnswer, setSearchAnswer] = useState("");
  const [searchCitations, setSearchCitations] = useState<any[]>([]);
  const [activeCitation, setActiveCitation] = useState<any | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3; // max 3 degrees
    const rotateY = ((x - centerX) / centerX) * 3;

    setHoverStyles((prev) => ({
      ...prev,
      [cardId]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
      },
    }));
  };

  const handleMouseLeave = (cardId: string) => {
    setHoverStyles((prev) => ({
      ...prev,
      [cardId]: {
        transform: "",
      },
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    setSearchAnswer("");
    setSearchCitations([]);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://chat-ncert-api.sahilkhan123098p.workers.dev";
      const response = await fetch(`${apiBase}/api/v1/rag/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sk_live_mock_dev_key",
        },
        body: JSON.stringify({ question: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchAnswer(data.answer);
        setSearchCitations(data.citations || []);
      } else {
        throw new Error("Search failed");
      }
    } catch {
      // Mock fallback when local dev server is offline
      setTimeout(() => {
        setSearchAnswer(
          `This is a simulated semantic response for **"${searchQuery}"**.\n\nWe found matching references inside Class 10 Science textbooks regarding chemical laws and equations. When balancing chemical equations, ensure coefficients are applied to whole formulas rather than modifying subscripts.`
        );
        setSearchCitations([
          {
            documentTitle: "Class 10 Science - Chapter 1.pdf",
            page: 4,
            paragraph: "Balancing equations and chemical combinations...",
          },
          {
            documentTitle: "Class 10 Science - Chapter 1.pdf",
            page: 6,
            paragraph: "The law of conservation of mass states that mass can neither be created nor destroyed...",
          },
        ]);
      }, 1000);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b  border-neutral-500/40">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, Arjun! 👋
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base mt-1.5 font-medium">
            Let's crush today's syllabus goals and elevate your rank.
          </p>
        </div>
        <button
          onClick={() => {
            setIsSearchOpen(true);
            setSearchQuery("");
            setSearchAnswer("");
            setSearchCitations([]);
          }}
          className="flex items-center gap-2 bg-card hover:bg-slate-gray border border-neutral-500/30 shadow-sm px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <Search size={14} className="text-muted-foreground" />
          <span>Search NCERT...</span>
        </button>
      </header>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Streak Widget (1x1) */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "streak")}
          onMouseLeave={() => handleMouseLeave("streak")}
          style={hoverStyles["streak"]}
          className="bg-card rounded-2xl border border-neutral-500/30 shadow-sm p-6 flex flex-col justify-between transition-all duration-300 ease-out relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute -right-4 -top-4 size-24 bg-saffron/10 rounded-full blur-xl group-hover:bg-saffron/20 transition-colors" />
          <div className="flex items-center justify-between z-10">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Daily Streak
            </h3>
            <Flame className="text-saffron w-7 h-7 fill-saffron animate-pulse" />
          </div>
          <div className="z-10 mt-6">
            <p className="text-4xl font-black text-foreground">
              {studyStreak} <span className="text-sm text-muted-foreground font-semibold">Days</span>
            </p>
            <p className="text-[11px] text-saffron font-bold mt-1">
              On fire! Keep it up.
            </p>
          </div>
        </div>

        {/* Mascot Greeting (2x2) */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "mascot")}
          onMouseLeave={() => handleMouseLeave("mascot")}
          style={hoverStyles["mascot"]}
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-teal-light/20 to-teal-light/5 rounded-2xl shadow-sm p-8 flex flex-col sm:flex-row items-center justify-between border border-teal-accent/25 relative overflow-hidden transition-all duration-300 ease-out cursor-pointer group"
        >
          <div className="flex-1 pr-0 sm:pr-6 z-10 flex flex-col h-full justify-center text-center sm:text-left">
            <span className="inline-block px-3 py-1 bg-white dark:bg-card border border-teal-accent/10 text-teal-accent text-[10px] font-bold rounded-full mb-4 w-fit mx-auto sm:mx-0 shadow-sm">
              Level 12 Scholar
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground mb-3 leading-tight">
              Ready to tackle Physics Chapter 4?
            </h2>
            <p className="text-muted-foreground text-xs lg:text-sm mb-6 max-w-sm">
              You left off at <span className="font-bold text-foreground">"Moving Charges and Magnetism"</span>. The AI tutor is prepped with your past questions.
            </p>
            <Link
              href="/dashboard/rag"
              className="bg-teal-accent text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-teal-dark hover:-translate-y-0.5 transition-all w-fit mx-auto sm:mx-0 flex items-center gap-2"
            >
              <span>Resume Lesson</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div
            className="w-40 h-40 bg-contain bg-no-repeat bg-center z-10 mt-6 sm:mt-0 shrink-0 transform group-hover:scale-105 transition-transform duration-500"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80")`,
            }}
          />
          <div className="absolute -bottom-10 -right-10 size-64 bg-teal-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Quick Jump: Physics (1x1) */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "physics")}
          onMouseLeave={() => handleMouseLeave("physics")}
          style={hoverStyles["physics"]}
          className="bg-card rounded-2xl border border-neutral-500/30 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 ease-out relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-radial from-teal-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="z-10 bg-teal-light/30 text-teal-accent w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <Compass size={20} />
          </div>
          <div className="z-10 mt-6">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
              CH 4 • Science
            </p>
            <h3 className="font-extrabold text-foreground text-lg leading-tight">
              Physics
            </h3>
            <div className="w-full bg-slate-gray border border-neutral-500/30 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-teal-accent h-full w-[65%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Quick Jump: Math (1x1) */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "math")}
          onMouseLeave={() => handleMouseLeave("math")}
          style={hoverStyles["math"]}
          className="bg-card rounded-2xl border border-neutral-500/30 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 ease-out relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-saffron/10 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform" />
          <div className="z-10 bg-saffron-light border border-saffron/10 text-saffron-dark w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <Calculator size={20} />
          </div>
          <div className="z-10 mt-6">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
              CH 6 • Maths
            </p>
            <h3 className="font-extrabold text-foreground text-lg leading-tight">
              Mathematics
            </h3>
            <div className="w-full bg-slate-gray border border-neutral-500/30 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-saffron h-full w-[30%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Daily Quiz CTA (2x1) */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "daily-quiz")}
          onMouseLeave={() => handleMouseLeave("daily-quiz")}
          style={hoverStyles["daily-quiz"]}
          className="md:col-span-2 bg-ink text-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between border border-neutral-500/30/10 relative overflow-hidden transition-all duration-300 ease-out cursor-pointer group"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="z-10 text-center sm:text-left mb-4 sm:mb-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Flame size={16} className="text-saffron fill-saffron animate-bounce" />
              <span className="text-saffron text-[10px] font-extrabold uppercase tracking-wider">
                Time Sensitive
              </span>
            </div>
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              Take your Daily NCERT Quiz
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Earn 50 XP and protect your streak today.
            </p>
          </div>
          <Link
            href="/dashboard/quizzes"
            className="z-10 bg-saffron hover:bg-saffron-dark text-foreground font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 shrink-0"
          >
            Start Quiz
          </Link>
        </div>

        {/* Recent Activity (2x2) */}
        <div className="md:col-span-2 md:row-span-2 bg-card rounded-2xl border border-neutral-500/30 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-foreground text-base flex items-center gap-2">
              <Brain size={18} className="text-teal-accent" /> Recent AI Queries
            </h3>
            <Link
              href="/dashboard/rag"
              className="text-teal-accent text-xs font-bold hover:underline"
            >
              View Chat
            </Link>
          </div>
          
          <div className="flex-grow flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Activity Item 1 */}
            <Link
              href="/dashboard/rag"
              className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-gray/50 border border-transparent hover: border-neutral-500/30 transition-all cursor-pointer"
            >
              <div className="size-9 rounded-xl bg-teal-light/20 border border-teal-accent/15 flex items-center justify-center text-teal-accent shrink-0 mt-0.5">
                <HelpCircle size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1 leading-snug">
                  Explain Faraday's Law of Induction simply.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-slate-gray border border-neutral-500/30 text-muted-foreground px-2 py-0.5 rounded-full font-bold">
                    Physics
                  </span>
                  <span className="text-[9px] text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </Link>

            {/* Activity Item 2 */}
            <Link
              href="/dashboard/rag"
              className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-gray/50 border border-transparent hover: border-neutral-500/30 transition-all cursor-pointer"
            >
              <div className="size-9 rounded-xl bg-saffron-light/20 border border-saffron/15 flex items-center justify-center text-saffron-dark shrink-0 mt-0.5">
                <Calculator size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1 leading-snug">
                  Step-by-step solution for Exercise 6.2, Q4.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-slate-gray border border-neutral-500/30 text-muted-foreground px-2 py-0.5 rounded-full font-bold">
                    Math
                  </span>
                  <span className="text-[9px] text-muted-foreground">Yesterday</span>
                </div>
              </div>
            </Link>

            {/* Activity Item 3 */}
            <Link
              href="/dashboard/rag"
              className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-gray/50 border border-transparent hover: border-neutral-500/30 transition-all cursor-pointer"
            >
              <div className="size-9 rounded-xl bg-teal-light/20 border border-teal-accent/15 flex items-center justify-center text-teal-accent shrink-0 mt-0.5">
                <Compass size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1 leading-snug">
                  Summary of Cell Division process.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-slate-gray border border-neutral-500/30 text-muted-foreground px-2 py-0.5 rounded-full font-bold">
                    Biology
                  </span>
                  <span className="text-[9px] text-muted-foreground">2 days ago</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* pgvector Search Modal Overlay (Frosted Glassmorphic) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex justify-center pt-24 px-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card/75 border  border-neutral-500/40 backdrop-blur-lg w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Close button */}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:scale-110 transition-transform"
              type="button"
              aria-label="Close search"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-teal-light text-teal-accent rounded-lg">
                <Brain size={16} />
              </div>
              <h3 className="font-extrabold text-sm text-foreground">
                NCERT pgvector Semantic Search
              </h3>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a topic to search semantically (e.g. displacement reactions)"
                  className="flex-grow px-4 py-3 bg-slate-gray rounded-xl border  border-neutral-500/40 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-teal-accent"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isSearching}
                  className="px-5 py-3 bg-teal-accent hover:bg-teal-dark disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {/* Results Log Container */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {isSearching && (
                <div className="text-center py-8 space-y-2 animate-pulse">
                  <div className="w-8 h-8 border-2 border-teal-accent border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-muted-foreground font-semibold">Querying 768-dim pgvector textbook embeddings...</p>
                </div>
              )}

              {/* AI Quick Answer */}
              {searchAnswer && (
                <div className="p-4 rounded-xl bg-teal-accent/5 border border-teal-accent/20 space-y-1.5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-1.5 text-teal-accent text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles size={12} /> AI Study Assistant Answer
                  </div>
                  <p className="text-xs text-foreground leading-relaxed font-light whitespace-pre-wrap">{searchAnswer}</p>
                </div>
              )}

              {/* Citations / Textbook matches */}
              {searchCitations.length > 0 && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <h4 className="text-foreground text-[10px] font-bold uppercase tracking-wider px-1">Matching Textbook Paragraphs</h4>
                  <div className="grid gap-3">
                    {searchCitations.map((cite, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveCitation(cite)}
                        className="p-3.5 rounded-xl bg-card border  border-neutral-500/40 hover:border-teal-accent/30 hover:scale-[1.01] transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] bg-slate-gray px-2 py-0.5 rounded-md font-semibold text-muted-foreground">
                            {cite.documentTitle}
                          </span>
                          <span className="text-[9px] text-teal-accent font-extrabold uppercase tracking-wide">
                            Page {cite.page}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">"... {cite.paragraph} ..."</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isSearching && !searchAnswer && searchQuery.trim() && (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Press enter or click Search to run semantic similarity queries.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Citation Preview Modal */}
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
