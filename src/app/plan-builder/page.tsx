"use client";

import { useEffect, useMemo, useState } from "react";
import { extractYouTubeId, buildFacebookEmbedUrl, detectVideoPlatform, getVideoSourceInfo } from "@/lib/url";
import { loadLibrary, loadPlans, savePlans } from "@/lib/storage";
import { LibraryState, TrainingPlan, TrainingUnitItem } from "@/types/library";

function createId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function PlanBuilderPage() {
  const [lib, setLib] = useState<LibraryState>({ videos: [], exercises: [] });
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [title, setTitle] = useState("");
  const [currentItems, setCurrentItems] = useState<TrainingUnitItem[]>([]);

  useEffect(() => {
    setLib(loadLibrary());
    setPlans(loadPlans());
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
    const newPlan: TrainingPlan = { id: createId("plan"), title: title.trim(), items: currentItems };
    const next = [newPlan, ...plans];
    setPlans(next);
    savePlans(next);
    setTitle("");
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
                  {sourceInfo.icon}
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
      <h1 className="text-2xl font-semibold">Plan Builder</h1>

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

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Plan preview</h2>
        <div className="space-y-4">{renderPreview.length ? renderPreview : <p className="text-gray-500">No items in plan.</p>}</div>
        <div className="flex gap-2 items-center">
          <input className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:placeholder:text-gray-400" placeholder="Plan title" value={title} onChange={e => setTitle(e.target.value)} />
          <button className="rounded bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2" onClick={savePlan}>Save Plan</button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Saved plans</h2>
        <ul className="space-y-2">
          {plans.map(p => (
            <li key={p.id} className="rounded border p-3">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-500">{p.items.length} items</div>
            </li>
          ))}
          {plans.length === 0 && <p className="text-gray-500">No saved plans.</p>}
        </ul>
      </section>
    </div>
  );
}


