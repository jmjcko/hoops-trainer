"use client";

import { useEffect, useState } from "react";
import { detectVideoPlatform, extractYouTubeId, validateFacebookUrlEmbeddable } from "@/lib/url";
import { loadVisibleLibrary, upsertExercise, upsertVideo } from "@/lib/storage";
import { ExerciseItem, LibraryState, VideoItem } from "@/types/library";
import { addResource, loadResources, deleteResource, updateResource, detectResourcePlatform, extractResourceName } from "@/lib/resource-storage";
import { Resource, ResourceFormData } from "@/types/resource";
import { fetchYouTubeVideoTitle, extractVideoIdFromUrl } from "@/lib/youtube-title";
import { updateVideoTitles } from "@/lib/update-video-titles";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function ContentManagementPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoVisibility, setVideoVisibility] = useState<"public" | "private">("public");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [exerciseDesc, setExerciseDesc] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("");
  const [exerciseVisibility, setExerciseVisibility] = useState<"public" | "private">("public");
  
  // Resource management state
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceForm, setResourceForm] = useState<ResourceFormData>({
    name: "",
    platform: "youtube",
    url: "",
    description: "",
    thumbnailUrl: "",
    followerCount: "",
    isVerified: false
  });
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isUpdatingTitles, setIsUpdatingTitles] = useState(false);

  useEffect(() => {
    setLib(loadVisibleLibrary());
    setResources(loadResources());
  }, []);

  const handleAddVideo = async () => {
    const url = videoUrl.trim();
    if (!url) return;
    
    setVideoError(null);
    setIsLoadingVideo(true);
    
    try {
      const platform = detectVideoPlatform(url);
      if (platform === "facebook") {
        const valid = validateFacebookUrlEmbeddable(url);
        if (!valid.ok) {
          setVideoError(valid.hint ? `${valid.reason} ${valid.hint}` : valid.reason);
          return;
        }
      }
      
      const idBase = platform === "youtube" ? extractYouTubeId(url) ?? createId("yt") : createId("vid");
      
      // Try to fetch title for YouTube videos
      let title: string | undefined;
      if (platform === "youtube") {
        const videoId = extractVideoIdFromUrl(url);
        if (videoId) {
          try {
            const fetchedTitle = await fetchYouTubeVideoTitle(videoId);
            if (fetchedTitle) {
              title = fetchedTitle;
            }
          } catch (error) {
            console.log('Could not fetch video title:', error);
          }
        }
      }
      
      const item: VideoItem = {
        id: idBase,
        url,
        platform,
        title,
        category: videoCategory.trim() || undefined,
        visibility: videoVisibility,
      };
      
      const updated = upsertVideo(item);
      setLib(updated);
      setVideoUrl("");
      setVideoCategory("");
      setVideoVisibility("public");
      setVideoError(null);
    } finally {
      setIsLoadingVideo(false);
    }
  };

  const handleAddExercise = () => {
    if (!exerciseTitle.trim()) return;
    const ex: ExerciseItem = {
      id: createId("ex"),
      title: exerciseTitle.trim(),
      category: exerciseCategory.trim() || undefined,
      description: exerciseDesc.trim() || undefined,
      visibility: exerciseVisibility,
    };
    const updated = upsertExercise(ex);
    setLib(updated);
    setExerciseTitle("");
    setExerciseDesc("");
    setExerciseCategory("");
    setExerciseVisibility("public");
  };

  const handleAddResource = () => {
    const url = resourceForm.url.trim();
    if (!url) {
      setResourceError("URL is required");
      return;
    }

    const platform = detectResourcePlatform(url);
    if (!platform) {
      setResourceError("Unsupported platform. Please use YouTube, Instagram, or Facebook URLs.");
      return;
    }

    const name = resourceForm.name.trim() || extractResourceName(url, platform);
    
    try {
      const newResource = addResource({
        name,
        platform,
        url,
        description: resourceForm.description?.trim() || undefined,
        thumbnailUrl: resourceForm.thumbnailUrl?.trim() || undefined,
        followerCount: resourceForm.followerCount?.trim() || undefined,
        isVerified: resourceForm.isVerified,
        visibility: "public"
      });
      
      setResources(prev => [...prev, newResource]);
      setResourceForm({
        name: "",
        platform: "youtube",
        url: "",
        description: "",
        thumbnailUrl: "",
        followerCount: "",
        isVerified: false
      });
      setResourceError(null);
    } catch (error) {
      setResourceError("Failed to add resource");
    }
  };

  const handleDeleteResource = (id: string) => {
    if (deleteResource(id)) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource.id);
    setResourceForm({
      name: resource.name,
      platform: resource.platform,
      url: resource.url,
      description: resource.description || "",
      thumbnailUrl: resource.thumbnailUrl || "",
      followerCount: resource.followerCount || "",
      isVerified: resource.isVerified || false
    });
  };

  const handleUpdateResource = () => {
    if (!editingResource) {
      console.error('No resource being edited');
      return;
    }

    console.log('Updating resource:', editingResource);
    console.log('Form data:', resourceForm);

    const url = resourceForm.url.trim();
    if (!url) {
      setResourceError("URL is required");
      return;
    }

    const platform = detectResourcePlatform(url);
    if (!platform) {
      setResourceError("Unsupported platform. Please use YouTube, Instagram, or Facebook URLs.");
      return;
    }

    const name = resourceForm.name.trim() || extractResourceName(url, platform);
    
    console.log('Update data:', {
      name,
      platform,
      url,
      description: resourceForm.description?.trim() || undefined,
      thumbnailUrl: resourceForm.thumbnailUrl?.trim() || undefined,
      followerCount: resourceForm.followerCount?.trim() || undefined,
      isVerified: resourceForm.isVerified
    });
    
    try {
      const updatedResource = updateResource(editingResource, {
        name,
        platform,
        url,
        description: resourceForm.description?.trim() || undefined,
        thumbnailUrl: resourceForm.thumbnailUrl?.trim() || undefined,
        followerCount: resourceForm.followerCount?.trim() || undefined,
        isVerified: resourceForm.isVerified
      });
      
      console.log('Update result:', updatedResource);
      
      if (updatedResource) {
        setResources(prev => prev.map(r => r.id === editingResource ? updatedResource : r));
        setEditingResource(null);
        setResourceForm({
          name: "",
          platform: "youtube",
          url: "",
          description: "",
          thumbnailUrl: "",
          followerCount: "",
          isVerified: false
        });
        setResourceError(null);
      } else {
        // Fallback: try to delete the old resource and add a new one
        console.log('Update failed, trying fallback approach');
        try {
          const oldResource = resources.find(r => r.id === editingResource);
          if (oldResource) {
            // Delete the old resource
            deleteResource(editingResource);
            
            // Add a new resource with the updated data
            const newResource = addResource({
              name,
              platform,
              url,
              description: resourceForm.description?.trim() || undefined,
              thumbnailUrl: resourceForm.thumbnailUrl?.trim() || undefined,
              followerCount: resourceForm.followerCount?.trim() || undefined,
              isVerified: resourceForm.isVerified,
              visibility: "public"
            });
            
            if (newResource) {
              setResources(prev => prev.filter(r => r.id !== editingResource).concat(newResource));
              setEditingResource(null);
              setResourceForm({
                name: "",
                platform: "youtube",
                url: "",
                description: "",
                thumbnailUrl: "",
                followerCount: "",
                isVerified: false
              });
              setResourceError(null);
            } else {
              setResourceError("Failed to update resource. Please try again.");
            }
          } else {
            setResourceError("Failed to update resource. Resource not found or update failed.");
          }
        } catch (fallbackError) {
          console.error('Fallback update failed:', fallbackError);
          setResourceError("Failed to update resource. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      setResourceError("Failed to update resource. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingResource(null);
    setResourceForm({
      name: "",
      platform: "youtube",
      url: "",
      description: "",
      thumbnailUrl: "",
      followerCount: "",
      isVerified: false
    });
    setResourceError(null);
  };

  const handleUpdateVideoTitles = async () => {
    setIsUpdatingTitles(true);
    try {
      await updateVideoTitles();
      // Reload the library to show updated titles
      setLib(loadVisibleLibrary());
    } catch (error) {
      console.error('Error updating video titles:', error);
    } finally {
      setIsUpdatingTitles(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-10 space-y-10">
      <h1 className="text-4xl font-bold text-[var(--foreground)]">Content Management</h1>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">Add video by URL</h2>
          {lib.videos.some(v => v.platform === "youtube" && !v.title) && (
            <button
              onClick={handleUpdateVideoTitles}
              disabled={isUpdatingTitles}
              className="rounded-lg bg-blue-500 text-white px-4 py-2 text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingTitles ? "Updating..." : "Update Video Titles"}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Paste YouTube, Shorts, Facebook URL"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <input
            className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Category (e.g., shooting, dribbling)"
            list="category-options"
            value={videoCategory}
            onChange={e => setVideoCategory(e.target.value)}
          />
          <select
            className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            value={videoVisibility}
            onChange={e => setVideoVisibility(e.target.value as "public" | "private")}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <button 
            className="rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-6 py-3 font-medium shadow-2 hover:shadow-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleAddVideo}
            disabled={isLoadingVideo}
          >
            {isLoadingVideo ? "Fetching title..." : "Add Video"}
          </button>
        </div>
        <datalist id="category-options">
          <option value="shooting" />
          <option value="dribbling" />
          <option value="passing" />
          <option value="defense" />
          <option value="conditioning" />
          <option value="footwork" />
        </datalist>
        {videoError && <p className="text-sm text-red-600">{videoError}</p>}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Add exercise</h2>
        <div className="flex flex-col gap-4">
          <input
            className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Title"
            value={exerciseTitle}
            onChange={e => setExerciseTitle(e.target.value)}
          />
          <textarea
            className="min-h-32 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200 resize-none"
            placeholder="Description (optional)"
            value={exerciseDesc}
            onChange={e => setExerciseDesc(e.target.value)}
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
              placeholder="Category (e.g., shooting, dribbling)"
              list="category-options"
              value={exerciseCategory}
              onChange={e => setExerciseCategory(e.target.value)}
            />
            <select
              className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
              value={exerciseVisibility}
              onChange={e => setExerciseVisibility(e.target.value as "public" | "private")}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button className="rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-6 py-3 font-medium shadow-2 hover:shadow-3 transition-all duration-200" onClick={handleAddExercise}>
              Add Exercise
            </button>
          </div>
        </div>
      </section>

      {/* Resource Management Section */}
      <section className="bg-[var(--surface)] shadow-1 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
          {editingResource ? "Edit Resource" : "Resource Management"}
        </h2>
        <p className="text-[var(--muted)] mb-6">
          {editingResource 
            ? "Update the resource details below." 
            : "Add YouTube channels, Instagram profiles, or Facebook pages to display on the homepage."
          }
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Resource Name</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
                placeholder="Channel/Profile name (optional - will auto-detect)"
                value={resourceForm.name}
                onChange={e => setResourceForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Platform</label>
              <select
                className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
                value={resourceForm.platform}
                onChange={e => setResourceForm(prev => ({ ...prev, platform: e.target.value as Resource['platform'] }))}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">URL</label>
            <input
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
              placeholder="https://www.youtube.com/@channelname or https://instagram.com/username"
              value={resourceForm.url}
              onChange={e => setResourceForm(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Description (Optional)</label>
            <textarea
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
              placeholder="Brief description of the resource"
              rows={3}
              value={resourceForm.description}
              onChange={e => setResourceForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Thumbnail URL (Optional)</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
                placeholder="https://example.com/image.jpg"
                value={resourceForm.thumbnailUrl}
                onChange={e => setResourceForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Follower Count (Optional)</label>
              <input
                className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
                placeholder="e.g., 1.2M followers"
                value={resourceForm.followerCount}
                onChange={e => setResourceForm(prev => ({ ...prev, followerCount: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVerified"
              className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              checked={resourceForm.isVerified}
              onChange={e => setResourceForm(prev => ({ ...prev, isVerified: e.target.checked }))}
            />
            <label htmlFor="isVerified" className="text-sm text-[var(--foreground)]">Verified account</label>
          </div>
          
          {resourceError && (
            <div className="text-red-500 text-sm">{resourceError}</div>
          )}
          
          <div className="flex gap-3">
            <button 
              className="rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-6 py-3 font-medium shadow-2 hover:shadow-3 transition-all duration-200"
              onClick={editingResource ? handleUpdateResource : handleAddResource}
            >
              {editingResource ? "Update Resource" : "Add Resource"}
            </button>
            
            {editingResource && (
              <button 
                className="rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] px-6 py-3 font-medium shadow-1 hover:shadow-2 transition-all duration-200"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        {/* Existing Resources */}
        {resources.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Existing Resources</h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-4 bg-[var(--surface-variant)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      resource.platform === 'youtube' ? 'bg-red-500' :
                      resource.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      'bg-blue-600'
                    }`}>
                      {resource.platform === 'youtube' ? (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      ) : resource.platform === 'instagram' ? (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--foreground)]">{resource.name}</span>
                        {resource.isVerified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        )}
                      </div>
                      <div className="text-sm text-[var(--muted)] capitalize">{resource.platform}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit resource"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete resource"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


