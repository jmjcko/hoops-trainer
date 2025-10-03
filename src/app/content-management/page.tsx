"use client";

import { useEffect, useState } from "react";
import { detectVideoPlatform, extractYouTubeId, validateFacebookUrlEmbeddable } from "@/lib/url";
import { loadVisibleLibrary, upsertExercise, upsertVideo } from "@/lib/storage";
import { ExerciseItem, LibraryState, VideoItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function ContentManagementPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoVisibility, setVideoVisibility] = useState<"public" | "private">("public");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseDesc, setExerciseDesc] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("");
  const [exerciseVisibility, setExerciseVisibility] = useState<"public" | "private">("public");

  useEffect(() => {
    setLib(loadVisibleLibrary());
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
      visibility: videoVisibility,
    };
    const updated = upsertVideo(item);
    setLib(updated);
    setVideoUrl("");
    setVideoCategory("");
    setVideoVisibility("public");
    setVideoError(null);
  };

  const handleAddExercise = () => {
    if (!exerciseTitle.trim()) return;
    const ex: ExerciseItem = {
      id: createId("ex"),
      title: exerciseTitle.trim(),
      category: exerciseCategory.trim() || undefined,
      description: exerciseDesc.trim() || undefined,
      visibility: exerciseVisibility,
    };
    const updated = upsertExercise(ex);
    setLib(updated);
    setExerciseTitle("");
    setExerciseDesc("");
    setExerciseCategory("");
    setExerciseVisibility("public");
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-10 space-y-10">
      <h1 className="text-4xl font-bold text-[var(--foreground)]">Content Management</h1>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Add video by URL</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Paste YouTube, Shorts, Facebook URL"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <input
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Category (e.g., shooting, dribbling)"
            list="category-options"
            value={videoCategory}
            onChange={e => setVideoCategory(e.target.value)}
          />
          <select
            className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            value={videoVisibility}
            onChange={e => setVideoVisibility(e.target.value as "public" | "private")}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <button className="rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-6 py-3 font-medium shadow-2 hover:shadow-3 transition-all duration-200" onClick={handleAddVideo}>
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

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Add exercise</h2>
        <div className="flex flex-col gap-4">
          <input
            className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Title"
            value={exerciseTitle}
            onChange={e => setExerciseTitle(e.target.value)}
          />
          <textarea
            className="min-h-32 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200 resize-none"
            placeholder="Description (optional)"
            value={exerciseDesc}
            onChange={e => setExerciseDesc(e.target.value)}
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
              placeholder="Category (e.g., shooting, dribbling)"
              list="category-options"
              value={exerciseCategory}
              onChange={e => setExerciseCategory(e.target.value)}
            />
            <select
              className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
              value={exerciseVisibility}
              onChange={e => setExerciseVisibility(e.target.value as "public" | "private")}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button className="rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-6 py-3 font-medium shadow-2 hover:shadow-3 transition-all duration-200" onClick={handleAddExercise}>
              Add Exercise
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


