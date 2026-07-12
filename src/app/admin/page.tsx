"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AdminLoginPage() {
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (data.success) {
                router.push("/admin/dashboard")
                router.refresh()
            } else {
                setError("Invalid password")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <Card className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border-neutral-800/50 shadow-2xl relative z-10">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="relative h-12 w-auto">
                            <img
                                src="https://placehold.co/140x40/0a0a0a/8b5cf6?text=Sunkye"
                                alt="Sunkye Logo"
                                width={140}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-heading">Sunkye Admin</h1>
                    <p className="text-neutral-400 text-sm">Enter your password to access the dashboard</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 focus:ring-purple-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {error && (
                                <p className="text-purple-400 text-sm flex items-center gap-2">
                                    <span className="inline-block w-1 h-1 bg-purple-400 rounded-full"></span>
                                    {error}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                "Access Dashboard"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-neutral-800">
                        <p className="text-center text-neutral-500 text-xs">
                            Protected area. Unauthorized access is prohibited.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
