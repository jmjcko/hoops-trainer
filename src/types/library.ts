export type VideoPlatform = "youtube" | "facebook" | "unknown";

export interface VideoItem {
  id: string;
  url: string;
  platform: VideoPlatform;
  category?: string;
  title?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  notes?: string;
  visibility: "public" | "private";
  userId?: string; // undefined for anonymous users
}

export interface ExerciseItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  durationMinutes?: number;
  visibility: "public" | "private";
  userId?: string; // undefined for anonymous users
}

export interface TrainingUnitItem {
  id: string;
  type: "video" | "exercise";
  refId: string; // id of VideoItem or ExerciseItem
  durationMinutes?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  items: TrainingUnitItem[];
}

export interface LibraryState {
  videos: VideoItem[];
  exercises: ExerciseItem[];
}


