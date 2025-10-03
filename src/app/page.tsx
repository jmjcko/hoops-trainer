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
    // Simulate fetching news (in a real app, you'd fetch from an API)
    const mockNews: NewsItem[] = [
      {
        title: "Victor Wembanyama's Intensive Offseason Training",
        content: "San Antonio Spurs' center underwent rigorous summer training including practices at a Shaolin temple in China and sessions at NASA's Johnson Space Center.",
        category: "NBA",
        timestamp: "2 hours ago"
      },
      {
        title: "Al Horford Joins the Warriors",
        content: "Veteran forward Al Horford has signed a multi-year deal with the Golden State Warriors, aiming to bolster their frontcourt depth for the upcoming season.",
        category: "NBA",
        timestamp: "4 hours ago"
      },
      {
        title: "Turkey's Alperen Sengun Sets Record",
        content: "Alperen Sengun led Turkey to an 84-64 victory over Estonia, setting a remarkable record during the EuroBasket 2025 game.",
        category: "International",
        timestamp: "6 hours ago"
      },
      {
        title: "Pac-12 Conference Expansion",
        content: "The Pac-12 is actively working to rebuild by adding new teams, aiming to strengthen its position in college basketball.",
        category: "College",
        timestamp: "8 hours ago"
      }
    ];

    setTimeout(() => {
      setNews(mockNews);
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

      {/* Basketball News Feed */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Latest Basketball News</h2>
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
