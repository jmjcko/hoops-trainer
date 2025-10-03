export type VideoPlatform = "youtube" | "facebook" | "unknown";

export interface VideoItem {
  id: string;
  url: string;
  platform: VideoPlatform;
  title?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  notes?: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
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


