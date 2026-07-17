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

    const processImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new window.Image();
                    img.src = event.target?.result as string;
                    img.onload = () => {
                        try {
                            const canvas = document.createElement("canvas");
                            const MAX_WIDTH = 1200;
                            const MAX_HEIGHT = 1200;
                            let width = img.width;
                            let height = img.height;
                            
                            if (width > height && width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            } else if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext("2d");
                            ctx?.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL("image/jpeg", 0.8));
                        } catch (err) {
                            console.error("Canvas compression failed:", err);
                            alert("Failed to compress image.");
                            reject(err);
                        }
                    };
                    img.onerror = () => {
                        alert("Invalid image file.");
                        reject(new Error("Invalid image"));
                    };
                };
                reader.onerror = () => {
                    alert("Failed to read file.");
                    reject(new Error("Read failed"));
                };
            } catch (err) {
                console.error("Image processing error:", err);
                reject(err);
            }
        });
    };

    const handleUploadCollaboration = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !settings) return;
        const base64 = await processImage(e.target.files[0]);
        const newCollab = { id: `coll-${Date.now()}`, name: `Collab ${settings.collaborations.length + 1}`, image: base64 };
        setSettings({ ...settings, collaborations: [...settings.collaborations, newCollab] });
    };

    const removeCollaboration = (id: string) => {
        if (!settings) return;
        setSettings({ ...settings, collaborations: settings.collaborations.filter(c => c.id !== id) });
    };

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
                    <TabsTrigger value="contact" className="text-xs data-[state=active]:bg-purple-600 h-6"><Mail className="h-3 w-3 mr-1" />Contact</TabsTrigger>
                    <TabsTrigger value="about" className="text-xs data-[state=active]:bg-purple-600 h-6"><User className="h-3 w-3 mr-1" />About</TabsTrigger>
                    <TabsTrigger value="hero" className="text-xs data-[state=active]:bg-purple-600 h-6"><ImageIcon className="h-3 w-3 mr-1" />Hero</TabsTrigger>
                    <TabsTrigger value="site" className="text-xs data-[state=active]:bg-purple-600 h-6"><FileText className="h-3 w-3 mr-1" />SEO</TabsTrigger>
                    <TabsTrigger value="collaborations" className="text-xs data-[state=active]:bg-purple-600 h-6"><ImageIcon className="h-3 w-3 mr-1" />Collaborations</TabsTrigger>
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

                <TabsContent value="hero">
                    <Card className="bg-neutral-900/50 border-neutral-800/50">
                        <CardContent className="p-4 space-y-3">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2"><ImageIcon className="h-4 w-4 text-purple-400" />Hero Section</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Subtitle</label><Input value={settings.hero.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">Title</label><Input value={settings.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            </div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Description</label><Textarea value={settings.hero.description} onChange={(e) => updateField("hero", "description", e.target.value)} className="bg-neutral-800 border-neutral-700 text-sm min-h-[50px]" /></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">featured Image</label><Input value={settings.hero.featuredImage} onChange={(e) => updateField("hero", "featuredImage", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] text-neutral-400 block mb-1">featured Title</label><Input value={settings.hero.featuredTitle} onChange={(e) => updateField("hero", "featuredTitle", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                                <div><label className="text-[10px] text-neutral-400 block mb-1">featured Description</label><Input value={settings.hero.featuredDescription} onChange={(e) => updateField("hero", "featuredDescription", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="site">
                    <Card className="bg-neutral-900/50 border-neutral-800/50">
                        <CardContent className="p-4 space-y-3">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2"><FileText className="h-4 w-4 text-purple-400" />SEO Settings</h3>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Site Title</label><Input value={settings.site.title} onChange={(e) => updateField("site", "title", e.target.value)} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Site Description</label><Textarea value={settings.site.description} onChange={(e) => updateField("site", "description", e.target.value)} className="bg-neutral-800 border-neutral-700 text-sm min-h-[60px]" /></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="collaborations">
                    <Card className="bg-neutral-900/50 border-neutral-800/50">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-white flex items-center gap-2"><ImageIcon className="h-4 w-4 text-purple-400" />Groups I've Worked With</h3>
                                    <p className="text-[10px] text-neutral-400 mt-1">Upload screenshots of group cards/banners</p>
                                </div>
                                <div>
                                    <Input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleUploadCollaboration} 
                                        className="bg-neutral-800 border-neutral-700 cursor-pointer file:text-purple-500 file:bg-transparent file:border-0 hover:file:text-purple-400 text-xs h-8 w-64" 
                                    />
                                </div>
                            </div>
                            
                            {settings.collaborations.length === 0 ? (
                                <div className="text-center py-6 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-lg">No collaborations added yet. Upload an image to start.</div>
                            ) : (
                                <div className="space-y-3 mt-4">
                                    {settings.collaborations.map((collab, index) => (
                                        <div key={collab.id} className="flex items-center gap-4 bg-neutral-800/50 p-2 rounded-lg border border-neutral-700/50">
                                            <div className="text-xs text-neutral-500 w-6 text-center">{index + 1}</div>
                                            <div className="h-16 flex-1 relative rounded overflow-hidden bg-neutral-900 flex items-center justify-center">
                                                <img src={collab.image} alt={collab.name} className="h-full w-auto object-contain" />
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => removeCollaboration(collab.id)} className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8">
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
