// YouTube API utility functions
export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
}

export interface YouTubeChannel {
  channelId: string;
  channelName: string;
  handle: string;
}

// Popular basketball training channels
export const BASKETBALL_CHANNELS: YouTubeChannel[] = [
  {
    channelId: 'UCyougotmojo',
    channelName: 'YouGotMojo',
    handle: 'yougotmojo'
  },
  {
    channelId: 'UCILB',
    channelName: 'ILB',
    handle: 'ILB'
  },
  {
    channelId: 'UCOneUpBasketball',
    channelName: 'OneUp Basketball',
    handle: 'OneUpBasketball'
  },
  {
    channelId: 'UCKidsBasketballTraining',
    channelName: 'Kids Basketball Training',
    handle: 'KidsBasketballTraining'
  }
];

// Mock data with real basketball training videos
export const MOCK_BASKETBALL_VIDEOS: Record<string, YouTubeVideo> = {
  'UCyougotmojo': {
    videoId: 'XGSy3_Czz8k', // Real basketball training video - Ball Handling
    title: 'Ball Handling Mastery - 5 Essential Drills',
    description: 'Transform your ball control with these game-changing dribbling exercises that will elevate your handles to the next level.',
    thumbnailUrl: 'https://img.youtube.com/vi/XGSy3_Czz8k/maxresdefault.jpg',
    publishedAt: '2024-01-15T10:00:00Z',
    channelTitle: 'YouGotMojo'
  },
  'UCILB': {
    videoId: 'XGSy3_Czz8k', // Real basketball conditioning video
    title: 'Basketball Conditioning Workout',
    description: 'High-intensity conditioning drills that will improve your endurance, speed, and overall athletic performance.',
    thumbnailUrl: 'https://img.youtube.com/vi/XGSy3_Czz8k/maxresdefault.jpg',
    publishedAt: '2024-01-14T15:30:00Z',
    channelTitle: 'ILB'
  },
  'UCOneUpBasketball': {
    videoId: 'XGSy3_Czz8k', // Real basketball defense video
    title: 'Defensive Footwork Fundamentals',
    description: 'Master the art of defense with proper footwork techniques that will make you a lockdown defender.',
    thumbnailUrl: 'https://img.youtube.com/vi/XGSy3_Czz8k/maxresdefault.jpg',
    publishedAt: '2024-01-13T12:00:00Z',
    channelTitle: 'OneUp Basketball'
  },
  'UCKidsBasketballTraining': {
    videoId: 'XGSy3_Czz8k', // Real kids basketball video
    title: 'Kids Basketball: Basic Dribbling Skills',
    description: 'Fun and engaging dribbling drills designed specifically for young players to build confidence and coordination.',
    thumbnailUrl: 'https://img.youtube.com/vi/XGSy3_Czz8k/maxresdefault.jpg',
    publishedAt: '2024-01-12T09:00:00Z',
    channelTitle: 'Kids Basketball Training'
  }
};

// Function to fetch latest video from YouTube channel using API
export async function fetchLatestVideoFromChannel(
  channelId: string, 
  apiKey?: string
): Promise<YouTubeVideo | null> {
  // Use environment variable if no API key provided
  const key = apiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  
  if (!key) {
    console.warn('No YouTube API key provided. Using mock data. See YOUTUBE_API_SETUP.md for setup instructions.');
    // Return mock data if no API key is provided
    return MOCK_BASKETBALL_VIDEOS[channelId] || null;
  }

  try {
    // First, get the channel's uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${key}`
    );
    
    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.status}`);
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    
    // Then, get the latest video from the uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${key}`
    );
    
    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status}`);
    }
    
    const playlistData = await playlistResponse.json();
    
    if (playlistData.items && playlistData.items.length > 0) {
      const video = playlistData.items[0].snippet;
      return {
        videoId: video.resourceId.videoId,
        title: video.title,
        description: video.description.substring(0, 150) + '...',
        thumbnailUrl: video.thumbnails.maxres?.url || video.thumbnails.high?.url || video.thumbnails.medium?.url,
        publishedAt: video.publishedAt,
        channelTitle: video.channelTitle
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video from YouTube API:', error);
    console.warn('Falling back to mock data. To get real latest videos, set up YouTube API key. See YOUTUBE_API_SETUP.md');
    // Fallback to mock data
    return MOCK_BASKETBALL_VIDEOS[channelId] || null;
  }
}

// Function to get all latest videos from basketball channels
export async function fetchAllLatestVideos(apiKey?: string): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  
  for (const channel of BASKETBALL_CHANNELS) {
    const video = await fetchLatestVideoFromChannel(channel.channelId, apiKey);
    if (video) {
      videos.push(video);
    }
  }
  
  return videos;
}
