"use client";

import { useEffect, useState } from "react";
import { loadVisiblePlans, removePlan } from "@/lib/storage";
import { TrainingPlan } from "@/types/library";

export default function PlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setPlans(await loadVisiblePlans());
    };
    loadData();
  }, []);

  const deletePlan = (id: string) => {
    const updatedPlans = removePlan(id);
    setPlans(updatedPlans);
  };

  const editPlan = (plan: TrainingPlan) => {
    // Redirect to plan builder with edit mode
    window.location.href = `/plan-builder?edit=${plan.id}`;
  };

  return (
    <div className="max-w-6xl mx-auto w-full py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div></div>
        <a 
          href="/plan-builder" 
          className="px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-medium shadow-2 hover:shadow-3 transition-all duration-200"
        >
          Create New Plan
        </a>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Your Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="bg-[var(--surface)] shadow-1 rounded-lg p-6 transition-all duration-200 hover:shadow-2">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-[var(--foreground)] truncate flex-1 mr-3">{plan.title}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${plan.visibility === "public" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {plan.visibility === "public" ? (
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
              
              {plan.description && (
                <p className="text-sm text-[var(--muted)] mb-4 line-clamp-3">{plan.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-[var(--muted)] mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  {plan.items.length} items
                </span>
                <span>{new Date(plan.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="flex-1 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] px-4 py-2 text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200"
                  onClick={() => editPlan(plan)}
                >
                  Edit
                </button>
                <button 
                  className="rounded-lg bg-[var(--surface)] text-[var(--error)] border border-[var(--border)] px-4 py-2 text-sm font-medium shadow-1 hover:shadow-2 transition-all duration-200"
                  onClick={() => deletePlan(plan.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {plans.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No Plans Yet</h3>
              <p className="text-[var(--muted)] mb-4">Create your first training plan to get started.</p>
              <a 
                href="/plan-builder" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Plan
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
