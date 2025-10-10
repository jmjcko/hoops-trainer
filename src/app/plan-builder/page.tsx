"use client";

import { useEffect, useMemo, useState } from "react";
import { extractYouTubeId, buildFacebookEmbedUrl, detectVideoPlatform, getVideoSourceInfo } from "@/lib/url";
import { loadVisibleLibrary, upsertPlan } from "@/lib/storage";
import { LibraryState, TrainingPlan, TrainingUnitItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function PlanBuilderPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [currentItems, setCurrentItems] = useState<TrainingUnitItem[]>([]);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLib(await loadVisibleLibrary());
    };
    loadData();
  }, []);

  const addVideoToPlan = (refId: string) => {
    setCurrentItems(items => [...items, { id: createId("unit"), type: "video", refId }]);
  };
  const addExerciseToPlan = (refId: string) => {
    setCurrentItems(items => [...items, { id: createId("unit"), type: "exercise", refId }]);
  };
  const removeItem = (id: string) => setCurrentItems(items => items.filter(i => i.id !== id));
  const moveItem = (id: string, dir: -1 | 1) => {
    setCurrentItems(items => {
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return items;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= items.length) return items;
      const copy = items.slice();
      const [it] = copy.splice(idx, 1);
      copy.splice(newIdx, 0, it);
      return copy;
    });
  };

  const savePlan = async () => {
    if (!title.trim() || currentItems.length === 0) return;
    
    const planId = editingPlan ? editingPlan.id : createId("plan");
    const now = new Date().toISOString();
    
    const newPlan: TrainingPlan = {
      id: planId,
      title: title.trim(),
      description: description.trim() || undefined,
      items: currentItems,
      createdAt: editingPlan ? editingPlan.createdAt : now,
      updatedAt: now,
      visibility: visibility
    };
    
    await upsertPlan(newPlan);
    
    // Reset form
    setTitle("");
    setDescription("");
    setVisibility("public");
    setCurrentItems([]);
    setEditingPlan(null);
  };

  const editPlan = (plan: TrainingPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setDescription(plan.description || "");
    setVisibility(plan.visibility);
    setCurrentItems(plan.items);
  };


  const startNewPlan = () => {
    setEditingPlan(null);
    setTitle("");
    setDescription("");
    setVisibility("public");
    setCurrentItems([]);
  };

  const renderPreview = useMemo(() => {
    return currentItems.map((it, index) => {
      if (it.type === "video") {
        const v = lib.videos.find(v => v.id === it.refId);
        if (!v) return null;
        const platform = detectVideoPlatform(v.url);
        const getPlatformIcon = (platform: string) => {
          if (platform === "youtube") {
            return (
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            );
          }
          if (platform === "facebook") {
            return (
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            );
          }
          return (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          );
        };
        const getPlatformColor = (platform: string) => {
          if (platform === "youtube") return "bg-red-500";
          if (platform === "facebook") return "bg-blue-600";
          return "bg-gray-500";
        };
        return (
          <div key={it.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-3 transition-all duration-200 hover:shadow-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 text-[var(--accent-contrast)] font-bold text-sm">
                {index + 1}
              </div>
              <div className={`w-6 h-6 ${getPlatformColor(platform)} rounded-full flex items-center justify-center flex-shrink-0`}>
                {getPlatformIcon(platform)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-[var(--foreground)] truncate">
                    {v.title || `${platform === "youtube" ? "YouTube" : platform === "facebook" ? "Facebook" : "Video"} Video`}
                  </h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                    {v.category || "uncategorized"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)] transition-colors" 
                  onClick={() => moveItem(it.id, -1)}
                  disabled={index === 0}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button 
                  className="p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)] transition-colors" 
                  onClick={() => moveItem(it.id, 1)}
                  disabled={index === currentItems.length - 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button 
                  className="p-1 rounded text-[var(--error)] hover:text-[var(--error)]/80 transition-colors" 
                  onClick={() => removeItem(it.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      }
      const e = lib.exercises.find(e => e.id === it.refId);
      if (!e) return null;
      return (
        <div key={it.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-3 transition-all duration-200 hover:shadow-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 text-[var(--accent-contrast)] font-bold text-sm">
              {index + 1}
            </div>
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-[var(--foreground)] truncate">{e.title}</h4>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                  {e.category || "uncategorized"}
                </span>
              </div>
              {e.description && (
                <p className="text-sm text-[var(--muted)] mt-1 line-clamp-1">{e.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button 
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)] transition-colors" 
                onClick={() => moveItem(it.id, -1)}
                disabled={index === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button 
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--foreground)] transition-colors" 
                onClick={() => moveItem(it.id, 1)}
                disabled={index === currentItems.length - 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button 
                className="p-1 rounded text-[var(--error)] hover:text-[var(--error)]/80 transition-colors" 
                onClick={() => removeItem(it.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    });
  }, [currentItems, lib]);

  return (
    <div className="max-w-6xl mx-auto w-full py-8 space-y-8">
      <div className="flex items-center justify-end">
        <button 
          onClick={startNewPlan}
          className="px-4 py-2 rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:shadow-1 transition-all duration-200"
        >
          New Plan
        </button>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Assemble plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-[var(--muted)] font-medium">Videos</div>
            <ul className="space-y-1 max-h-80 overflow-auto pr-2 pb-2">
              {lib.videos.map(v => {
                const platform = detectVideoPlatform(v.url);
                const getPlatformIcon = (platform: string) => {
                  if (platform === "youtube") {
                    return (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    );
                  }
                  if (platform === "facebook") {
                    return (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    );
                  }
                  return (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  );
                };
                const getPlatformColor = (platform: string) => {
                  if (platform === "youtube") return "bg-red-500";
                  if (platform === "facebook") return "bg-blue-600";
                  return "bg-gray-500";
                };
                return (
                  <li key={v.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-3 transition-all duration-200 hover:shadow-2 cursor-pointer group">
                    <a 
                      href={v.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 ${getPlatformColor(platform)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getPlatformIcon(platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-[var(--foreground)] truncate text-sm group-hover:text-[var(--accent)] transition-colors">
                              {v.title || `${platform === "youtube" ? "YouTube" : platform === "facebook" ? "Facebook" : "Video"} Video`}
                            </h4>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                              {v.category || "uncategorized"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <button 
                            className="px-3 py-1 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addVideoToPlan(v.id);
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
              {lib.videos.length === 0 && <p className="text-[var(--muted)] text-center py-4">No videos yet.</p>}
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-[var(--muted)] font-medium">Exercises</div>
            <ul className="space-y-1 max-h-80 overflow-auto pr-2 pb-2">
              {lib.exercises.map(e => (
                <li key={e.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-3 transition-all duration-200 hover:shadow-2 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[var(--foreground)] truncate text-sm group-hover:text-[var(--accent)] transition-colors">{e.title}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--accent-contrast)]">
                          {e.category || "uncategorized"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-3 py-1 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200 flex-shrink-0" 
                        onClick={() => addExerciseToPlan(e.id)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {lib.exercises.length === 0 && <p className="text-[var(--muted)] text-center py-4">No exercises yet.</p>}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Plan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            placeholder="Plan title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <select
            className="rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200"
            value={visibility}
            onChange={e => setVisibility(e.target.value as "public" | "private")}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <textarea
          className="w-full rounded-lg border border-[var(--border)] px-4 py-3 bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-1 transition-all duration-200 resize-none"
          placeholder="Plan description (optional)"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Plan Preview</h2>
        <div className="space-y-4">{renderPreview.length ? renderPreview : <p className="text-[var(--muted)]">No items in plan.</p>}</div>
        <div className="flex gap-4 items-center">
          <button 
            className="rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-6 py-3 font-medium shadow-2 hover:shadow-3 transition-all duration-200" 
            onClick={savePlan}
            disabled={!title.trim() || currentItems.length === 0}
          >
            {editingPlan ? "Update Plan" : "Save Plan"}
          </button>
          {editingPlan && (
            <button 
              className="rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] px-6 py-3 font-medium shadow-1 hover:shadow-2 transition-all duration-200" 
              onClick={startNewPlan}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">View Your Plans</h2>
          <p className="text-[var(--muted)] mb-6">Manage and edit your saved training plans</p>
          <a 
            href="/plans" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] font-medium shadow-1 hover:shadow-2 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            View All Plans
          </a>
        </div>
      </section>
    </div>
  );
}


