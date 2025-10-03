import { VideoPlatform } from "@/types/library";

export function getVideoSourceInfo(platform: VideoPlatform) {
  switch (platform) {
    case "youtube":
      return {
        name: "YouTube",
        color: "bg-red-500",
        textColor: "text-white"
      };
    case "facebook":
      return {
        name: "Facebook",
        color: "bg-blue-600",
        textColor: "text-white"
      };
    default:
      return {
        name: "Video",
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


