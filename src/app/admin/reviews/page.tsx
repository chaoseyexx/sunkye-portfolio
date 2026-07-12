"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Star, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Review { id: string; name: string; role: string; content: string; avatarColor: string; rating: number; price: string; project: string }

const avatarColors = ["#FF5E5B", "#7B61FF", "#4CAF50", "#FFD700", "#FF9800", "#2196F3", "#E91E63", "#009688"]

function SortableReview({ review, onEdit, onDelete }: { review: Review; onEdit: () => void; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: review.id })
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

    return (
        <Card ref={setNodeRef} style={style} className="bg-neutral-900/50 border-neutral-800/50 group">
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: review.avatarColor }}>
                        {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-white">{review.name}</h3>
                                <p className="text-[10px] text-neutral-400">{review.role}</p>
                            </div>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="ghost" onClick={onEdit} className="h-6 w-6 p-0 text-neutral-400 hover:text-white"><Pencil className="h-3 w-3" /></Button>
                                <Button size="sm" variant="ghost" onClick={onDelete} className="h-6 w-6 p-0 text-neutral-400 hover:text-purple-400"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        </div>
                        <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-700"}`} />)}
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{review.content}</p>
                        <div className="flex gap-1.5 mt-2">
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300">{review.project}</span>
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300">{review.price}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const [deletingReview, setDeletingReview] = useState<Review | null>(null)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({ name: "", role: "Client", content: "", avatarColor: "#FF5E5B", rating: 5, price: "", project: "" })

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

    useEffect(() => { fetchReviews() }, [])

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews")
            setReviews(await res.json() || [])
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = reviews.findIndex(r => r.id === active.id)
        const newIndex = reviews.findIndex(r => r.id === over.id)
        const newReviews = arrayMove(reviews, oldIndex, newIndex)
        setReviews(newReviews)
        try { await fetch("/api/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reorder: true, items: newReviews }) }) } catch (e) { console.error(e) }
    }

    const handleAdd = () => { setEditingReview(null); setFormData({ name: "", role: "Client", content: "", avatarColor: "#FF5E5B", rating: 5, price: "", project: "" }); setIsFormOpen(true) }
    const handleEdit = (r: Review) => { setEditingReview(r); setFormData({ name: r.name, role: r.role, content: r.content, avatarColor: r.avatarColor, rating: r.rating, price: r.price, project: r.project }); setIsFormOpen(true) }
    const handleDelete = (r: Review) => { setDeletingReview(r); setIsDeleteOpen(true) }

    const handleSave = async () => {
        setSaving(true)
        try {
            const method = editingReview ? "PUT" : "POST"
            const body = editingReview ? { ...formData, id: editingReview.id } : formData
            const res = await fetch("/api/reviews", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            if (res.ok) { await fetchReviews(); setIsFormOpen(false) }
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const confirmDelete = async () => {
        if (!deletingReview) return
        try {
            const res = await fetch(`/api/reviews?id=${deletingReview.id}`, { method: "DELETE" })
            if (res.ok) { await fetchReviews(); setIsDeleteOpen(false); setDeletingReview(null) }
        } catch (e) { console.error(e) }
    }

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div></div>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reviews</h1>
                    <p className="text-xs text-neutral-400">Drag to reorder • {reviews.length} testimonials</p>
                </div>
                <Button size="sm" onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-purple-600"><Plus className="h-3 w-3 mr-1" /> Add</Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={reviews.map(r => r.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {reviews.map((review) => <SortableReview key={review.id} review={review} onEdit={() => handleEdit(review)} onDelete={() => handleDelete(review)} />)}
                    </div>
                </SortableContext>
            </DndContext>

            {reviews.length === 0 && <div className="text-center py-8"><p className="text-neutral-400 text-sm">No reviews yet</p><Button onClick={handleAdd} variant="link" className="text-purple-400 text-sm">Add your first review</Button></div>}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base">{editingReview ? "Edit Review" : "Add Review"}</DialogTitle>
                        <DialogDescription className="text-neutral-400 text-sm">Fill in the details below to {editingReview ? "update the" : "create a new"} review.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Name</label><Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Role</label>
                                <Select value={formData.role} onValueChange={(v) => setFormData(p => ({ ...p, role: v }))}>
                                    <SelectTrigger className="bg-neutral-800 border-neutral-700 h-8 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-neutral-800 border-neutral-700"><SelectItem value="Client">Client</SelectItem><SelectItem value="VIP Client">VIP Client</SelectItem><SelectItem value="Developer">Developer</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div><label className="text-[10px] text-neutral-400 block mb-1">Content</label><Textarea value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-sm min-h-[60px]" /></div>
                        <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Project</label><Input value={formData.project} onChange={(e) => setFormData(p => ({ ...p, project: e.target.value }))} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Price</label><Input value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                        </div>
                        <div className="flex gap-4">
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Rating</label><div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(s => <button key={s} type="button" onClick={() => setFormData(p => ({ ...p, rating: s }))}><Star className={`h-5 w-5 ${s <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-600"}`} /></button>)}</div></div>
                            <div><label className="text-[10px] text-neutral-400 block mb-1">Color</label><div className="flex gap-1">{avatarColors.map(c => <button key={c} type="button" onClick={() => setFormData(p => ({ ...p, avatarColor: c }))} className={`w-5 h-5 rounded-full ${formData.avatarColor === c ? "ring-2 ring-white ring-offset-1 ring-offset-neutral-900" : ""}`} style={{ backgroundColor: c }} />)}</div></div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button size="sm" variant="outline" onClick={() => setIsFormOpen(false)} className="border-neutral-700">Cancel</Button>
                        <Button size="sm" onClick={handleSave} disabled={saving || !formData.name || !formData.content} className="bg-gradient-to-r from-purple-600 to-purple-600">{saving ? "..." : "Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                    <AlertDialogHeader><AlertDialogTitle className="text-white text-base">Delete Review</AlertDialogTitle><AlertDialogDescription className="text-neutral-400 text-sm">Delete "{deletingReview?.name}"?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel className="border-neutral-700 text-white hover:bg-neutral-800 h-8 text-sm">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-purple-600 hover:bg-purple-700 h-8 text-sm">Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
