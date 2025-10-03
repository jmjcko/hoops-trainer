"use client";

import { ExerciseItem, LibraryState, TrainingPlan, VideoItem } from "@/types/library";

const LIBRARY_KEY = "ht_library_v1";
const PLANS_KEY = "ht_plans_v1";

export function loadLibrary(): LibraryState {
  if (typeof window === "undefined") return { videos: [], exercises: [] };
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return { videos: [], exercises: [] };
    return JSON.parse(raw);
  } catch {
    return { videos: [], exercises: [] };
  }
}

export function saveLibrary(state: LibraryState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(state));
}

export function upsertVideo(video: VideoItem): LibraryState {
  const lib = loadLibrary();
  const idx = lib.videos.findIndex(v => v.id === video.id);
  if (idx === -1) lib.videos.unshift(video);
  else lib.videos[idx] = video;
  saveLibrary(lib);
  return lib;
}

export function removeVideo(id: string): LibraryState {
  const lib = loadLibrary();
  saveLibrary({ ...lib, videos: lib.videos.filter(v => v.id !== id) });
  return loadLibrary();
}

export function upsertExercise(ex: ExerciseItem): LibraryState {
  const lib = loadLibrary();
  const idx = lib.exercises.findIndex(e => e.id === ex.id);
  if (idx === -1) lib.exercises.unshift(ex);
  else lib.exercises[idx] = ex;
  saveLibrary(lib);
  return lib;
}

export function removeExercise(id: string): LibraryState {
  const lib = loadLibrary();
  saveLibrary({ ...lib, exercises: lib.exercises.filter(e => e.id !== id) });
  return loadLibrary();
}

export function loadPlans(): TrainingPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePlans(plans: TrainingPlan[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}


