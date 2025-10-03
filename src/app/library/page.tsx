"use client";

import { useEffect, useMemo, useState } from "react";
import { extractYouTubeId, buildFacebookEmbedUrl, detectVideoPlatform, getVideoSourceInfo } from "@/lib/url";
import { loadLibrary, removeVideo, removeExercise } from "@/lib/storage";
import { LibraryState } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function LibraryPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  // browse-only state
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    setLib(loadLibrary());
  }, []);

  const handleRemoveVideo = (id: string) => {
    const updated = removeVideo(id);
    setLib(updated);
  };

  const handleRemoveExercise = (id: string) => {
    const updated = removeExercise(id);
    setLib(updated);
  };

  const videoEmbeds = useMemo(() => {
    return lib.videos.map(v => {
      if (v.platform === "youtube") {
        const yt = extractYouTubeId(v.url);
        if (yt) return { id: v.id, src: `https://www.youtube.com/embed/${yt}` };
      }
      if (v.platform === "facebook") {
        return { id: v.id, src: buildFacebookEmbedUrl(v.url) };
      }
      return { id: v.id, src: v.url };
    });
  }, [lib.videos]);

  const categories = useMemo(() => {
    const defaults = ["shooting", "dribbling", "passing", "defense", "conditioning", "footwork"];
    const set = new Set<string>(defaults);
    lib.videos.forEach(v => { if (v.category) set.add(v.category); });
    lib.exercises.forEach(e => { if (e.category) set.add(e.category); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [lib]);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return lib.videos;
    return lib.videos.filter(v => (v.category || "uncategorized") === activeCategory);
  }, [lib.videos, activeCategory]);

  const filteredExercises = useMemo(() => {
    if (activeCategory === "all") return lib.exercises;
    return lib.exercises.filter(e => (e.category || "uncategorized") === activeCategory);
  }, [lib.exercises, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto w-full py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">Library</h1>
        <p className="text-[var(--muted)] text-lg">Browse and manage your training content</p>
      </div>

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
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredVideos.map(v => {
            const yt = extractYouTubeId(v.url);
            const src = v.platform === "youtube" && yt
              ? `https://www.youtube.com/embed/${yt}`
              : (v.platform === "facebook" ? buildFacebookEmbedUrl(v.url) : v.url);
            const platform = detectVideoPlatform(v.url);
            const sourceInfo = getVideoSourceInfo(platform);
            return (
              <div key={v.id} className="bg-[var(--surface)] shadow-1 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-2">
                <div className="w-full bg-black/10 h-32 md:h-36 relative">
                  <iframe className="w-full h-full" src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  <div className="absolute top-2 right-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sourceInfo.color} ${sourceInfo.textColor} shadow-lg`}>
                      {platform === "youtube" && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )}
                      {platform === "facebook" && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                      {platform === "unknown" && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span>{sourceInfo.name}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                      {v.category || "uncategorized"}
                    </span>
                    <button 
                      className="text-[var(--error)] hover:text-[var(--error)]/80 transition-colors text-sm font-medium"
                      onClick={() => handleRemoveVideo(v.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-xs text-[var(--muted)] truncate">{v.id}</div>
                </div>
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


