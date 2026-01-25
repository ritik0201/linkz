"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Briefcase, GraduationCap, MapPin, Plus, Send, Star, Linkedin, Github, Twitter, MoreHorizontal, ThumbsUp, MessageSquare, Share2, Eye, Users, Phone, Pencil, X, Trash2, Award, LogOut, Camera } from 'lucide-react';
import CreatePostModal from '@/components/CreatePostModal';
import { useParams } from 'next/navigation';

const people = [
  { name: 'Jane Smith', headline: 'Lead Designer at Innovate Inc.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop' },
  { name: 'John Appleseed', headline: 'Backend Developer at TechGiant', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop' },
  { name: 'Emily White', headline: 'Product Manager at Solutions Co.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
  { name: 'Michael Brown', headline: 'Data Scientist at DataWorks', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop' },
  { name: 'Sarah Jones', headline: 'UX Researcher at UserFirst', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop' },
];

interface ProfileData {
  user: {
    _id: string;
    fullName: string;
    email: string;
    username: string;
    role?: string;
    mobile?: string;
    profileImage?: string;
  };
  headline?: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  links: { title: string; url: string }[];
  skills: string[];
  certificates: {
    name: string;
    organization: string;
    issueDate?: string;
    url?: string;
  }[];
  education: {
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
  }[];
  experience: {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }[];
}

const ProfileSidebarCard = ({ profile }: { profile: ProfileData }) => (
  <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700">
    <div className="h-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')" }}></div>
    <div className="p-4 text-center relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img
          className="w-20 h-20 rounded-full border-4 border-[#2b2b2b] object-cover"
          src={profile.profilePicture || profile.user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop"}
          alt="Profile Picture"
        />
      </div>
      <div className="pt-10">
        <h2 className="text-xl font-bold">{profile.user.fullName}</h2>
        <p className="text-zinc-400 text-sm mt-1">{profile.headline}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-700/50 text-left space-y-1">
        <div className="flex justify-between items-center text-sm text-zinc-400 hover:bg-zinc-800/50 px-2 py-1.5 rounded-md transition-colors cursor-pointer">
          <span className="font-semibold">Profile views</span>
          <span className="text-indigo-400 font-bold">432</span>
        </div>
        <div className="flex justify-between items-center text-sm text-zinc-400 hover:bg-zinc-800/50 px-2 py-1.5 rounded-md transition-colors cursor-pointer">
          <span className="font-semibold">Post impressions</span>
          <span className="text-indigo-400 font-bold">1,205</span>
        </div>
      </div>
    </div>
  </div>
);

const SidebarCard = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-[#2b2b2b] p-5 rounded-2xl shadow-lg border border-zinc-700">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const PersonListItem = ({ name, headline, avatar }: { name: string, headline: string, avatar: string }) => (
  <div className="flex items-start gap-3">
    <img className="w-12 h-12 rounded-full object-cover" src={avatar} alt={name} />
    <div>
      <p className="font-semibold text-white hover:underline cursor-pointer">{name}</p>
      <p className="text-xs text-zinc-400">{headline}</p>
      <button className="mt-2 text-sm font-bold text-zinc-400 border border-zinc-500 rounded-full px-3 py-0.5 hover:bg-zinc-700 hover:border-zinc-400 hover:text-white transition-colors flex items-center gap-1">
        <Plus size={14} /> Connect
      </button>
    </div>
  </div>
);

const GroupListItem = ({ name, members, avatar }: { name: string, members: string, avatar: string }) => (
    <div className="flex items-center gap-3">
      <img className="w-10 h-10 rounded-lg object-cover" src={avatar} alt={name} />
      <div>
        <p className="font-semibold text-white hover:underline cursor-pointer">{name}</p>
        <p className="text-xs text-zinc-400">{members}</p>
      </div>
    </div>
  );

const GroupsSidebarCard = () => (
    <SidebarCard title="Recent Groups" icon={<Users size={20} />}>
        <GroupListItem name="React Developers" members="120k members" avatar="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop" />
        <GroupListItem name="Next.js Community" members="80k members" avatar="https://images.unsplash.com/photo-1549423554-29405a1539e0?q=80&w=2070&auto=format&fit=crop" />
        <GroupListItem name="TypeScript Enthusiasts" members="95k members" avatar="https://images.unsplash.com/photo-1619410283995-43d9134e7656?q=80&w=2070&auto=format&fit=crop" />
    </SidebarCard>
);

const EditIntroModal = ({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-lg border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Edit Intro</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Headline</label>
            <input type="text" name="headline" value={formData.headline} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: Developer at Company" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Ex: San Francisco, CA" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Mobile Number</label>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="+1 234 567 890" />
          </div>
        </form>
        <div className="p-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

const EditAboutModal = ({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData: any; onSave: (data: any) => void }) => {
  const [bio, setBio] = useState(initialData.bio || '');

  useEffect(() => {
    setBio(initialData.bio || '');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ bio });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-lg border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Edit About</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} className="w-full bg-[#1a1a1a] border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="Tell us about yourself..." />
          </div>
        </form>
        <div className="p-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

const EditExperienceModal = ({ isOpen, onClose, experiences, onSave }: { isOpen: boolean; onClose: () => void; experiences: any[]; onSave: (data: any) => void }) => {
  const [list, setList] = useState(experiences || []);
  const [newExp, setNewExp] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setList(experiences || []);
  }, [experiences, isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newExp.title || !newExp.company) return;
    setList([...list, newExp]);
    setNewExp({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' });
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSave = () => {
    onSave({ experience: list });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-2xl border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Edit Experience</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4 mb-6">
            {list.map((exp: any, i: number) => (
              <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{exp.title}</h4>
                  <p className="text-sm text-zinc-300">{exp.company}</p>
                  <p className="text-xs text-zinc-400">{new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}</p>
                </div>
                <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          {isAdding ? (
            <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-3 border border-zinc-600">
              <input type="text" placeholder="Title" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} />
              <input type="text" placeholder="Company" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} />
              <input type="text" placeholder="Location" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newExp.location} onChange={e => setNewExp({...newExp, location: e.target.value})} />
              <div className="flex gap-2">
                <input type="date" className="bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newExp.startDate} onChange={e => setNewExp({...newExp, startDate: e.target.value})} />
                <input type="date" className="bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newExp.endDate} onChange={e => setNewExp({...newExp, endDate: e.target.value})} disabled={newExp.current} />
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" checked={newExp.current} onChange={e => setNewExp({...newExp, current: e.target.checked})} /> I currently work here
              </label>
              <textarea placeholder="Description" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsAdding(false)} className="text-sm text-zinc-400">Cancel</button>
                <button onClick={handleAdd} className="text-sm bg-indigo-600 px-3 py-1 rounded text-white">Add</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"><Plus size={18} /> Add Experience</button>
          )}
        </div>
        <div className="p-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const EditEducationModal = ({ isOpen, onClose, education, onSave }: { isOpen: boolean; onClose: () => void; education: any[]; onSave: (data: any) => void }) => {
  const [list, setList] = useState(education || []);
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setList(education || []);
  }, [education, isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newEdu.school || !newEdu.degree) return;
    setList([...list, newEdu]);
    setNewEdu({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSave = () => {
    onSave({ education: list });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-2xl border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Edit Education</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4 mb-6">
            {list.map((edu: any, i: number) => (
              <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{edu.school}</h4>
                  <p className="text-sm text-zinc-300">{edu.degree}, {edu.fieldOfStudy}</p>
                  <p className="text-xs text-zinc-400">{new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</p>
                </div>
                <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          {isAdding ? (
            <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-3 border border-zinc-600">
              <input type="text" placeholder="School" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} />
              <input type="text" placeholder="Degree" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} />
              <input type="text" placeholder="Field of Study" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newEdu.fieldOfStudy} onChange={e => setNewEdu({...newEdu, fieldOfStudy: e.target.value})} />
              <div className="flex gap-2">
                <input type="date" className="bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newEdu.startDate} onChange={e => setNewEdu({...newEdu, startDate: e.target.value})} />
                <input type="date" className="bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newEdu.endDate} onChange={e => setNewEdu({...newEdu, endDate: e.target.value})} />
              </div>
              <textarea placeholder="Description" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newEdu.description} onChange={e => setNewEdu({...newEdu, description: e.target.value})} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsAdding(false)} className="text-sm text-zinc-400">Cancel</button>
                <button onClick={handleAdd} className="text-sm bg-indigo-600 px-3 py-1 rounded text-white">Add</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"><Plus size={18} /> Add Education</button>
          )}
        </div>
        <div className="p-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const EditSkillsModal = ({ isOpen, onClose, initialData, onSave }: { isOpen: boolean; onClose: () => void; initialData: any; onSave: (data: any) => void }) => {
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    setSkills(initialData.skills || []);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemove = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ skills });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-lg border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Edit Skills</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-[#1a1a1a] border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
              placeholder="Add a skill" 
            />
            <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors"><Plus size={20} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <div key={i} className="bg-zinc-700/50 border border-zinc-600 rounded-full px-3 py-1 flex items-center gap-2">
                <span className="text-sm text-white">{skill}</span>
                <button onClick={() => handleRemove(skill)} className="text-zinc-400 hover:text-white"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

const EditCertificatesModal = ({ isOpen, onClose, certificates, onSave }: { isOpen: boolean; onClose: () => void; certificates: any[]; onSave: (data: any) => void }) => {
  const [list, setList] = useState(certificates || []);
  const [newCert, setNewCert] = useState({ name: '', organization: '', issueDate: '', url: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setList(certificates || []);
  }, [certificates, isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newCert.name || !newCert.organization) return;
    setList([...list, newCert]);
    setNewCert({ name: '', organization: '', issueDate: '', url: '' });
    setIsAdding(false);
  };

  const handleRemove = (index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSave = () => {
    onSave({ certificates: list });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2b2b2b] rounded-2xl w-full max-w-2xl border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Edit Certificates</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4 mb-6">
            {list.map((cert: any, i: number) => (
              <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{cert.name}</h4>
                  <p className="text-sm text-zinc-300">{cert.organization}</p>
                  {cert.issueDate && <p className="text-xs text-zinc-400">Issued {new Date(cert.issueDate).toLocaleDateString()}</p>}
                </div>
                <button onClick={() => handleRemove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          {isAdding ? (
            <div className="bg-[#1a1a1a] p-4 rounded-lg space-y-3 border border-zinc-600">
              <input type="text" placeholder="Certificate Name" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})} />
              <input type="text" placeholder="Issuing Organization" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newCert.organization} onChange={e => setNewCert({...newCert, organization: e.target.value})} />
              <input type="date" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newCert.issueDate} onChange={e => setNewCert({...newCert, issueDate: e.target.value})} />
              <input type="text" placeholder="Credential URL" className="w-full bg-[#2b2b2b] p-2 rounded text-white border border-zinc-600" value={newCert.url} onChange={e => setNewCert({...newCert, url: e.target.value})} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsAdding(false)} className="text-sm text-zinc-400">Cancel</button>
                <button onClick={handleAdd} className="text-sm bg-indigo-600 px-3 py-1 rounded text-white">Add</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"><Plus size={18} /> Add Certificate</button>
          )}
        </div>
        <div className="p-4 border-t border-zinc-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const LinkedInProfilePage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isCertificatesModalOpen, setIsCertificatesModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/profile?userid=${username}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch profile');
          }
          const { data } = await res.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/auth/ProjectOrResearch?userid=${username}`);
          if (res.ok) {
            const data = await res.json();
            const formattedPosts = (data.data || []).map((post: any) => ({
              id: post._id,
              author: {
                name: post.user?.fullName,
                username: post.user?.username,
                avatar: post.user?.profileImage,
                headline: post.user?.headline,
              },
              timestamp: new Date(post.createdAt).toLocaleDateString(),
              content: post.description,
              coverImage: post.coverImage,
              likes: post.likes || [],
              interested: post.interested || [],
              comments: post.comments?.length || 0,
            }));
            setPosts(formattedPosts);
          }
        } catch (err) {
          console.error("Failed to fetch posts", err);
        }
      };

      fetchProfile();
      fetchPosts();
    }
  }, [username]);

  const handleCreatePost = (content: string) => {
    if (!content.trim() || !profile) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: profile.user.fullName,
        username: profile.user.username,
        avatar: profile.profilePicture || profile.user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop",
        headline: profile.headline || "",
      },
      timestamp: "Just now",
      content: content,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
  };

  const handleCreateProject = async (formData: FormData) => {
    // This function sends the project data to the backend API.
    const res = await fetch('/api/auth/ProjectOrResearch', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create project.');
    }

    // TODO: Re-fetch projects or update state here to show the new project
    alert('Project created successfully!');
    // You might want to trigger a refresh of the projects list here.
  };

  const handleInteraction = async (postId: string, action: 'like' | 'interested') => {
    if (!session?.user?.email) return;
    const userIdentifier = session.user.email;

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const list = action === 'like' ? post.likes : (post.interested || []);
        const isActive = list.includes(userIdentifier);
        const newList = isActive 
          ? list.filter((u: string) => u !== userIdentifier)
          : [...list, userIdentifier];
        
        return {
          ...post,
          [action === 'like' ? 'likes' : 'interested']: newList
        };
      }
      return post;
    }));

    try {
      await fetch('/api/auth/ProjectOrResearch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action, username: userIdentifier }),
      });
    } catch (error) {
      console.error("Failed to update interaction", error);
    }
  };

  const handleSaveProfile = async (sectionUpdates: any) => {
    if (!profile) return;

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionUpdates),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const { data } = await res.json();
      
      // Update local state to reflect changes immediately
      setProfile(prev => prev ? {
        ...prev,
        ...data
      } : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleSaveProfile({ profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex justify-center items-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex justify-center items-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white flex justify-center items-center">
        <p>Profile not found.</p>
      </div>
    );
  }

  const { user, headline, bio, location, profilePicture, links, skills, education, experience, certificates } = profile;

  const latestExperience = experience && experience.length > 0 ? experience.find(e => e.current) || experience[0] : null;
  const latestEducation = education && education.length > 0 ? education[0] : null;

  const socialLinks = {
    linkedin: links.find(l => l.title.toLowerCase() === 'linkedin')?.url,
    github: links.find(l => l.title.toLowerCase() === 'github')?.url,
    twitter: links.find(l => l.title.toLowerCase() === 'twitter')?.url,
  };

  const isOwnProfile = session?.user?.email === user.email;

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-white font-sans">
      <div className="container mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-8">
        {/* Left Sidebar */}
        <div className="hidden lg:col-span-3 lg:block space-y-6 self-start sticky top-8">
          <ProfileSidebarCard profile={profile} />
          <GroupsSidebarCard />
          {isOwnProfile && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full bg-[#2b2b2b] hover:bg-red-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg border border-zinc-700"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-12 space-y-6 lg:col-span-6">
          {/* Profile Card */}
          <div className="bg-[#2b2b2b] rounded-2xl overflow-hidden shadow-lg border border-zinc-700">
            {/* Cover Photo */}
            <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')" }}></div>

            <div className="p-6 relative">
              {/* Profile Picture */}
              <div className="absolute -top-20 left-6 group">
                <img
                  className="w-36 h-36 rounded-full border-4 border-[#2b2b2b] object-cover"
                  src={profilePicture || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop"}
                  alt="Profile Picture"
                />
                {isOwnProfile && (
                  <>
                    <button
                      onClick={handleProfilePictureClick}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera size={24} className="text-white" />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </>
                )}
              </div>

              <div className="pt-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold truncate" title={user.fullName}>{user.fullName}</h1>
                      {isOwnProfile && (
                        <button 
                          onClick={() => setIsIntroModalOpen(true)}
                          className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Pencil size={20} />
                        </button>
                      )}
                    </div>
                    <p className="text-zinc-300 mt-1 text-lg">{headline}</p>
                    
                    <div className="flex flex-wrap gap-y-1 gap-x-3 mt-2 text-sm text-zinc-400">
                        {location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={16} /> {location}
                        </span>
                        )}
                        {user.mobile && (
                        <span className="flex items-center gap-1">
                            <Phone size={16} /> {user.mobile}
                        </span>
                        )}
                         {user.email && (
                        <span className="flex items-center gap-1">
                            <Send size={16} /> {user.email}
                        </span>
                        )}
                    </div>

                    {/* {user.role && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                            {user.role}
                        </span>
                      </div>
                    )}
                     */}
                    {bio && (
                      <p className="text-zinc-400 text-sm mt-3 line-clamp-2 max-w-2xl">
                        {bio}
                      </p>
                    )}

                    {skills && skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="text-xs bg-zinc-700/50 text-zinc-300 px-2 py-1 rounded-md border border-zinc-600/50">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 5 && (
                          <span className="text-xs text-zinc-500 py-1 px-1">+{skills.length - 5} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                        {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#0077b5] transition-colors"><Linkedin size={20} /></a>}
                        {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors"><Github size={20} /></a>}
                        {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={20} /></a>}
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col gap-2 min-w-55">
                      {latestExperience && (
                          <div className="flex items-center gap-2 group cursor-pointer">
                              <div className="w-8 h-8 bg-zinc-700 rounded flex items-center justify-center text-white shrink-0"><Briefcase size={14} /></div>
                              <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 group-hover:underline line-clamp-2">{latestExperience.company}</span>
                          </div>
                      )}
                      {latestEducation && (
                          <div className="flex items-center gap-2 group cursor-pointer">
                              <div className="w-8 h-8 bg-zinc-700 rounded flex items-center justify-center text-white shrink-0"><GraduationCap size={14} /></div>
                              <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 group-hover:underline line-clamp-2">{latestEducation.school}</span>
                          </div>
                      )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  {!isOwnProfile && (
                    <>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 transition-colors">
                        <Plus size={18} /> Connect
                      </button>
                      <button className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 transition-colors">
                        <Send size={16} /> Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Create Post Section */}
          {isOwnProfile && (
            <div className="bg-[#2b2b2b] p-4 rounded-2xl shadow-lg border border-zinc-700">
              <div className="flex items-start gap-4">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={profilePicture || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop"}
                  alt="Your Profile Picture"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 text-left bg-transparent border border-zinc-600 hover:bg-zinc-800 rounded-full px-5 py-3 text-zinc-400 font-medium transition-colors"
                >
                  Share a Project or Research...
                </button>
              </div>
            </div>
          )}

          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateProject}
            user={{
              _id: user._id,
              name: profile.user.fullName,
              avatar: profilePicture || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop",
              headline: headline || "",
            }}
          />

          <EditIntroModal 
            isOpen={isIntroModalOpen} 
            onClose={() => setIsIntroModalOpen(false)} 
            initialData={{ headline: profile.headline, location: profile.location, mobile: profile.user.mobile }} 
            onSave={handleSaveProfile}
          />

          {/* My Posts Section */}
          <div className="bg-[#2b2b2b] rounded-2xl shadow-lg border border-zinc-700">
            <h2 className="text-2xl font-bold p-6 pb-4">Projects & Researches</h2>
            <div className="divide-y divide-zinc-700/50">
              {posts.map((post) => (
                <div key={post.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={post.author.avatar || profile?.profilePicture || profile?.user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fDE?q=80&w=1780&auto=format&fit=crop"}
                        alt={`${post.author.name || profile?.user?.fullName || "User"}'s avatar`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{post.author.name || profile?.user?.fullName || "Unknown"}</p>
                          {(post.author.username || profile?.user?.username) && <span className="text-xs text-zinc-500">@{post.author.username || profile?.user?.username}</span>}
                        </div>
                        <p className="text-sm text-zinc-400">{post.author.headline || profile?.headline}</p>
                        <p className="text-xs text-zinc-500 mt-1">{post.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-zinc-400 hover:text-white">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                  <p className="mt-4 text-zinc-300 whitespace-pre-wrap">{post.content}</p>
                  {post.coverImage && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-zinc-700">
                      <img
                        src={post.coverImage}
                        alt="Post content"
                        className="w-full h-auto object-cover max-h-[500px]"
                      />
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between text-zinc-400 text-sm">
                      <div className="flex items-center gap-1.5">
                          <ThumbsUp size={14} className="text-green-500" />
                          <span>{post.likes.length}</span>
                      </div>
                      {post.interested && post.interested.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Star size={14} className="text-yellow-500" />
                            <span>{post.interested.length} interested</span>
                        </div>
                      )}
                      <span>{post.comments} comments</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-700 flex gap-2">
                    <button onClick={() => handleInteraction(post.id, 'like')} className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors w-full justify-center ${post.likes.includes(session?.user?.email) ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300 hover:bg-zinc-700'}`}>
                      <ThumbsUp size={20} className={post.likes.includes(session?.user?.email) ? 'fill-current' : ''} /> Like
                    </button>
                    <button onClick={() => handleInteraction(post.id, 'interested')} className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors w-full justify-center ${post.interested?.includes(session?.user?.email) ? 'text-yellow-400 bg-yellow-500/10' : 'text-zinc-300 hover:bg-zinc-700'}`}>
                      <Star size={20} className={post.interested?.includes(session?.user?.email) ? 'fill-current' : ''} /> Interested
                    </button>
                    <button className="flex items-center gap-2 text-zinc-300 hover:bg-zinc-700 py-2 px-3 rounded-lg transition-colors w-full justify-center">
                      <MessageSquare size={20} /> Comment
                    </button>
                    <button className="flex items-center gap-2 text-zinc-300 hover:bg-zinc-700 py-2 px-3 rounded-lg transition-colors w-full justify-center">
                      <Share2 size={20} /> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="bg-[#2b2b2b] p-6 rounded-2xl shadow-lg border border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">About</h2>
              {isOwnProfile && (
                <button onClick={() => setIsAboutModalOpen(true)} className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <Pencil size={20} />
                </button>
              )}
            </div>
            <p className="text-zinc-300 leading-relaxed">{bio || 'No bio available.'}</p>
            <EditAboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} initialData={{ bio }} onSave={handleSaveProfile} />
          </div>

          {/* Experience Section */}
          <div className="bg-[#2b2b2b] p-6 rounded-2xl shadow-lg border border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Experience</h2>
              {isOwnProfile && (
                <button onClick={() => setIsExperienceModalOpen(true)} className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <Pencil size={20} />
                </button>
              )}
            </div>
            <div className="space-y-6">
              {experience?.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center text-white shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{exp.title}</h3>
                    <p className="text-zinc-300">{exp.company}</p>
                    <p className="text-zinc-400 text-sm">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </p>
                    {exp.location && <p className="text-zinc-400 text-sm mt-1">{exp.location}</p>}
                  </div>
                </div>
              ))}
              {experience?.length === 0 && <p className="text-zinc-400">No experience listed.</p>}
            </div>
            <EditExperienceModal isOpen={isExperienceModalOpen} onClose={() => setIsExperienceModalOpen(false)} experiences={experience} onSave={handleSaveProfile} />
          </div>

          {/* Education Section */}
          <div className="bg-[#2b2b2b] p-6 rounded-2xl shadow-lg border border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Education</h2>
              {isOwnProfile && (
                <button onClick={() => setIsEducationModalOpen(true)} className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <Pencil size={20} />
                </button>
              )}
            </div>
            {education?.map((edu, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center text-white shrink-0">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{edu.school}</h3>
                  <p className="text-zinc-300">{edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</p>
                  <p className="text-zinc-400 text-sm">
                    {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  </p>
                </div>
              </div>
            ))}
            {education?.length === 0 && <p className="text-zinc-400">No education listed.</p>}
            <EditEducationModal isOpen={isEducationModalOpen} onClose={() => setIsEducationModalOpen(false)} education={education} onSave={handleSaveProfile} />
          </div>

          {/* Certificates Section */}
          <div className="bg-[#2b2b2b] p-6 rounded-2xl shadow-lg border border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Certificates</h2>
              {isOwnProfile && (
                <button onClick={() => setIsCertificatesModalOpen(true)} className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <Pencil size={20} />
                </button>
              )}
            </div>
            {certificates?.map((cert, i) => (
              <div key={i} className="flex gap-4 mb-4 last:mb-0">
                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center text-white shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{cert.name}</h3>
                  <p className="text-zinc-300">{cert.organization}</p>
                  {cert.issueDate && <p className="text-zinc-400 text-sm">Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>}
                </div>
              </div>
            ))}
            {certificates?.length === 0 && <p className="text-zinc-400">No certificates listed.</p>}
            <EditCertificatesModal isOpen={isCertificatesModalOpen} onClose={() => setIsCertificatesModalOpen(false)} certificates={certificates} onSave={handleSaveProfile} />
          </div>

          {/* Skills Section */}
          <div className="bg-[#2b2b2b] p-6 rounded-2xl shadow-lg border border-zinc-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Skills</h2>
              {isOwnProfile && (
                <button onClick={() => setIsSkillsModalOpen(true)} className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <Pencil size={20} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {skills?.map((skill, i) => (
                <SkillBadge key={i} name={skill} />
              ))}
              {skills?.length === 0 && <p className="text-zinc-400">No skills listed.</p>}
            </div>
            <EditSkillsModal isOpen={isSkillsModalOpen} onClose={() => setIsSkillsModalOpen(false)} initialData={{ skills }} onSave={handleSaveProfile} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:col-span-3 lg:block space-y-6 self-start sticky top-8">
          <SidebarCard title="People also viewed" icon={<Users size={20} />}>
            {people.slice(0, 3).map((person, i) => <PersonListItem key={i} {...person} />)}
          </SidebarCard>
          <SidebarCard title="People you may know" icon={<Users size={20} />}>
            {people.slice(3, 5).map((person, i) => <PersonListItem key={i} {...person} />)}
          </SidebarCard>
        </div>
      </div>
    </div>
  );
};

const SkillBadge = ({ name }: { name: string }) => (
  <div className="bg-zinc-700/50 border border-zinc-600 rounded-full px-4 py-2">
    <span className="font-medium text-sm">{name}</span>
  </div>
);

export default LinkedInProfilePage;