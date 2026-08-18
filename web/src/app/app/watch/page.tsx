"use client";

import React, { useState, useEffect, useRef } from "react";
import { RecommendationResponse } from "@/types";
import { Loader2, Heart, Share2, MessageCircle, Bookmark, Zap } from "lucide-react";
import Link from "next/link";
import { recordScrollIQActivity, fetchDynamicFeed, fetchCandidates } from "@/lib/api";

export default function WatchFeedPage() {
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Watch Time Tracking
  const observerRef = useRef<IntersectionObserver | null>(null);
  const entryTimes = useRef<Record<string, number>>({});
  const videoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadFeed = async () => {
      try {
        let rec: RecommendationResponse | null = null;
        const saved = localStorage.getItem("scrolliq_last_recommendation");
        
        if (saved) {
          rec = JSON.parse(saved);
          setRecommendation(rec);
          if (rec?.videoId) {
            recordScrollIQActivity(rec.videoId, rec.recommendedTechReel, "opened");
          }
        }
        
        // Try to fetch dynamic feed from YouTube if we have a direction
        let candidates = [];
        if (rec && rec.recommendation_direction) {
          const ytToken = localStorage.getItem("scrolliq_youtube_token") || undefined;
          candidates = await fetchDynamicFeed(rec.recommendation_direction, ytToken);
        } else {
          candidates = await fetchCandidates();
        }
        
        let combinedFeed = [];
        
        if (rec && rec.videoId) {
          combinedFeed.push({
            isPrimary: true,
            videoId: rec.videoId,
            title: rec.recommendedTechReel,
            reason: rec.whyRecommendation
          });
        }
        
        // Append other candidates
        candidates.forEach(c => {
          if (c.videoId && c.videoId !== rec?.videoId) {
            combinedFeed.push({
              isPrimary: false,
              videoId: c.videoId,
              title: c.title,
              reason: "Curated technical content"
            });
          }
        });
        
        setFeed(combinedFeed);
      } catch (err) {
        console.error("Failed to load feed", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeed();
  }, []);

  // Set up Intersection Observer for Watch Time tracking
  useEffect(() => {
    if (loading || feed.length === 0) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const videoId = entry.target.getAttribute('data-video-id');
        const title = entry.target.getAttribute('data-video-title');
        if (!videoId || !title) return;

        if (entry.isIntersecting) {
          // Video just snapped into view - start timer
          entryTimes.current[videoId] = Date.now();
        } else {
          // Video snapped out of view - calculate duration
          const startTime = entryTimes.current[videoId];
          if (startTime) {
            const durationMs = Date.now() - startTime;
            const durationSeconds = durationMs / 1000;
            
            // Delete to avoid double-logging
            delete entryTimes.current[videoId];
            
            // Log watch duration to backend (tracked via watchPercent field for simplicity)
            recordScrollIQActivity(videoId, title, "watched", durationSeconds)
              .catch(err => console.error("Failed to log watch time:", err));
          }
        }
      });
    }, { threshold: 0.7 }); // Triggers when 70% of the video is visible

    // Observe all video elements
    Object.values(videoRefs.current).forEach(el => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, feed]);

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen w-full bg-slate-950 flex justify-center items-center overflow-hidden">
      
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium animate-pulse">Loading your custom feed...</p>
        </div>
      ) : feed.length > 0 ? (
        <>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
          <div className="relative w-full max-w-[400px] h-[90vh] bg-black rounded-3xl overflow-y-scroll snap-y snap-mandatory shadow-2xl border border-slate-800 hide-scrollbar">
            
            {feed.map((video, idx) => (
              <div 
                key={idx} 
                ref={(el) => {
                  videoRefs.current[video.videoId] = el;
                }}
                data-video-id={video.videoId}
                data-video-title={video.title}
                className="w-full h-full snap-start snap-always relative flex items-center justify-center overflow-hidden"
              >
                
                {/* Video Player */}
                <iframe 
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=${idx === 0 ? 1 : 0}&mute=0&controls=0&modestbranding=1&rel=0&loop=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-[150%] h-[150%] pointer-events-auto"
                ></iframe>

                {/* Overlay UI */}
                <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
                  
                  {/* Top Bar */}
                  <div className="flex justify-between items-start">
                    {video.isPrimary ? (
                      <div className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg">
                        <Zap className="w-3 h-3 text-yellow-300 fill-current" />
                        AI Recommended
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>

                  {/* Bottom Actions & Info */}
                  <div className="flex items-end justify-between">
                    <div className="flex-1 mr-4">
                      <h3 className="text-white font-bold text-lg leading-tight mb-2 drop-shadow-md">
                        {video.title}
                      </h3>
                      <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 pointer-events-auto">
                        <p className="text-xs text-blue-300 font-bold mb-1 uppercase tracking-wider">
                          {video.isPrimary ? "ScrollIQ Reason" : "Explore"}
                        </p>
                        <p className="text-sm text-slate-200 leading-snug">{video.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-6 items-center pointer-events-auto pb-4">
                      <button className="group flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-slate-800 transition-colors">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white drop-shadow-md">{Math.floor(Math.random() * 900 + 100)}</span>
                      </button>
                      <button className="group flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-slate-800 transition-colors">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white drop-shadow-md">{Math.floor(Math.random() * 90 + 10)}</span>
                      </button>
                      <button className="group flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-slate-800 transition-colors">
                          <Bookmark className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white drop-shadow-md">Save</span>
                      </button>
                      <button className="group flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-slate-800 transition-colors">
                          <Share2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white drop-shadow-md">Share</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm">
          <Zap className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Recommendation Found</h2>
          <p className="text-slate-400 mb-6 text-sm">Generate a smart recommendation in the Analytics Overview first to start your customized feed.</p>
          <Link href="/app" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors inline-block">
            Go to Overview
          </Link>
        </div>
      )}
    </div>
  );
}
