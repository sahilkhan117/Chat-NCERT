"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  MessageSquare,
  Users,
  BookOpen,
  FileText,
  LayoutDashboard,
  UploadCloud,
  Settings,
  GraduationCap,
  Building,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  userRole: "student" | "instructor" | "admin" | "super_admin";
  userName: string;
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigationMap = {
    student: [
      { name: "Study Hall", href: "/dashboard", icon: Home },
      { name: "NCERT AI Q&A", href: "/dashboard/rag", icon: MessageSquare },
      { name: "Community Feed", href: "/dashboard/community", icon: Users },
      { name: "Practice Quizzes", href: "/dashboard/quizzes", icon: BookOpen },
      { name: "Assignments", href: "/dashboard/assignments", icon: FileText },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    instructor: [
      { name: "Overview", href: "/instructor", icon: LayoutDashboard },
      { name: "Upload Textbooks", href: "/instructor/documents", icon: UploadCloud },
      { name: "AI Quiz Builder", href: "/instructor/quizzes", icon: Settings },
      { name: "Grades & Submissions", href: "/instructor/assignments", icon: GraduationCap },
    ],
    admin: [
      { name: "Settings", href: "/admin", icon: Settings },
      { name: "Instructors list", href: "/admin/instructors", icon: Users },
    ],
    super_admin: [
      { name: "Tenants list", href: "/super-admin", icon: Building },
      { name: "System stats", href: "/super-admin/stats", icon: LayoutDashboard },
    ],
  };

  const navLinks = navigationMap[userRole] || [];

  return (
    <div
      className={`h-screen flex flex-col bg-card border-r border-neutral-500/30 text-foreground transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-neutral-500/30 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Chat-NCERT Logo"
              width={140}
              height={40}
              priority
              className="h-9 w-auto object-contain dark:brightness-0 dark:invert transition-all"
            />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-muted hover:bg-teal-light hover:text-teal-accent transition-colors flex items-center justify-center"
          type="button"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Quick Info */}
      {!collapsed && (
        <div className="p-4 mx-4 my-3 rounded-xl bg-slate-gray border border-neutral-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-accent text-white font-bold flex items-center justify-center">
            {userName[0].toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight text-foreground">{userName}</h4>
            <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const IconComponent = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-teal-accent text-white shadow-md shadow-teal-accent/20 scale-[1.02]"
                  : "hover:bg-slate-gray hover:text-teal-accent text-muted-foreground"
              }`}
            >
              <IconComponent size={18} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-neutral-500/30">
        <button
          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          type="button"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
