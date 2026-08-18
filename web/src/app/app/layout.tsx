"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PlaySquare, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex text-zinc-900 font-sans selection:bg-zinc-200">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col fixed h-full z-10 hidden lg:flex shadow-sm">
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">ScrollIQ</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/app"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname === '/app' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Analytics Overview
          </Link>
          <Link 
            href="/app/watch"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname === '/app/watch' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <PlaySquare className="w-4 h-4" />
            Watch Feed
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 space-y-2">
          <Link 
            href="/app/settings"
            className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname === '/app/settings' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem("youtube_access_token");
              router.push("/");
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[#FF4F4F] hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 relative min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-zinc-200 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="font-bold">ScrollIQ</span>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <Link href="/app" className={pathname === '/app' ? 'text-zinc-900' : 'text-zinc-500'}>Overview</Link>
            <Link href="/app/watch" className={pathname === '/app/watch' ? 'text-zinc-900' : 'text-zinc-500'}>Watch</Link>
          </div>
        </div>
        
        {children}
      </main>

    </div>
  );
}
