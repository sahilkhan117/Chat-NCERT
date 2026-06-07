"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "../components/theme-provider";
import {
  Sun,
  Moon,
  Bot,
  Sparkles,
  MessageSquare,
  Check,
  X,
  ArrowRight,
  BookOpen,
  Send,
  Award,
  Globe,
  Database,
  Lock,
  ChevronRight,
  Terminal,
  MessageCircle,
  FileText,
  Star,
  Users
} from "lucide-react";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"students" | "platforms">("students");

  const plans = [
    {
      name: "Free Trial",
      price: "₹0",
      description: "Perfect for testing features and setting up a sandbox.",
      features: [
        "50 active student seats",
        "100 RAG Q&A queries/mo",
        "500MB Cloud R2 Storage",
        "Community discussion access"
      ],
      buttonText: "Get Started",
      accent: false,
    },
    {
      name: "Starter Class",
      price: "₹999",
      period: "/month",
      description: "For individual classrooms and tutoring centers.",
      features: [
        "500 active student seats",
        "5,000 RAG Q&A queries/mo",
        "5GB Cloud R2 Storage",
        "Custom Ollama local tunnel binding",
        "Priority pgvector index creation"
      ],
      buttonText: "Upgrade Starter",
      accent: true, // Saffron highlighted
    },
    {
      name: "School Pro",
      price: "₹4,999",
      period: "/month",
      description: "For large educational schools and institutional networks.",
      features: [
        "Unlimited active student seats",
        "Unlimited RAG Q&A queries",
        "50GB Cloud R2 Storage",
        "Advanced admin control panel",
        "Dedicated R2 bucket configurations"
      ],
      buttonText: "Go Pro",
      accent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans relative">
      {/* Radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-linear-to-br from-accent-bright/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-linear-to-br from-accent-warm/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-5 border-b border-neutral-500/30 bg-background/80 backdrop-blur-md flex items-center justify-between transition-all duration-300">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Chat-NCERT Logo"
              width={140}
              height={40}
              priority
              className="h-8 sm:h-9 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
          <a href="#students" className="hover:text-accent-bright transition-colors">For Students</a>
          <a href="#platforms" className="hover:text-accent-bright transition-colors">For Platforms</a>
          <a href="#how" className="hover:text-accent-bright transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-accent-bright transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-neutral-500/30 flex items-center justify-center hover:bg-card hover:text-accent-bright transition-all"
            type="button"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-accent-bright hover:bg-[#00ffca] text-ink font-semibold text-xs rounded-lg shadow-lg shadow-accent-bright/15 transition-all duration-200"
          >
            Enter Study Hall
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="min-h-screen max-w-6xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-16 flex flex-col md:grid md:grid-cols-2 items-center gap-12 sm:gap-16 relative">
        <div className="space-y-6 sm:space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-bright/10 border border-accent-bright/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" />
            <span className="text-[10px] font-bold text-accent-bright uppercase tracking-wider">
              AI-powered academic intelligence
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-normal leading-[1.05] tracking-tight">
            Every student<br />
            deserves an <span className="font-serif italic text-accent-bright">expert</span><br />
            <span className="text-accent-warm font-serif italic">by their side</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed font-light">
            Chat-NCERT brings RAG-powered AI tutoring, community learning, and smart practice quizzes to your institution — white-labeled, API-first, and ready to embed in minutes.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 bg-accent-bright hover:bg-[#00ffca] text-ink font-bold text-sm rounded-lg shadow-xl shadow-accent-bright/20 transition-all duration-200 flex items-center gap-2"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <a
              href="#platforms"
              className="px-6 py-3.5 border border-neutral-500/30 hover:bg-card text-foreground font-semibold text-sm rounded-lg transition-colors flex items-center gap-1"
            >
              For EdTech Platforms &rarr;
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-6 border-t border-neutral-500/30/50">
            <div className="flex -space-x-2.5">
              <div className="w-8 h-8 rounded-full border-2 border-background bg-accent-bright text-ink font-bold text-[10px] flex items-center justify-center">N</div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-accent-warm text-ink font-bold text-[10px] flex items-center justify-center">S</div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-accent-coral text-foreground font-bold text-[10px] flex items-center justify-center">A</div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-card text-muted-foreground text-[10px] font-bold flex items-center justify-center">+5k</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Loved by <strong className="text-foreground font-bold">5,000+ students</strong> across India
            </p>
          </div>
        </div>

        {/* HERO RIGHT: Interactive Chat Visual */}
        <div className="w-full relative animate-fade-up delay-100">
          <div className="relative border border-neutral-500/30 rounded-2xl bg-card shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-neutral-500/30 bg-background/50 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-muted-foreground">
                Class 10 Science • Chapter 1
              </span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* User message */}
              <div className="flex gap-3 justify-end">
                <div className="p-3 rounded-2xl rounded-tr-none bg-accent-bright/10 border border-accent-bright/20 max-w-[80%] text-foreground">
                  How does the displacement reaction work in Class 10 Ch 1?
                </div>
                <div className="w-8 h-8 rounded-lg bg-accent-warm/15 text-accent-warm font-bold flex items-center justify-center shrink-0">
                  S
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-bright/15 text-accent-bright font-bold flex items-center justify-center text-sm shrink-0 animate-bounce-slow">
                  🦉
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-background/50 border border-neutral-500/30 max-w-[80%] space-y-2 leading-relaxed">
                  <p>
                    In a <strong>displacement reaction</strong>, a more reactive element displaces a less reactive element from its salt solution.
                  </p>
                  <p className="text-muted-foreground">
                    For example, when iron nails are placed in blue copper sulphate solution, iron displaces copper:
                  </p>
                  <pre className="p-2 rounded bg-background border border-neutral-500/30 text-[10px] font-mono overflow-x-auto text-accent-bright">
                    Fe(s) + CuSO4(aq) &rarr; FeSO4(aq) + Cu(s)
                  </pre>
                  {/* Citation */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-bright/5 border border-accent-bright/20 rounded-md text-[9px] font-bold text-accent-bright">
                      <BookOpen size={10} /> Class 10 Science - Ch 1.pdf (p. 4)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input mock */}
            <div className="p-4 border-t border-neutral-500/30 bg-background/35 flex items-center gap-3">
              <div className="flex-1 px-3 py-2 bg-background border border-neutral-500/30 rounded-lg text-muted-foreground/60 text-xs">
                Ask a follow-up question...
              </div>
              <button className="w-8 h-8 bg-accent-bright hover:bg-[#00ffca] rounded-lg flex items-center justify-center transition-all shrink-0">
                <Send size={14} className="text-ink" />
              </button>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute -bottom-6 -left-6 bg-card border border-neutral-500/30 rounded-xl p-3 shadow-2xl flex items-center gap-3 animate-float">
            <div className="w-8 h-8 rounded-lg bg-accent-bright/10 text-accent-bright flex items-center justify-center text-lg">
              🏆
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground block font-bold uppercase tracking-wider">
                Current Level
              </span>
              <strong className="text-xs font-semibold block">
                Chem Alchemist
              </strong>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-card border border-accent-bright/30 rounded-xl px-3 py-2 shadow-2xl flex items-center gap-2 animate-float [animation-delay:1.5s]">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-bright" />
            <span className="text-[10px] font-bold text-accent-bright uppercase tracking-wider">
              768-dim Index Active
            </span>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <section className="py-6 border-y border-neutral-500/30 overflow-hidden bg-card/20 backdrop-blur-sm relative z-10">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          <div className="flex gap-16 px-4">
            {["Chemical Reactions", "Acids, Bases & Salts", "Carbon & Compounds", "Metals & Non-metals", "Life Processes", "Control & Coordination", "Light Reflection & Refraction"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs font-bold font-display uppercase tracking-widest text-muted-foreground">
                <span className="text-accent-bright text-lg">✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-16 px-4">
            {["Chemical Reactions", "Acids, Bases & Salts", "Carbon & Compounds", "Metals & Non-metals", "Life Processes", "Control & Coordination", "Light Reflection & Refraction"].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs font-bold font-display uppercase tracking-widest text-muted-foreground">
                <span className="text-accent-bright text-lg">✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-background border-b border-neutral-500/30 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-neutral-500/30 rounded-2xl overflow-hidden">
          <div className="p-8 text-center bg-background hover:bg-card/30 transition-colors">
            <h3 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-none">
              98.4<span className="text-accent-bright">%</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-2 font-display uppercase tracking-wider">
              Student Accuracy
            </p>
          </div>
          <div className="p-8 text-center bg-background hover:bg-card/30 transition-colors">
            <h3 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-none">
              3.2<span className="text-accent-bright">M</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-2 font-display uppercase tracking-wider">
              Vector Embeddings
            </p>
          </div>
          <div className="p-8 text-center bg-background hover:bg-card/30 transition-colors">
            <h3 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-none">
              &lt; 150<span className="text-accent-bright">ms</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-2 font-display uppercase tracking-wider">
              Response Speed
            </p>
          </div>
          <div className="p-8 text-center bg-background hover:bg-card/30 transition-colors">
            <h3 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-none">
              500<span className="text-accent-bright">+</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-2 font-display uppercase tracking-wider">
              Classrooms Configured
            </p>
          </div>
        </div>
      </section>

      {/* FOR STUDENTS SECTION */}
      <section id="students" className="py-20 sm:py-28 max-w-6xl mx-auto px-6 sm:px-12 space-y-16 relative z-10">
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-accent-bright uppercase tracking-widest font-display flex items-center gap-2">
            <span className="w-4 h-px bg-accent-bright" /> For Students
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight mt-4">
            A living study hall,<br />
            available 24/7.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mt-2 font-light">
            Keep your students engaged with a gamified study space designed specifically for the NCERT curriculum.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bento-card p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-bright to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-accent-bright/10 text-accent-bright flex items-center justify-center">
              <Bot size={24} />
            </div>
            <h3 className="font-display font-semibold text-base tracking-tight">🦉 AI Tutor Vidya</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Chat with our dedicated mascot owl who searches your textbooks in real-time, delivering page-level citations for every single answer.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bento-card p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-warm to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-accent-warm/10 text-accent-warm flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h3 className="font-display font-semibold text-base tracking-tight">📝 Practice Quiz Wizard</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Answer balanced practice questions with countdown timers. Get complete explanations and diagnostics at the end of each attempt.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bento-card p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-coral to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-accent-coral/10 text-accent-coral flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-display font-semibold text-base tracking-tight">💬 Discussion Board Feed</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Participate in Class 10 student boards. Share study notes, write queries, respond to classmates with nested comment threads, and react.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bento-card p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-bright to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-accent-bright/10 text-accent-bright flex items-center justify-center">
              <Award size={24} />
            </div>
            <h3 className="font-display font-semibold text-base tracking-tight">📈 Gamified Pathways</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Earn Study Points (XP) for answering quizzes, keeping your streak count alive, uploading assignments, and raising your alchemist rank.
            </p>
          </div>
        </div>
      </section>

      {/* FOR PLATFORMS SECTION */}
      <section id="platforms" className="bg-card/45 border-y border-neutral-500/30 py-20 sm:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold text-accent-bright uppercase tracking-widest font-display flex items-center gap-2">
              <span className="w-4 h-px bg-accent-bright" /> For EdTech Platforms
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight mt-4">
              Integrate AI intelligence<br />
              into your existing stack.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2 font-light">
              API-first white-labeled portal made to run efficiently on Cloudflare Workers and PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 bg-background border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group hover:shadow-2xl hover:border-accent-bright/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent-bright opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif text-4xl text-border leading-none font-normal">01</div>
              <h3 className="font-display font-semibold text-base tracking-tight mt-4">White-Labeled Core</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-light">
                Match your institutional guidelines. Fully custom domain bindings, layout configurations, and localized text definitions.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-background border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group hover:shadow-2xl hover:border-accent-warm/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent-warm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif text-4xl text-border leading-none font-normal">02</div>
              <h3 className="font-display font-semibold text-base tracking-tight mt-4">Secure Local Ollama</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-light">
                Provide an Ollama endpoint tunnel (Cloudflare Tunnel). Queries execute locally, keeping student data 100% private.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-background border border-neutral-500/30 rounded-2xl space-y-4 relative overflow-hidden group hover:shadow-2xl hover:border-accent-coral/20 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent-coral opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif text-4xl text-border leading-none font-normal">03</div>
              <h3 className="font-display font-semibold text-base tracking-tight mt-4">Hybrid REST & Webhooks</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-light">
                Listen to quiz completions, study progress milestones, and Razorpay webhook updates to trigger local actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 sm:py-28 max-w-6xl mx-auto px-6 sm:px-12 space-y-16 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-accent-bright uppercase tracking-widest font-display inline-flex items-center gap-2 justify-center">
            <span className="w-4 h-px bg-accent-bright" /> How It Works
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
            Provisioned in four simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-background border border-neutral-500/30 flex items-center justify-center font-serif text-lg font-normal text-foreground mx-auto hover:bg-accent-bright/10 hover:border-accent-bright hover:text-accent-bright transition-all">
              1
            </div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Ingest Textbooks</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Upload NCERT PDF files directly to your Cloudflare R2 bucket.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-background border border-neutral-500/30 flex items-center justify-center font-serif text-lg font-normal text-foreground mx-auto hover:bg-accent-bright/10 hover:border-accent-bright hover:text-accent-bright transition-all">
              2
            </div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Chunk & Embed</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              We slice content into 512-token chunks and build `pgvector` indexes.
            </p>
          </div>

          {/* Step-3 */}
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-background border border-neutral-500/30 flex items-center justify-center font-serif text-lg font-normal text-foreground mx-auto hover:bg-accent-bright/10 hover:border-accent-bright hover:text-accent-bright transition-all">
              3
            </div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Connect Tunnel</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Bind your Gemini key or bind a private local Ollama tunnel endpoint.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-background border border-neutral-500/30 flex items-center justify-center font-serif text-lg font-normal text-foreground mx-auto hover:bg-accent-bright/10 hover:border-accent-bright hover:text-accent-bright transition-all">
              4
            </div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Launch Hall</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-light">
              Embed our Next.js client or make requests directly to the GraphQL endpoint.
            </p>
          </div>
        </div>
      </section>

      {/* WHY US / PRODUCT COMPARISON */}
      <section className="bg-card/45 border-y border-neutral-500/30 py-20 sm:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-start">
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-accent-bright uppercase tracking-widest font-display flex items-center gap-2">
              <span className="w-4 h-px bg-accent-bright" /> Smart RAG Engine
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
              Why settle for <em>generic</em> AI overlays?
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              Traditional AI overlays hallucinate and lack specific textbook page alignments. Chat-NCERT is custom engineered to solve academic textbook precision:
            </p>

            <blockquote className="border-l-2 border-accent-bright pl-4 italic text-sm text-foreground/80 leading-relaxed font-light">
              "We verified our pgvector cosine distance calculation operator directly against the board syllabus. The citations are 100% aligned to CBSE page prints."
            </blockquote>
          </div>

          {/* Comparison grids */}
          <div className="grid grid-cols-2 gap-4">
            {/* Generic RAG */}
            <div className="p-6 bg-background border border-neutral-500/30 rounded-xl space-y-4">
              <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Generic RAG Models
              </h4>
              <ul className="text-xs space-y-3 font-light">
                <li className="flex items-center gap-2 text-muted-foreground/60">
                  <X size={14} className="text-accent-coral shrink-0" /> Large chunk sizes
                </li>
                <li className="flex items-center gap-2 text-muted-foreground/60">
                  <X size={14} className="text-accent-coral shrink-0" /> Hallucinates source page
                </li>
                <li className="flex items-center gap-2 text-muted-foreground/60">
                  <X size={14} className="text-accent-coral shrink-0" /> High subscription fees
                </li>
                <li className="flex items-center gap-2 text-muted-foreground/60">
                  <X size={14} className="text-accent-coral shrink-0" /> No study tools
                </li>
              </ul>
            </div>

            {/* Chat-NCERT RAG */}
            <div className="p-6 bg-background border border-accent-bright/35 rounded-xl space-y-4">
              <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-accent-bright">
                Chat-NCERT Engine
              </h4>
              <ul className="text-xs space-y-3">
                <li className="flex items-center gap-2 font-medium">
                  <Check size={14} className="text-accent-bright shrink-0" /> 512-token precision
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check size={14} className="text-accent-bright shrink-0" /> Page-level citations
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check size={14} className="text-accent-bright shrink-0" /> Offline Ollama tunnel
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check size={14} className="text-accent-bright shrink-0" /> Integrates gamified XP
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-20 sm:py-28 max-w-6xl mx-auto px-6 sm:px-12 space-y-16 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-accent-bright uppercase tracking-widest font-display inline-flex items-center gap-2 justify-center">
            <span className="w-4 h-px bg-accent-bright" /> Pricing Plans
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
            Flexible white-labeled pricing
          </h2>
          <p className="text-muted-foreground text-xs mt-1">
            Start building today. No credit card required. Upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 bg-card border rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 ${
                plan.accent
                  ? "border-accent-bright shadow-lg shadow-accent-bright/5"
                  : "border-border shadow-sm"
              }`}
            >
              <div>
                {plan.accent && (
                  <span className="inline-block px-2 py-0.5 bg-accent-bright text-ink text-[9px] font-bold uppercase rounded-full tracking-wider mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                  {plan.name}
                </h3>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="font-serif text-4xl sm:text-5xl font-normal">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xs text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-light">
                  {plan.description}
                </p>
                <div className="h-px bg-border my-6" />
                <ul className="space-y-3 text-xs text-foreground font-semibold">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 font-medium">
                      <Check size={14} className="text-accent-bright shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`mt-8 w-full py-3 rounded-lg font-bold text-xs shadow-md transition-all duration-200 ${
                  plan.accent
                    ? "bg-accent-bright text-ink hover:bg-[#00ffca] hover:shadow-lg hover:shadow-accent-bright/20"
                    : "bg-background border border-neutral-500/30 text-foreground hover:bg-card"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* API CTA SECTION */}
      <section className="bg-card/45 border-y border-neutral-500/30 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              Integrate RAG Q&A in seconds
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm font-light">
              Submit student questions directly via our endpoint. Response contains exact textbook citation indices in JSON output.
            </p>
          </div>

          {/* Code block */}
          <div className="p-5 rounded-xl bg-background border border-neutral-500/30 font-mono text-xs text-accent-bright shadow-2xl relative overflow-x-auto">
            <div className="absolute top-3 right-3 text-[10px] text-muted-foreground font-sans font-semibold uppercase tracking-wider">
              bash curl
            </div>
            <pre className="whitespace-pre">
{`curl -X POST https://api.chat-ncert.com/v1/rag/query \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What is displacement reaction?"
  }'`}
            </pre>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 max-w-6xl mx-auto px-6 sm:px-12 space-y-16 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-accent-bright uppercase tracking-widest font-display inline-flex items-center gap-2 justify-center">
            <span className="w-4 h-px bg-accent-bright" /> Testimonials
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
            Trust by Educators & Students
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-6 hover:border-accent-bright/20 transition-all duration-300">
            <p className="font-serif text-sm leading-relaxed italic font-normal text-foreground/90">
              "The page-specific citations solved our verification problem completely. Students finally trust the AI answers because they can open the exact PDF source location."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-bright/10 text-accent-bright flex items-center justify-center font-bold text-sm">
                NS
              </div>
              <div>
                <strong className="text-xs font-semibold block">Nisha Sharma</strong>
                <span className="text-[10px] text-muted-foreground">Class 10 Tutor • Delhi</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-6 hover:border-accent-bright/20 transition-all duration-300">
            <p className="font-serif text-sm leading-relaxed italic font-normal text-foreground/90">
              "We connected Wrangler to our local Ollama server in less than ten minutes. The vector search is sub-millisecond and runs entirely offline without API costs."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-warm/10 text-accent-warm flex items-center justify-center font-bold text-sm">
                AP
              </div>
              <div>
                <strong className="text-xs font-semibold block">Amit Patel</strong>
                <span className="text-[10px] text-muted-foreground">IT Director • Ahmedabad</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-card border border-neutral-500/30 rounded-2xl space-y-6 hover:border-accent-bright/20 transition-all duration-300">
            <p className="font-serif text-sm leading-relaxed italic font-normal text-foreground/90">
              "The streak dashboard keeps me studying chemistry everyday. It feels less like reading a dry textbook and more like gaming with my friends in the study hall."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-coral/10 text-accent-coral flex items-center justify-center font-bold text-sm">
                RK
              </div>
              <div>
                <strong className="text-xs font-semibold block">Rajesh Kumar</strong>
                <span className="text-[10px] text-muted-foreground">Student • Class 10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 text-center max-w-4xl mx-auto px-6 space-y-8 relative z-10">
        <h2 className="font-serif text-5xl sm:text-7xl font-normal leading-[1.05] tracking-tight">
          Every student deserves<br />
          an <em>expert</em>.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto font-light">
          Bring white-labeled NCERT academic intelligence to your institution today. Set up in minutes.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-accent-bright hover:bg-[#00ffca] text-ink font-bold text-sm rounded-lg shadow-xl shadow-accent-bright/20 transition-all"
          >
            Start Practice Now
          </Link>
          <a
            href="#pricing"
            className="px-6 py-3.5 border border-neutral-500/30 hover:bg-card text-foreground font-semibold text-sm rounded-lg transition-colors"
          >
            SaaS Plan Pricing
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-500/30 bg-card/25 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Chat-NCERT Logo"
                width={120}
                height={35}
                className="h-8 w-auto object-contain dark:brightness-0 dark:invert transition-all"
              />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-light max-w-[200px]">
              AI-driven academic tutoring and study workspace custom tailored for the CBSE NCERT syllabus.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product</h4>
            <ul className="text-xs space-y-2 font-light">
              <li><a href="#students" className="hover:text-accent-bright">For Students</a></li>
              <li><a href="#platforms" className="hover:text-accent-bright">For Platforms</a></li>
              <li><a href="#pricing" className="hover:text-accent-bright">Plan Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Developer</h4>
            <ul className="text-xs space-y-2 font-light">
              <li><a href="http://localhost:8787/graphql" target="_blank" rel="noreferrer" className="hover:text-accent-bright">GraphQL Playground</a></li>
              <li><a href="http://localhost:8787/api/v1/health" target="_blank" rel="noreferrer" className="hover:text-accent-bright">Health Status</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Legal</h4>
            <ul className="text-xs space-y-2 font-light">
              <li><a href="#" className="hover:text-accent-bright">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent-bright">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-8 border-t border-neutral-500/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground">
          <p>© 2026 Chat-NCERT. Built for Interview Demonstration. Permanent Zero-Cost Infrastructure.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
