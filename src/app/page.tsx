"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { loadVisibleResources } from "@/lib/resource-storage";
import { Resource } from "@/types/resource";

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = () => {
      try {
        const userResources = loadVisibleResources();
        setResources(userResources);
        setLoading(false);
      } catch (error) {
        console.error('Error loading resources:', error);
        setResources([]);
        setLoading(false);
      }
    };

    // Small delay to ensure client-side
    setTimeout(loadResources, 100);
  }, []);

  // Get platform icon
  function getPlatformIcon(platform: Resource['platform']) {
    switch (platform) {
      case "youtube":
        return (
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case "facebook":
        return (
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  }

  // Get platform color
  function getPlatformColor(platform: Resource['platform']) {
    switch (platform) {
      case "youtube":
        return "bg-red-500";
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "facebook":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
          Build your personalized basketball training plans, video tutorials, and expert exercises.
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
          <a 
            href="/plans" 
            className="px-6 py-3 rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] font-medium shadow-1 hover:shadow-2 transition-all duration-200"
          >
            View Plans
          </a>
        </div>
      </div>

      {/* Resources Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">Resources</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[var(--surface)] shadow-1 rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No Resources Yet</h3>
            <p className="text-[var(--muted)] mb-4">Add YouTube channels, Instagram profiles, or Facebook pages to see them here.</p>
            <a 
              href="/content-management" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Resources
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-6 hover:shadow-2 transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${getPlatformColor(resource.platform)} rounded-full flex items-center justify-center`}>
                    {getPlatformIcon(resource.platform)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--foreground)]">{resource.name}</h3>
                      {resource.isVerified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted)] capitalize">{resource.platform}</p>
                    {resource.followerCount && (
                      <p className="text-xs text-[var(--muted)]">{resource.followerCount} followers</p>
                    )}
                  </div>
                </div>

                {resource.description && (
                  <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">{resource.description}</p>
                )}

                {resource.thumbnailUrl && (
                  <div className="mb-4">
                    <Image 
                      src={resource.thumbnailUrl} 
                      alt={resource.name}
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent)]/80 text-sm font-medium transition-colors"
                >
                  {getPlatformIcon(resource.platform)}
                  View {resource.platform === "youtube" ? "Channel" : resource.platform === "instagram" ? "Profile" : "Page"} →
                </a>
              </div>
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