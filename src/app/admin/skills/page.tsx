"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Code, Zap, Star, ExternalLink, GripVertical } from "lucide-react"
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

interface Skill { id: string; title: string; desc: string; icon: string; skills: string[] }

const iconOptions = [{ value: "code", label: "Code", icon: Code }, { value: "zap", label: "Zap", icon: Zap }, { value: "star", label: "Star", icon: Star }, { value: "external-link", label: "Link", icon: ExternalLink }]
const getIcon = (name: string) => iconOptions.find(o => o.value === name)?.icon || Code

function SortableSkill({ skill, onEdit, onDelete }: { skill: Skill; onEdit: () => void; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id })
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
    const Icon = getIcon(skill.icon)

    return (
        <Card ref={setNodeRef} style={style} className="bg-neutral-900/50 border-neutral-800/50 group">
            <CardContent className="p-3">
                <div className="flex items-start gap-2">
                    <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white">{skill.title}</h3>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="ghost" onClick={onEdit} className="h-6 w-6 p-0 text-neutral-400 hover:text-white"><Pencil className="h-3 w-3" /></Button>
                                <Button size="sm" variant="ghost" onClick={onDelete} className="h-6 w-6 p-0 text-neutral-400 hover:text-purple-400"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{skill.desc}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {skill.skills.slice(0, 4).map((s, i) => <span key={i} className="px-1.5 py-0.5 text-[10px] rounded bg-neutral-800 text-neutral-300">{s}</span>)}
                            {skill.skills.length > 4 && <span className="px-1.5 py-0.5 text-[10px] rounded bg-neutral-800 text-neutral-400">+{skill.skills.length - 4}</span>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
    const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({ title: "", desc: "", icon: "code", skills: [""] })

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

    useEffect(() => { fetchSkills() }, [])

    const fetchSkills = async () => {
        try {
            const res = await fetch("/api/skills")
            setSkills(await res.json() || [])
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = skills.findIndex(s => s.id === active.id)
        const newIndex = skills.findIndex(s => s.id === over.id)
        const newSkills = arrayMove(skills, oldIndex, newIndex)
        setSkills(newSkills)
        try { await fetch("/api/skills", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reorder: true, items: newSkills }) }) } catch (e) { console.error(e) }
    }

    const handleAdd = () => { setEditingSkill(null); setFormData({ title: "", desc: "", icon: "code", skills: [""] }); setIsFormOpen(true) }
    const handleEdit = (s: Skill) => { setEditingSkill(s); setFormData({ title: s.title, desc: s.desc, icon: s.icon, skills: s.skills.length > 0 ? s.skills : [""] }); setIsFormOpen(true) }
    const handleDelete = (s: Skill) => { setDeletingSkill(s); setIsDeleteOpen(true) }
    const addSkillItem = () => setFormData(p => ({ ...p, skills: [...p.skills, ""] }))
    const removeSkillItem = (i: number) => setFormData(p => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }))
    const updateSkillItem = (i: number, v: string) => setFormData(p => ({ ...p, skills: p.skills.map((s, idx) => idx === i ? v : s) }))

    const handleSave = async () => {
        setSaving(true)
        try {
            const method = editingSkill ? "PUT" : "POST"
            const filtered = formData.skills.filter(s => s.trim() !== "")
            const body = editingSkill ? { ...formData, skills: filtered, id: editingSkill.id } : { ...formData, skills: filtered }
            const res = await fetch("/api/skills", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            if (res.ok) { await fetchSkills(); setIsFormOpen(false) }
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const confirmDelete = async () => {
        if (!deletingSkill) return
        try {
            const res = await fetch(`/api/skills?id=${deletingSkill.id}`, { method: "DELETE" })
            if (res.ok) { await fetchSkills(); setIsDeleteOpen(false); setDeletingSkill(null) }
        } catch (e) { console.error(e) }
    }

    if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div></div>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Skills</h1>
                    <p className="text-xs text-neutral-400">Drag to reorder • {skills.length} skills</p>
                </div>
                <Button size="sm" onClick={handleAdd} className="bg-gradient-to-r from-purple-600 to-purple-600"><Plus className="h-3 w-3 mr-1" /> Add</Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {skills.map((skill) => <SortableSkill key={skill.id} skill={skill} onEdit={() => handleEdit(skill)} onDelete={() => handleDelete(skill)} />)}
                    </div>
                </SortableContext>
            </DndContext>

            {skills.length === 0 && <div className="text-center py-8"><p className="text-neutral-400 text-sm">No skills yet</p><Button onClick={handleAdd} variant="link" className="text-purple-400 text-sm">Add your first skill</Button></div>}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
                    <DialogHeader><DialogTitle className="text-base">{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle><DialogDescription className="sr-only">Form to add or edit skill categories</DialogDescription></DialogHeader>
                    <div className="space-y-3 py-2">
                        <div><label className="text-[10px] text-neutral-400 block mb-1">Title</label><Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="bg-neutral-800 border-neutral-700 h-8 text-sm" /></div>
                        <div><label className="text-[10px] text-neutral-400 block mb-1">Description</label><Textarea value={formData.desc} onChange={(e) => setFormData(p => ({ ...p, desc: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-sm min-h-[50px]" /></div>
                        <div><label className="text-[10px] text-neutral-400 block mb-1">Icon</label>
                            <Select value={formData.icon} onValueChange={(v) => setFormData(p => ({ ...p, icon: v }))}>
                                <SelectTrigger className="bg-neutral-800 border-neutral-700 h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-neutral-800 border-neutral-700">{iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1"><label className="text-[10px] text-neutral-400">Skill Items</label><Button type="button" size="sm" variant="ghost" onClick={addSkillItem} className="h-5 text-[10px] text-purple-400"><Plus className="h-3 w-3 mr-0.5" />Add</Button></div>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                {formData.skills.map((s, i) => (
                                    <div key={i} className="flex gap-1">
                                        <Input value={s} onChange={(e) => updateSkillItem(i, e.target.value)} className="bg-neutral-800 border-neutral-700 h-7 text-xs" placeholder={`Skill ${i + 1}`} />
                                        {formData.skills.length > 1 && <Button type="button" size="icon" variant="ghost" onClick={() => removeSkillItem(i)} className="h-7 w-7 text-neutral-400 hover:text-purple-400"><X className="h-3 w-3" /></Button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button size="sm" variant="outline" onClick={() => setIsFormOpen(false)} className="border-neutral-700">Cancel</Button>
                        <Button size="sm" onClick={handleSave} disabled={saving || !formData.title} className="bg-gradient-to-r from-purple-600 to-purple-600">{saving ? "..." : "Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                    <AlertDialogHeader><AlertDialogTitle className="text-white text-base">Delete Skill</AlertDialogTitle><AlertDialogDescription className="text-neutral-400 text-sm">Delete "{deletingSkill?.title}"?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel className="border-neutral-700 text-white hover:bg-neutral-800 h-8 text-sm">Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-purple-600 hover:bg-purple-700 h-8 text-sm">Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
