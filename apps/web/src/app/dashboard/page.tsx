"use client";

import Link from "next/link";
import { useState, useRef, MouseEvent } from "react";
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
  ArrowRightCircle,
  HelpCircle,
  MessageSquare,
  Search,
} from "lucide-react";

interface TiltStyle {
  transform: string;
}

export default function StudentDashboard() {
  const [studyStreak] = useState(7);
  const [hoverStyles, setHoverStyles] = useState<{ [key: string]: TiltStyle }>({});

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-neutral-500/30">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, Arjun! 👋
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base mt-1.5 font-medium">
            Let's crush today's syllabus goals and elevate your rank.
          </p>
        </div>
        <Link
          href="/dashboard/rag"
          className="flex items-center gap-2 bg-card hover:bg-slate-gray border border-neutral-500/30 shadow-sm px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
        >
          <Search size={14} className="text-muted-foreground" />
          <span>Search NCERT...</span>
        </Link>
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
          <div className="absolute -right-4 -top-4 size-24 bg-saffron/10 rounded-full blur-xl group-hover:bg-saffron/20 transition-colors"></div>
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
              backgroundImage: `url("https://lh3.googleusercontent.com/aida/AP1WRLtg0wle-v_eMFcSO0B7WLX5wYWHK4_xxJHuM8BbwPCL55Srf1CAsYdbPMWk1Ah-mUQxP5l_myFOlwdVOMtluYRhKizqr-lxwQkiAHOVDCasU2WSrqpzxOg7qphggMerhks7eG-ALM7BklL4_cXBpvUNZLcCtQRb7wP-RgsxKXPq9S74rRciKezZVbAkIt3TnHRdyWCnOHez8qg_7P6Ie7keiR7ttRDmwQ9I1xkeG0fsfWNHGRdGF2uzQrt6")`,
            }}
          ></div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-10 -right-10 size-64 bg-teal-accent/5 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Jump: Physics (1x1) */}
        <div
          onMouseMove={(e) => handleMouseMove(e, "physics")}
          onMouseLeave={() => handleMouseLeave("physics")}
          style={hoverStyles["physics"]}
          className="bg-card rounded-2xl border border-neutral-500/30 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 ease-out relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-radial from-teal-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-saffron/10 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
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
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
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
              className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-gray/50 border border-transparent hover:border-border transition-all cursor-pointer"
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
              className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-gray/50 border border-transparent hover:border-border transition-all cursor-pointer"
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
              className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-gray/50 border border-transparent hover:border-border transition-all cursor-pointer"
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
    </div>
  );
}
