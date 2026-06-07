"use client";

export const runtime = "edge";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Flame, ChevronLeft, ChevronRight, Clock, Award, Star } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export default function QuizTakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Mock quiz questions
  const quizTitle = "Chemical Reactions and Equations";
  const questions: Question[] = [
    {
      id: "q1",
      text: "Which of the following is a displacement reaction?",
      options: [
        "CaCO3 → CaO + CO2",
        "2H2 + O2 → 2H2O",
        "Fe + CuSO4 → FeSO4 + Cu",
        "NaOH + HCl → NaCl + H2O",
      ],
      correctIndex: 2,
    },
    {
      id: "q2",
      text: "What happens when dilute hydrochloric acid is added to iron filings?",
      options: [
        "Hydrogen gas and iron chloride are produced.",
        "Chlorine gas and iron hydroxide are produced.",
        "No reaction takes place.",
        "Iron salt and water are produced.",
      ],
      correctIndex: 0,
    },
    {
      id: "q3",
      text: "Which of the following is an endothermic process?",
      options: [
        "Dilution of sulphuric acid",
        "Sublimation of dry ice",
        "Condensation of water vapours",
        "Respiration in living organisms",
      ],
      correctIndex: 1,
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes total
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft <= 0 || finished) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  // Formatter for MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSelectOption = (optIdx: number) => {
    const qId = questions[currentIdx].id;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setFinished(true);
  };

  // Render Finished Summary Card
  if (finished) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-2xl bg-card border border-border text-center shadow-lg space-y-6">
        <Trophy className="mx-auto text-saffron w-16 h-16 animate-bounce" />
        <div>
          <h2 className="text-3xl font-black text-foreground leading-tight">Quiz Completed!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Excellent effort. You completed the practice test for:
          </p>
          <h3 className="font-extrabold text-teal-accent text-base mt-2">{quizTitle}</h3>
        </div>

        {/* Gamified XP and Score boxes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-gray border border-border flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-teal-accent flex items-center gap-1">
              <Award size={20} />
              {score}%
            </span>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
              Final Score
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-gray border border-border flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-saffron flex items-center gap-1">
              <Star size={20} className="fill-saffron text-saffron" />+{score * 5} XP
            </span>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
              Study Hall Points
            </p>
          </div>
        </div>

        {/* Action navigation buttons */}
        <div className="flex gap-4 pt-4">
          <Link
            href="/dashboard/quizzes"
            className="flex-1 py-3 rounded-xl bg-slate-gray hover:bg-muted border border-border font-bold text-xs text-foreground transition-colors"
          >
            Practice Board
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3 rounded-xl bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs transition-colors"
          >
            Study Hall Home
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);
  const selectedOption = selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top bar with timer & progress */}
      <div className="p-4 rounded-2xl bg-card border border-border flex justify-between items-center shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-teal-accent uppercase tracking-wider">
            Quiz Mode
          </span>
          <h4 className="font-bold text-sm leading-tight text-foreground">{quizTitle}</h4>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-saffron-light border border-saffron/20 text-saffron-dark font-extrabold text-sm">
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
          <span>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-accent rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        <h3 className="font-extrabold text-lg leading-snug">{currentQuestion.text}</h3>

        {/* Options list */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                  isSelected
                    ? "bg-teal-light/30 border-teal-accent text-teal-dark scale-[1.01]"
                    : "bg-slate-gray border-border hover:border-teal-accent/30 text-foreground"
                }`}
                type="button"
              >
                <span
                  className={`inline-block w-6 h-6 rounded-lg text-xs font-bold mr-3 text-center leading-6 border ${
                    isSelected
                      ? "bg-teal-accent border-teal-accent text-white"
                      : "bg-white border-border text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Card Actions Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <button
            onClick={handleBack}
            disabled={currentIdx === 0}
            className="px-4 py-2.5 rounded-xl border border-border bg-slate-gray hover:bg-muted font-bold text-xs disabled:opacity-50 text-foreground transition-colors flex items-center gap-1.5"
            type="button"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="px-5 py-2.5 rounded-xl bg-saffron hover:bg-saffron-dark disabled:bg-muted disabled:text-muted-foreground text-foreground font-black text-xs transition-colors flex items-center gap-1.5"
              type="button"
            >
              Submit Test <Award size={16} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              type="button"
            >
              Next Question <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
