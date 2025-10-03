"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  content: string;
  category: string;
  timestamp: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching training content from YouTube and Instagram
    const mockTrainingContent: NewsItem[] = [
      {
        title: "Advanced Ball Handling Drills",
        content: "Master the fundamentals of ball control with these progressive dribbling exercises designed for all skill levels.",
        category: "YouTube - YouGotMojo",
        timestamp: "2 hours ago"
      },
      {
        title: "Shooting Form Breakdown",
        content: "Perfect your shooting technique with detailed analysis of proper form, follow-through, and shot mechanics.",
        category: "Instagram - @shotbasketball23",
        timestamp: "4 hours ago"
      },
      {
        title: "Youth Basketball Fundamentals",
        content: "Essential skills and drills for young players to develop proper basketball foundation and technique.",
        category: "YouTube - Kids Basketball Training",
        timestamp: "6 hours ago"
      },
      {
        title: "One-on-One Defense Techniques",
        content: "Learn effective defensive strategies and footwork to become a lockdown defender on the court.",
        category: "YouTube - OneUp Basketball",
        timestamp: "8 hours ago"
      },
      {
        title: "Conditioning for Basketball",
        content: "Build endurance and athleticism with basketball-specific conditioning drills and workout routines.",
        category: "YouTube - ILB",
        timestamp: "1 day ago"
      },
      {
        title: "Game Situation Drills",
        content: "Practice real game scenarios with these competitive drills that simulate actual game conditions.",
        category: "Instagram - @shotbasketball23",
        timestamp: "2 days ago"
      }
    ];

    setTimeout(() => {
      setNews(mockTrainingContent);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-[var(--foreground)]">
          Welcome to HOOPS Trainer
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
          Build your basketball skills with personalized training plans, video tutorials, and expert exercises.
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="/library" 
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-medium shadow-2 hover:shadow-3 transition-all duration-200"
          >
            Browse Library
          </a>
          <a 
            href="/plan-builder" 
            className="px-6 py-3 rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] font-medium shadow-1 hover:shadow-2 transition-all duration-200"
          >
            Create Plan
          </a>
        </div>
      </div>

      {/* Basketball Training Feed */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Latest Training Content</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[var(--surface)] shadow-1 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-[var(--surface-variant)] rounded mb-3"></div>
                <div className="h-3 bg-[var(--surface-variant)] rounded mb-2"></div>
                <div className="h-3 bg-[var(--surface-variant)] rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item, index) => (
              <article key={index} className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                    {item.category}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{item.timestamp}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  {item.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Featured Training Sources */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Featured Training Sources</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">YouGotMojo</h3>
                <p className="text-sm text-[var(--muted)]">Advanced Training</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">Professional basketball training and skill development for serious players.</p>
            <a href="https://www.youtube.com/@yougotmojo" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium">
              View Channel →
            </a>
          </div>

          <div className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">ILB</h3>
                <p className="text-sm text-[var(--muted)]">Intense Training</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">High-intensity basketball conditioning and skill development programs.</p>
            <a href="https://www.youtube.com/@ILB" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium">
              View Channel →
            </a>
          </div>

          <div className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.069 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">@shotbasketball23</h3>
                <p className="text-sm text-[var(--muted)]">Shooting Specialist</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">Expert shooting techniques and form analysis for all skill levels.</p>
            <a href="https://www.instagram.com/shotbasketball23/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium">
              View Profile →
            </a>
          </div>

          <div className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">OneUp Basketball</h3>
                <p className="text-sm text-[var(--muted)]">Skill Development</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">Comprehensive basketball training programs for skill enhancement.</p>
            <a href="https://www.youtube.com/@OneUpBasketball" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium">
              View Channel →
            </a>
          </div>

          <div className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Kids Basketball Training</h3>
                <p className="text-sm text-[var(--muted)]">Youth Development</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">Age-appropriate training and fundamentals for young basketball players.</p>
            <a href="https://www.youtube.com/@KidsBasketballTraining" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium">
              View Channel →
            </a>
          </div>

          <div className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.069 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Instagram Reels</h3>
                <p className="text-sm text-[var(--muted)]">Quick Tips</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">Bite-sized training tips and quick drills from our Instagram feed.</p>
            <a href="https://www.instagram.com/reel/DJMRg7_NACC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium">
              View Reel →
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-[var(--surface)] shadow-1 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">Get Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-[var(--accent-contrast)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="font-semibold text-[var(--foreground)]">Browse Library</h4>
            <p className="text-sm text-[var(--muted)]">Access videos and exercises</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-[var(--accent-contrast)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="font-semibold text-[var(--foreground)]">Add Content</h4>
            <p className="text-sm text-[var(--muted)]">Upload your own videos</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-[var(--accent-contrast)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h4 className="font-semibold text-[var(--foreground)]">Create Plans</h4>
            <p className="text-sm text-[var(--muted)]">Build training routines</p>
          </div>
        </div>
      </section>
    </div>
  );
}
