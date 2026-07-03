"use client";

import { useState, useRef } from "react";
import { createProject, deleteProject, ProjectInput } from "@/actions/projects";
import { X, Upload, Loader2 } from "lucide-react";

export function ProjectForm({ onClose, onComplete }: { onClose: () => void, onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProjectInput>({
    title: "",
    desc: "",
    category: "environments",
    image: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createProject(formData);
      if (res.error) {
        setError(res.error);
      } else {
        onComplete();
      }
    } catch (err) {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-950">
          <h2 className="text-xl font-bold text-white">Add New Project</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}

          {/* Image Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group
              ${formData.image ? 'border-primary-500 bg-black' : 'border-neutral-700 bg-neutral-950 hover:border-primary-500 hover:bg-primary-900/10'}`}
          >
            {formData.image ? (
              <>
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2"><Upload className="w-5 h-5"/> Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Upload className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium mb-1">Click to upload project image</p>
                <p className="text-neutral-500 text-sm">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Project Title</label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-4 py-3 text-white outline-none"
                placeholder="e.g. Hillside Hobbit Home"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-4 py-3 text-white outline-none appearance-none"
              >
                <option value="environments">Environments</option>
                <option value="structures">Structures</option>
                <option value="interiors">Interiors</option>
                <option value="models">Models</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">Description</label>
            <textarea
              required
              rows={3}
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-4 py-3 text-white outline-none resize-none"
              placeholder="Short description of the build..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
