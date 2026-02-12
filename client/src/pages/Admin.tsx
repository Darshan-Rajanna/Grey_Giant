import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Github, Save, CheckCircle, AlertCircle, Image as ImageIcon, Send, X, Plus, Trash2, ArrowRight, Layers, Star, PlusCircle, Pencil, Search, RefreshCw, UploadCloud, Eye, EyeOff, FileText, ChevronLeft, ChevronRight, GripVertical, Maximize2, Briefcase } from "lucide-react";
import { siteContent, type SiteContent } from "@/data/siteContent";
import logoImg from "@assets/logo/logo1.jpeg";
import { updateGitHubFile, uploadGitHubImage, listGitHubFiles, deleteGitHubFile, type GitHubConfig } from "@/lib/github-api";
import { resolveAsset } from "@/lib/asset-utils";

// Helper to resolve assets in Admin with a GitHub raw fallback for newly uploaded files
const resolveAdminAsset = (path: string, auth?: { githubOwner: string, githubRepo: string }) => {
  if (!path) return "https://placehold.co/600x400/0a0a0a/d4af37?text=No+Asset";
  if (path.startsWith('data:') || path.startsWith('http')) return path;

  // Try local first
  const local = resolveAsset(path);
  // If local resolution fails (e.g. it returns a placeholder or doesn't map) 
  // or if we want to ensure we see the LATEST version from GitHub:
  if (auth && auth.githubOwner && auth.githubRepo) {
    const isSpecial = (path.startsWith('OurStory/') || path.startsWith('Welcome/') || path.startsWith('Brochure/'));
    const isAbout = path.startsWith('About/');
    const isBg = !path.includes('/');

    // Resolve relative path based on directory location
    const repoPath = isBg ? `backgrounds/${path}` : (isSpecial ? path : (isAbout ? `gallery/${path}` : `gallery/${path}`));
    return `https://raw.githubusercontent.com/${auth.githubOwner}/${auth.githubRepo}/main/client/src/assets/${repoPath}`;
  }
  return local;
};

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Import ONLY GeneralGallery images (matches website Gallery.tsx)
// Static glob removed to avoid duplication with live GitHub asset fetching

interface AuthState {
  isLoggedIn: boolean;
  step: "credentials" | "otp";
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
}

type Tab = "hero" | "about" | "story" | "values" | "services" | "gallery" | "reviews" | "contact" | "socials" | "welcome";

const tabMetadata: Record<Tab, { label: string, icon: any }> = {
  hero: { label: "Hero", icon: Star },
  about: { label: "About", icon: FileText },
  story: { label: "Story", icon: Eye },
  values: { label: "Values", icon: Layers },
  services: { label: "Services", icon: Briefcase },
  gallery: { label: "Gallery", icon: ImageIcon },
  reviews: { label: "Reviews", icon: Send },
  contact: { label: "Contact", icon: Mail },
  socials: { label: "Socials", icon: Github },
  welcome: { label: "Welcome", icon: RefreshCw }
};

// --- Sortable Components ---

