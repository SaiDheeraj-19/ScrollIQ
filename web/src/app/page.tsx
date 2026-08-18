"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Star, ArrowRight, Activity, Network, ShieldAlert, MousePointerClick, Brain, TrendingUp, Dna, Puzzle, Compass, Sparkles, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 font-sans selection:bg-zinc-200 relative overflow-hidden">
      
      {/* Giant Background Watermark - Top Right */}
      <div 
        className="fixed top-0 right-[-5%] text-[30rem] font-bold text-zinc-50 pointer-events-none select-none leading-none z-0 tracking-tighter"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        ScrollIQ
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-6">
        
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">ScrollIQ</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link href="#features" className="hover:text-zinc-900 transition-colors">Features</Link>
            <Link href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</Link>
            <Link href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</Link>
            <Link href="#blog" className="hover:text-zinc-900 transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-zinc-200 hidden md:block"></div>
            <Link href="/login" className="text-sm font-medium hover:text-zinc-500 transition-colors hidden md:block">
              Login
            </Link>
            <Link 
              href="/login" 
              className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="text-center max-w-4xl mx-auto mt-20 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-zinc-500 text-sm font-medium mb-6">Intelligence built for curious minds.</p>
            <h1 className="text-6xl md:text-[5rem] font-bold tracking-tight leading-[1.1] mb-8 text-zinc-900">
              ScrollIQ. Don't scroll,<br/>
              <span className="text-[#FF4F4F]">understand.</span>
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Experience the next generation of AI-powered recommendations. Seamlessly blending cutting-edge behavioral analysis with deep latent interest discovery.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started for Free
              </Link>
              <Link 
                href="/app" 
                className="w-full sm:w-auto bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm"
              >
                VIEW DEMO
              </Link>
            </div>


          </motion.div>
        </main>

        {/* Powered By Section */}
        <section className="mb-40">
          <p className="text-center text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-8">
            Integrated AI Models & Tech
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Groq', logo: 'https://www.google.com/s2/favicons?domain=groq.com&sz=64' },
              { name: 'Llama 3', logo: 'https://www.google.com/s2/favicons?domain=meta.com&sz=64' },
              { name: 'OpenRouter', logo: 'https://www.google.com/s2/favicons?domain=openrouter.ai&sz=64' },
              { name: 'FastAPI', logo: 'https://cdn.simpleicons.org/fastapi/009688' },
              { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/000000' },
              { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB' }
            ].map((tech) => (
              <div key={tech.name} className="bg-white border border-zinc-200/60 shadow-sm rounded-2xl py-6 px-10 min-w-[160px] flex flex-col items-center justify-center gap-3 hover:border-zinc-300 transition-colors">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={tech.logo} alt={tech.name} className="w-6 h-6 object-contain" />
                </div>
                <span className="text-xs font-medium text-zinc-500">{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline Section */}
        <section className="mb-40 pt-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">How ScrollIQ Works</h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
              The end-to-end pipeline that transforms mindless scrolling into actionable career recommendations.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-y-10 gap-x-2 md:gap-x-4 relative z-10">
              {[
                { name: "Student Interactions", icon: MousePointerClick, color: "text-blue-500" },
                { name: "Content Understanding", icon: Brain, color: "text-indigo-500" },
                { name: "Behavior Analysis", icon: TrendingUp, color: "text-violet-500" },
                { name: "Interest Inference", icon: Network, color: "text-purple-500" },
                { name: "Interest Profile", icon: Dna, color: "text-fuchsia-500" },
                { name: "Knowledge Gap", icon: Puzzle, color: "text-pink-500" },
                { name: "Career Direction", icon: Compass, color: "text-rose-500" },
                { name: "Recommendation", icon: Sparkles, color: "text-[#FF4F4F]" },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center w-28 md:w-32 group">
                    <div className="w-16 h-16 bg-white border border-zinc-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 relative transition-all group-hover:scale-105 group-hover:shadow-md group-hover:border-zinc-300">
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                        {i + 1}
                      </div>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-zinc-700 leading-tight">{step.name}</h4>
                  </div>
                  {i < 7 && (
                    <div className="hidden lg:flex text-zinc-300 items-center justify-center mt-[-2rem]">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-40 pt-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight text-zinc-900 mb-4">Everything in one place</h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
              One platform for every AI agent you need.<br/>
              No need to switch contexts, manage multiple subscriptions, or learn new interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#FF4F4F] mb-3">Behavior</span>
              <h3 className="text-3xl font-bold tracking-tight mb-6">Analyze signals.</h3>
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-8 flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-16 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center">
                      <Activity className={`w-6 h-6 ${i % 2 === 0 ? 'text-zinc-900' : 'text-zinc-300'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#3b82f6] mb-3">Discovery</span>
              <h3 className="text-3xl font-bold tracking-tight mb-6">Discover DNA.</h3>
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-8 flex-1">
                <p className="text-zinc-500 leading-relaxed mb-6">
                  Create powerful profiles that guide AI agents to deliver exactly what you need. Our intuitive engine helps you understand deep latent interests.
                </p>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-center mt-auto">
                  <Network className="w-12 h-12 text-[#3b82f6]" />
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#10b981] mb-3">Recommendation</span>
              <h3 className="text-3xl font-bold tracking-tight mb-6">Break the trap.</h3>
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-3xl p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-4xl font-bold text-zinc-900 mb-1">98% <span className="text-lg font-medium text-zinc-400">+30%</span></h4>
                  <p className="text-sm text-zinc-500 mb-8">Recommendation accuracy</p>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {[40, 70, 45, 90, 60, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-zinc-200 rounded-t-sm" style={{ height: `${h}%` }}>
                      {i === 5 && <div className="w-full h-full bg-zinc-900 rounded-t-sm"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-40 max-w-3xl mx-auto pt-20">
          <p className="text-center text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-4">Frequently asked questions</h2>
          <p className="text-center text-zinc-500 mb-16">Can't find the answer you're looking for? <strong className="text-zinc-900 cursor-pointer">Get in touch.</strong></p>

          <div className="space-y-6">
            {[
              "What makes ScrollIQ different from standard algorithms?",
              "How does it analyze my YouTube history?",
              "Is my data secure? How do you handle privacy?",
              "What is the Anti-Hype filter?",
              "How quickly can I get started?"
            ].map((q, i) => (
              <div key={i} className="flex items-center justify-between py-6 border-b border-zinc-200 group cursor-pointer">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-zinc-400">(00{i+1})</span>
                  <h4 className="text-lg font-bold text-zinc-900">{q}</h4>
                </div>
                <span className="text-zinc-400 text-2xl group-hover:text-zinc-900 transition-colors">+</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200 pt-20 pb-10 relative overflow-hidden">
        {/* Giant footer watermark */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[15rem] font-bold text-zinc-100 pointer-events-none select-none z-0 tracking-tighter w-full text-center">
          SCROLLIQ
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-bold tracking-tight">ScrollIQ</span>
              </div>
              <p className="text-sm text-zinc-500">AI agents that work, always.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <strong className="text-zinc-900 font-bold mb-2">Product</strong>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Features</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Pricing</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Integrations</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">API</Link>
            </div>

            <div className="flex flex-col gap-3">
              <strong className="text-zinc-900 font-bold mb-2">Company</strong>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">About</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Careers</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Contact</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Privacy</Link>
            </div>

            <div className="col-span-1 md:col-span-1">
              <strong className="text-zinc-900 font-bold mb-4 block">Get in touch</strong>
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                Join developers building the next generation of AI-powered workflows.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-400"
                />
                <button className="bg-zinc-900 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-zinc-800 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">We'll get back to you within 24 hours.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-zinc-200/50">
            <p className="text-xs text-zinc-400">© 2026 SCROLLIQ. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900">Terms</Link>
              <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900">Privacy</Link>
              <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-900">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
