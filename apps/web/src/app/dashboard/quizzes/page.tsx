"use client";

import Link from "next/link";
import { Award, Clock, HelpCircle, Flame, ArrowRight } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  class: string;
  questionCount: number;
  timeLimit: number; // in minutes
  highScore: number | null; // Null if not attempted
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function QuizzesPage() {
  const quizzes: Quiz[] = [
    {
      id: "quiz-1",
      title: "Chemical Reactions and Equations",
      subject: "Science",
      class: "Class 10",
      questionCount: 10,
      timeLimit: 15,
      highScore: 90,
      difficulty: "Medium",
    },
    {
      id: "quiz-2",
      title: "Acids, Bases and Salts",
      subject: "Science",
      class: "Class 10",
      questionCount: 8,
      timeLimit: 12,
      highScore: null,
      difficulty: "Easy",
    },
    {
      id: "quiz-3",
      title: "Carbon and its Compounds",
      subject: "Science",
      class: "Class 10",
      questionCount: 15,
      timeLimit: 25,
      highScore: null,
      difficulty: "Hard",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Practice Quizzes</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Test your knowledge, gain XP points, and rank up your chemistry skills.
          </p>
        </div>
        <div className="bg-saffron/10 border border-saffron/20 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-saffron-dark">
          <Award size={16} />
          <span>Rank: Chem Alchemist (Level 4)</span>
        </div>
      </div>

      {/* Quizzes List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between hover:border-teal-accent/30 transition-all duration-300 transform hover:scale-[1.01]"
          >
            <div>
              {/* Badges row */}
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold bg-slate-gray border border-border px-2.5 py-1 rounded-full uppercase tracking-wider text-muted-foreground">
                  {quiz.subject} • {quiz.class}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    quiz.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : quiz.difficulty === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {quiz.difficulty}
                </span>
              </div>

              {/* Title & Stats */}
              <h3 className="font-extrabold text-lg mt-4 text-foreground leading-tight">
                {quiz.title}
              </h3>
              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {quiz.timeLimit} mins
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle size={12} /> {quiz.questionCount} Questions
                </span>
              </div>
            </div>

            {/* Previous Score and Take button row */}
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground block">
                  PERSONAL BEST
                </span>
                <span className="font-black text-sm text-foreground flex items-center gap-1">
                  <Flame size={14} className="text-saffron" />
                  {quiz.highScore !== null ? `${quiz.highScore}%` : "Not Attempted"}
                </span>
              </div>
              <Link
                href={`/dashboard/quizzes/${quiz.id}`}
                className="px-4 py-2 bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center gap-1.5"
              >
                {quiz.highScore !== null ? "Retake Quiz" : "Start Quiz"} <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
