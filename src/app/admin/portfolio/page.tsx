"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, GripVertical, Link } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface PortfolioItem { id: string; title: string; desc: string; image: string }
interface PortfolioData { environments: PortfolioItem[]; structures: PortfolioItem[]; interiors: PortfolioItem[]; models: PortfolioItem[] }
type Category = "environments" | "structures" | "interiors" | "models"

const categoryFolders: Record<Category, string> = { environments: "", structures: "structures", interiors: "interiors", models: "models" }

function SortableCard({ item, onEdit, onDelete }: { item: PortfolioItem; onEdit: () => void; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 1 }

    return (
        <Card ref={setNodeRef} style={style} className="bg-neutral-900/50 border-neutral-800/50 overflow-hidden group relative">
            <div {...attributes} {...listeners} className="absolute top-1 left-1 z-10 p-1.5 bg-neutral-800/80 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3 w-3 text-neutral-400" />
            </div>
            <div className="relative h-28">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <Button size="sm" onClick={onEdit} className="bg-white/20 hover:bg-white/30 h-7 w-7 p-0"><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="destructive" onClick={onDelete} className="h-7 w-7 p-0"><Trash2 className="h-3 w-3" /></Button>
                </div>
            </div>
            <CardContent className="p-2">
                <h3 className="text-xs font-medium text-white truncate">{item.title}</h3>
                <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{item.desc}</p>
            </CardContent>
        </Card>
    )
}

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<Category>("environments")
    const [searchQuery, setSearchQuery] = useState("")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
    const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null)
    const [formData, setFormData] = useState({ title: "", desc: "", image: "" })
    const [saving, setSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => { fetchPortfolio() }, [])

    const fetchPortfolio = async () => {
        try {
            const res = await fetch("/api/portfolio")
            const data = await res.json()
            setPortfolio(data)
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id || !portfolio) return

        const items = portfolio[activeTab]
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        setPortfolio({ ...portfolio, [activeTab]: newItems })

        // Save new order to API
        try {
            await fetch("/api/portfolio", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: activeTab, items: newItems, reorder: true }),
            })
        } catch (e) { console.error("Failed to save order:", e) }
    }

    const handleAdd = () => { setEditingItem(null); setFormData({ title: "", desc: "", image: "" }); setIsFormOpen(true) }
    const handleEdit = (item: PortfolioItem) => { setEditingItem(item); setFormData({ title: item.title, desc: item.desc, image: item.image }); setIsFormOpen(true) }
    const handleDelete = (item: PortfolioItem) => { setDeletingItem(item); setIsDeleteOpen(true) }



    const handleSave = async () => {
        if (!formData.title || !formData.desc || !formData.image) return
        setSaving(true)
        try {
            const method = editingItem ? "PUT" : "POST"
            const body = { category: activeTab, item: editingItem ? { ...formData, id: editingItem.id } : formData }
            const res = await fetch("/api/portfolio", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            if (res.ok) { await fetchPortfolio(); setIsFormOpen(false) }
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const confirmDelete = async () => {
        if (!deletingItem) return
        try {
            const res = await fetch(`/api/portfolio?category=${activeTab}&id=${deletingItem.id}`, { method: "DELETE" })
            if (res.ok) { await fetchPortfolio(); setIsDeleteOpen(false); setDeletingItem(null) }
        } catch (e) { console.error(e) }
    }

    const getFilteredItems = (items: PortfolioItem[]) => {
        if (!searchQuery) return items
        const q = searchQuery.toLowerCase()
        return items.filter((i) => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
    }

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-heading">Portfolio</h1>
                    <p className="text-neutral-400 mt-1">Drag items to reorder • Click to edit</p>
                </div>
                <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-purple-600"><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                <Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-neutral-900/50 border-neutral-800 text-white" />
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Category)}>
                <TabsList className="bg-neutral-900/50 border border-neutral-800">
                    {(["environments", "structures", "interiors", "models"] as Category[]).map((cat) => (
                        <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-purple-600 capitalize">{cat} ({portfolio?.[cat]?.length || 0})</TabsTrigger>
                    ))}
                </TabsList>

                {(["environments", "structures", "interiors", "models"] as Category[]).map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={getFilteredItems(portfolio?.[category] || []).map(i => i.id)} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {getFilteredItems(portfolio?.[category] || []).map((item) => (
                                        <SortableCard key={item.id} item={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        {getFilteredItems(portfolio?.[category] || []).length === 0 && (
                            <div className="text-center py-12"><p className="text-neutral-400">No items found</p><Button onClick={handleAdd} variant="link" className="text-purple-400 mt-2">Add your first item</Button></div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-lg">
                    <DialogHeader><DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle><DialogDescription className="sr-only">Form to add or edit portfolio items</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div><label className="text-sm text-neutral-400 block mb-2">Title</label><Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="bg-neutral-800 border-neutral-700" placeholder="Enter title" /></div>
                        <div><label className="text-sm text-neutral-400 block mb-2">Description</label><Textarea value={formData.desc} onChange={(e) => setFormData((p) => ({ ...p, desc: e.target.value }))} className="bg-neutral-800 border-neutral-700 min-h-[100px]" placeholder="Enter description" /></div>
                        <div>
                            <label className="text-sm text-neutral-400 block mb-2">Image Upload</label>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            // Simple client-side compression to avoid MongoDB/Vercel size limits
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
                                                        
                                                        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                                                        setFormData((p) => ({ ...p, image: dataUrl }));
                                                    } catch (err) {
                                                        console.error("Canvas compression failed:", err);
                                                        alert("Failed to compress image. Try a different format.");
                                                    }
                                                };
                                                img.onerror = () => {
                                                    alert("Invalid image file.");
                                                };
                                            };
                                            reader.onerror = () => {
                                                alert("Failed to read file.");
                                            }
                                        } catch (err) {
                                            console.error("Image processing error:", err);
                                        }
                                    }
                                }} 
                                className="bg-neutral-800 border-neutral-700 cursor-pointer file:text-purple-500 file:bg-transparent file:border-0 hover:file:text-purple-400" 
                            />
                            <p className="text-xs text-neutral-500 mt-1">Select an image from your computer to upload directly</p>
                            {formData.image && <div className="mt-2 relative h-32 rounded-lg overflow-hidden"><Image src={formData.image} alt="Preview" fill className="object-cover" /></div>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)} className="border-neutral-700">Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !formData.title || !formData.desc || !formData.image} className="bg-gradient-to-r from-purple-600 to-purple-600">{saving ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                    <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Item</AlertDialogTitle><AlertDialogDescription className="text-neutral-400">Are you sure you want to delete "{deletingItem?.title}"?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel className="border-neutral-700 text-white hover:bg-neutral-800">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-purple-600 hover:bg-purple-700">Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
