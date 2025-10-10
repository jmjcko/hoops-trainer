"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--surface-variant)] text-[var(--foreground)] font-medium text-sm">
        <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2 pl-3 border-l-2 border-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent rounded-r-lg py-1 pr-1">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/5 text-[var(--foreground)] text-xs border border-[var(--accent)]/20">
          <img 
            src={session.user?.image || ""} 
            alt={session.user?.name || ""} 
            className="w-5 h-5 rounded-full ring-1 ring-[var(--accent)]/30"
          />
          <span className="hidden sm:inline font-medium text-xs">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-[var(--error)] to-red-600 text-white font-medium text-xs shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <Link href="/auth/signin" className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-medium text-sm shadow-2 hover:shadow-3 transition-all duration-200">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span>Sign In</span>
    </Link>
  );
}