const SortableGridItem = ({ id, path, idx, otherUsage, onRemove, onReplace, auth }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden cursor-pointer group p-2 bg-black/20 border border-primary/30 shadow-2xl rounded-sm w-full"
    >
      <div className="w-full h-full" {...attributes} {...listeners}>
        <img
          src={resolveAdminAsset(path, auth)}
          className="w-full h-full object-cover rounded-sm transition-transform duration-1000 group-hover:scale-110"
          alt="Gallery Item"
        />
      </div>

      {/* Usage Indicator */}
      {otherUsage.has(path) && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-10 pointer-events-none">
          <Layers size={12} className="text-primary/60" />
          <span className="text-xs font-black uppercase text-white/60 tracking-wider">In Use</span>
        </div>
      )}

      {/* Actions Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          {onReplace && (
            <button
              onClick={(e) => { e.stopPropagation(); onReplace(); }}
              className="p-3 bg-primary/20 hover:bg-primary text-primary hover:text-black rounded-full transition-all border border-primary/30"
              title="Replace Asset"
            >
              <RefreshCw size={14} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all border border-red-500/30"
            title="Remove from Curator"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
          <GripVertical className="text-primary/40 w-4 h-4" />
        </div>
      </div>

      <div className="absolute bottom-2 left-2 px-2.5 py-1.5 bg-black/60 rounded-lg text-xs font-black text-white/40 border border-white/5 pointer-events-none">
        {idx + 1}
      </div>
    </div>
  );
};

const SortableListItem = ({ id, children, onRemove, handle = true }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-4 p-6 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-white/10 transition-all">
        {handle && (
          <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-white/5 hover:text-primary transition-colors p-2 -ml-2">
            <GripVertical size={20} />
          </div>
        )}
        <div className="flex-1 space-y-4">
          {children}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="mt-1 p-3 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// --- Externalized UI Components ---

const VisualImageField = ({ label, value, onBrowse, helpText }: any) => (
  <div className="space-y-4">
    <div className="space-y-1.5">
      <label className="text-sm uppercase tracking-wider text-white/60 font-bold px-1 flex items-center gap-2">
        <ImageIcon size={14} className="text-primary/60" /> {label}
      </label>
      {helpText && <p className="text-xs text-white/30 px-1 leading-relaxed">{helpText}</p>}
    </div>
    <div
      onClick={onBrowse}
      className="group relative aspect-video bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-500 min-h-[44px]"
    >
      {value?.toLowerCase().endsWith('.pdf') ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/5 text-primary">
          <FileText size={48} className="mb-4 opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
          <span className="text-sm uppercase font-black tracking-wider opacity-40 group-hover:opacity-100 transition-opacity duration-700">PDF Document</span>
          <span className="text-xs text-white/20 mt-2">Click to change</span>
        </div>
      ) : (
        <img
          src={value && (value.startsWith?.("data:") || value.startsWith?.("http")) ? value : resolveAdminAsset(value, onBrowse?.auth)}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
          alt={label}
          onError={(e: any) => e.target.src = "https://placehold.co/600x400/0a0a0a/d4af37?text=Click+to+Select+Image"}
        />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-primary/20 rounded-full border border-primary/30">
            <RefreshCw size={24} className="text-primary animate-spin-slow group-hover:rotate-180 transition-transform duration-1000" />
          </div>
          <span className="text-sm uppercase font-black tracking-wider text-primary">Change Image</span>
          <span className="text-xs text-white/40">Click to browse</span>
        </div>
      </div>
      {value && (
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          <p className="text-xs font-mono text-white/40 truncate">{value}</p>
        </div>
      )}
    </div>
  </div>
);

const Field = ({ label, value, onChange, area = false, italic = false, helpText, placeholder }: any) => (
  <div className="space-y-3">
    <div className="space-y-1.5">
      <label className="text-sm uppercase tracking-wider text-white/60 font-bold px-1 flex items-center gap-2">
        <Pencil size={14} className="text-primary/60" /> {label}
      </label>
      {helpText && <p className="text-xs text-white/30 px-1 leading-relaxed">{helpText}</p>}
    </div>
    {area ? (
      <textarea
        className={`w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-white/80 focus:border-primary/40 focus:bg-white/[0.05] outline-none transition-all min-h-[140px] resize-none leading-relaxed text-sm ${italic ? 'italic font-serif text-lg' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter text here...'}
      />
    ) : (
      <input
        type="text"
        className="w-full bg-white/[0.03] border border-white/10 rounded-3xl h-14 md:h-16 px-6 text-white/80 focus:border-primary/40 focus:bg-white/[0.05] outline-none transition-all text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter text...'}
      />
    )}
  </div>
);

const MobileNav = ({ activeTab, setActiveTab }: any) => (
  <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 z-[100] px-4 py-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
    <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4 scroll-smooth">
      {(Object.keys(tabMetadata) as Tab[]).map((tabId) => {
        const { label, icon: Icon } = tabMetadata[tabId];
        const isActive = activeTab === tabId;
        return (
          <button
            key={tabId}
            onClick={() => {
              setActiveTab(tabId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1.5 min-w-[64px] py-2 px-1 rounded-2xl transition-all duration-500 ${isActive ? 'text-primary' : 'text-white/20 hover:text-white/40'}`}
          >
            <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-primary/10 scale-110 shadow-[0_0_20px_rgba(212,175,55,0.2)]' : ''}`}>
              <Icon size={18} />
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest">{label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

const DeploymentStatus = ({ auth, isSaving, status }: any) => {
  const [lastCommit, setLastCommit] = useState<any>(null);

  useEffect(() => {
    if (auth?.isLoggedIn && !isSaving) {
      const fetchLastCommit = async () => {
        try {
          const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
          const OctokitClz = (await import("octokit")).Octokit;
          const octokit = new OctokitClz({ auth: config.token });
          const { data } = await octokit.rest.repos.listCommits({ owner: config.owner, repo: config.repo, per_page: 1 });
          setLastCommit(data[0]);
        } catch (e) { }
      };
      fetchLastCommit();
      const interval = setInterval(fetchLastCommit, 60000);
      return () => clearInterval(interval);
    }
  }, [auth?.isLoggedIn, isSaving, auth?.githubOwner, auth?.githubRepo, auth?.githubToken]);

  if (!auth?.isLoggedIn) return null;

  return (
    <div className="flex flex-col gap-3 p-5 bg-white/[0.02] border border-white/5 rounded-3xl group transition-all duration-500 hover:border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github size={12} className="text-white/20" />
          <span className="text-[9px] uppercase font-black tracking-[0.2em] text-white/20">Sync Engine</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`} />
      </div>

      {lastCommit && (
        <div className="space-y-1 overflow-hidden">
          <span className="text-[10px] font-black text-white/60 truncate block leading-tight">{isSaving ? 'Synchronizing Control...' : 'Active Protocol'}</span>
          <span className="text-[9px] font-mono text-white/20 truncate block opacity-0 group-hover:opacity-100 transition-opacity duration-500">{lastCommit.commit.message}</span>
        </div>
      )}

      {status && (
        <div className={`mt-1 p-2 rounded-xl border text-[8px] font-black uppercase tracking-wider ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onSave, isSaving, logout, auth, status }: any) => (
  <aside className="hidden lg:flex flex-col w-[350px] h-screen fixed left-0 top-0 bg-[#050505] border-r border-white/5 px-8 py-10 z-[200]">
    {/* Head Section with Logo */}
    <div className="mb-10 px-2">
      <div className="flex items-center gap-5 mb-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-colors duration-700 rounded-full" />
          <img
            src={logoImg}
            alt="Grey Giant Logo"
            className="relative w-14 h-14 object-contain rounded-2xl border border-white/10 shadow-2xl"
          />
        </div>
        <div>
          <h1 className="text-2xl font-serif italic text-white flex flex-col leading-none">
            Grey <span className="text-primary not-italic font-sans text-[10px] uppercase tracking-[0.4em] font-black mt-1">Giant Studio</span>
          </h1>
          <p className="text-[8px] text-white/10 uppercase tracking-[0.3em] font-black mt-2">Administrative Console</p>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
    </div>

    {/* Navigation Tabs - Scrollable but items are more compact to fit */}
    <nav className="flex-1 min-h-0 -mx-2 px-2 overflow-y-auto custom-scrollbar scroll-smooth">
      <div className="grid grid-cols-1 gap-1.5 pb-8">
        {(Object.keys(tabMetadata) as Tab[]).map((tabId) => {
          const { label, icon: Icon } = tabMetadata[tabId];
          const isActive = activeTab === tabId;
          return (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-500 group outline-none relative ${isActive ? 'bg-primary text-black shadow-[0_10px_25px_rgba(212,175,55,0.2)]' : 'text-white/20 hover:bg-white/[0.03] hover:text-white/40'}`}
            >
              <div className={`p-1.5 rounded-lg transition-colors duration-500 ${isActive ? 'bg-black/10' : 'bg-transparent group-hover:bg-white/5'}`}>
                <Icon size={16} className={isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-500'} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-[0.2em]">{label}</span>
              {isActive && <ArrowRight size={12} className="ml-auto opacity-40 animate-in slide-in-from-left-2" />}
            </button>
          );
        })}
      </div>
    </nav>

    {/* Status & Actions Section - Pushed to bottom, Fixed layout */}
    <div className="mt-auto pt-8 border-t border-white/5 space-y-4 shrink-0">
      <DeploymentStatus auth={auth} isSaving={isSaving} status={status} />

      <div className="space-y-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="relative w-full py-4 bg-primary text-black rounded-xl text-[10px] uppercase font-black flex items-center justify-center gap-3 shadow-2xl transition-all duration-500 disabled:opacity-50 group outline-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 flex items-center gap-2">
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} className="group-hover:rotate-12 transition-transform duration-500" />}
            {isSaving ? "Sync Active" : "Push Changes"}
          </span>
        </button>

        <button
          onClick={logout}
          className="w-full py-3 text-white/20 hover:text-red-400 hover:bg-red-500/5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all duration-300 outline-none"
        >
          Sign Out
        </button>
      </div>
    </div>
  </aside>
);


const RepositoryBrowser = ({
  dir,
  activeSelection,
  assetFiles,
  fetchAllAssets,
  isFetchingFiles,
  isOptimizing,
  onFileChange,
  selectedUploadFile,
  uploadTargetDirForSection,
  setUploadTargetDirForSection,
  handleImageUpload,
  handleDeleteAsset,
  usedAssets,
  onSelect,
  auth,
  stagedUploads
}: any) => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
      <div>
        <h4 className="text-sm uppercase tracking-wider font-black text-white/60">{dir}</h4>
        <p className="text-xs text-white/30 mt-0.5">Manage images for this section</p>
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={fetchAllAssets}
          title="Refresh image list from server"
          className="text-primary/60 hover:text-primary transition-colors flex items-center gap-2 text-sm uppercase font-black min-h-[44px] px-4 py-2 rounded-xl hover:bg-white/5"
        >
          <RefreshCw size={16} className={isFetchingFiles ? "animate-spin" : ""} /> Refresh
        </button>
        <label
          htmlFor={`up-${dir}`}
          title={`Upload new ${dir === "Brochure" ? "PDF document" : "image"}`}
          className="text-primary hover:text-white bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer flex items-center gap-2 text-sm uppercase font-black min-h-[44px] px-5 py-2 rounded-xl"
        >
          <UploadCloud size={16} /> Upload {dir === "Brochure" ? "PDF" : "Image"}
        </label>
        <input
          type="file"
          id={`up-${dir}`}
          className="hidden"
          accept={dir === "Brochure" ? ".pdf" : "image/*"}
          onChange={(e) => {
            setUploadTargetDirForSection(dir);
            onFileChange(e);
          }}
        />
      </div>
    </div>

    {isOptimizing && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center gap-4">
        <RefreshCw size={18} className="animate-spin text-primary" />
        <div>
          <span className="text-sm uppercase font-black tracking-wider text-primary block">Optimizing Image...</span>
          <span className="text-xs text-white/40 mt-1 block">Converting to WebP format</span>
        </div>
      </motion.div>
    )}

    {selectedUploadFile && uploadTargetDirForSection === dir && !isOptimizing && (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-primary/10 border border-dashed border-primary/30 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border border-primary/20 bg-black/40 overflow-hidden flex-shrink-0">
            <img src={selectedUploadFile.base64} className="w-full h-full object-cover" alt="Preview" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-primary uppercase tracking-wider">{selectedUploadFile.name}</span>
            <span className="text-xs text-white/40 mt-1">Ready to upload • Optimized for web</span>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleImageUpload(dir)}
            className="flex-1 sm:flex-none px-6 py-3 bg-primary text-black text-sm uppercase font-black rounded-xl shadow-lg hover:scale-105 transition-all min-h-[44px]"
          >
            Confirm Upload
          </button>
          <button
            onClick={() => onFileChange(null as any)}
            title="Cancel upload"
            className="p-3 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all min-h-[44px] min-w-[44px]"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    )}

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* Render Staged Uploads first */}
      {(stagedUploads || [])
        .filter((s: any) => s.targetDir === dir)
        .map((s: any, idx: number) => {
          const fullPath = s.base64; // Use base64 as path for staged
          const isActive = activeSelection === fullPath;
          const isUsed = usedAssets && usedAssets.has(fullPath);

          return (
            <motion.div
              key={`staged-${idx}`}
              whileHover={{ scale: 1.02 }}
              className={`aspect-square bg-primary/5 border rounded-[2rem] overflow-hidden group relative transition-all duration-500 border-primary/40`}
            >
              <img
                src={s.base64}
                className={`w-full h-full object-cover opacity-90`}
                alt={s.name}
              />

              <div className="absolute top-4 left-4 flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 bg-primary/20 backdrop-blur-md rounded-lg border border-primary/30 z-10">
                <UploadCloud size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">Staged</span>
              </div>

              {isUsed && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-10">
                  <Layers size={12} className="text-primary/60" />
                  <span className="text-[10px] font-black uppercase text-white/60 tracking-wider">Active</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <button
                  onClick={() => onSelect && onSelect(fullPath)}
                  className="w-full py-3 bg-primary text-black rounded-xl text-xs uppercase font-black shadow-xl"
                >
                  Select Staged
                </button>
              </div>
            </motion.div>
          );
        })
      }

      {(assetFiles[dir] || []).map((f: string) => {
        const isBg = dir === "backgrounds";
        const fullPath = isBg ? f : `${dir}/${f}`;
        const isActive = activeSelection === fullPath;
        const isUsed = usedAssets && usedAssets.has(fullPath);

        return (
          <motion.div
            key={f}
            whileHover={{ scale: 1.02 }}
            className={`aspect-square bg-white/[0.02] border rounded-[2rem] overflow-hidden group relative transition-all duration-500 ${isActive ? 'border-primary/60 shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'border-white/5'}`}
          >
            <img
              src={resolveAdminAsset(fullPath, auth)}
              className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'opacity-90 grayscale-0' : 'opacity-40 group-hover:opacity-80 grayscale-[0.5] group-hover:grayscale-0'}`}
              alt={f}
              onError={(e: any) => e.target.src = "https://placehold.co/600x400/020202/d4af37?text=Image"}
            />

            {isUsed && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-10">
                <Layers size={12} className="text-primary/60" />
                <span className="text-xs font-black uppercase text-white/60 tracking-wider">Active</span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col gap-3">
              <button
                onClick={() => {
                  if (onSelect) onSelect(fullPath);
                  else {
                    navigator.clipboard.writeText(fullPath);
                  }
                }}
                title={onSelect ? "Use this image" : "Copy path to clipboard"}
                className="w-full py-3 bg-primary text-black rounded-xl text-xs uppercase font-black shadow-xl min-h-[44px] hover:bg-white transition-colors"
              >
                {onSelect ? "Select Image" : "Copy Path"}
              </button>
              {!isUsed && (
                <button
                  onClick={() => handleDeleteAsset(dir, f)}
                  title="Delete this image permanently"
                  className="text-red-500/60 hover:text-red-500 transition-colors self-center p-2 hover:bg-red-500/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            {isActive && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black shadow-lg animate-in zoom-in-50 duration-500">
                <CheckCircle size={14} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default function Admin() {
  const serviceFolderMap: Record<string, string> = {
    'Luxury Corporate Events': 'LuxuryCorporateEvents',
    'Bespoke Weddings & Engagements': 'BespokeWeddings&Engagements',
    'DJ Night & Private Party Event Services': 'DJNights&PrivateParties',
    'Traditional Bands & Brand Opening Décor': 'TraditionalBands&BrandOpenings',
    'Catering & Culinary Experiences': 'Catering & Culinary Experiences',
    'Makeup & Hairstyle Services': 'Makeup&StylingServices',
    'Customized Cakes & Desserts': 'Pastries & Celebration Cakes',
    'Birthday Events & Celebration Services': 'Balloon Decor & Birthday Celebrations',
    'Public Events & Social Activity Services': 'Private & Social Celebrations',
    'School & College Event Services': 'Schools, Colleges & University Event Services'
  };

  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    step: "credentials",
    githubToken: "",
    githubOwner: "",
    githubRepo: "",
  });

  const [showToken, setShowToken] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Asset Management
  const [assetFiles, setAssetFiles] = useState<{ [key: string]: string[] }>({});
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<{ name: string; base64: string } | null>(null);
  const [stagedUploads, setStagedUploads] = useState<Array<{ targetDir: string; name: string; base64: string; previousPath?: string; deleteOld?: boolean }>>([]);
  const [activePickerField, setActivePickerField] = useState<{ label: string, path: string, setter: (val: string) => void, preferredDir?: string } | null>(null);

  const assetDirectories = ["backgrounds", "Welcome", "About", "OurStory", "Brochure", "LuxuryCorporateEvents", "BespokeWeddings&Engagements", "GeneralGallery", "DJNights&PrivateParties", "TraditionalBands&BrandOpenings", "Catering & Culinary Experiences", "Makeup&StylingServices", "Pastries & Celebration Cakes", "Balloon Decor & Birthday Celebrations", "Private & Social Celebrations", "Schools, Colleges & University Event Services"];

  // Configuration mapping for background directory associations
  const bgDirMap: Record<Tab, string> = {
    hero: "backgrounds",
    about: "About",
    story: "OurStory",
    values: "backgrounds",
    services: "LuxuryCorporateEvents",
    gallery: "GeneralGallery",
    reviews: "DJNights&PrivateParties",
    contact: "Private & Social Celebrations",
    socials: "backgrounds",
    welcome: "Welcome",
    brochure: "Brochure"
  } as any;

  // Load GitHub config and session from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem("gh_token");
    const savedOwner = localStorage.getItem("gh_owner");
    const savedRepo = localStorage.getItem("gh_repo");
    const savedLogin = localStorage.getItem("is_admin_logged_in") === "true";

    if (savedToken && savedOwner && savedRepo) {
      setAuth(prev => ({
        ...prev,
        githubToken: savedToken,
        githubOwner: savedOwner,
        githubRepo: savedRepo,
        isLoggedIn: savedLogin
      }));
    }
  }, []);

  // Normalize uploaded filenames to a predictable, URL-friendly format
  const normalizeFileName = (original: string, ext = "webp") => {
    const base = original.replace(/\.[^/.]+$/, "");
    const sanitized = base
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return `${sanitized}.${ext}`;
  };

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchAllAssets();
    }
  }, [auth.isLoggedIn]);

  const adminGalleryList = useMemo(() => {
    const savedOrder = formData.galleryPage?.galleryItems || [];

    // Use fetched assets instead of static glob to avoid duplication and staleness
    const activeFiles = assetFiles["GeneralGallery"] || [];
    const normalizedFolderImages = activeFiles.map(f => `GeneralGallery/${f}`);

    // Strictly manual control: only show what is saved in content
    const finalOrder = savedOrder.filter(path =>
      path.startsWith('data:') || path.startsWith('http') || normalizedFolderImages.includes(path)
    );
    return finalOrder;
  }, [formData.galleryPage?.galleryItems, assetFiles]);

  const fetchAllAssets = async () => {
    setIsFetchingFiles(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
    const newAssets: { [key: string]: string[] } = {};
    for (const dir of assetDirectories) {
      const path = (dir === "backgrounds" || dir === "Welcome" || dir === "OurStory" || dir === "Brochure")
        ? `client/src/assets/${dir}`
        : `client/src/assets/gallery/${dir}`;
      const result = await listGitHubFiles(config, path);
      if (result.success && result.files) {
        newAssets[dir] = result.files;
      }
    }
    setAssetFiles(newAssets);
    setIsFetchingFiles(false);
  };


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent, section: string, subId?: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFormData((prev: SiteContent) => {
      const newData = { ...prev };
      if (section === 'gallery') {
        const oldIndex = adminGalleryList.indexOf(active.id as string);
        const newIndex = adminGalleryList.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
          newData.galleryPage.galleryItems = arrayMove([...adminGalleryList], oldIndex, newIndex);
        }
      } else if (section === 'services') {
        const oldIndex = newData.services.findIndex(s => s.id === active.id);
        const newIndex = newData.services.findIndex(s => s.id === over?.id);
        newData.services = arrayMove([...newData.services], oldIndex, newIndex);
      } else if (section === 'service-details' && subId) {
        const sIdx = newData.services.findIndex(s => s.id === subId);
        if (sIdx !== -1) {
          const details = [...(newData.services[sIdx].details || [])];
          const oldIndex = details.findIndex((_, idx) => `det-${subId}-${idx}` === active.id);
          const newIndex = details.findIndex((_, idx) => `det-${subId}-${idx}` === over?.id);
          newData.services[sIdx].details = arrayMove(details, oldIndex, newIndex);
        }
      } else if (section === 'about-desc') {
        const oldIndex = newData.about.description.indexOf(active.id as string);
        const newIndex = newData.about.description.indexOf(over?.id as string);
        newData.about.description = arrayMove([...newData.about.description], oldIndex, newIndex);
      } else if (section === 'distinction-dialog') {
        const oldIndex = newData.distinction.dialog.paragraphs.indexOf(active.id as string);
        const newIndex = newData.distinction.dialog.paragraphs.indexOf(over?.id as string);
        newData.distinction.dialog.paragraphs = arrayMove([...newData.distinction.dialog.paragraphs], oldIndex, newIndex);
      } else if (section === 'values') {
        const oldIndex = newData.values.items.findIndex(v => v.title === active.id);
        const newIndex = newData.values.items.findIndex(v => v.title === over?.id);
        newData.values.items = arrayMove([...newData.values.items], oldIndex, newIndex);
      } else if (section === 'reviews') {
        const oldIndex = newData.reviewItems.findIndex(r => r.id === active.id);
        const newIndex = newData.reviewItems.findIndex(r => r.id === over?.id);
        newData.reviewItems = arrayMove([...newData.reviewItems], oldIndex, newIndex);
      }
      return newData;
    });
  };

  const getAssetUsageCounts = (data: SiteContent) => {
    const counts = new Map<string, number>();
    const process = (val: any) => {
      if (!val) return;
      if (typeof val === 'string' && val.trim() !== '') {
        // Count both standard paths and staged base64 URLs
        if (!val.startsWith('http') && (!val.startsWith('data:') || val.length > 100)) {
          counts.set(val, (counts.get(val) || 0) + 1);
        }
      } else if (Array.isArray(val)) {
        val.forEach(process);
      } else if (typeof val === 'object') {
        Object.values(val).forEach(process);
      }
    };
    process(data);
    return counts;
  };

  const otherUsage = useMemo(() => {
    const counts = getAssetUsageCounts(formData);
    const usedSet = new Set<string>();
    counts.forEach((count, path) => {
      if (count > 0) usedSet.add(path);
    });
    return usedSet;
  }, [formData]);

  const usageCounts = useMemo(() => getAssetUsageCounts(formData), [formData]);

  // --- Core Handlers ---

  const sendOtp = async () => {
    const trimmedToken = auth.githubToken.trim();
    const trimmedOwner = auth.githubOwner.trim();
    const trimmedRepo = auth.githubRepo.trim();

    if (!trimmedToken || !trimmedOwner || !trimmedRepo) {
      setStatus({ type: "error", message: "Missing GitHub credentials." });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "success", message: "Validating credentials..." });

    try {
      // Test the token by trying to get the repo info
      const octokit = new (await import("octokit")).Octokit({ auth: trimmedToken });
      await octokit.rest.repos.get({
        owner: trimmedOwner,
        repo: trimmedRepo,
      });

      // If we reach here, credentials are valid
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      console.log("OTP code:", code);

      // Update state with trimmed values
      setAuth(prev => ({
        ...prev,
        githubToken: trimmedToken,
        githubOwner: trimmedOwner,
        githubRepo: trimmedRepo,
        step: "otp"
      }));

      setStatus({ type: "success", message: `Activation key sent to console: ${code}` });
    } catch (error: any) {
      console.error("Validation Error:", error);
      setStatus({
        type: "error",
        message: error.status === 401 ? "Bad credentials: Check your Token." :
          error.status === 404 ? "Repository not found: Check Owner/Repo names." :
            "Validation failed: " + error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setAuth(prev => ({ ...prev, isLoggedIn: true }));
      localStorage.setItem("gh_token", auth.githubToken);
      localStorage.setItem("gh_owner", auth.githubOwner);
      localStorage.setItem("gh_repo", auth.githubRepo);
      localStorage.setItem("is_admin_logged_in", "true");
      setStatus(null);
    } else {
      setStatus({ type: "error", message: "Invalid key." });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("is_admin_logged_in");
    setAuth(prev => ({ ...prev, isLoggedIn: false }));
    setStatus({ type: "success", message: "Signed out successfully." });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };

    // 0.1) Pre-flight count verification
    const affectedDirs = new Set(stagedUploads.map(s => s.targetDir));
    const preFlightCounts: Record<string, number> = {};
    Array.from(affectedDirs).forEach(dir => {
      preFlightCounts[dir] = (assetFiles[dir] || []).length;
    });

    // Work on a deep copy of current content so we can safely replace previews
    const newData: SiteContent = JSON.parse(JSON.stringify(formData));

    // 0) Validation: Ensure all services and details have images
    for (const service of newData.services) {
      if (!service.image) {
        setIsSaving(false);
        setStatus({ type: "error", message: `Service "${service.title}" is missing a featured image.` });
        return;
      }
      for (const detail of (service.details || [])) {
        if (!detail.image) {
          setIsSaving(false);
          setStatus({ type: "error", message: `Detail "${detail.title}" in "${service.title}" is missing an image.` });
          return;
        }
      }
    }

    // 1) Process staged uploads
    if (stagedUploads.length > 0) {
      for (const staged of stagedUploads) {
        const { targetDir, name, base64, previousPath, deleteOld } = staged;
        const uploadRes = await uploadGitHubImage(config, targetDir, name, base64.split(",")[1], `Admin: Resource upload to ${targetDir}`);
        if (!uploadRes.success) {
          setIsSaving(false);
          setStatus({ type: "error", message: `Upload failed for ${name}: ${uploadRes.message}` });
          return;
        }

        const newPath = targetDir === "backgrounds" ? name : `${targetDir}/${name}`;

        // If requested, delete old asset from repo
        if (deleteOld && previousPath && previousPath !== newPath) {
          const deletePath = (previousPath.includes('/') && !previousPath.startsWith('About/') && !previousPath.startsWith('OurStory/') && !previousPath.startsWith('Welcome/'))
            ? `client/src/assets/gallery/${previousPath}`
            : `client/src/assets/${previousPath.includes('/') ? previousPath : 'backgrounds/' + previousPath}`;
          await deleteGitHubFile(config, deletePath, `Admin: Auto-cleanup of replaced asset ${previousPath}`);
        }

        // Compose repository file path and a public raw URL so the site can fetch images without a local build
        const repoFilePath = targetDir === "backgrounds" ? `client/src/assets/backgrounds/${name}` : `client/src/assets/gallery/${targetDir}/${name}`;
        const rawUrl = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/main/${repoFilePath}`;

        // Replace any occurrences of the base64 placeholder in newData with the RELATIVE path
        // Storing relative paths (e.g., backgrounds/hero.webp) ensures resolveAsset works correctly
        const replaceBase64 = (obj: any): any => {
          if (!obj) return obj;
          if (typeof obj === 'string') return obj === base64 ? newPath : obj;
          if (Array.isArray(obj)) return obj.map((v) => replaceBase64(v));
          if (typeof obj === 'object') {
            Object.keys(obj).forEach((k) => {
              obj[k] = replaceBase64(obj[k]);
            });
            return obj;
          }
          return obj;
        };

        replaceBase64(newData);
      }

      // Clear staged uploads after processing
      setStagedUploads([]);
    }

    // 2) Persist the content file to the repository
    const result = await updateGitHubFile(config, "client/src/data/siteContent.json", JSON.stringify(newData, null, 2), "Admin: Comprehensive content update");

    // 3) Update local state and UI
    if (result.success) {
      setFormData(newData);
      // Verify that referenced assets exist in repository (catch mapping mismatches)
      try {
        const usage = getAssetUsageCounts(newData);
        const used = Array.from(usage.keys());
        const missing: string[] = [];
        const OctokitClz = (await import("octokit")).Octokit;
        const octokit = new OctokitClz({ auth: config.token });

        await Promise.all(used.map(async (assetPath: any) => {
          if (!assetPath || typeof assetPath !== 'string' || assetPath.startsWith('data:') || assetPath.startsWith('http')) return;
          const repoPath = assetPath.includes('/')
            ? `client/src/assets/${assetPath.startsWith('About/') || assetPath.startsWith('OurStory/') || assetPath.startsWith('Welcome/') || assetPath.startsWith('Brochure/') ? assetPath : 'gallery/' + assetPath}`
            : `client/src/assets/backgrounds/${assetPath}`;
          try {
            await octokit.rest.repos.getContent({ owner: config.owner, repo: config.repo, path: repoPath });
          } catch (err: any) {
            missing.push(assetPath);
          }
        }));

        if (missing.length) {
          setStatus({ type: "error", message: `Sync completed but ${missing.length} mapped assets are missing: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ', ...' : ''}` });
        } else {
          setStatus({ type: "success", message: "Repository synchronization successful." });
        }
      } catch (err: any) {
        setStatus({ type: "success", message: "Repository synchronized. (Asset verification skipped due to check error)" });
      }

      // Refresh asset list and site content to reflect repository changes immediately
      await fetchAllAssets();
      setStatus({ type: "success", message: "Repository synchronization successful and UI updated." });

      // Post-flight count verification report
      const postFlightCounts: Record<string, number> = {};
      let countReport = "Directory Snapshot: ";

      // Use a standard for loop on Array.from(affectedDirs) for reliable async/await
      const affectedDirsArray = Array.from(affectedDirs);
      for (let i = 0; i < affectedDirsArray.length; i++) {
        const dir = affectedDirsArray[i];
        const path = (dir === "backgrounds" || dir === "Welcome" || dir === "About" || dir === "OurStory" || dir === "Brochure")
          ? `client/src/assets/${dir}`
          : `client/src/assets/gallery/${dir}`;
        const res = await listGitHubFiles(config, path);
        const count = res.success ? (res.files?.length || 0) : 0;
        postFlightCounts[dir] = count;
        countReport += `${dir}: ${preFlightCounts[dir]} -> ${count} files. `;
      }
      setStatus(prev => ({
        type: "success",
        message: `${prev?.message || "Sync successful."} ${countReport}`
      }));
    } else {
      setStatus({ type: "error", message: `Sync failed: ${result.message}` });
    }

    setIsSaving(false);
  };

  const handleImageUpload = async (targetDir: string) => {
    if (!selectedUploadFile) return;

    // Get the previous path - check if it's a data URL (base64) or actual path
    const previousPath = activePickerField?.path;
    const isPreviousPathValid = previousPath && !previousPath.startsWith('data:') && !previousPath.startsWith('http') && previousPath.trim() !== '';

    // Check if the image is from GeneralGallery - these should NEVER be deleted
    const isGeneralGallery = isPreviousPathValid && previousPath.includes('GeneralGallery/');

    // Exact cleanup logic: delete only if it's the LAST usage in the entire site
    const currentCount = isPreviousPathValid ? (usageCounts.get(previousPath) || 0) : 0;
    const willDeleteOld = !!(isPreviousPathValid && !isGeneralGallery && currentCount === 1);

    // Stage the upload for later (Push Live)
    setStagedUploads(prev => [...prev, {
      targetDir,
      name: selectedUploadFile.name,
      base64: selectedUploadFile.base64,
      previousPath: isPreviousPathValid ? previousPath : undefined,
      deleteOld: willDeleteOld
    }]);

    // Show immediate preview in the admin UI by assigning the base64 to the active field
    if (activePickerField) {
      activePickerField.setter(selectedUploadFile.base64);
      setIsPickerOpen(false);
      setActivePickerField(null);
    }

    setSelectedUploadFile(null);

    // Enhanced status message
    let statusMsg = 'Asset staged for deployment.';
    if (isGeneralGallery) {
      statusMsg += ' General Gallery images are preserved (no deletion).';
    } else if (willDeleteOld) {
      statusMsg += ` Previous asset "${previousPath}" will be removed on Push Live.`;
    } else if (isPreviousPathValid) {
      statusMsg += ' Previous asset will NOT be removed (in use elsewhere).';
    }

    setStatus({ type: "success", message: statusMsg });
  };

  const handleDeleteAsset = async (dir: string, fileName: string) => {
    // General Gallery images previously had deletion locked. 
    // Now allowing with confirmation for manual archival control.
    const isGeneralGallery = dir === "GeneralGallery";

    if (!confirm(`Permanently delete ${fileName} from ${dir}?${isGeneralGallery ? " This action is irreversible." : ""}`)) return;
    setIsSaving(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
    const path = (dir === "backgrounds" || dir === "Welcome" || dir === "About" || dir === "OurStory" || dir === "Brochure")
      ? `client/src/assets/${dir}/${fileName}`
      : `client/src/assets/gallery/${dir}/${fileName}`;
    const result = await deleteGitHubFile(config, path, `Admin: Resource removal ${fileName}`);
    setIsSaving(false);
    if (result.success) {
      setStatus({ type: "success", message: "Asset purged from repository." });
      fetchAllAssets();
    } else {
      setStatus({ type: "error", message: `Purge failed: ${result.message}` });
    }
  };

  const processImage = (file: File): Promise<{ name: string; base64: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 2000;
          const MAX_HEIGHT = 2000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const webpName = normalizeFileName(file.name, "webp");
          const base64 = canvas.toDataURL("image/webp", 0.85);
          resolve({ name: webpName, base64: base64 });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (!e) {
      setSelectedUploadFile(null);
      setIsOptimizing(false);
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      if (uploadTargetDirForSection === "Brochure") {
        if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
          setStatus({ type: "error", message: "Only PDF files are allowed for the brochure." });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedUploadFile({ name: normalizeFileName(file.name, "pdf"), base64: e.target?.result as string });
        };
        reader.readAsDataURL(file);
        return;
      }

      setIsOptimizing(true);
      try {
        const optimized = await processImage(file);
        setSelectedUploadFile(optimized);
      } catch (err) {
        console.error("Optimization failed:", err);
        setStatus({ type: "error", message: "Image optimization failed. Please try another file." });
        setSelectedUploadFile(null);
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  // --- UI Components ---

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // use the previously defined usageCounts and otherUsage for site-wide consistency
  const usedAssets = otherUsage;


  // Fix duplicate service images on mount and after save
  const fixDuplicateServiceImages = () => {
    let fixedCount = 0;
    const newServices = formData.services.map(service => {
      const usedImages = new Set<string>();
      const newDetails = (service.details || []).map(detail => {
        // If detail has no image or null, keep it as empty string
        if (!detail.image || detail.image.trim() === '') {
          return { ...detail, image: '' };
        }

        // If this image is already used in this service, find a replacement
        if (usedImages.has(detail.image)) {
          fixedCount++;
          console.warn(`Duplicate image detected in "${service.title}": ${detail.image}`);

          // Try to find an unused image from the service folder
          const folderName = service.title.replace(/\s+/g, '');
          const availableImages = assetFiles[folderName] || [];

          // Build full paths and filter out already used ones
          const unusedImage = availableImages
            .map(f => `${folderName}/${f}`)
            .find(path => !usedImages.has(path) && path !== service.image);

          if (unusedImage) {
            usedImages.add(unusedImage);
            return { ...detail, image: unusedImage };
          } else {
            // No available images, set to empty string
            return { ...detail, image: '' };
          }
        }

        usedImages.add(detail.image);
        return detail;
      });

      return { ...service, details: newDetails };
    });

    if (fixedCount > 0) {
      setFormData(prev => ({ ...prev, services: newServices }));
      setStatus({
        type: "success",
        message: `Fixed ${fixedCount} duplicate image mapping(s). Review and Push Live to save.`
      });
    }

    return fixedCount;
  };

  // Auto-fix duplicate images after assets are loaded
  useEffect(() => {
    if (Object.keys(assetFiles).length > 0 && formData.services.length > 0) {
      // Small delay to ensure formData is stable
      const timer = setTimeout(() => {
        fixDuplicateServiceImages();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [assetFiles]);

  const [uploadTargetDirForSection, setUploadTargetDirForSection] = useState("");


  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 selection:bg-primary/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-[80px]" />

          <div className="relative z-10">
            <div className="flex flex-col items-center mb-12">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.1)]">
                <Lock size={32} />
              </div>
              <h1 className="text-3xl font-serif italic text-white text-center">Administrative Suite</h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black mt-3">Identity Verification Required</p>
            </div>

            <AnimatePresence mode="wait">
              {auth.step === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        type={showToken ? "text" : "password"}
                        placeholder="GitHub Access Token"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-16 pl-6 pr-14 text-white outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
                        value={auth.githubToken}
                        onChange={e => setAuth(p => ({ ...p, githubToken: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors p-2"
                      >
                        {showToken ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Owner"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-14 px-5 text-white outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
                        value={auth.githubOwner}
                        onChange={e => setAuth(p => ({ ...p, githubOwner: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Repo"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-14 px-5 text-white outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
                        value={auth.githubRepo}
                        onChange={e => setAuth(p => ({ ...p, githubRepo: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button
                    onClick={sendOtp}
                    className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Authorize Access
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-24 text-center text-5xl font-serif italic text-primary outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all tracking-[0.2em]"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                    <p className="text-center text-[9px] uppercase tracking-widest text-white/20 mt-4 font-black italic">Check console for the activation key</p>
                  </div>
                  <button
                    onClick={verifyOtp}
                    className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Confirm Identity
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-4 rounded-xl text-[9px] uppercase font-black text-center tracking-widest border ${status.type === 'success' ? 'text-green-400 bg-green-500/5 border-green-500/10' : 'text-red-400 bg-red-500/5 border-red-500/10'}`}
              >
                {status.message}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const logout = () => { localStorage.clear(); window.location.reload(); };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/20">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSave}
        isSaving={isSaving}
        logout={logout}
        auth={auth}
        status={status}
      />

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="lg:ml-[350px] min-h-screen pb-32 lg:pb-24 bg-[#050505] relative z-0">
        <div className="max-w-6xl mx-auto px-6 lg:px-20 pt-10 pb-32 lg:pt-32 lg:pb-32">

          {/* Top Bar for Mobile/Tablet */}
          <header className="lg:hidden flex items-center justify-between mb-16 pt-2">
            <div className="flex items-center gap-4">
              <img src={logoImg} className="w-10 h-10 rounded-xl border border-white/10" alt="Logo" />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  <h1 className="text-2xl font-serif italic text-white tracking-tight">{tabMetadata[activeTab].label}</h1>
                </div>
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-black pl-4">Interface Node Alpha</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className={`p-4 rounded-2xl border transition-all duration-500 ${isSaving ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-primary text-black border-primary shadow-[0_10px_30px_rgba(212,175,55,0.2)]'}`}
            >
              {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            </motion.button>
          </header>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-12 p-6 rounded-3xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-between gap-4 ${status.type === 'success' ? 'bg-green-500/5 border-green-500/10 text-green-400' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}
            >
              <div className="flex items-center gap-4">
                {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {status.message}
              </div>
              <button onClick={() => setStatus(null)} className="opacity-40 hover:opacity-100"><X size={14} /></button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-12 lg:space-y-20"
            >
              {/* Section Header */}
              <div className="hidden lg:flex items-end justify-between border-b border-white/5 pb-12">
                <div>
                  <h2 className="text-5xl font-serif italic text-white tracking-tighter">
                    {tabMetadata[activeTab].label} <span className="text-primary/40 font-sans not-italic text-lg ml-6 uppercase tracking-[0.4em]">Section</span>
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.6em] text-white/20 font-black mt-6">Protocol Layer: {activeTab}</p>
                </div>
              </div>

              {/* Dynamic Content Rendering */}
              <div className="space-y-16 lg:space-y-24">
                {/* Section Customization Controls */}
                {/* Integrated Background Select */}
                <VisualImageField
                  label="Section Background Canvas"
                  value={formData.backgrounds[activeTab === 'story' ? 'story' : (activeTab as keyof typeof formData.backgrounds)]}
                  onBrowse={() => {
                    const pageId = activeTab === 'story' ? 'story' : activeTab;
                    setActivePickerField({
                      label: "Section Background",
                      path: (formData.backgrounds as any)[pageId],
                      setter: (val) => setFormData(p => ({ ...p, backgrounds: { ...p.backgrounds, [pageId]: val } }))
                    });
                    setIsPickerOpen(true);
                  }}
                />

                <div className="space-y-16">
                  {activeTab === 'hero' && (
                    <div className="space-y-10">
                      <Field label="Section Eyebrow" value={formData.hero.eyebrow} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, eyebrow: v } }))} />
                      <div className="grid md:grid-cols-2 gap-8">
                        <Field label="Hero First Title" value={formData.hero.title.first} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, title: { ...p.hero.title, first: v } } }))} />
                        <Field label="Hero Accent Title" value={formData.hero.title.second} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, title: { ...p.hero.title, second: v } } }))} />
                      </div>
                      <Field label="Main Hero Description" value={formData.hero.description} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, description: v } }))} area italic />
                    </div>
                  )}

                  {activeTab === 'about' && (
                    <div className="space-y-12">
                      <Field label="Section Eyebrow" value={formData.about.eyebrow} onChange={(v: string) => setFormData(p => ({ ...p, about: { ...p.about, eyebrow: v } }))} />
                      <div className="grid md:grid-cols-2 gap-8">
                        <Field label="Heading Main" value={formData.about.title.main} onChange={(v: string) => setFormData(p => ({ ...p, about: { ...p.about, title: { ...p.about.title, main: v } } }))} />
                        <Field label="Heading Accent" value={formData.about.title.accent} onChange={(v: string) => setFormData(p => ({ ...p, about: { ...p.about, title: { ...p.about.title, accent: v } } }))} />
                      </div>
                      <VisualImageField
                        label="Main Content Asset"
                        value={formData.about.image}
                        onBrowse={() => {
                          setActivePickerField({
                            label: "About Asset",
                            path: formData.about.image,
                            setter: (v) => setFormData(p => ({ ...p, about: { ...p.about, image: v } })),
                            preferredDir: "About"
                          });
                          setIsPickerOpen(true);
                        }}
                      />
                      <div className="space-y-6">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black px-2">Narrative Sections</p>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'about-desc')}>
                          <SortableContext items={formData.about.description} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                              {formData.about.description.map((p, i) => (
                                <SortableListItem
                                  key={p}
                                  id={p}
                                  onRemove={() => setFormData(prev => ({ ...prev, about: { ...prev.about, description: prev.about.description.filter((_, idx) => idx !== i) } }))}
                                >
                                  <textarea
                                    className="w-full bg-transparent border-none text-white/80 outline-none min-h-[80px] resize-none text-sm leading-relaxed"
                                    value={p}
                                    onChange={(e) => {
                                      const d = [...formData.about.description]; d[i] = e.target.value;
                                      setFormData(prev => ({ ...prev, about: { ...prev.about, description: d } }));
                                    }}
                                  />
                                </SortableListItem>
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                        <button onClick={() => setFormData(p => ({ ...p, about: { ...p.about, description: [...p.about.description, "New Narrative Block " + Date.now()] } }))} className="w-full py-8 border border-dashed border-white/10 rounded-[2rem] text-[10px] uppercase font-black text-white/20 hover:text-primary/60 hover:border-primary/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2">
                          <Plus size={16} /> Add Narrative Segment
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'story' && (
                    <div className="space-y-12">
                      <Field label="Section Eyebrow" value={formData.distinction.eyebrow} onChange={(v: string) => setFormData(p => ({ ...p, distinction: { ...p.distinction, eyebrow: v } }))} />
                      <div className="grid md:grid-cols-2 gap-8">
                        <Field label="Intro Overview" value={formData.distinction.shortDesc} onChange={(v: string) => setFormData(p => ({ ...p, distinction: { ...p.distinction, shortDesc: v } }))} area italic />
                        <VisualImageField
                          label="Main Narrative Asset"
                          value={formData.distinction.image}
                          onBrowse={() => {
                            setActivePickerField({
                              label: "Story Asset",
                              path: formData.distinction.image,
                              setter: (v) => setFormData(p => ({ ...p, distinction: { ...p.distinction, image: v } })),
                              preferredDir: "OurStory"
                            });
                            setIsPickerOpen(true);
                          }}
                        />
                      </div>
                      <div className="space-y-6">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black px-2">Dialog Paragraphs</p>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'distinction-dialog')}>
                          <SortableContext items={formData.distinction.dialog.paragraphs} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                              {formData.distinction.dialog.paragraphs.map((p, i) => (
                                <SortableListItem
                                  key={p}
                                  id={p}
                                  onRemove={() => setFormData(prev => ({ ...prev, distinction: { ...prev.distinction, dialog: { ...prev.distinction.dialog, paragraphs: prev.distinction.dialog.paragraphs.filter((_, idx) => idx !== i) } } }))}
                                >
                                  <textarea
                                    className="w-full bg-transparent border-none text-white/80 outline-none min-h-[60px] resize-none text-sm leading-relaxed italic font-serif"
                                    value={p}
                                    onChange={(e) => {
                                      const d = [...formData.distinction.dialog.paragraphs]; d[i] = e.target.value;
                                      setFormData(prev => ({ ...prev, distinction: { ...prev.distinction, dialog: { ...prev.distinction.dialog, paragraphs: d } } }));
                                    }}
                                  />
                                </SortableListItem>
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                        <button onClick={() => setFormData(p => ({ ...p, distinction: { ...p.distinction, dialog: { ...p.distinction.dialog, paragraphs: [...p.distinction.dialog.paragraphs, "New Dialog Segment " + Date.now()] } } }))} className="w-full py-8 border border-dashed border-white/10 rounded-[2rem] text-[10px] uppercase font-black text-white/20 hover:text-primary/60 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2">
                          <Plus size={16} /> Add Dialog Segment
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'values' && (
                    <div className="space-y-12">
                      <Field label="Section Eyebrow" value={formData.values.eyebrow} onChange={(v: string) => setFormData(p => ({ ...p, values: { ...p.values, eyebrow: v } }))} />
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black px-2">Core Principles</p>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'values')}>
                        <SortableContext items={formData.values.items.map(v => v.title)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-4">
                            {formData.values.items.map((v, i) => (
                              <SortableListItem
                                key={v.title}
                                id={v.title}
                                onRemove={() => setFormData(p => ({ ...p, values: { ...p.values, items: p.values.items.filter((_, idx) => idx !== i) } }))}
                              >
                                <div className="grid md:grid-cols-3 gap-8 p-4">
                                  <div className="md:col-span-1">
                                    <Field label="Title" value={v.title} onChange={(val: string) => {
                                      const ni = [...formData.values.items]; ni[i].title = val; setFormData(p => ({ ...p, values: { ...p.values, items: ni } }));
                                    }} />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Field label="Essence" value={v.desc} onChange={(val: string) => {
                                      const ni = [...formData.values.items]; ni[i].desc = val; setFormData(p => ({ ...p, values: { ...p.values, items: ni } }));
                                    }} area />
                                  </div>
                                </div>
                              </SortableListItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      <button onClick={() => setFormData(p => ({ ...p, values: { ...p.values, items: [...p.values.items, { title: "New Principle " + Date.now(), desc: "Describe the core essence..." }] } }))} className="w-full py-12 border border-dashed border-white/10 rounded-[3rem] text-[10px] uppercase font-black text-white/20 hover:text-primary/60 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-4">
                        <PlusCircle size={32} /> Add Core Principle
                      </button>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div className="space-y-20">
                      <Field label="Section Eyebrow" value={formData.servicesPage.eyebrow} onChange={(v: string) => setFormData(p => ({ ...p, servicesPage: { ...p.servicesPage, eyebrow: v } }))} />
                      <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Offerings Repository</p>
                        <button onClick={() => setFormData(p => ({ ...p, services: [{ id: `svc-${Date.now()}`, title: "New Offering", desc: "Brief intro", fullDescription: "Detailed narrative", image: "", details: [] }, ...p.services] }))} className="px-8 py-4 bg-primary text-black rounded-2xl text-[10px] uppercase font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition-all outline-none"><Plus size={16} /> New Offering</button>
                      </div>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'services')}>
                        <SortableContext items={formData.services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-24">
                            {formData.services.map((s, si) => (
                              <SortableListItem
                                key={s.id}
                                id={s.id}
                                onRemove={() => setFormData(p => ({ ...p, services: p.services.filter((_, idx) => idx !== si) }))}
                              >
                                <div className="space-y-10 p-4">
                                  <div className="grid md:grid-cols-2 gap-8">
                                    <Field label="Service Header" value={s.title} onChange={(v: string) => {
                                      const news = [...formData.services]; news[si].title = v; setFormData(p => ({ ...p, services: news }));
                                    }} />
                                    <VisualImageField
                                      label="Featured Asset"
                                      value={s.image}
                                      onBrowse={() => {
                                        setActivePickerField({
                                          label: "Service Asset",
                                          path: s.image,
                                          setter: (v) => { const news = [...formData.services]; news[si].image = v; setFormData(p => ({ ...p, services: news })); },
                                          preferredDir: serviceFolderMap[s.title] || "GeneralGallery"
                                        });
                                        setIsPickerOpen(true);
                                      }}
                                    />
                                  </div>
                                  <Field label="Catalog Snippet" value={s.desc} onChange={(v: string) => {
                                    const news = [...formData.services]; news[si].desc = v; setFormData(p => ({ ...p, services: news }));
                                  }} />
                                  <Field label="Vertical Journey Narrative" value={s.fullDescription || ""} onChange={(v: string) => {
                                    const news = [...formData.services]; news[si].fullDescription = v; setFormData(p => ({ ...p, services: news }));
                                  }} area italic />

                                  <div className="pt-12 border-t border-white/5 space-y-8">
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black px-2">Experience Sequence</p>

                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'service-details', s.id)}>
                                      <SortableContext items={(s.details || []).map((_, idx) => `det-${s.id}-${idx}`)} strategy={verticalListSortingStrategy}>
                                        <div className="grid md:grid-cols-2 gap-6">
                                          {(s.details || []).map((d, di) => (
                                            <SortableListItem
                                              key={`det-${s.id}-${di}`}
                                              id={`det-${s.id}-${di}`}
                                              onRemove={() => {
                                                const news = [...formData.services]; news[si].details = news[si].details.filter((_, idx) => idx !== di);
                                                setFormData(p => ({ ...p, services: news }));
                                              }}
                                            >
                                              <div className="space-y-6 p-4">
                                                <Field label="Title" value={d.title} onChange={(v: string) => {
                                                  const news = [...formData.services]; news[si].details[di].title = v; setFormData(p => ({ ...p, services: news }));
                                                }} />
                                                <VisualImageField
                                                  label="Phase Asset"
                                                  value={d.image}
                                                  onBrowse={() => {
                                                    setActivePickerField({
                                                      label: "Detail Asset",
                                                      path: d.image,
                                                      setter: (v) => { const news = [...formData.services]; news[si].details[di].image = v; setFormData(p => ({ ...p, services: news })); },
                                                      preferredDir: serviceFolderMap[s.title] || "GeneralGallery"
                                                    });
                                                    setIsPickerOpen(true);
                                                  }}
                                                />
                                                <textarea className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-[11px] h-24 text-white/60 resize-none focus:border-primary/40 outline-none transition-all" value={d.description} onChange={(e) => {
                                                  const news = [...formData.services]; news[si].details[di].description = e.target.value; setFormData(p => ({ ...p, services: news }));
                                                }} />
                                              </div>
                                            </SortableListItem>
                                          ))}
                                          <button onClick={() => {
                                            const news = [...formData.services]; news[si].details = [...(news[si].details || []), { title: "New Feature", buttonText: "Explore", image: "", description: "" }];
                                            setFormData(p => ({ ...p, services: news }));
                                          }} className="border border-dashed border-white/10 rounded-[2.5rem] min-h-[200px] text-white/10 hover:text-primary/60 hover:bg-white/[0.02] flex flex-col items-center justify-center gap-3 transition-all outline-none"><Plus size={24} /> New Sequence Phase</button>
                                        </div>
                                      </SortableContext>
                                    </DndContext>
                                  </div>
                                </div>
                              </SortableListItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}

                  {activeTab === 'gallery' && (
                    <div className="space-y-16">
                      <Field label="Section Eyebrow" value={formData.galleryPage.eyebrow || ""} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, eyebrow: v } }))} />
                      <div className="grid md:grid-cols-2 gap-8">
                        <Field label="Section Header" value={formData.galleryPage.title.main} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, title: { ...p.galleryPage.title, main: v } } }))} />
                        <Field label="Header Accent" value={formData.galleryPage.title.accent} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, title: { ...p.galleryPage.title, accent: v } } }))} />
                      </div>
                      <Field label="Archive Description" value={formData.galleryPage.description} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, description: v } }))} area />

                      <div className="pt-16 border-t border-white/5 space-y-10">
                        <div className="flex items-center justify-between px-2">
                          <div className="space-y-1">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">Archive Collection</h4>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest">Mirroring client site layout</p>
                          </div>
                          <div className="flex items-center gap-4 text-white/40">
                            <Layers size={14} />
                            <span className="text-[9px] uppercase font-black tracking-widest">{(formData.galleryPage.galleryItems || []).length} Masterpieces</span>
                          </div>
                        </div>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'gallery')}>
                          <SortableContext items={adminGalleryList} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                              {adminGalleryList.map((path: string, idx: number) => (
                                <SortableGridItem
                                  key={path}
                                  id={path}
                                  path={path}
                                  idx={idx}
                                  otherUsage={otherUsage}
                                  auth={auth}
                                  onRemove={() => {
                                    const items = adminGalleryList.filter((p) => p !== path);
                                    setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, galleryItems: items } }));
                                  }}
                                  onReplace={() => {
                                    setActivePickerField({
                                      label: `Replace Item ${idx + 1}`,
                                      path: path,
                                      setter: (val) => setFormData(p => {
                                        const items = [...p.galleryPage.galleryItems];
                                        items[idx] = val;
                                        return { ...p, galleryPage: { ...p.galleryPage, galleryItems: items } };
                                      }),
                                      preferredDir: path.includes('/') ? path.split('/')[0] : "BespokeWeddings&Engagements"
                                    });
                                    setIsPickerOpen(true);
                                  }}
                                />
                              ))}
                              <button
                                onClick={() => {
                                  setActivePickerField({
                                    label: "Add Gallery Item",
                                    path: "",
                                    setter: (val) => setFormData(p => ({
                                      ...p,
                                      galleryPage: {
                                        ...p.galleryPage,
                                        galleryItems: [...(p.galleryPage.galleryItems || []), val]
                                      }
                                    })),
                                    preferredDir: "BespokeWeddings&Engagements"
                                  });
                                  setIsPickerOpen(true);
                                }}
                                className="aspect-[4/5] md:aspect-[3/4] border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-white/10 hover:text-primary hover:border-primary/40 transition-all bg-white/[0.01] hover:bg-white/[0.03] outline-none"
                              >
                                <PlusCircle size={32} />
                                <span className="text-[9px] uppercase font-black tracking-widest">Add Piece</span>
                              </button>
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-16">
                      <Field label="Section Eyebrow" value={formData.reviewsPage.eyebrow} onChange={(v: string) => setFormData(p => ({ ...p, reviewsPage: { ...p.reviewsPage, eyebrow: v } }))} />
                      <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Testimonial Ledger</p>
                        <button onClick={() => setFormData(p => ({ ...p, reviewItems: [{ id: Date.now(), name: "John Doe", rating: 5, comment: "Exceptional mastery." }, ...p.reviewItems] }))} className="px-8 py-4 bg-primary text-black rounded-2xl text-[10px] uppercase font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition-all outline-none"><Plus size={16} /> Add reflection</button>
                      </div>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'reviews')}>
                        <SortableContext items={formData.reviewItems.map(r => r.id)} strategy={verticalListSortingStrategy}>
                          <div className="grid md:grid-cols-1 gap-10">
                            {formData.reviewItems.map((r, i) => (
                              <SortableListItem
                                key={r.id}
                                id={r.id}
                                onRemove={() => setFormData(p => ({ ...p, reviewItems: p.reviewItems.filter((_, idx) => idx !== i) }))}
                              >
                                <div className="space-y-6 p-4">
                                  <div className="flex justify-between items-center gap-8">
                                    <div className="flex-1">
                                      <Field label="Client Distinction" value={r.name} onChange={(v: string) => {
                                        const nr = [...formData.reviewItems]; nr[i].name = v; setFormData(p => ({ ...p, reviewItems: nr }));
                                      }} />
                                    </div>
                                    <div className="space-y-3">
                                      <label className="text-[10px] uppercase tracking-widest text-primary/40 font-black px-1">Rating</label>
                                      <select className="w-40 bg-white/[0.03] border border-white/10 rounded-2xl h-16 px-6 text-[11px] text-primary outline-none focus:border-primary/40 transition-all" value={r.rating} onChange={(e) => {
                                        const nr = [...formData.reviewItems]; nr[i].rating = parseInt(e.target.value); setFormData(p => ({ ...p, reviewItems: nr }));
                                      }}>
                                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n} className="bg-[#050505]">{n} Diamonds</option>)}
                                      </select>
                                    </div>
                                  </div>
                                  <Field label="Reflection Content" value={r.comment} onChange={(v: string) => {
                                    const nr = [...formData.reviewItems]; nr[i].comment = v; setFormData(p => ({ ...p, reviewItems: nr }));
                                  }} area italic />
                                </div>
                              </SortableListItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="space-y-16">
                      <Field label="Section Eyebrow" value={formData.contactPage.eyebrow || ""} onChange={(v: string) => setFormData(p => ({ ...p, contactPage: { ...p.contactPage, eyebrow: v } }))} />
                      <div className="grid md:grid-cols-2 gap-12">
                        <Field label="Primary Header" value={formData.contactPage.title.main} onChange={(v: string) => setFormData(p => ({ ...p, contactPage: { ...p.contactPage, title: { ...p.contactPage.title, main: v } } }))} />
                        <Field label="Communication Prompt" value={formData.contactPage.description} onChange={(v: string) => setFormData(p => ({ ...p, contactPage: { ...p.contactPage, description: v } }))} area />
                      </div>
                      <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[3rem] space-y-10 shadow-inner">
                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-black">Meta Connectors</h4>
                        <Field label="Studio Location" value={formData.contact.address} onChange={(v: string) => setFormData(p => ({ ...p, contact: { ...p.contact, address: v } }))} area />
                        <Field label="Operational Hours" value={formData.contact.hours} onChange={(v: string) => setFormData(p => ({ ...p, contact: { ...p.contact, hours: v } }))} />
                        <Field label="Google Maps URL" value={formData.contact.mapsLink || ""} onChange={(v: string) => setFormData(p => ({ ...p, contact: { ...p.contact, mapsLink: v } }))} />
                        <VisualImageField
                          label="Event Brochure (PDF)"
                          value={formData.contact.brochureLink || ""}
                          onBrowse={() => {
                            setActivePickerField({
                              label: "Select Brochure PDF",
                              path: formData.contact.brochureLink || "",
                              setter: (v) => setFormData(p => ({ ...p, contact: { ...p.contact, brochureLink: v } })),
                              preferredDir: "Brochure"
                            });
                            setIsPickerOpen(true);
                          }}
                        />
                        {formData.contact.brochureLink && (
                          <div className="flex justify-end px-4 -mt-6">
                            <a href={resolveAsset(formData.contact.brochureLink)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] uppercase font-black text-primary hover:text-white transition-colors">
                              <Eye size={12} /> Review Brochure
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'socials' && (
                    <div className="grid md:grid-cols-2 gap-10">
                      {Object.keys(formData.socials).map(s => (
                        <Field key={s} label={`${s} Endpoint`} value={(formData.socials as any)[s]} onChange={(v: string) => setFormData(p => ({ ...p, socials: { ...p.socials, [s]: v } }))} />
                      ))}
                    </div>
                  )}

                  {activeTab === 'welcome' && (
                    <div className="space-y-16">
                      <div className="grid md:grid-cols-2 gap-8">
                        <Field label="Popup Title" value={formData.welcomePopup.title.main} onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, title: { ...p.welcomePopup.title, main: v } } }))} />
                        <Field label="Title Accent" value={formData.welcomePopup.title.accent} onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, title: { ...p.welcomePopup.title, accent: v } } }))} />
                      </div>
                      <Field label="Popup Description" value={formData.welcomePopup.description} onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, description: v } }))} area italic />
                      <VisualImageField
                        label="Featured Invitation Asset"
                        value={formData.welcomePopup.image}
                        onBrowse={() => {
                          setActivePickerField({
                            label: "Popup Asset",
                            path: formData.welcomePopup.image,
                            setter: (v) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, image: v } })),
                            preferredDir: "Welcome"
                          });
                          setIsPickerOpen(true);
                        }}
                      />
                    </div>
                  )}
                </div>
                <hr className="border-white/5 my-16" />
                <div className="space-y-12">
                  <div className="flex items-center gap-4">
                    <Search size={16} className="text-primary/40" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Global Asset Repository Browser</h4>
                  </div>
                  <RepositoryBrowser
                    dir={bgDirMap[activeTab] || "backgrounds"}
                    assetFiles={assetFiles}
                    fetchAllAssets={fetchAllAssets}
                    isFetchingFiles={isFetchingFiles}
                    isOptimizing={isOptimizing}
                    onFileChange={onFileChange}
                    selectedUploadFile={selectedUploadFile}
                    uploadTargetDirForSection={uploadTargetDirForSection}
                    setUploadTargetDirForSection={setUploadTargetDirForSection}
                    handleImageUpload={handleImageUpload}
                    usedAssets={otherUsage}
                    auth={auth}
                    stagedUploads={stagedUploads}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Loading / Status Overlay */}
      <AnimatePresence>
        {isSaving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center gap-8">
            <div className="w-24 h-24 border-t-2 border-primary rounded-full animate-spin"></div>
            <div className="text-center space-y-2">
              <p className="text-[10px] uppercase font-black tracking-[0.8em] text-primary animate-pulse">Syncing Repository</p>
              <p className="text-white/20 text-[9px] uppercase tracking-widest">Committing shifts to live infrastructure</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Global Media Picker Interface */}
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] p-6 md:p-12 overflow-y-auto scroll-smooth"
            onAnimationComplete={() => {
              if (activePickerField?.preferredDir) {
                const el = document.getElementById(`dir-${activePickerField.preferredDir}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <div className="container mx-auto max-w-7xl h-full flex flex-col pb-32">
              <header className="flex items-center justify-between mb-16 border-b border-white/10 pb-10">
                <div className="flex items-center gap-8">
                  <div className="p-5 bg-primary/10 border border-primary/20 rounded-[2rem] text-primary">
                    <ImageIcon size={32} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-4xl font-serif italic text-white tracking-tight">Media Picker <span className="text-white/10 font-sans not-italic text-lg mx-6">/</span> <span className="text-primary/60 font-sans not-italic text-sm uppercase tracking-[0.4em]">{activePickerField?.label}</span></h2>
                    <p className="text-[10px] uppercase tracking-[0.6em] text-white/20 font-black">Selecting asset for deployment</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsPickerOpen(false); setActivePickerField(null); }}
                  className="group p-6 bg-white/[0.03] border border-white/10 rounded-full hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-500"
                >
                  <X size={32} className="text-white/20 group-hover:text-red-500 transition-colors" />
                </button>
              </header>

              <div className="space-y-24 flex-grow custom-scrollbar pr-8">
                {assetDirectories.map(dir => (
                  <div key={dir} id={`dir-${dir}`} className={`p-12 bg-white/[0.01] border rounded-[4rem] shadow-inner transition-all duration-700 ${activePickerField?.preferredDir === dir ? 'border-primary/40 bg-primary/5' : 'border-white/5'}`}>
                    <RepositoryBrowser
                      dir={dir}
                      activeSelection={activePickerField?.path}
                      assetFiles={assetFiles}
                      fetchAllAssets={fetchAllAssets}
                      isFetchingFiles={isFetchingFiles}
                      isOptimizing={isOptimizing}
                      onFileChange={onFileChange}
                      selectedUploadFile={selectedUploadFile}
                      uploadTargetDirForSection={uploadTargetDirForSection}
                      setUploadTargetDirForSection={setUploadTargetDirForSection}
                      handleImageUpload={handleImageUpload}
                      handleDeleteAsset={handleDeleteAsset}
                      usedAssets={otherUsage}
                      auth={auth}
                      stagedUploads={stagedUploads}
                      onSelect={(fullPath: string) => {
                        if (activePickerField) {
                          activePickerField.setter(fullPath);
                          setIsPickerOpen(false);
                          setActivePickerField(null);
                          setStatus({ type: "success", message: "Asset assigned successfully." });
                        }
                      }}
                    />
                  </div>
                ))}
              </div>

              <footer className="mt-20 border-t border-white/10 pt-10 flex cursor-pointer items-center justify-center opacity-20 hover:opacity-100 transition-opacity" onClick={() => { setIsPickerOpen(false); setActivePickerField(null); }}>
                <p className="text-[10px] uppercase font-black tracking-[0.8em]">Click to cancel selection</p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
