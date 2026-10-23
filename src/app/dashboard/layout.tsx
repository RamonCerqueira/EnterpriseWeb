import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Header from "@/components/dashboard/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Server-side authentication check
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground select-none">
      <Header session={session} />
      <main className="relative flex-1 overflow-y-auto bg-background p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
