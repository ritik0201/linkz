"use client";
import React, { useState } from 'react';
import { X, Image, Link2, Users, FileText, Type } from 'lucide-react';

// NOTE: This modal has been repurposed to create a "Project or Research" entry.
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  user: {
    _id: string;
    name: string;
    avatar: string;
    headline: string;
  };
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, user }: CreatePostModalProps) => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [teamMembers, setTeamMembers] = useState("");
  const [category, setCategory] = useState<"project" | "research">("project");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!topic.trim() || !coverImage) {
      setError("Topic and a cover image are required.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('topic', topic);
    formData.append('description', description);
    formData.append('coverImage', coverImage);
    formData.append('teamMembers', teamMembers);
    formData.append('category', category);
    formData.append('link', link);

    try {
      await onSubmit(formData);
      // Reset form and close
      setTopic("");
      setDescription("");
      setCoverImage(null);
      setTeamMembers("");
      setCategory("project");
      setLink("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1b1f23] w-full max-w-2xl rounded-none md:rounded-3xl shadow-2xl border border-zinc-700 overflow-hidden relative flex flex-col h-full md:h-auto md:max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Share a Project or Research</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Area */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="relative">
            <Type className="absolute left-3 top-3.5 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Project / Research Topic*"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#2b2b2b] border border-zinc-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <textarea
            className="w-full bg-[#2b2b2b] border border-zinc-600 rounded-lg px-3 py-2.5 text-white placeholder-zinc-400 resize-none focus:outline-none focus:border-indigo-500 min-h-30"
            placeholder="Describe your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Users className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Team (comma-separated)"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                className="w-full bg-[#2b2b2b] border border-zinc-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <Link2 className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input
                type="url"
                placeholder="Project Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full bg-[#2b2b2b] border border-zinc-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white cursor-pointer"><input type="radio" name="category" value="project" checked={category === 'project'} onChange={() => setCategory('project')} className="form-radio bg-zinc-700 border-zinc-600 text-indigo-500 focus:ring-indigo-500" />Project</label>
              <label className="flex items-center gap-2 text-white cursor-pointer"><input type="radio" name="category" value="research" checked={category === 'research'} onChange={() => setCategory('research')} className="form-radio bg-zinc-700 border-zinc-600 text-indigo-500 focus:ring-indigo-500" />Research</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Cover Image*</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Image className="mx-auto h-12 w-12 text-zinc-500" />
                <div className="flex text-sm text-zinc-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-zinc-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900 focus-within:ring-indigo-500 px-2">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                {coverImage && <p className="text-xs text-green-400 mt-2">{coverImage.name}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end border-t border-zinc-700/50">
          <button
            onClick={handleSubmit}
            disabled={loading || !topic.trim() || !coverImage}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;