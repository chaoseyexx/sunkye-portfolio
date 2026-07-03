"use client";

import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { LayoutDashboard, LogOut, Home } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#030303] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-neutral-900">
          <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2 hover:text-primary-400 transition-colors">
            Sunkye<span className="text-primary-500">.</span>
          </Link>
          <span className="text-xs text-primary-500 font-bold uppercase tracking-widest mt-1 block">Admin Console</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary-600/10 text-primary-500 rounded-xl font-medium border border-primary-500/20">
            <LayoutDashboard className="w-5 h-5" />
            Projects
          </Link>
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition-colors">
            <Home className="w-5 h-5" />
            View Site
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-neutral-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-neutral-900 bg-neutral-950">
          <Link href="/" className="text-xl font-bold text-white">Sunkye<span className="text-primary-500">.</span></Link>
          <button onClick={handleLogout} className="text-neutral-400 hover:text-red-500 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
