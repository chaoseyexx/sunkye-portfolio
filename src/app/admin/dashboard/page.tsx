"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Images, Star, Zap, Settings, ArrowRight, Mountain, Building2, Sofa, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PortfolioData { environments: any[]; structures: any[]; interiors: any[]; models: any[] }

export default function AdminDashboard() {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
    const [reviewsCount, setReviewsCount] = useState(0)
    const [skillsCount, setSkillsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [p, r, s] = await Promise.all([fetch("/api/portfolio"), fetch("/api/reviews"), fetch("/api/skills")])
                setPortfolio(await p.json())
                setReviewsCount((await r.json()).length || 0)
                setSkillsCount((await s.json()).length || 0)
            } catch (e) { console.error(e) } finally { setLoading(false) }
        }
        fetchData()
    }, [])

    const total = portfolio ? portfolio.environments.length + portfolio.structures.length + portfolio.interiors.length + portfolio.models.length : 0

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-neutral-400">Welcome back! Here's your portfolio overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { title: "Portfolio", value: total, icon: Images, href: "/admin/portfolio", color: "from-purple-500 to-purple-600" },
                    { title: "Reviews", value: reviewsCount, icon: Star, href: "/admin/reviews", color: "from-amber-500 to-orange-600" },
                    { title: "Skills", value: skillsCount, icon: Zap, href: "/admin/skills", color: "from-emerald-500 to-green-600" },
                    { title: "Settings", value: "Active", icon: Settings, href: "/admin/settings", color: "from-blue-500 to-indigo-600" },
                ].map((item) => (
                    <Link key={item.title} href={item.href}>
                        <Card className="bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-neutral-400">{item.title}</p>
                                        <p className="text-xl font-bold text-white mt-1">{item.value}</p>
                                    </div>
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}`}>
                                        <item.icon className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Category Breakdown */}
            <Card className="bg-neutral-900/50 border-neutral-800/50">
                <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-white mb-3">Portfolio Breakdown</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: "Environments", count: portfolio?.environments.length || 0, icon: Mountain, color: "text-purple-400" },
                            { label: "Structures", count: portfolio?.structures.length || 0, icon: Building2, color: "text-amber-400" },
                            { label: "Interiors", count: portfolio?.interiors.length || 0, icon: Sofa, color: "text-emerald-400" },
                            { label: "Models", count: portfolio?.models.length || 0, icon: Package, color: "text-blue-400" },
                        ].map((item) => (
                            <div key={item.label} className="bg-neutral-800/50 rounded-lg p-3 text-center">
                                <item.icon className={`h-4 w-4 mx-auto mb-1 ${item.color}`} />
                                <p className="text-lg font-bold text-white">{item.count}</p>
                                <p className="text-[10px] text-neutral-400">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-neutral-900/50 border-neutral-800/50">
                <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <Link href="/admin/portfolio"><Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-purple-600 text-xs">Add Portfolio <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
                        <Link href="/admin/reviews"><Button size="sm" variant="outline" className="w-full border-neutral-700 text-white text-xs">Add Review</Button></Link>
                        <Link href="/admin/skills"><Button size="sm" variant="outline" className="w-full border-neutral-700 text-white text-xs">Add Skill</Button></Link>
                        <Link href="/admin/settings"><Button size="sm" variant="outline" className="w-full border-neutral-700 text-white text-xs">Settings</Button></Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
