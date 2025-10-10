"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export default function NavLink({ href, children, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm shadow-1 hover:shadow-2 ${
        isActive 
          ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-2" 
          : "bg-[var(--surface-variant)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)]"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
