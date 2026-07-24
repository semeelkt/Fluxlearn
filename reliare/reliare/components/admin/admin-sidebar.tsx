"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  BookMarked,
  ImageIcon,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/research", label: "Research Papers", icon: BookMarked },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 shrink-0 border-r rule min-h-screen flex flex-col bg-paper dark:bg-paper-dark">
      <div className="px-6 py-7 border-b rule">
        <Link href="/" className="font-display text-xl">Reliare</Link>
        <div className="issue-line mt-1">Admin Panel</div>
      </div>

      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-sans transition-colors ${
                active
                  ? "text-oxblood bg-oxblood/[0.06] border-r-2 border-oxblood"
                  : "text-ink/70 dark:text-ink-dark/70 hover:text-oxblood hover:bg-oxblood/[0.04]"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-6 py-5 text-sm font-sans border-t rule text-ink/70 dark:text-ink-dark/70 hover:text-oxblood transition-colors"
      >
        <LogOut size={16} strokeWidth={1.5} />
        Sign Out
      </button>
    </aside>
  );
}
