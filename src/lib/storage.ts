"use client";

import { ExerciseItem, LibraryState, TrainingPlan, VideoItem } from "@/types/library";
import { getSession } from "next-auth/react";

const LIBRARY_KEY = "ht_library_v1";
const PLANS_KEY = "ht_plans_v1";

// Get current user ID from NextAuth session
async function getCurrentUserId(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;
  
  try {
    const session = await getSession();
    return session?.user?.email || undefined;
  } catch {
    // Fallback to sessionStorage for anonymous users
    let userId = sessionStorage.getItem("ht_user_id");
    if (!userId) {
      userId = `anonymous_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("ht_user_id", userId);
    }
    return userId;
  }
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
export async function loadVisibleLibrary(): Promise<LibraryState> {
  const allContent = loadLibrary();
  const currentUserId = await getCurrentUserId();
  
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

export async function upsertVideo(video: VideoItem): Promise<LibraryState> {
  const lib = loadLibrary();
  const currentUserId = await getCurrentUserId();
  
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

export async function upsertExercise(ex: ExerciseItem): Promise<LibraryState> {
  const lib = loadLibrary();
  const currentUserId = await getCurrentUserId();
  
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

// Load only plans that should be visible to current user
export async function loadVisiblePlans(): Promise<TrainingPlan[]> {
  const allPlans = loadPlans();
  const currentUserId = await getCurrentUserId();
  
  return allPlans.filter(plan => 
    plan.visibility === "public" || plan.userId === currentUserId
  );
}

export function savePlans(plans: TrainingPlan[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export async function upsertPlan(plan: TrainingPlan): Promise<TrainingPlan[]> {
  const plans = loadPlans();
  const currentUserId = await getCurrentUserId();
  const now = new Date().toISOString();
  
  // Ensure the plan has the current user ID, visibility, and timestamps
  const planWithUser = {
    ...plan,
    userId: currentUserId,
    visibility: plan.visibility || "public",
    createdAt: plan.createdAt || now,
    updatedAt: now
  };
  
  const idx = plans.findIndex(p => p.id === plan.id);
  if (idx === -1) {
    plans.unshift(planWithUser);
  } else {
    plans[idx] = planWithUser;
  }
  
  savePlans(plans);
  return plans;
}

export function removePlan(id: string): TrainingPlan[] {
  const plans = loadPlans();
  const filtered = plans.filter(p => p.id !== id);
  savePlans(filtered);
  return filtered;
}


