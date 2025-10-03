"use client";

import { useEffect, useMemo, useState } from "react";
import { detectVideoPlatform, extractYouTubeId, buildFacebookEmbedUrl, validateFacebookUrlEmbeddable } from "@/lib/url";
import { loadLibrary, removeVideo, upsertExercise, upsertVideo } from "@/lib/storage";
import { ExerciseItem, LibraryState, VideoItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function LibraryPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseDesc, setExerciseDesc] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    setLib(loadLibrary());
  }, []);

  const handleAddVideo = () => {
    const url = videoUrl.trim();
    if (!url) return;
    const platform = detectVideoPlatform(url);
    if (platform === "facebook") {
      const valid = validateFacebookUrlEmbeddable(url);
      if (!valid.ok) {
        setVideoError(valid.hint ? `${valid.reason} ${valid.hint}` : valid.reason);
        return;
      }
    }
    const idBase = platform === "youtube" ? extractYouTubeId(url) ?? createId("yt") : createId("vid");
    const item: VideoItem = {
      id: idBase,
      url,
      platform,
      category: videoCategory.trim() || undefined,
    };
    const updated = upsertVideo(item);
    setLib(updated);
    setVideoUrl("");
    setVideoError(null);
    setVideoCategory("");
  };

  const handleRemoveVideo = (id: string) => {
    const updated = removeVideo(id);
    setLib(updated);
  };

  const handleAddExercise = () => {
    if (!exerciseTitle.trim()) return;
    const ex: ExerciseItem = {
      id: createId("ex"),
      title: exerciseTitle.trim(),
      category: exerciseCategory.trim() || undefined,
      description: exerciseDesc.trim() || undefined,
    };
    const updated = upsertExercise(ex);
    setLib(updated);
    setExerciseTitle("");
    setExerciseDesc("");
    setExerciseCategory("");
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

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Add video by URL</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Paste YouTube, Shorts, Facebook URL"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <input
            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Category (e.g., shooting, dribbling)"
            list="category-options"
            value={videoCategory}
            onChange={e => setVideoCategory(e.target.value)}
          />
          <button className="rounded bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2" onClick={handleAddVideo}>
            Add Video
          </button>
        </div>
        <datalist id="category-options">
          <option value="shooting" />
          <option value="dribbling" />
          <option value="passing" />
          <option value="defense" />
          <option value="conditioning" />
          <option value="footwork" />
        </datalist>
        {videoError && <p className="text-sm text-red-600">{videoError}</p>}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Add exercise</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Title"
            value={exerciseTitle}
            onChange={e => setExerciseTitle(e.target.value)}
          />
          <input
            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Category (e.g., shooting, dribbling)"
            list="category-options"
            value={exerciseCategory}
            onChange={e => setExerciseCategory(e.target.value)}
          />
          <input
            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Description (optional)"
            value={exerciseDesc}
            onChange={e => setExerciseDesc(e.target.value)}
          />
          <button className="rounded bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2" onClick={handleAddExercise}>
            Add Exercise
          </button>
        </div>
      </section>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.map(v => {
            const yt = extractYouTubeId(v.url);
            const src = yt ? `https://www.youtube.com/embed/${yt}` : (v.platform === "facebook" ? buildFacebookEmbedUrl(v.url) : v.url);
            return (
              <div key={v.id} className="space-y-2">
                <div className="w-full bg-black/10 h-40 md:h-48">
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
              <div className="flex items-center gap-2">
                <div className="font-medium truncate">{e.title}</div>
                <span className="text-xs rounded-full px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-contrast)]">{e.category || "uncategorized"}</span>
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


