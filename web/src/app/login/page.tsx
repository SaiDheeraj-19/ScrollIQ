"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  React.useEffect(() => {
    // If the user already has a token, they shouldn't be on the login page.
    if (localStorage.getItem("youtube_access_token")) {
      router.push("/app");
    }
  }, [router]);

  const handleGoogleLogin = () => {
    // The backend handles the Google OAuth flow and will redirect to /app on success.
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    window.location.href = `${apiBase}/integrations/youtube/login`;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Dark Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-zinc-950 to-zinc-950"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to website</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-3 h-3 bg-zinc-950 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ScrollIQ</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Stop endlessly scrolling. Start deeply understanding.
          </h1>
          <p className="text-zinc-400 text-lg">
            The first AI-powered behavioral engine that infers your true latent interests from short-form video consumption.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {['JD', 'SA', 'MK'][i-1]}
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-400 font-medium">Join 2,500+ curious minds.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">ScrollIQ</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Welcome back</h2>
            <p className="text-zinc-500">Sign in to your account to continue.</p>
          </div>

          <div className="mt-10">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-900 font-medium py-3 px-4 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-zinc-500">Or continue with</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                disabled
              />
            </div>
            <button
              disabled
              className="w-full bg-zinc-900 text-white font-medium py-3 px-4 rounded-xl opacity-50 cursor-not-allowed"
            >
              Sign in with Email (Coming Soon)
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-8">
            By clicking continue, you agree to our <a href="#" className="underline hover:text-zinc-900">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-900">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
