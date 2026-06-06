"use client";

import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock logged in student. In production, resolve from Better-Auth / Zustand
  const mockUser = {
    name: "Sahil Khan",
    role: "student" as const,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar userRole={mockUser.role} userName={mockUser.name} />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <Header title="NCERT Study Hall" userRole={mockUser.role} />

        {/* Dynamic Inner Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
