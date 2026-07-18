"use client"

import { useState, useEffect } from "react"
import { Save, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Collaboration {
    id: string
    name: string
    image: string
}

export default function CollaborationsPage() {
    const [collaborations, setCollaborations] = useState<Collaboration[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => { fetchSettings() }, [])

    // We still fetch and save to the main settings API to keep the database structure simple
    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings")
            const data = await res.json()
            setCollaborations(data.collaborations || [])
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Fetch current settings so we don't overwrite other tabs
            const res = await fetch("/api/settings")
            const currentSettings = await res.json()
            
            const updatedSettings = { ...currentSettings, collaborations }
            
            const putRes = await fetch("/api/settings", { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(updatedSettings) 
            })
            
            if (putRes.ok) { 
                setSaved(true)
                setTimeout(() => setSaved(false), 2000) 
            }
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const processImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (event) => {
                    const img = new window.Image()
                    img.src = event.target?.result as string
                    img.onload = () => {
                        try {
                            const canvas = document.createElement("canvas")
                            const MAX_WIDTH = 1200
                            const MAX_HEIGHT = 1200
                            let width = img.width
                            let height = img.height
                            
                            if (width > height && width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width
                                width = MAX_WIDTH
                            } else if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height
                                height = MAX_HEIGHT
                            }
                            
                            canvas.width = width
                            canvas.height = height
                            const ctx = canvas.getContext("2d")
                            ctx?.drawImage(img, 0, 0, width, height)
                            resolve(canvas.toDataURL("image/jpeg", 0.8))
                        } catch (err) {
                            console.error("Canvas compression failed:", err)
                            alert("Failed to compress image.")
                            reject(err)
                        }
                    }
                    img.onerror = () => {
                        alert("Invalid image file.")
                        reject(new Error("Invalid image"))
                    }
                }
                reader.onerror = () => {
                    alert("Failed to read file.")
                    reject(new Error("Read failed"))
                }
            } catch (err) {
                console.error("Image processing error:", err)
                reject(err)
            }
        })
    }

    const handleUploadCollaboration = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const base64 = await processImage(file)
            const newCollab = { id: `coll-${Date.now()}`, name: `Collab ${collaborations.length + 1}`, image: base64 }
            setCollaborations([...collaborations, newCollab])
        } catch (err) {
            console.error(err)
        }
    }

    const removeCollaboration = (id: string) => {
        setCollaborations(collaborations.filter(c => c.id !== id))
    }

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div></div>

    return (
        <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Collaborations</h1>
                    <p className="text-xs text-neutral-400">Manage the groups you've worked with</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                    </Button>
                </div>
            </div>

            <Card className="bg-neutral-900/50 border-neutral-800/50">
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-white flex items-center gap-2"><ImageIcon className="h-4 w-4 text-purple-400" />Upload New Banner</h3>
                            <p className="text-[10px] text-neutral-400 mt-1">Upload screenshots of group cards/banners. Changes must be saved to go live.</p>
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
                    
                    <div className="pt-4 border-t border-neutral-800">
                        {collaborations.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-lg">No collaborations added yet. Upload an image to start.</div>
                        ) : (
                            <div className="space-y-3 mt-4">
                                {collaborations.map((collab, index) => (
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
