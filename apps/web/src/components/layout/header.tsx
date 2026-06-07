"use client";

import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../theme-provider";

interface HeaderProps {
  title: string;
  userRole: string;
}

export function Header({ title, userRole }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-8 border-b border-neutral-500/30 bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
      {/* Page Title */}
      <div>
        <h1 className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-2">
          {title}
        </h1>
      </div>

      {/* Action Badges & Notifications */}
      <div className="flex items-center gap-4">
        {/* Study Mascot Alert Link */}
        <div className="hidden sm:flex items-center gap-2 bg-saffron-light border border-saffron/20 px-3 py-1.5 rounded-full text-xs font-semibold text-saffron-dark animate-bounce-slow">
          <span>🦉</span>
          <span>Vidya: "Welcome back! Ready to study Class 10 Science today?"</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-slate-gray border border-neutral-500/30 flex items-center justify-center hover:bg-teal-light hover:text-teal-accent text-muted-foreground hover:scale-105 transition-all"
          type="button"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Icon Button */}
        <button
          className="relative w-10 h-10 rounded-full bg-slate-gray border border-neutral-500/30 flex items-center justify-center hover:bg-teal-light hover:text-teal-accent text-muted-foreground hover:scale-105 transition-all"
          type="button"
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-saffron text-foreground text-[9px] font-black rounded-full flex items-center justify-center border border-card shadow-sm">
            2
          </span>
        </button>

        {/* Dynamic Role Pill */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-light text-teal-accent border border-teal-accent/10 capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-ping" />
          {userRole} Active
        </span>
      </div>
    </header>
  );
}
