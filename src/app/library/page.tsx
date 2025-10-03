"use client";

import { useEffect, useMemo, useState } from "react";
import { extractYouTubeId, buildFacebookEmbedUrl } from "@/lib/url";
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
    <div className="max-w-5xl mx-auto w-full py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Library</h1>

      {/* Browsing only; adding moved to Content Management */}

      

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Filter by category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded border ${activeCategory === "all" ? "bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent" : "bg-transparent"}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-3 py-1 rounded border ${activeCategory === cat ? "bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent" : "bg-transparent"}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredVideos.map(v => {
            const yt = extractYouTubeId(v.url);
            const src = yt ? `https://www.youtube.com/embed/${yt}` : (v.platform === "facebook" ? buildFacebookEmbedUrl(v.url) : v.url);
            return (
              <div key={v.id} className="space-y-2 rounded-xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm p-2">
                <div className="w-full bg-black/10 h-32 md:h-36 rounded-lg overflow-hidden">
                  <iframe className="w-full h-full" src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-contrast)]">
                      {v.category || "uncategorized"}
                    </span>
                    <span className="text-sm text-gray-500 truncate">{v.id}</span>
                  </div>
                  <button className="text-red-600" onClick={() => handleRemoveVideo(v.id)}>Remove</button>
                </div>
              </div>
            );
          })}
          {filteredVideos.length === 0 && <p className="text-gray-500">No videos for this category.</p>}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Exercises</h2>
        <ul className="space-y-2">
          {filteredExercises.map(e => (
            <li key={e.id} className="rounded border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex items-center gap-2">
                  <div className="font-medium truncate">{e.title}</div>
                  <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-contrast)]">{e.category || "uncategorized"}</span>
                </div>
                <button className="text-red-600" onClick={() => handleRemoveExercise(e.id)}>Remove</button>
              </div>
              {e.description && <div className="text-sm text-gray-500">{e.description}</div>}
            </li>
          ))}
          {filteredExercises.length === 0 && <p className="text-gray-500">No exercises for this category.</p>}
        </ul>
      </section>
    </div>
  );
}


