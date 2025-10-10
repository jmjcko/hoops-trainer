"use client";

import { useEffect, useMemo, useState } from "react";
import { detectVideoPlatform } from "@/lib/url";
import { loadVisibleLibrary, removeVideo, removeExercise } from "@/lib/storage";
import { LibraryState } from "@/types/library";


export default function LibraryPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  // browse-only state
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");

  useEffect(() => {
    const loadData = async () => {
      setLib(await loadVisibleLibrary());
    };
    loadData();
  }, []);

  const handleRemoveVideo = (id: string) => {
    const updated = removeVideo(id);
    setLib(updated);
  };

  const handleRemoveExercise = (id: string) => {
    const updated = removeExercise(id);
    setLib(updated);
  };


  const categories = useMemo(() => {
    const defaults = ["shooting", "dribbling", "passing", "defense", "conditioning", "footwork"];
    const set = new Set<string>(defaults);
    lib.videos.forEach(v => { if (v.category) set.add(v.category); });
    lib.exercises.forEach(e => { if (e.category) set.add(e.category); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [lib]);

  const filteredVideos = useMemo(() => {
    let filtered = lib.videos;
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(v => (v.category || "uncategorized") === activeCategory);
    }
    
    // Filter by visibility
    if (visibilityFilter !== "all") {
      filtered = filtered.filter(v => v.visibility === visibilityFilter);
    }
    
    return filtered;
  }, [lib.videos, activeCategory, visibilityFilter]);

  const filteredExercises = useMemo(() => {
    let filtered = lib.exercises;
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(e => (e.category || "uncategorized") === activeCategory);
    }
    
    // Filter by visibility
    if (visibilityFilter !== "all") {
      filtered = filtered.filter(e => e.visibility === visibilityFilter);
    }
    
    return filtered;
  }, [lib.exercises, activeCategory, visibilityFilter]);

  return (
    <div className="max-w-5xl mx-auto w-full py-8 space-y-8">

      {/* Browsing only; adding moved to Content Management */}

      

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Filter by category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-6 py-3 rounded-full transition-all duration-200 ${activeCategory === "all" ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-2" : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:shadow-1 hover:border-[var(--accent)]"}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-6 py-3 rounded-full transition-all duration-200 ${activeCategory === cat ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-2" : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:shadow-1 hover:border-[var(--accent)]"}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Filter by visibility</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 ${visibilityFilter === "all" ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-2" : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:shadow-1 hover:border-[var(--accent)]"}`}
            onClick={() => setVisibilityFilter("all")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            All
          </button>
          <button
            className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 ${visibilityFilter === "public" ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-2" : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:shadow-1 hover:border-[var(--accent)]"}`}
            onClick={() => setVisibilityFilter("public")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Public
          </button>
          <button
            className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 ${visibilityFilter === "private" ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-2" : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:shadow-1 hover:border-[var(--accent)]"}`}
            onClick={() => setVisibilityFilter("private")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
            Private
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Videos</h2>
        <div className="space-y-3">
          {filteredVideos.map(v => {
            const platform = detectVideoPlatform(v.url);
            
            // Get platform icon and color
            const getPlatformIcon = (platform: string) => {
              if (platform === "youtube") {
                return (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                );
              }
              if (platform === "facebook") {
                return (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                );
              }
              return (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              );
            };

            const getPlatformColor = (platform: string) => {
              if (platform === "youtube") return "bg-red-500";
              if (platform === "facebook") return "bg-blue-600";
              return "bg-gray-500";
            };

            const getPlatformName = (platform: string) => {
              if (platform === "youtube") return "YouTube";
              if (platform === "facebook") return "Facebook";
              return "Video";
            };

            return (
              <div key={v.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-3 transition-all duration-200 hover:shadow-2 cursor-pointer group">
                <a 
                  href={v.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${getPlatformColor(platform)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {getPlatformIcon(platform)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">
                          {v.title || `${getPlatformName(platform)} Video`}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                          {v.category || "uncategorized"}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${v.visibility === "public" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                          {v.visibility === "public" ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Public
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                              Private
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <button 
                        className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors text-sm font-medium flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveVideo(v.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
          {filteredVideos.length === 0 && <p className="text-gray-500">No videos for this category.</p>}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Exercises</h2>
        <ul className="space-y-2">
          {filteredExercises.map(e => (
            <li key={e.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-4 transition-all duration-200 hover:shadow-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-[var(--foreground)] truncate">{e.title}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                      {e.category || "uncategorized"}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${e.visibility === "public" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                      {e.visibility === "public" ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Public
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Private
                        </>
                      )}
                    </span>
                  </div>
                  {e.description && <p className="text-sm text-[var(--muted)] leading-relaxed">{e.description}</p>}
                </div>
                <button 
                  className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors text-sm font-medium flex-shrink-0"
                  onClick={() => handleRemoveExercise(e.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          {filteredExercises.length === 0 && <p className="text-gray-500">No exercises for this category.</p>}
        </ul>
      </section>
    </div>
  );
}


