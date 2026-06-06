"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Flame,
  Bot,
  Calendar,
  Award,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

export default function StudentDashboard() {
  const [studyStreak] = useState(5); // 5 days streak

  // Mock student stats
  const stats = {
    averageQuizScore: 84,
    completedLessons: 12,
    rank: "Chem Alchemist",
    level: 4,
    xpProgress: 65, // 65% of level 4 completed
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-card border border-border shadow-sm gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back to the <span className="text-teal-accent">Study Hall</span>!
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track your progress, chat with AI, and master your NCERT chapters.
          </p>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-3 bg-saffron-light border border-saffron/20 px-5 py-3 rounded-2xl">
          <Flame className="text-saffron w-6 h-6 animate-pulse" />
          <div>
            <h4 className="font-extrabold text-saffron-dark text-lg leading-tight">
              {studyStreak} Day Streak!
            </h4>
            <p className="text-[10px] text-saffron-dark/80 font-medium">
              Keep it up to unlock double XP!
            </p>
          </div>
        </div>
      </div>

      {/* Gamified Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Mascot & Level Tracking (Col Span 2) */}
        <div className="bento-card md:col-span-2 p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-light text-3xl flex items-center justify-center border border-teal-accent/20 animate-bounce-slow text-teal-accent">
              🦉
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-teal-accent bg-teal-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                Mascot: Vidya
              </span>
              <p className="text-foreground font-semibold text-base mt-2.5 leading-relaxed">
                "You're only <span className="text-saffron">350 XP</span> away from reaching Level 5!
                Try taking the **Class 10 Chemical Reactions Quiz** today to claim your bonus."
              </p>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <GraduationCap size={16} className="text-teal-accent" />
                Level {stats.level} ({stats.rank})
              </span>
              <span>{stats.xpProgress}% to Level {stats.level + 1}</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron rounded-full transition-all duration-500"
                style={{ width: `${stats.xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: AI Q&A Quick launcher (Col Span 1) */}
        <div className="bento-card p-6 rounded-2xl bg-teal-accent text-white flex flex-col justify-between hover:bg-teal-dark transition-colors">
          <div>
            <Bot className="w-8 h-8 text-teal-light" />
            <h3 className="font-extrabold text-xl mt-3">NCERT AI Assistant</h3>
            <p className="text-teal-light/80 text-xs mt-1.5 leading-relaxed">
              Ask questions directly from your textbooks. Generates answers complete with page-specific citations.
            </p>
          </div>
          <Link
            href="/dashboard/rag"
            className="mt-6 w-full py-2.5 rounded-xl bg-white text-teal-accent text-center font-bold text-sm hover:scale-[1.02] transition-transform shadow-md flex items-center justify-center gap-2"
          >
            Launch Chatbot <ArrowRight size={14} />
          </Link>
        </div>

        {/* Card 3: Upcoming Assignments (Col Span 1) */}
        <div className="bento-card p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div>
            <Calendar className="w-6 h-6 text-saffron" />
            <h3 className="font-extrabold text-lg mt-3">Next Assignment</h3>
            <div className="mt-4 p-3 rounded-xl bg-saffron-light border border-saffron/10">
              <h4 className="font-bold text-saffron-dark text-sm">Carbon & Its Compounds</h4>
              <p className="text-[10px] text-saffron-dark/80 mt-1">Due in 2 days (June 8, 2026)</p>
            </div>
          </div>
          <Link
            href="/dashboard/assignments"
            className="mt-6 text-center text-xs font-bold text-saffron hover:underline flex items-center justify-center gap-1.5"
          >
            Submit Assignment <ArrowRight size={12} />
          </Link>
        </div>

        {/* Card 4: Practice Quizzes Tracker (Col Span 2) */}
        <div className="bento-card md:col-span-2 p-6 rounded-2xl bg-card border border-border flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-accent" /> Recent Quiz Scores
              </h3>
              <Link href="/dashboard/quizzes" className="text-xs font-bold text-teal-accent hover:underline">
                View All
              </Link>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-gray border border-border text-center flex flex-col justify-center items-center">
                <span className="text-2xl font-black text-teal-accent flex items-center gap-1">
                  <TrendingUp size={18} className="text-teal-accent" />
                  {stats.averageQuizScore}%
                </span>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                  Average Accuracy
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-gray border border-border text-center flex flex-col justify-center items-center">
                <span className="text-2xl font-black text-saffron">{stats.completedLessons}</span>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                  Lessons Mastered
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-teal-light/20 border border-teal-accent/10 flex items-center justify-between text-xs">
            <span className="font-medium text-teal-dark">🔥 Daily practice complete! (+50 XP claimed)</span>
            <span className="font-bold text-teal-accent">Claimed</span>
          </div>
        </div>

        {/* Card 5: Micro-community Quick Card (Col Span 3) */}
        <div className="bento-card md:col-span-3 p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-gray border border-border flex items-center justify-center text-teal-accent shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Study Community Hub</h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Join discussions, clear doubts with peers, and share notes with classmates.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/community"
            className="px-5 py-2.5 rounded-xl bg-slate-gray border border-border text-xs font-bold hover:bg-teal-accent hover:text-white transition-colors"
          >
            Enter Community board
          </Link>
        </div>
      </div>
    </div>
  );
}
