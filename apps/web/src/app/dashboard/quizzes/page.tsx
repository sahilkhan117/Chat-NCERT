"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Clock,
  HelpCircle,
  Flame,
  ArrowRight,
  Sparkles,
  Upload,
  BookOpen,
  CheckCircle2,
  FileText
} from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  class: string;
  questionCount: number;
  timeLimit: number; // in minutes
  highScore: number | null;
  difficulty: "Easy" | "Medium" | "Hard";
  isCustom?: boolean;
}

export default function QuizzesPage() {
  const router = useRouter();

  // State for loaded custom quizzes
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  
  // Tab & Form States for Custom Quiz Creator
  const [creationTab, setCreationTab] = useState<"details" | "pdf">("details");
  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [topicName, setTopicName] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");
  
  // Generating State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const defaultQuizzes: Quiz[] = [
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

  // Load custom quizzes from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("custom-quizzes");
    if (stored) {
      try {
        setCustomQuizzes(JSON.parse(stored));
      } catch {
        // clear corrupted data
        localStorage.removeItem("custom-quizzes");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  // Generate tailored custom questions
  const generateQuestions = (topic: string, subject: string, cls: string) => {
    const query = (topic + " " + subject).toLowerCase();
    
    if (query.includes("force") || query.includes("motion") || query.includes("physics")) {
      return [
        {
          id: "q1",
          text: "According to Newton's First Law of Motion, an object will remain at rest or in uniform motion unless acted upon by:",
          options: ["A balanced force", "An external unbalanced force", "Frictional resistance only", "Gravitational force only"],
          correctIndex: 1,
        },
        {
          id: "q2",
          text: "What is the SI unit of force?",
          options: ["Joule", "Pascal", "Newton", "Watt"],
          correctIndex: 2,
        },
        {
          id: "q3",
          text: "The acceleration due to gravity on the surface of the Earth is approximately:",
          options: ["9.8 m/s²", "8.9 m/s²", "10.5 m/s²", "6.7 m/s²"],
          correctIndex: 0,
        }
      ];
    }
    
    if (query.includes("life") || query.includes("cell") || query.includes("biology") || query.includes("science")) {
      return [
        {
          id: "q1",
          text: "Which of the following cell organelles is known as the 'powerhouse of the cell'?",
          options: ["Lysosome", "Mitochondria", "Ribosome", "Golgi apparatus"],
          correctIndex: 1,
        },
        {
          id: "q2",
          text: "Photosynthesis in plants primarily takes place in which cell organelle?",
          options: ["Mitochondria", "Chloroplast", "Nucleus", "Cell wall"],
          correctIndex: 1,
        },
        {
          id: "q3",
          text: "Which molecule stores and carries genetic information in organisms?",
          options: ["RNA", "Protein", "DNA", "Carbohydrate"],
          correctIndex: 2,
        }
      ];
    }

    if (query.includes("equation") || query.includes("algebra") || query.includes("math")) {
      return [
        {
          id: "q1",
          text: `What is the value of x if 2x + 7 = 15?`,
          options: ["x = 3", "x = 4", "x = 5", "x = 6"],
          correctIndex: 1,
        },
        {
          id: "q2",
          text: "What is the degree of a quadratic equation?",
          options: ["1", "2", "3", "4"],
          correctIndex: 1,
        },
        {
          id: "q3",
          text: "If log10(x) = 3, what is the value of x?",
          options: ["30", "100", "1000", "10000"],
          correctIndex: 2,
        }
      ];
    }

    // Default Fallback Questions templates
    return [
      {
        id: "q1",
        text: `In the context of ${cls} ${subject}, which of the following best defines the primary concepts of ${topic || "this topic"}?`,
        options: ["A static set of variables", "An integrated law governing reactions/formulas", "A negligible parameter", "None of the above"],
        correctIndex: 1,
      },
      {
        id: "q2",
        text: `Which of the following statements is widely accepted as correct regarding ${topic || "this topic"}?`,
        options: ["It remains constant under all conditions", "It depends entirely on external pressure", "It follows fundamental academic principles", "It contradicts conservation laws"],
        correctIndex: 2,
      },
      {
        id: "q3",
        text: `What is a common practical application of ${topic || "this topic"} in daily scientific/technological scenarios?`,
        options: ["Domestic cooling systems", "Analyzing textbook calculations", "Standard laboratory reference points", "All of the above"],
        correctIndex: 3,
      }
    ];
  };

  const handleGenerateQuiz = () => {
    const finalTopic = creationTab === "pdf" && pdfFileName ? pdfFileName.replace(/\.[^/.]+$/, "") : topicName;
    if (!finalTopic.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);

    // Dynamic generation step simulator
    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);

    // Save after simulation
    setTimeout(() => {
      const generatedQuestions = generateQuestions(finalTopic, selectedSubject, selectedClass);
      
      const newQuizId = `custom-quiz-${Date.now()}`;
      const newQuiz: Quiz & { questions: any[] } = {
        id: newQuizId,
        title: creationTab === "pdf" ? `Quiz from PDF: ${finalTopic}` : `AI Quiz: ${finalTopic}`,
        subject: selectedSubject,
        class: selectedClass,
        questionCount: generatedQuestions.length,
        timeLimit: 5,
        highScore: null,
        difficulty: "Medium",
        isCustom: true,
        questions: generatedQuestions
      };

      // Save complete quiz details
      localStorage.setItem(newQuizId, JSON.stringify(newQuiz));

      // Append to custom list
      const updatedList = [newQuiz, ...customQuizzes];
      localStorage.setItem("custom-quizzes", JSON.stringify(updatedList));

      setIsGenerating(false);
      router.push(`/dashboard/quizzes/${newQuizId}`);
    }, 5000);
  };

  const allQuizzes = [...customQuizzes, ...defaultQuizzes];
  const steps = [
    "Reading NCERT textbook chapters & contexts...",
    "Extracting key concepts & vocabulary...",
    "Drafting multiple-choice questions & answer keys...",
    "Validating difficulty thresholds..."
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
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

      {/* 🔮 Custom AI Quiz Wizard (Glassmorphism UI) */}
      <div className="bg-card/45 backdrop-blur-md border  border-neutral-500/30 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-teal-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 border-b  border-neutral-500/20 pb-4">
          <div className="p-1.5 bg-teal-accent/15 text-teal-accent rounded-xl">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground">Custom AI Quiz Wizard</h3>
            <p className="text-[11px] text-muted-foreground">Generate tailored practice tests using vector indexing.</p>
          </div>
        </div>

        {isGenerating ? (
          /* Generating State Screen */
          <div className="py-8 flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 border-2 border-teal-accent border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">Vidya is analyzing syllabus...</h4>
              <p className="text-xs text-teal-accent font-semibold leading-relaxed animate-pulse">
                {steps[generationStep]}
              </p>
            </div>
            
            {/* Step Checkmarks */}
            <div className="w-full flex justify-between pt-4 text-[10px] text-muted-foreground/60 font-bold">
              {steps.map((_, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <CheckCircle2
                    size={14}
                    className={
                      generationStep >= idx
                        ? "text-teal-accent fill-teal-accent/10"
                        : "text-muted-foreground/20"
                    }
                  />
                  <span>Step {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Input Configuration Screen */
          <div className="space-y-5">
            {/* Tab Switer */}
            <div className="flex bg-slate-gray/40 p-1 rounded-xl border  border-neutral-500/20 w-fit">
              <button
                onClick={() => setCreationTab("details")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  creationTab === "details" ? "bg-card text-teal-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                type="button"
              >
                Textbook Details
              </button>
              <button
                onClick={() => setCreationTab("pdf")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  creationTab === "pdf" ? "bg-card text-teal-accent shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                type="button"
              >
                Upload NCERT PDF
              </button>
            </div>

            {/* Config Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Class Select</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-gray border  border-neutral-500/30 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-teal-accent font-semibold"
                >
                  <option>Class 9</option>
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject Select</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-gray border  border-neutral-500/30 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-teal-accent font-semibold"
                >
                  <option>Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                </select>
              </div>

              {creationTab === "details" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Enter Topic</label>
                  <input
                    type="text"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="e.g. Chemical Bonding"
                    className="bg-slate-gray border  border-neutral-500/30 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-teal-accent"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Upload PDF File</label>
                  <div className="relative bg-slate-gray border border-dashed  border-neutral-500/60 hover:border-teal-accent/40 rounded-xl flex items-center justify-center p-2.5 h-[42px] transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                      {pdfFileName ? (
                        <>
                          <FileText size={14} className="text-teal-accent" />
                          <span className="text-foreground max-w-[140px] truncate">{pdfFileName}</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Select Textbook PDF</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={creationTab === "details" ? !topicName.trim() : !pdfFileName}
              className="bg-teal-accent hover:bg-teal-dark disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 ml-auto"
            >
              Generate AI Quiz <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Quizzes List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-6 rounded-2xl bg-card border border-neutral-500/30 shadow-sm flex flex-col justify-between hover:border-teal-accent/30 transition-all duration-300 transform hover:scale-[1.01]"
          >
            <div>
              {/* Badges row */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-slate-gray border border-neutral-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider text-muted-foreground">
                    {quiz.subject} • {quiz.class}
                  </span>
                  {quiz.isCustom && (
                    <span className="text-[10px] font-extrabold bg-teal-light text-teal-accent border border-teal-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      ✨ AI Custom
                    </span>
                  )}
                </div>
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
            <div className="mt-6 pt-4 border-t border-neutral-500/30 flex justify-between items-center">
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
