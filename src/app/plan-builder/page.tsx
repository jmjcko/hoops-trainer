"use client";

import { useEffect, useMemo, useState } from "react";
import { extractYouTubeId, buildFacebookEmbedUrl, detectVideoPlatform, getVideoSourceInfo } from "@/lib/url";
import { loadVisibleLibrary, loadVisiblePlans, upsertPlan, removePlan } from "@/lib/storage";
import { LibraryState, TrainingPlan, TrainingUnitItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function PlanBuilderPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [currentItems, setCurrentItems] = useState<TrainingUnitItem[]>([]);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);

  useEffect(() => {
    setLib(loadVisibleLibrary());
    setPlans(loadVisiblePlans());
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

  const savePlan = () => {
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
    
    const updatedPlans = upsertPlan(newPlan);
    setPlans(updatedPlans);
    
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

  const deletePlan = (id: string) => {
    const updatedPlans = removePlan(id);
    setPlans(updatedPlans);
  };

  const startNewPlan = () => {
    setEditingPlan(null);
    setTitle("");
    setDescription("");
    setVisibility("public");
    setCurrentItems([]);
  };

  const renderPreview = useMemo(() => {
    return currentItems.map(it => {
      if (it.type === "video") {
        const v = lib.videos.find(v => v.id === it.refId);
        if (!v) return null;
        const yt = extractYouTubeId(v.url);
        const src = v.platform === "youtube" && yt
          ? `https://www.youtube.com/embed/${yt}`
          : (v.platform === "facebook" ? buildFacebookEmbedUrl(v.url) : v.url);
        const platform = detectVideoPlatform(v.url);
        const sourceInfo = getVideoSourceInfo(platform);
        return (
          <div key={it.id} className="space-y-2">
            <div className="aspect-video w-full bg-black/10 rounded-lg overflow-hidden relative">
              <iframe className="w-full h-full" src={src} />
              <div className="absolute top-2 right-2">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sourceInfo.color} ${sourceInfo.textColor} shadow-lg`}>
                  {platform === "youtube" && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                  {platform === "facebook" && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {platform === "unknown" && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span>{sourceInfo.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded" onClick={() => moveItem(it.id, -1)}>Up</button>
              <button className="px-2 py-1 border rounded" onClick={() => moveItem(it.id, 1)}>Down</button>
              <button className="px-2 py-1 border rounded text-red-600" onClick={() => removeItem(it.id)}>Remove</button>
            </div>
          </div>
        );
      }
      const e = lib.exercises.find(e => e.id === it.refId);
      if (!e) return null;
      return (
        <div key={it.id} className="rounded border p-3 space-y-2">
          <div className="font-medium">{e.title}</div>
          {e.description && <div className="text-sm text-gray-500">{e.description}</div>}
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded" onClick={() => moveItem(it.id, -1)}>Up</button>
            <button className="px-2 py-1 border rounded" onClick={() => moveItem(it.id, 1)}>Down</button>
            <button className="px-2 py-1 border rounded text-red-600" onClick={() => removeItem(it.id)}>Remove</button>
          </div>
        </div>
      );
    });
  }, [currentItems, lib]);

  return (
    <div className="max-w-6xl mx-auto w-full py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">Plan Builder</h1>
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
            <div className="text-sm text-gray-500">Videos</div>
            <ul className="space-y-2 max-h-80 overflow-auto pr-2">
              {lib.videos.map(v => (
                <li key={v.id} className="flex justify-between items-center rounded border p-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm">{v.id}</div>
                    <div className="text-xs text-gray-500">{v.category || "uncategorized"}</div>
                  </div>
                  <button className="px-2 py-1 border rounded" onClick={() => addVideoToPlan(v.id)}>Add</button>
                </li>
              ))}
              {lib.videos.length === 0 && <p className="text-gray-500">No videos yet.</p>}
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Exercises</div>
            <ul className="space-y-2 max-h-80 overflow-auto pr-2">
              {lib.exercises.map(e => (
                <li key={e.id} className="flex justify-between items-center rounded border p-2">
                  <div className="min-w-0">
                    <div className="truncate">{e.title}</div>
                    <div className="text-xs text-gray-500">{e.category || "uncategorized"}</div>
                  </div>
                  <button className="px-2 py-1 border rounded" onClick={() => addExerciseToPlan(e.id)}>Add</button>
                </li>
              ))}
              {lib.exercises.length === 0 && <p className="text-gray-500">No exercises yet.</p>}
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
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Saved Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-6 transition-all duration-200 hover:shadow-2">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-[var(--foreground)] truncate">{p.title}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${p.visibility === "public" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {p.visibility === "public" ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Public
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Private
                    </>
                  )}
                </span>
              </div>
              {p.description && (
                <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">{p.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-[var(--muted)] mb-4">
                <span>{p.items.length} items</span>
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex-1 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2 text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200"
                  onClick={() => editPlan(p)}
                >
                  Edit
                </button>
                <button 
                  className="rounded-lg bg-[var(--surface)] text-[var(--error)] border border-[var(--border)] px-4 py-2 text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200"
                  onClick={() => deletePlan(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-[var(--muted)] text-lg">No saved plans yet.</p>
              <p className="text-[var(--muted)] text-sm mt-2">Create your first training plan above!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


