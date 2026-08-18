"use client";

import React, { useState } from "react";
import { Settings, Shield, Zap, Bell, Monitor, Smartphone, PlaySquare, Camera, Ghost, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [model, setModel] = useState("llama3");
  const [autoplay, setAutoplay] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem("youtube_access_token");
    localStorage.removeItem("scrolliq_onboarding_complete");
    router.push("/");
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto selection:bg-zinc-200">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Settings</h1>
        <p className="text-zinc-500">Manage your account, connected platforms, and AI preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav (Desktop) */}
        <div className="hidden md:flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 bg-zinc-100 text-zinc-900 font-medium rounded-xl">
            <Settings className="w-4 h-4" /> General
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <Shield className="w-4 h-4" /> Privacy & Data
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <Zap className="w-4 h-4" /> AI Models
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* Connected Accounts */}
          <section className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Connected Platforms</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <PlaySquare className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">YouTube</h4>
                    <p className="text-xs text-zinc-500">Read access to Liked Videos</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-zinc-500 hover:text-[#FF4F4F] bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-sm transition-colors">
                  Disconnect
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Instagram</h4>
                    <p className="text-xs text-zinc-500">Reels interaction history</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-zinc-500 hover:text-[#FF4F4F] bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-sm transition-colors">
                  Disconnect
                </button>
              </div>
            </div>
          </section>

          {/* AI Preferences */}
          <section className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">AI Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-900 mb-2">Inference Model</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-zinc-900 focus:border-zinc-900 block p-3 outline-none"
                >
                  <option value="llama3">Llama 3 (8B) - Default</option>
                  <option value="gpt4o">GPT-4o (Premium)</option>
                  <option value="claude3">Claude 3.5 Sonnet</option>
                </select>
                <p className="text-xs text-zinc-500 mt-2">Determines how deeply ScrollIQ analyzes your interactions.</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Anti-Hype Filter</h4>
                  <p className="text-xs text-zinc-500">Automatically rejects clickbait content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Autoplay Watch Feed</h4>
                  <p className="text-xs text-zinc-500">Automatically play embedded videos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={autoplay} onChange={() => setAutoplay(!autoplay)} />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 border border-red-100 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-700 mb-6">These actions are permanent and cannot be undone.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={handleSignOut}
                className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
              <button className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                Delete Account
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
