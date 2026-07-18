"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Images, Star, Zap, Settings, LogOut, Menu, X, ExternalLink, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/portfolio", label: "Portfolio", icon: Images },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/skills", label: "Skills", icon: Zap },
    { href: "/admin/collaborations", label: "Collaborations", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    if (pathname === "/admin") return <>{children}</>

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" })
        router.push("/admin")
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-neutral-950">
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-56 bg-neutral-900 border-r border-neutral-800 transition-transform duration-200",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                        <span className="text-white font-bold text-xl">Sunkye<span className="text-purple-500">.</span></span>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-neutral-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <nav className="flex-1 p-2 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                                    className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                        isActive ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                    )}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-2 border-t border-neutral-800">
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full justify-start gap-2 text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 text-xs">
                            <LogOut className="h-3 w-3" /> Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:pl-56">
                <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur border-b border-neutral-800">
                    <div className="flex items-center justify-between px-4 py-2">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-neutral-400 hover:text-white">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3 ml-auto">
                            <Link href="/" target="_blank" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white">
                                View Site <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    )
}
