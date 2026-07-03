"use client";

import { useEffect, useState } from "react";
import { getProjects, deleteProject } from "@/actions/projects";
import { ProjectForm } from "./components/project-form";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    if (res.success && res.data) {
      setProjects(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    const res = await deleteProject(id);
    if (res.success) {
      setProjects(projects.filter(p => p._id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Portfolio Projects</h1>
          <p className="text-neutral-400">Manage your Roblox builds displayed on the live site.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">You haven't uploaded any projects yet. Click the button above to add your first build.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden bg-neutral-950">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg disabled:opacity-50 transition-colors"
                  >
                    {deletingId === project._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-primary-400 uppercase tracking-wider">
                  {project.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{project.title}</h3>
                <p className="text-sm text-neutral-400 line-clamp-2">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ProjectForm 
          onClose={() => setIsFormOpen(false)} 
          onComplete={() => {
            setIsFormOpen(false);
            fetchProjects();
          }} 
        />
      )}
    </div>
  );
}
