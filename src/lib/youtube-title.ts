// Function to fetch YouTube video title from video ID
export async function fetchYouTubeVideoTitle(videoId: string): Promise<string | null> {
  // For now, we'll use a simple approach that works without API key
  // In a real implementation, you'd use the YouTube Data API
  
  try {
    // Try to fetch from YouTube's oEmbed API (no key required)
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (response.ok) {
      const data = await response.json();
      return data.title || null;
    }
  } catch (error) {
    console.log('Could not fetch title from oEmbed API:', error);
  }

  // Fallback: return a generic title
  return `YouTube Video ${videoId}`;
}

// Function to extract video ID from YouTube URL
export function extractVideoIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    
    if (host.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    
    if (host.includes("youtube.com")) {
      return u.searchParams.get("v");
    }
    
    return null;
  } catch {
    return null;
  }
}
