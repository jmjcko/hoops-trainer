"use client";

import { useEffect, useState } from "react";
import { detectVideoPlatform, extractYouTubeId, validateFacebookUrlEmbeddable } from "@/lib/url";
import { loadLibrary, upsertExercise, upsertVideo } from "@/lib/storage";
import { ExerciseItem, LibraryState, VideoItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function ContentManagementPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseDesc, setExerciseDesc] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("");

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
    setVideoCategory("");
    setVideoError(null);
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

  return (
    <div className="max-w-5xl mx-auto w-full py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Content Management</h1>

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
        <div className="flex flex-col gap-2">
          <input
            className="rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Title"
            value={exerciseTitle}
            onChange={e => setExerciseTitle(e.target.value)}
          />
          <textarea
            className="min-h-28 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Description (optional)"
            value={exerciseDesc}
            onChange={e => setExerciseDesc(e.target.value)}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
              placeholder="Category (e.g., shooting, dribbling)"
              list="category-options"
              value={exerciseCategory}
              onChange={e => setExerciseCategory(e.target.value)}
            />
            <button className="rounded bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2" onClick={handleAddExercise}>
              Add Exercise
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


