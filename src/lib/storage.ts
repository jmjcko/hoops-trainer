"use client";

import { ExerciseItem, LibraryState, TrainingPlan, VideoItem } from "@/types/library";

const LIBRARY_KEY = "ht_library_v1";
const PLANS_KEY = "ht_plans_v1";

// Get current user ID (for now, we'll use a simple session ID)
function getCurrentUserId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  let userId = sessionStorage.getItem("ht_user_id");
  if (!userId) {
    userId = `user_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("ht_user_id", userId);
  }
  return userId;
}

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

// Load only content that should be visible to current user
export function loadVisibleLibrary(): LibraryState {
  const allContent = loadLibrary();
  const currentUserId = getCurrentUserId();
  
  return {
    videos: allContent.videos.filter(v => 
      v.visibility === "public" || v.userId === currentUserId
    ),
    exercises: allContent.exercises.filter(e => 
      e.visibility === "public" || e.userId === currentUserId
    )
  };
}

export function saveLibrary(state: LibraryState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(state));
}

export function upsertVideo(video: VideoItem): LibraryState {
  const lib = loadLibrary();
  const currentUserId = getCurrentUserId();
  
  // Ensure the video has the current user ID and visibility
  const videoWithUser = {
    ...video,
    userId: currentUserId,
    visibility: video.visibility || "public"
  };
  
  const idx = lib.videos.findIndex(v => v.id === video.id);
  if (idx === -1) lib.videos.unshift(videoWithUser);
  else lib.videos[idx] = videoWithUser;
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
  const currentUserId = getCurrentUserId();
  
  // Ensure the exercise has the current user ID and visibility
  const exerciseWithUser = {
    ...ex,
    userId: currentUserId,
    visibility: ex.visibility || "public"
  };
  
  const idx = lib.exercises.findIndex(e => e.id === ex.id);
  if (idx === -1) lib.exercises.unshift(exerciseWithUser);
  else lib.exercises[idx] = exerciseWithUser;
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


