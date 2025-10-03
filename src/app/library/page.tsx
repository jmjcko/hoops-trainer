"use client";

import { useEffect, useMemo, useState } from "react";
import { detectVideoPlatform, extractYouTubeId } from "@/lib/url";
import { loadLibrary, removeVideo, upsertExercise, upsertVideo } from "@/lib/storage";
import { ExerciseItem, LibraryState, VideoItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function LibraryPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [videoUrl, setVideoUrl] = useState("");
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseDesc, setExerciseDesc] = useState("");

  useEffect(() => {
    setLib(loadLibrary());
  }, []);

  const handleAddVideo = () => {
    const url = videoUrl.trim();
    if (!url) return;
    const platform = detectVideoPlatform(url);
    const idBase = platform === "youtube" ? extractYouTubeId(url) ?? createId("yt") : createId("vid");
    const item: VideoItem = {
      id: idBase,
      url,
      platform,
    };
    const updated = upsertVideo(item);
    setLib(updated);
    setVideoUrl("");
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
      description: exerciseDesc.trim() || undefined,
    };
    const updated = upsertExercise(ex);
    setLib(updated);
    setExerciseTitle("");
    setExerciseDesc("");
  };

  const videoEmbeds = useMemo(() => {
    return lib.videos.map(v => {
      if (v.platform === "youtube") {
        const yt = extractYouTubeId(v.url);
        if (yt) {
          return { id: v.id, src: `https://www.youtube.com/embed/${yt}` };
        }
      }
      return { id: v.id, src: v.url };
    });
  }, [lib.videos]);

  return (
    <div className="max-w-5xl mx-auto w-full py-10 space-y-10">
      <h1 className="text-2xl font-semibold">Library</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Add video by URL</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400"
            placeholder="Paste YouTube, Shorts, Facebook URL"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <button className="rounded bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2" onClick={handleAddVideo}>
            Add Video
          </button>
        </div>
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
            placeholder="Description (optional)"
            value={exerciseDesc}
            onChange={e => setExerciseDesc(e.target.value)}
          />
          <button className="rounded bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2" onClick={handleAddExercise}>
            Add Exercise
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoEmbeds.map(v => (
            <div key={v.id} className="space-y-2">
              <div className="aspect-video w-full bg-black/10">
                <iframe className="w-full h-full" src={v.src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{v.id}</span>
                <button className="text-red-600" onClick={() => handleRemoveVideo(v.id)}>Remove</button>
              </div>
            </div>
          ))}
          {videoEmbeds.length === 0 && <p className="text-gray-500">No videos yet.</p>}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Exercises</h2>
        <ul className="space-y-2">
          {lib.exercises.map(e => (
            <li key={e.id} className="rounded border p-3">
              <div className="font-medium">{e.title}</div>
              {e.description && <div className="text-sm text-gray-500">{e.description}</div>}
            </li>
          ))}
          {lib.exercises.length === 0 && <p className="text-gray-500">No exercises yet.</p>}
        </ul>
      </section>
    </div>
  );
}


