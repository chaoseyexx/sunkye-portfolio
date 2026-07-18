"use client"

import { useEffect, useState } from "react"
import { Save, User, Mail, FileText, Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Settings {
    site: { title: string; description: string }
    hero: { subtitle: string; title: string; description: string; featuredImage: string; featuredTitle: string; featuredDescription: string }
    about: { name: string; age: string; experience: string; profileImage: string; bio: string[]; whyHireMe: string[] }
    contact: { email: string; robloxUsername: string; discordUsername: string; discordLink: string; availability: string }
    collaborations: { id: string; name: string; image: string }[]
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => { fetchSettings() }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings")
            const data = await res.json()
            
            // Safe fallbacks for older or empty database documents
            if (!data.site) data.site = { title: "", description: "" }
            if (!data.hero) data.hero = { subtitle: "", title: "", description: "", featuredImage: "", featuredTitle: "", featuredDescription: "" }
            if (!data.about) data.about = { name: "", age: "", experience: "", profileImage: "", bio: [], whyHireMe: [] }
            if (!data.contact) data.contact = { email: "", robloxUsername: "", discordUsername: "", discordLink: "", availability: "" }
            if (!data.collaborations) data.collaborations = []
            
            if (!data.about.bio) data.about.bio = []
            if (!data.about.whyHireMe) data.about.whyHireMe = []
            
            setSettings(data)
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const handleSave = async () => {
        if (!settings) return
        setSaving(true)
        try {
            const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) })
            if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const updateField = (section: keyof Settings, field: string, value: any) => {
        if (!settings) return
        setSettings({ ...settings, [section]: { ...settings[section], [field]: value } })
    }

    const updateBio = (index: number, value: string) => {
        if (!settings) return
        const bio = [...settings.about.bio]; bio[index] = value
        setSettings({ ...settings, about: { ...settings.about, bio } })
    }

    const updateWhyHire = (index: number, value: string) => {
        if (!settings) return
        const whyHireMe = [...settings.about.whyHireMe]; whyHireMe[index] = value
        setSettings({ ...settings, about: { ...settings.about, whyHireMe } })
    }

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div></div>
    if (!settings) return <div className="text-center py-8 text-neutral-400 text-sm">Failed to load settings</div>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-xs text-neutral-400">Manage site content and contact info</p>
                </div>
                <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-purple-600 to-purple-600">
                    <Save className="h-3 w-3 mr-1" /> {saving ? "..." : saved ? "Saved!" : "Save"}
                </Button>
            </div>

            <Tabs defaultValue="contact" className="space-y-4">
                <TabsList className="bg-neutral-900/50 border border-neutral-800 h-8">
                    <TabsTrigger value="contact" className="text-xs data-[state=active]:bg-purple-600 h-6"><Mail className="h-3 w-3 mr-1" />Contact & Social</TabsTrigger>
                    <TabsTrigger value="about" className="text-xs data-[state=active]:bg-purple-600 h-6"><User className="h-3 w-3 mr-1" />About Me</TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                    <Card className="bg-neutral-900/50 border-neutral-800/50">
                        <CardContent className="p-4 space-y-3">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2"><Mail className="h-4 w-4 text-purple-400" />Contact Information</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Email</label><Input value={settings.contact.email} onChange={(e) => updateField("contact", "email", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Roblox Username</label><Input value={settings.contact.robloxUsername} onChange={(e) => updateField("contact", "robloxUsername", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Discord Username</label><Input value={settings.contact.discordUsername} onChange={(e) => updateField("contact", "discordUsername", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Discord Link</label><Input value={settings.contact.discordLink} onChange={(e) => updateField("contact", "discordLink", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            </div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Availability Status</label><Input value={settings.contact.availability} onChange={(e) => updateField("contact", "availability", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card className="bg-neutral-900/50 border-neutral-800/50">
                        <CardContent className="p-4 space-y-3">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2"><User className="h-4 w-4 text-purple-400" />About Section</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Name</label><Input value={settings.about.name} onChange={(e) => updateField("about", "name", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Age</label><Input value={settings.about.age} onChange={(e) => updateField("about", "age", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Experience</label><Input value={settings.about.experience} onChange={(e) => updateField("about", "experience", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            </div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Profile Image URL</label><Input value={settings.about.profileImage} onChange={(e) => updateField("about", "profileImage", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Bio Paragraphs</label><div className="space-y-1.5">{settings.about.bio.map((p, i) => <Textarea key={i} value={p} onChange={(e) => updateBio(i, e.target.value)} className="bg-neutral-800 border-neutral-700 text-sm min-h-[50px]" placeholder={`Paragraph ${i + 1}`} />)}</div></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Why Hire Me Points</label><div className="space-y-1.5">{settings.about.whyHireMe.map((p, i) => <Input key={i} value={p} onChange={(e) => updateWhyHire(i, e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" placeholder={`Point ${i + 1}`} />)}</div></div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
