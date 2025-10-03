import { loadVisibleLibrary, upsertVideo } from "./storage";
import { fetchYouTubeVideoTitle, extractVideoIdFromUrl } from "./youtube-title";

// Function to update titles for existing videos that don't have them
export async function updateVideoTitles(): Promise<void> {
  const library = loadVisibleLibrary();
  
  for (const video of library.videos) {
    if (video.platform === "youtube" && !video.title) {
      const videoId = extractVideoIdFromUrl(video.url);
      if (videoId) {
        try {
          const title = await fetchYouTubeVideoTitle(videoId);
          if (title) {
            const updatedVideo = { ...video, title };
            upsertVideo(updatedVideo);
            console.log(`Updated title for video ${video.id}: ${title}`);
          }
        } catch (error) {
          console.log(`Could not fetch title for video ${video.id}:`, error);
        }
      }
    }
  }
}

// Function to update a specific video's title
export async function updateVideoTitle(videoId: string): Promise<string | null> {
  const library = loadVisibleLibrary();
  const video = library.videos.find(v => v.id === videoId);
  
  if (!video || video.platform !== "youtube") {
    return null;
  }
  
  const youtubeVideoId = extractVideoIdFromUrl(video.url);
  if (!youtubeVideoId) {
    return null;
  }
  
  try {
    const title = await fetchYouTubeVideoTitle(youtubeVideoId);
    if (title) {
      const updatedVideo = { ...video, title };
      upsertVideo(updatedVideo);
      return title;
    }
  } catch (error) {
    console.log(`Could not fetch title for video ${videoId}:`, error);
  }
  
  return null;
}
