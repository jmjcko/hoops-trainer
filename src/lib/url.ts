import { VideoPlatform } from "@/types/library";

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
    if (u.hostname.includes("youtu.be")) {
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


