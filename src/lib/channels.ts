import { VideoItem } from "@/types/library";
import { loadVisibleLibrary } from "./storage";
import { extractYouTubeId } from "./url";

export interface ChannelInfo {
  channelId: string;
  channelName: string;
  channelUrl: string;
  videoCount: number;
  latestVideo?: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    url: string;
  };
}

// Extract YouTube channel information from a YouTube URL
export function extractYouTubeChannelInfo(url: string): { channelId: string; channelName: string; channelUrl: string } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    
    if (!host.includes("youtube.com") && !host.includes("youtu.be")) {
      return null;
    }

    // Handle different YouTube URL formats
    if (host.includes("youtu.be")) {
      // For youtu.be links, extract video ID and try to get channel info
      const videoId = u.pathname.slice(1);
      if (videoId) {
        return {
          channelId: `video-${videoId}`,
          channelName: "YouTube Channel",
          channelUrl: `https://www.youtube.com/watch?v=${videoId}`
        };
      }
      return {
        channelId: "youtube-generic",
        channelName: "YouTube Channel",
        channelUrl: "https://www.youtube.com/"
      };
    }

    // Handle youtube.com URLs
    const pathParts = u.pathname.split("/").filter(Boolean);
    
    // Check if it's a channel URL (youtube.com/@channelname or youtube.com/c/channelname)
    if (pathParts[0] === "@" || pathParts[0] === "c") {
      const channelHandle = pathParts[1];
      return {
        channelId: `@${channelHandle}`,
        channelName: channelHandle,
        channelUrl: `https://www.youtube.com/@${channelHandle}`
      };
    }

    // Check if it's a user URL (youtube.com/user/username)
    if (pathParts[0] === "user") {
      const username = pathParts[1];
      return {
        channelId: username,
        channelName: username,
        channelUrl: `https://www.youtube.com/user/${username}`
      };
    }

    // For regular video URLs (youtube.com/watch?v=VIDEO_ID), extract video ID
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return {
        channelId: `video-${videoId}`,
        channelName: "YouTube Channel",
        channelUrl: `https://www.youtube.com/watch?v=${videoId}`
      };
    }

    // Fallback for any other YouTube URL
    return {
      channelId: "youtube-generic",
      channelName: "YouTube Channel",
      channelUrl: "https://www.youtube.com/"
    };

  } catch {
    return null;
  }
}

// Function to fetch channel info from YouTube API for a video ID
export async function fetchChannelInfoFromVideoId(videoId: string, apiKey?: string): Promise<{ channelId: string; channelName: string; channelUrl: string } | null> {
  const key = apiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  
  if (!key) {
    // Without API key, return generic info
    return {
      channelId: `video-${videoId}`,
      channelName: "YouTube Channel",
      channelUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${key}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const channelId = video.snippet.channelId;
      const channelName = video.snippet.channelTitle;
      
      return {
        channelId: channelId,
        channelName: channelName,
        channelUrl: `https://www.youtube.com/channel/${channelId}`
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching channel info from YouTube API:', error);
    // Fallback to generic info
    return {
      channelId: `video-${videoId}`,
      channelName: "YouTube Channel",
      channelUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }
}

// Get all unique YouTube channels from the user's library
export function getChannelsFromLibrary(): ChannelInfo[] {
  // Only run on client side
  if (typeof window === "undefined") {
    return [];
  }
  
  const library = loadVisibleLibrary();
  const channelMap = new Map<string, ChannelInfo>();

  library.videos.forEach(video => {
    if (video.platform === "youtube" && video.url) {
      const channelInfo = extractYouTubeChannelInfo(video.url);
      
      if (channelInfo) {
        const key = channelInfo.channelId;
        
        if (channelMap.has(key)) {
          // Update existing channel
          const existing = channelMap.get(key)!;
          existing.videoCount += 1;
          
          // Update latest video if this one is newer (we'll use the first one for now)
          if (!existing.latestVideo) {
            existing.latestVideo = {
              id: video.id,
              title: video.title || "Untitled Video",
              thumbnailUrl: video.thumbnailUrl,
              url: video.url
            };
          }
        } else {
          // Create new channel
          channelMap.set(key, {
            ...channelInfo,
            videoCount: 1,
            latestVideo: {
              id: video.id,
              title: video.title || "Untitled Video",
              thumbnailUrl: video.thumbnailUrl,
              url: video.url
            }
          });
        }
      }
    }
  });

  return Array.from(channelMap.values()).sort((a, b) => b.videoCount - a.videoCount);
}

// Enhanced function to get channel info with better YouTube URL handling
export async function getEnhancedChannelsFromLibrary(): Promise<ChannelInfo[]> {
  const library = loadVisibleLibrary();
  const channelMap = new Map<string, ChannelInfo>();

  // Process all videos
  for (const video of library.videos) {
    if (video.platform === "youtube" && video.url) {
      let channelInfo = extractYouTubeChannelInfo(video.url);
      
      // If we got a generic channel info (video-VIDEO_ID), try to get real channel info
      if (channelInfo && channelInfo.channelId.startsWith('video-')) {
        const videoId = channelInfo.channelId.replace('video-', '');
        const realChannelInfo = await fetchChannelInfoFromVideoId(videoId);
        if (realChannelInfo) {
          channelInfo = realChannelInfo;
        }
      }
      
      if (channelInfo) {
        const key = channelInfo.channelId;
        
        if (channelMap.has(key)) {
          // Update existing channel
          const existing = channelMap.get(key)!;
          existing.videoCount += 1;
          
          // Update latest video if this one is newer (we'll use the first one for now)
          if (!existing.latestVideo) {
            existing.latestVideo = {
              id: video.id,
              title: video.title || "Untitled Video",
              thumbnailUrl: video.thumbnailUrl,
              url: video.url
            };
          }
        } else {
          // Create new channel
          channelMap.set(key, {
            ...channelInfo,
            videoCount: 1,
            latestVideo: {
              id: video.id,
              title: video.title || "Untitled Video",
              thumbnailUrl: video.thumbnailUrl,
              url: video.url
            }
          });
        }
      }
    }
  }

  return Array.from(channelMap.values()).sort((a, b) => b.videoCount - a.videoCount);
}

// Get channel info for a specific channel ID
export function getChannelInfo(channelId: string): ChannelInfo | null {
  const channels = getChannelsFromLibrary();
  return channels.find(channel => channel.channelId === channelId) || null;
}

