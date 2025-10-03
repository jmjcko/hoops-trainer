import { VideoPlatform } from "@/types/library";

export function getVideoSourceInfo(platform: VideoPlatform) {
  switch (platform) {
    case "youtube":
      return {
        name: "YouTube",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        ),
        color: "bg-red-500",
        textColor: "text-white"
      };
    case "facebook":
      return {
        name: "Facebook",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        color: "bg-blue-600",
        textColor: "text-white"
      };
    default:
      return {
        name: "Video",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ),
        color: "bg-gray-500",
        textColor: "text-white"
      };
  }
}

export function detectVideoPlatform(url: string): VideoPlatform {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host.includes("facebook.com") || host.includes("fb.watch")) return "facebook";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const isYouTubeHost = host.includes("youtube.com") || host.includes("youtu.be");
    if (!isYouTubeHost) return null;
    if (host.includes("youtu.be")) {
      return u.pathname.slice(1) || null;
    }
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const pathParts = u.pathname.split("/").filter(Boolean);
    const idx = pathParts.indexOf("shorts");
    if (idx !== -1 && pathParts[idx + 1]) return pathParts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

// For public Facebook videos and reels, use the official plugins endpoint.
// Private or restricted posts will not render in iframes.
export function buildFacebookEmbedUrl(url: string): string {
  try {
    const encoded = encodeURIComponent(url);
    // hide text for a cleaner player; width is responsive via CSS
    return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&height=314`;
  } catch {
    return url;
  }
}

export type FacebookValidation = { ok: true } | { ok: false; reason: string; hint?: string };

export function validateFacebookUrlEmbeddable(url: string): FacebookValidation {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host.includes("fb.watch")) {
      return {
        ok: false,
        reason: "Short fb.watch links cannot be embedded directly.",
        hint: "Open the link in a browser and copy the full Facebook permalink (facebook.com/…/videos/{id} or /reel/{id} or /watch?v={id}).",
      };
    }
    if (!host.includes("facebook.com")) {
      return { ok: false, reason: "Not a Facebook URL." };
    }
    const path = u.pathname;
    const hasWatchParam = u.pathname.startsWith("/watch") && Boolean(u.searchParams.get("v"));
    const reelMatch = /\/reel\/\w+/.test(path);
    const videosMatch = /\/videos\/(\d+)/.test(path);
    if (hasWatchParam || reelMatch || videosMatch) {
      return { ok: true };
    }
    return {
      ok: false,
      reason: "This doesn't look like a Facebook video permalink.",
      hint: "Use a URL like facebook.com/{page}/videos/{video_id}, facebook.com/reel/{reel_id}, or facebook.com/watch?v={id}.",
    };
  } catch {
    return { ok: false, reason: "Invalid URL." };
  }
}


