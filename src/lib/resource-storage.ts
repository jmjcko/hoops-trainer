import { Resource } from "@/types/resource";

const STORAGE_KEY = 'hoops-trainer-resources';

// Load resources from localStorage
export function loadResources(): Resource[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading resources:', error);
    return [];
  }
}

// Save resources to localStorage
export function saveResources(resources: Resource[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  } catch (error) {
    console.error('Error saving resources:', error);
  }
}

// Add a new resource
export function addResource(resource: Omit<Resource, 'id' | 'addedAt'>): Resource {
  const newResource: Resource = {
    ...resource,
    id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    addedAt: new Date().toISOString(),
  };

  const resources = loadResources();
  resources.push(newResource);
  saveResources(resources);
  
  return newResource;
}

// Update an existing resource
export function updateResource(id: string, updates: Partial<Resource>): Resource | null {
  if (typeof window === "undefined") {
    console.error('updateResource called on server side');
    return null;
  }

  try {
    const resources = loadResources();
    console.log('Current resources:', resources);
    console.log('Looking for resource with id:', id);
    
    const index = resources.findIndex(r => r.id === id);
    console.log('Found resource at index:', index);
    
    if (index === -1) {
      console.error(`Resource with id ${id} not found in ${resources.length} resources`);
      return null;
    }
    
    const originalResource = resources[index];
    console.log('Original resource:', originalResource);
    console.log('Updates to apply:', updates);
    
    const updatedResource = { ...originalResource, ...updates };
    console.log('Updated resource:', updatedResource);
    
    resources[index] = updatedResource;
    saveResources(resources);
    
    console.log('Successfully updated resource');
    return updatedResource;
  } catch (error) {
    console.error('Error updating resource:', error);
    return null;
  }
}

// Delete a resource
export function deleteResource(id: string): boolean {
  const resources = loadResources();
  const filtered = resources.filter(r => r.id !== id);
  
  if (filtered.length === resources.length) return false;
  
  saveResources(filtered);
  return true;
}

// Get visible resources (public or user's private)
export function loadVisibleResources(): Resource[] {
  const resources = loadResources();
  // For now, return all resources (we can add user filtering later)
  return resources.filter(r => r.visibility === "public");
}

// Extract platform from URL
export function detectResourcePlatform(url: string): Resource['platform'] | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      return "youtube";
    }
    if (host.includes("instagram.com")) {
      return "instagram";
    }
    if (host.includes("facebook.com") || host.includes("fb.com")) {
      return "facebook";
    }
    
    return null;
  } catch {
    return null;
  }
}

// Extract resource name from URL
export function extractResourceName(url: string, platform: Resource['platform']): string {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split("/").filter(Boolean);
    
    switch (platform) {
      case "youtube":
        // Handle @channelname or /c/channelname or /user/username
        if (pathParts[0] === "@" || pathParts[0] === "c") {
          return pathParts[1] || "YouTube Channel";
        }
        if (pathParts[0] === "user") {
          return pathParts[1] || "YouTube User";
        }
        return "YouTube Channel";
        
      case "instagram":
        // Handle /username
        if (pathParts[0] && !pathParts[0].includes("p") && !pathParts[0].includes("reel")) {
          return pathParts[0];
        }
        return "Instagram Profile";
        
      case "facebook":
        // Handle /username or /pages/name
        if (pathParts[0] && pathParts[0] !== "pages") {
          return pathParts[0];
        }
        if (pathParts[0] === "pages" && pathParts[1]) {
          return pathParts[1];
        }
        return "Facebook Page";
        
      default:
        return "Resource";
    }
  } catch {
    return "Resource";
  }
}
