export type ResourcePlatform = "youtube" | "instagram" | "facebook";

export interface Resource {
  id: string;
  name: string;
  platform: ResourcePlatform;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  followerCount?: string;
  isVerified?: boolean;
  addedAt: string;
  visibility: "public" | "private";
  userId?: string; // undefined for anonymous users
}

export interface ResourceFormData {
  name: string;
  platform: ResourcePlatform;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  followerCount?: string;
  isVerified?: boolean;
}
