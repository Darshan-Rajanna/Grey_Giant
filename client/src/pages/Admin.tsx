import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Github, Save, CheckCircle, AlertCircle, Image as ImageIcon, Send, X, Plus, Trash2, ArrowRight, Layers, Star, PlusCircle, Pencil, Search, RefreshCw, UploadCloud, Eye, FileText, ChevronLeft, ChevronRight, GripVertical, Maximize2 } from "lucide-react";
import { siteContent, type SiteContent } from "@/data/siteContent";
import { updateGitHubFile, uploadGitHubImage, listGitHubFiles, deleteGitHubFile, type GitHubConfig } from "@/lib/github-api";
import { resolveAsset } from "@/lib/asset-utils";

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

// --- Types ---
const allFolderImages = Object.keys(import.meta.glob("@assets/gallery/**/*.{png,jpg,jpeg}", { eager: true }));

interface AuthState {
  isLoggedIn: boolean;
  step: "credentials" | "otp";
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
}

type Tab = "hero" | "about" | "story" | "values" | "services" | "gallery" | "reviews" | "contact" | "socials" | "welcome";

// --- Sortable Components ---

const SortableGridItem = ({ id, path, idx, otherUsage, onRemove, onReplace }: any) => {
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
                src={resolveAsset(path)} 
                className="w-full h-full object-cover rounded-sm transition-transform duration-1000 group-hover:scale-110" 
                alt="Gallery Item" 
            />
        </div>
        
        {/* Usage Indicator */}
        {otherUsage.has(path) && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-10 pointer-events-none">
                <Layers size={10} className="text-primary/60"/>
                <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">In Use</span>
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
                        <RefreshCw size={14}/>
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="p-3 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all border border-red-500/30"
                    title="Remove from Curator"
                >
                    <Trash2 size={14}/>
                </button>
            </div>
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                <GripVertical className="text-primary/40 w-4 h-4" />
            </div>
        </div>
        
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-[8px] font-black text-white/40 border border-white/5 pointer-events-none">
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
                        <GripVertical size={20}/>
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
                        <Trash2 size={20}/>
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Externalized UI Components ---

const Field = ({ label, value, onChange, area = false, italic = false, image = false, onBrowse }: any) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between px-1">
        <label className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black flex items-center gap-2">
          {image ? <ImageIcon size={10} className="text-primary/40"/> : <Pencil size={10} className="text-primary/40"/>} {label}
        </label>
        {image && onBrowse && (
            <button 
              onClick={onBrowse}
              className="text-[9px] uppercase font-black tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
            >
                <Search size={10}/> Browse Assets
            </button>
        )}
    </div>
    {area ? (
      <textarea 
        className={`w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-white/80 focus:border-primary/40 focus:bg-white/[0.04] outline-none transition-all min-h-[120px] resize-none leading-relaxed ${italic ? 'italic font-serif' : 'text-sm'}`}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    ) : (
      <div className="relative group">
          <input 
            type="text" 
            className={`w-full bg-white/[0.02] border border-white/5 rounded-2xl h-14 px-6 text-white/80 focus:border-primary/40 focus:bg-white/[0.04] outline-none transition-all ${image ? 'pr-20 font-mono text-xs' : ''}`}
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
          />
          {image && value && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border border-white/10 overflow-hidden bg-black/40">
                  <img src={resolveAsset(value)} className="w-full h-full object-cover" alt="Thumb" onError={(e:any)=>e.target.src="https://placehold.co/100x100/111/fff?text=?"}/>
              </div>
          )}
      </div>
    )}
  </div>
);

const BackgroundControl = ({ pageId, backgrounds, assetFiles, onBrowse, onChange }: any) => (
  <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-6">
      <div className="flex items-center justify-between">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/80">Page Background Engine</h4>
          <div className="flex items-center gap-4">
              <button 
                onClick={onBrowse}
                className="text-[9px] uppercase font-black tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
              >
                  <Search size={12}/> Browse Backgrounds
              </button>
              <ImageIcon size={16} className="text-primary/40"/>
          </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
              <select 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl h-12 px-4 text-xs text-white/60 focus:border-primary/40 transition-all outline-none cursor-pointer"
                  value={backgrounds[pageId]}
                  onChange={(e) => onChange(e.target.value)}
              >
                  <option value="">Select Background Asset</option>
                  {(assetFiles["backgrounds"] || []).map((f: string) => <option key={f} value={f}>{f}</option>)}
              </select>
              <p className="text-[9px] text-white/20 uppercase tracking-widest leading-relaxed">Assign any image from the `backgrounds` repository as the main canvas for this section.</p>
          </div>
          {backgrounds[pageId] && (
              <div className="w-full md:w-32 aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden group relative">
                  <img 
                    src={resolveAsset(backgrounds[pageId])} 
                    className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-80" 
                    alt="Preview"
                    onError={(e: any) => e.target.src = "https://placehold.co/600x400/020202/d4af37?text=Asset+Loading"}
                  />
              </div>
          )}
      </div>
  </div>
);

const RepositoryBrowser = ({ dir, onSelect, activeSelection, assetFiles, fetchAllAssets, isFetchingFiles, onFileChange, selectedUploadFile, uploadTargetDirForSection, setUploadTargetDirForSection, handleImageUpload, handleDeleteAsset, usedAssets }: any) => (
  <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Archive: {dir}</h4>
          <div className="flex gap-6 items-center">
             <button onClick={fetchAllAssets} className="text-primary/40 hover:text-primary transition-colors flex items-center gap-2 text-[10px] uppercase font-black"><RefreshCw size={12} className={isFetchingFiles ? "animate-spin" : ""}/> Sync</button>
             <label htmlFor={`up-${dir}`} className="text-primary/60 hover:text-primary transition-colors cursor-pointer flex items-center gap-2 text-[10px] uppercase font-black">
                  <UploadCloud size={14}/> Upload New
             </label>
             <input type="file" id={`up-${dir}`} className="hidden" accept="image/*" onChange={(e) => {
                 setUploadTargetDirForSection(dir);
                 onFileChange(e);
             }} />
          </div>
      </div>

      {selectedUploadFile && uploadTargetDirForSection === dir && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-primary/10 border border-dashed border-primary/30 rounded-3xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl border border-primary/20 bg-black/40 overflow-hidden">
                      <img src={selectedUploadFile.base64} className="w-full h-full object-cover" alt="Up"/>
                  </div>
                 <div className="flex flex-col">
                      <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">{selectedUploadFile.name}</span>
                      <span className="text-[9px] text-white/20 uppercase">Ready for deployment</span>
                 </div>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => handleImageUpload(dir)} className="px-6 py-2 bg-primary text-black text-[10px] uppercase font-black rounded-full shadow-lg hover:scale-105 transition-all">Confirm Upload</button>
                  <button onClick={() => onFileChange(null)} className="p-2 text-white/40 hover:text-red-500 transition-colors"><X size={16}/></button>
              </div>
          </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                        src={resolveAsset(fullPath)} 
                        className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'opacity-90 grayscale-0' : 'opacity-40 group-hover:opacity-80 grayscale-[0.5] group-hover:grayscale-0'}`} 
                        alt={f}
                        onError={(e: any) => e.target.src = "https://placehold.co/600x400/020202/d4af37?text=Asset+Error"}
                      />
                      
                      {isUsed && (
                          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-10">
                              <Layers size={10} className="text-primary/60"/>
                              <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">In Use</span>
                          </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col gap-2">
                          <button 
                              onClick={() => {
                                  if(onSelect) onSelect(fullPath);
                                  else {
                                      navigator.clipboard.writeText(fullPath);
                                  }
                              }} 
                              className="w-full py-2 bg-primary text-black rounded-xl text-[9px] uppercase font-black shadow-xl"
                          >
                              {onSelect ? "Apply Asset" : "Copy Reference"}
                          </button>
                          {!isUsed && (
                              <button onClick={() => handleDeleteAsset(dir, f)} className="text-red-500/60 hover:text-red-500 transition-colors self-center p-1"><Trash2 size={12}/></button>
                          )}
                      </div>
                      {isActive && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black shadow-lg animate-in zoom-in-50 duration-500">
                              <CheckCircle size={14}/>
                          </div>
                      )}
                  </motion.div>
              );
          })}
      </div>
  </div>
);

export default function Admin() {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    step: "credentials",
    githubToken: "",
    githubOwner: "",
    githubRepo: "",
  });

  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Asset Management
  const [assetFiles, setAssetFiles] = useState<{ [key: string]: string[] }>({});
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<{ name: string; base64: string } | null>(null);
  const [activePickerField, setActivePickerField] = useState<{ label: string, path: string, setter: (val: string) => void, preferredDir?: string } | null>(null);

  const assetDirectories = ["backgrounds", "Welcome", "LuxuryCorporateEvents", "BespokeWeddings&Engagements", "GeneralGallery", "DJNights&PrivateParties", "TraditionalBands&BrandOpenings", "Catering & Culinary Experiences", "Makeup&StylingServices", "Pastries & Celebration Cakes", "Balloon Decor & Birthday Celebrations", "Private & Social Celebrations", "Schools, Colleges & University Event Services"];

  // Configuration mapping for background directory associations
  const bgDirMap: Record<Tab, string> = {
    hero: "backgrounds",
    about: "backgrounds",
    story: "backgrounds",
    values: "backgrounds",
    services: "LuxuryCorporateEvents",
    gallery: "BespokeWeddings&Engagements",
    reviews: "DJNights&PrivateParties",
    contact: "Private & Social Celebrations",
    socials: "backgrounds",
    welcome: "Welcome"
  };

  // Load GitHub config from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem("gh_token");
    const savedOwner = localStorage.getItem("gh_owner");
    const savedRepo = localStorage.getItem("gh_repo");
    if (savedToken && savedOwner && savedRepo) {
      setAuth(prev => ({ ...prev, githubToken: savedToken, githubOwner: savedOwner, githubRepo: savedRepo }));
    }
  }, []);

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchAllAssets();
    }
  }, [auth.isLoggedIn]);

  const adminGalleryList = useMemo(() => {
    const savedOrder = formData.galleryPage.galleryItems || [];
    
    const normalizedFolderImages = allFolderImages.map(path => {
      const parts = path.split('/');
      const fileName = parts[parts.length - 1];
      const folderName = parts[parts.length - 2];
      return `${folderName}/${fileName}`;
    });
    
    const newImages = normalizedFolderImages.filter(path => !savedOrder.includes(path));
    return [...savedOrder, ...newImages];
  }, [formData.galleryPage.galleryItems]);

  const fetchAllAssets = async () => {
    setIsFetchingFiles(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
    const dirs = ["backgrounds", "Hero", "About", "OurStory", "Welcome", "LuxuryCorporateEvents", "BespokeWeddings&Engagements", "DJNights&PrivateParties", "TraditionalBands&BrandOpenings", "Catering & Culinary Experiences", "Makeup&StylingServices", "Pastries & Celebration Cakes", "Balloon Décor & Birthday Celebrations", "Private & Social Celebrations", "Schools, Colleges & University Event Services"];
    
    const newAssets: { [key: string]: string[] } = {};
    for (const dir of assetDirectories) {
      const path = dir === "backgrounds" ? "client/src/assets/backgrounds" : `client/src/assets/gallery/${dir}`;
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
                newData.galleryPage.galleryItems = arrayMove(adminGalleryList, oldIndex, newIndex);
              }
           } else if (section === 'services') {
              const oldIndex = newData.services.findIndex(s => s.id === active.id);
              const newIndex = newData.services.findIndex(s => s.id === over?.id);
              newData.services = arrayMove([...newData.services], oldIndex, newIndex);
           } else if (section === 'service-details' && subId) {
              const sIdx = newData.services.findIndex(s => s.id === subId);
              if(sIdx !== -1) {
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
      setStatus(null);
    } else {
      setStatus({ type: "error", message: "Invalid key." });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
    const result = await updateGitHubFile(config, "client/src/data/siteContent.json", JSON.stringify(formData, null, 2), "Admin: Comprehensive content update");
    setIsSaving(false);
    if (result.success) {
      setStatus({ type: "success", message: "Repository synchronization successful." });
    } else {
      setStatus({ type: "error", message: `Sync failed: ${result.message}` });
    }
  };

  const handleImageUpload = async (targetDir: string) => {
    if (!selectedUploadFile) return;
    
    const previousPath = activePickerField?.path;
    const shouldDeleteOld = previousPath && confirm(`Asset Replacement: Replace "${previousPath}" with "${selectedUploadFile.name}" and delete the old file from repository?`);

    setIsSaving(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
    
    // 1. Upload new image
    const result = await uploadGitHubImage(config, targetDir, selectedUploadFile.name, selectedUploadFile.base64.split(",")[1], `Admin: Resource upload to ${targetDir}`);
    
    if (result.success) {
      const newPath = targetDir === "backgrounds" ? selectedUploadFile.name : `${targetDir}/${selectedUploadFile.name}`;
      
      // 2. Optionally delete old image if it's a replacement and NOT the same file
      if (shouldDeleteOld && previousPath !== newPath) {
        const deletePath = previousPath.includes('/') ? `client/src/assets/gallery/${previousPath}` : `client/src/assets/backgrounds/${previousPath}`;
        await deleteGitHubFile(config, deletePath, `Admin: Auto-cleanup of replaced asset ${previousPath}`);
      }

      setStatus({ type: "success", message: `Asset ${shouldDeleteOld ? 'replaced' : 'uploaded'} successfully.` });
      
      // Auto-assign if we have an active picker field
      if (activePickerField) {
          activePickerField.setter(newPath);
          setIsPickerOpen(false);
          setActivePickerField(null);
      }
      
      setSelectedUploadFile(null);
      fetchAllAssets();
    } else {
      setStatus({ type: "error", message: `Upload failed: ${result.message}` });
    }
    setIsSaving(false);
  };

  const handleDeleteAsset = async (dir: string, fileName: string) => {
    if (!confirm(`Permanently delete ${fileName}?`)) return;
    setIsSaving(true);
    const config: GitHubConfig = { owner: auth.githubOwner, repo: auth.githubRepo, token: auth.githubToken };
    const path = dir === "backgrounds" ? `client/src/assets/backgrounds/${fileName}` : `client/src/assets/gallery/${dir}/${fileName}`;
    const result = await deleteGitHubFile(config, path, `Admin: Resource removal ${fileName}`);
    setIsSaving(false);
    if (result.success) {
      setStatus({ type: "success", message: "Asset purged from repository." });
      fetchAllAssets();
    } else {
      setStatus({ type: "error", message: `Purge failed: ${result.message}` });
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedUploadFile({ name: file.name, base64: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // --- UI Components ---

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Helper to find all image references in siteContent
  const getUsedAssets = (content: SiteContent) => {
    const used = new Set<string>();
    
    // Backgrounds
    Object.values(content.backgrounds).forEach((path: any) => { if(path) used.add(path as string); });
    
    // Services
    content.services.forEach(s => {
      if(s.image) used.add(s.image);
      (s.details || []).forEach(d => { if(d.image) used.add(d.image); });
    });
    
    // Gallery Items
    (content.galleryPage.galleryItems || []).forEach((path: string) => { if(path) used.add(path); });
    
    // Welcome
    if(content.welcomePopup?.image) used.add(content.welcomePopup.image);
    
    return used;
  };

  const getOtherUsage = (content: SiteContent) => {
    const used = new Set<string>();
    
    // Backgrounds
    Object.values(content.backgrounds).forEach((path: any) => { if(path) used.add(path as string); });
    
    // Services
    content.services.forEach(s => {
      if(s.image) used.add(s.image);
      (s.details || []).forEach(d => { if(d.image) used.add(d.image); });
    });
    
    // Welcome
    if(content.welcomePopup?.image) used.add(content.welcomePopup.image);
    
    return used;
  };

  const usedAssets = getUsedAssets(formData);
  const otherUsage = getOtherUsage(formData);

  const [uploadTargetDirForSection, setUploadTargetDirForSection] = useState("");

  if (!auth.isLoggedIn) {
    return (
     <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6">
       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-glow">
              <Lock size={32}/>
            </div>
            <h1 className="text-4xl font-serif italic text-white">Administrative Suite</h1>
          </div>
          <AnimatePresence mode="wait">
            {auth.step === "credentials" ? (
             <div className="space-y-6">
                <input type="password" placeholder="GitHub Access Token" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-5 text-white outline-none focus:border-primary/40 shadow-inner" value={auth.githubToken} onChange={e => setAuth(p => ({ ...p, githubToken: e.target.value }))}/>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Owner" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-5 text-white outline-none focus:border-primary/40 shadow-inner" value={auth.githubOwner} onChange={e => setAuth(p => ({ ...p, githubOwner: e.target.value }))}/>
                    <input type="text" placeholder="Repo" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-5 text-white outline-none focus:border-primary/40 shadow-inner" value={auth.githubRepo} onChange={e => setAuth(p => ({ ...p, githubRepo: e.target.value }))}/>
                </div>
                <button onClick={sendOtp} className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">Authorize Access</button>
             </div>
            ) : (
             <div className="space-y-6">
                <input type="text" maxLength={6} placeholder="Enter Code" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-20 text-center text-3xl font-serif italic text-primary outline-none focus:border-primary/40 shadow-inner" value={otp} onChange={e => setOtp(e.target.value)}/>
                <button onClick={verifyOtp} className="w-full py-5 bg-primary text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] transition-all">Grant Access</button>
             </div>
            )}
          </AnimatePresence>
          {status && <div className={`mt-8 p-4 rounded-xl text-[9px] uppercase font-black text-center tracking-widest ${status.type === 'success' ? 'text-green-400 bg-green-500/5' : 'text-red-400 bg-red-500/5'}`}>{status.message}</div>}
       </motion.div>
     </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white py-32 overflow-hidden selection:bg-primary/20">
        <div className="container mx-auto px-6 max-w-7xl">
            {/* Control Bar */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
                <div>
                   <h1 className="text-5xl font-serif italic mb-2 tracking-tighter">Event Horizon<span className="text-primary/40 font-sans text-lg ml-4 uppercase tracking-[0.5em] not-italic">Admin</span></h1>
                   <div className="flex gap-4 items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.6em] font-black">Live Remote Control Protocol Active</p>
                   </div>
                </div>
                <div className="flex items-center gap-8">
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-white/20 hover:text-red-500 transition-colors uppercase text-[9px] font-black tracking-widest">Logout</button>
                    <button onClick={handleSave} disabled={isSaving} className="group relative px-12 py-5 bg-primary text-black font-black uppercase tracking-[0.5em] text-[10px] rounded-full shadow-2xl overflow-hidden transition-all hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]">
                        <span className="relative z-10 flex items-center gap-3">
                            {isSaving ? "Syncing..." : <><Save size={16}/> Push Live</>}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                </div>
            </header>

            {status && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`mb-12 p-6 rounded-3xl border text-xs font-bold flex items-center justify-center gap-4 ${status.type === 'success' ? 'bg-green-500/5 border-green-500/10 text-green-400' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                    {status.message}
                </motion.div>
            )}

            <div className="grid lg:grid-cols-12 gap-16">
                {/* Section Navigation */}
                <nav className="lg:col-span-3 space-y-3">
                    {([
                        { id: "hero", label: "Home / Hero" },
                        { id: "about", label: "About Identity" },
                        { id: "story", label: "Our Story" },
                        { id: "values", label: "Core Values" },
                        { id: "services", label: "Client Offerings" },
                        { id: "gallery", label: "Visual Archive" },
                        { id: "reviews", label: "Client Reflections" },
                        { id: "contact", label: "Inquiry Center" },
                        { id: "socials", label: "Communication" },
                        { id: "welcome", label: "Welcome Popup" }
                    ] as { id: Tab, label: string }[]).map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center justify-between p-7 rounded-[2rem] border transition-all duration-500 group ${activeTab === t.id ? 'bg-primary border-primary text-black shadow-lg translate-x-4' : 'bg-white/[0.01] border-white/5 text-white/30 hover:bg-white/[0.03] hover:text-white'}`}>
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black">{t.label}</span>
                            <ArrowRight size={14} className={`transition-transform duration-500 ${activeTab === t.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}/>
                        </button>
                    ))}
                </nav>

                {/* Dashboard Engine */}
                <main className="lg:col-span-9 bg-black/40 border border-white/5 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl relative overflow-hidden min-h-[900px]">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="space-y-16">
                            
                            {/* Header Section */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-12">
                                <h2 className="text-4xl font-serif italic text-primary/80 capitalize">{activeTab.replace("-", " ")} <span className="text-white/10 text-xl font-sans not-italic ml-4 uppercase tracking-[0.3em]">Management</span></h2>
                            </div>

                            {/* Section Controls */}
                            <div className="space-y-12">
                                {/* Integrated Background Select */}
                                <BackgroundControl 
                                    pageId={activeTab === 'story' ? 'story' : activeTab} 
                                    backgrounds={formData.backgrounds}
                                    assetFiles={assetFiles}
                                    onBrowse={() => {
                                        const pageId = activeTab === 'story' ? 'story' : activeTab;
                                        setActivePickerField({ 
                                            label: "Section Background", 
                                            path: (formData.backgrounds as any)[pageId], 
                                            setter: (val) => setFormData(p => ({ ...p, backgrounds: { ...p.backgrounds, [pageId]: val } })) 
                                        });
                                        setIsPickerOpen(true);
                                    }}
                                    onChange={(val: string) => setFormData(p => ({ ...p, backgrounds: { ...p.backgrounds, [activeTab === 'story' ? 'story' : activeTab]: val } }))}
                                />

                                <hr className="border-white/5"/>

                                {/* Text CRUD - Dynamic based on Tab */}
                                <div className="space-y-10">
                                    {activeTab === 'hero' && (
                                        <>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <Field label="Hero First Title" value={formData.hero.title.first} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, title: { ...p.hero.title, first: v } } }))} />
                                                <Field label="Hero Accent Title" value={formData.hero.title.second} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, title: { ...p.hero.title, second: v } } }))} />
                                            </div>
                                            <Field label="Main Hero Description" value={formData.hero.description} onChange={(v: string) => setFormData(p => ({ ...p, hero: { ...p.hero, description: v } }))} area italic />
                                        </>
                                    )}

                                    {activeTab === 'about' && (
                                        <div className="space-y-12">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <Field label="Heading Main" value={formData.about.title.main} onChange={(v: string) => setFormData(p => ({ ...p, about: { ...p.about, title: { ...p.about.title, main: v } } }))} />
                                                <Field label="Heading Accent" value={formData.about.title.accent} onChange={(v: string) => setFormData(p => ({ ...p, about: { ...p.about, title: { ...p.about.title, accent: v } } }))} />
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-primary/40 font-black">Narrative Content</label>
                                                    <span className="text-[9px] text-white/20 uppercase font-black">Drag to Reorder</span>
                                                </div>
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
                                                <button onClick={() => setFormData(p => ({ ...p, about: { ...p.about, description: [...p.about.description, "New Narrative Block " + Date.now()] } }))} className="w-full py-6 border border-dashed border-white/5 rounded-3xl text-[10px] uppercase font-black text-white/20 hover:text-primary/40 hover:bg-white/[0.01] transition-all flex items-center justify-center gap-2">
                                                    <Plus size={16}/> Add Narrative Segment
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'story' && (
                                        <div className="space-y-12">
                                            <Field label="Intro Overview" value={formData.distinction.shortDesc} onChange={(v: string) => setFormData(p => ({ ...p, distinction: { ...p.distinction, shortDesc: v } }))} area italic />
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between px-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-primary/40 font-black">Dialog Paragraphs</label>
                                                </div>
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
                                                <button onClick={() => setFormData(p => ({ ...p, distinction: { ...p.distinction, dialog: { ...p.distinction.dialog, paragraphs: [...p.distinction.dialog.paragraphs, "New Dialog Segment " + Date.now()] } } }))} className="w-full py-6 border border-dashed border-white/5 rounded-3xl text-[10px] uppercase font-black text-white/20 hover:text-primary/40 hover:bg-white/[0.01] transition-all flex items-center justify-center gap-2">
                                                    <Plus size={16}/> Add Dialog Segment
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'values' && (
                                        <div className="space-y-12">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-[10px] uppercase tracking-widest text-primary/40 font-black">Core Principles</label>
                                            </div>
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'values')}>
                                                <SortableContext items={formData.values.items.map(v => v.title)} strategy={verticalListSortingStrategy}>
                                                    <div className="space-y-4">
                                                        {formData.values.items.map((v, i) => (
                                                            <SortableListItem 
                                                                key={v.title} 
                                                                id={v.title} 
                                                                onRemove={() => setFormData(p => ({ ...p, values: { ...p.values, items: p.values.items.filter((_, idx) => idx !== i) } }))}
                                                            >
                                                                <div className="grid md:grid-cols-3 gap-6">
                                                                    <div className="md:col-span-1 border-r border-white/5 pr-6">
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
                                            <button onClick={() => setFormData(p => ({ ...p, values: { ...p.values, items: [...p.values.items, { title: "New Principle " + Date.now(), desc: "Describe the core essence..." }] } }))} className="w-full py-8 border border-dashed border-white/5 rounded-3xl text-[10px] uppercase font-black text-white/20 hover:text-primary/40 hover:bg-white/[0.01] transition-all flex flex-col items-center justify-center gap-2">
                                                <Plus size={24}/> Add Core Principle
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'services' && (
                                        <div className="space-y-12">
                                            <div className="flex justify-between items-center px-2">
                                                <p className="text-[10px] uppercase tracking-widest text-primary/40 font-black">Offerings Repository</p>
                                                <button onClick={() => setFormData(p => ({ ...p, services: [{ id: `svc-${Date.now()}`, title: "New Offering", desc: "Brief intro", fullDescription: "Detailed narrative", image: "", details: [] }, ...p.services] }))} className="px-6 py-3 bg-primary text-black rounded-full text-[10px] uppercase font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"><Plus size={14}/> New Offering</button>
                                            </div>
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'services')}>
                                                <SortableContext items={formData.services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                                    <div className="space-y-12">
                                                        {formData.services.map((s, si) => (
                                                            <SortableListItem 
                                                                key={s.id} 
                                                                id={s.id} 
                                                                onRemove={() => setFormData(p => ({ ...p, services: p.services.filter((_, idx) => idx !== si) }))}
                                                            >
                                                                <div className="space-y-8">
                                                                    <div className="grid md:grid-cols-2 gap-8">
                                                                        <Field label="Service Header" value={s.title} onChange={(v: string) => {
                                                                            const news = [...formData.services]; news[si].title = v; setFormData(p => ({ ...p, services: news }));
                                                                        }} />
                                                                        <Field 
                                                                            label="Featured Asset" 
                                                                            value={s.image} 
                                                                            onChange={(v: string) => {
                                                                                const news = [...formData.services]; news[si].image = v; setFormData(p => ({ ...p, services: news }));
                                                                            }} 
                                                                            image 
                                                                            onBrowse={() => {
                                                                                setActivePickerField({ 
                                                                                    label: "Service Asset", 
                                                                                    path: s.image, 
                                                                                    setter: (v) => { const news = [...formData.services]; news[si].image = v; setFormData(p => ({ ...p, services: news })); },
                                                                                    preferredDir: s.title.replace(/\s+/g, '')
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

                                                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                                                        <h5 className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black px-2">Experience Sequence (Drag to Reorder)</h5>
                                                                        
                                                                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'service-details', s.id)}>
                                                                            <SortableContext items={(s.details || []).map((_, idx) => `det-${s.id}-${idx}`)} strategy={verticalListSortingStrategy}>
                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                    {(s.details || []).map((d, di) => (
                                                                                        <SortableListItem 
                                                                                            key={`det-${s.id}-${di}`} 
                                                                                            id={`det-${s.id}-${di}`}
                                                                                            onRemove={() => {
                                                                                                const news = [...formData.services]; news[si].details = news[si].details.filter((_, idx) => idx !== di);
                                                                                                setFormData(p => ({ ...p, services: news }));
                                                                                            }}
                                                                                        >
                                                                                            <div className="space-y-4">
                                                                                                <Field label="Title" value={d.title} onChange={(v: string) => {
                                                                                                    const news = [...formData.services]; news[si].details[di].title = v; setFormData(p => ({ ...p, services: news }));
                                                                                                }} />
                                                                                                <Field 
                                                                                                    label="Asset" 
                                                                                                    value={d.image} 
                                                                                                    onChange={(v: string) => {
                                                                                                        const news = [...formData.services]; news[si].details[di].image = v; setFormData(p => ({ ...p, services: news }));
                                                                                                    }} 
                                                                                                    image 
                                                                                                    onBrowse={() => {
                                                                                                        setActivePickerField({ 
                                                                                                            label: "Detail Asset", 
                                                                                                            path: d.image, 
                                                                                                            setter: (v) => { const news = [...formData.services]; news[si].details[di].image = v; setFormData(p => ({ ...p, services: news })); },
                                                                                                            preferredDir: s.title.replace(/\s+/g, '')
                                                                                                        });
                                                                                                        setIsPickerOpen(true);
                                                                                                    }}
                                                                                                />
                                                                                                <textarea className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[10px] h-20 text-white/60 resize-none focus:border-primary/40 outline-none transition-all" value={d.description} onChange={(e) => {
                                                                                                    const news = [...formData.services]; news[si].details[di].description = e.target.value; setFormData(p => ({ ...p, services: news }));
                                                                                                }} />
                                                                                            </div>
                                                                                        </SortableListItem>
                                                                                    ))}
                                                                                    <button onClick={() => {
                                                                                        const news = [...formData.services]; news[si].details = [...(news[si].details || []), { title: "New Feature", buttonText: "Explore", image: "", description: "" }];
                                                                                        setFormData(p => ({ ...p, services: news }));
                                                                                    }} className="border border-dashed border-white/5 rounded-3xl min-h-[150px] text-white/10 hover:text-primary/40 hover:bg-white/[0.01] flex flex-col items-center justify-center gap-2 transition-all"><Plus size={20}/> New Sequence Phase</button>
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
                                        <div className="space-y-12">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <Field label="Section Header" value={formData.galleryPage.title.main} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, title: { ...p.galleryPage.title, main: v } } }))} />
                                                <Field label="Header Accent" value={formData.galleryPage.title.accent} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, title: { ...p.galleryPage.title, accent: v } } }))} />
                                            </div>
                                            <Field label="Archive Description" value={formData.galleryPage.description} onChange={(v: string) => setFormData(p => ({ ...p, galleryPage: { ...p.galleryPage, description: v } }))} area />
                                            
                                            <div className="pt-12 border-t border-white/5 space-y-8">
                                                <div className="flex items-center justify-between px-2">
                                                    <div>
                                                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary/80">Curated Gallery Collection</h4>
                                                        <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Mirroring client site layout • Drag to reorder</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Layers size={14} className="text-white/20"/>
                                                        <span className="text-[9px] uppercase font-black text-white/40 tracking-widest">{(formData.galleryPage.galleryItems || []).length} Masterpieces</span>
                                                    </div>
                                                </div>

                                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'gallery')}>
                                                    <SortableContext items={adminGalleryList} strategy={rectSortingStrategy}>
                                                        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                                                            {adminGalleryList.map((path: string, idx: number) => (
                                                                <div key={path} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-1rem)]">
                                                                    <SortableGridItem 
                                                                        id={path}
                                                                        path={path}
                                                                        idx={idx}
                                                                        otherUsage={otherUsage}
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
                                                                </div>
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
                                                                className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-1rem)] aspect-[4/5] md:aspect-[3/4] border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center gap-4 text-white/20 hover:text-primary hover:border-primary/40 transition-all bg-white/[0.01] hover:bg-white/[0.03]"
                                                            >
                                                                <div className="p-4 bg-primary/5 rounded-full border border-primary/10">
                                                                    <Plus size={24}/>
                                                                </div>
                                                                <span className="text-[9px] uppercase font-black tracking-widest">Add Masterpiece</span>
                                                            </button>
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="space-y-12">
                                            <div className="flex justify-between items-center px-2">
                                                <p className="text-[10px] uppercase tracking-widest text-primary/40 font-black">Testimonial Ledger</p>
                                                <button onClick={() => setFormData(p => ({ ...p, reviewItems: [{ id: Date.now(), name: "John Doe", rating: 5, comment: "Exceptional mastery." }, ...p.reviewItems] }))} className="px-6 py-3 bg-primary text-black rounded-full text-[10px] uppercase font-black flex items-center gap-2 shadow-lg"><Plus size={14}/> Add reflection</button>
                                            </div>
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'reviews')}>
                                                <SortableContext items={formData.reviewItems.map(r => r.id)} strategy={verticalListSortingStrategy}>
                                                    <div className="grid md:grid-cols-2 gap-8">
                                                        {formData.reviewItems.map((r, i) => (
                                                            <SortableListItem 
                                                                key={r.id} 
                                                                id={r.id} 
                                                                onRemove={() => setFormData(p => ({ ...p, reviewItems: p.reviewItems.filter((_, idx) => idx !== i) }))}
                                                            >
                                                                <div className="space-y-4">
                                                                    <div className="flex justify-between items-center gap-4">
                                                                        <div className="flex-1">
                                                                            <Field label="Client Distinction" value={r.name} onChange={(v: string) => {
                                                                                const nr = [...formData.reviewItems]; nr[i].name = v; setFormData(p => ({ ...p, reviewItems: nr }));
                                                                            }} />
                                                                        </div>
                                                                        <select className="bg-black/40 border border-white/10 rounded-xl h-12 px-4 text-[10px] text-primary/60 outline-none" value={r.rating} onChange={(e) => {
                                                                            const nr = [...formData.reviewItems]; nr[i].rating = parseInt(e.target.value); setFormData(p => ({ ...p, reviewItems: nr }));
                                                                        }}>
                                                                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                                                        </select>
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
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-8">
                                                <Field label="Primary Header" value={formData.contactPage.title.main} onChange={(v: string) => setFormData(p => ({ ...p, contactPage: { ...p.contactPage, title: { ...p.contactPage.title, main: v } } }))} />
                                                <Field label="Communication Prompt" value={formData.contactPage.description} onChange={(v: string) => setFormData(p => ({ ...p, contactPage: { ...p.contactPage, description: v } }))} area />
                                            </div>
                                            <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[3rem] space-y-8">
                                                <h4 className="text-[10px] uppercase tracking-widest text-primary/60 font-black">Meta Connectors</h4>
                                                <Field label="Studio Location" value={formData.contact.address} onChange={(v: string) => setFormData(p => ({ ...p, contact: { ...p.contact, address: v } }))} area />
                                                <Field label="Operational Hours" value={formData.contact.hours} onChange={(v: string) => setFormData(p => ({ ...p, contact: { ...p.contact, hours: v } }))} />
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
                                        <div className="space-y-12">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <Field label="Popup Title" value={formData.welcomePopup.title.main} onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, title: { ...p.welcomePopup.title, main: v } } }))} />
                                                <Field label="Title Accent" value={formData.welcomePopup.title.accent} onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, title: { ...p.welcomePopup.title, accent: v } } }))} />
                                            </div>
                                            <Field label="Popup Description" value={formData.welcomePopup.description} onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, description: v } }))} area italic />
                                            <Field 
                                                label="Featured Invitation Asset" 
                                                value={formData.welcomePopup.image} 
                                                onChange={(v: string) => setFormData(p => ({ ...p, welcomePopup: { ...p.welcomePopup, image: v } }))} 
                                                image
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
                                <hr className="border-white/5 my-16"/>
                                <div className="space-y-12">
                                    <div className="flex items-center gap-4">
                                        <Search size={16} className="text-primary/40"/>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Global Asset Repository Browser</h4>
                                    </div>
                                    <RepositoryBrowser 
                                        dir={bgDirMap[activeTab] || "backgrounds"} 
                                        assetFiles={assetFiles}
                                        fetchAllAssets={fetchAllAssets}
                                        isFetchingFiles={isFetchingFiles}
                                        onFileChange={onFileChange}
                                        selectedUploadFile={selectedUploadFile}
                                        uploadTargetDirForSection={uploadTargetDirForSection}
                                        setUploadTargetDirForSection={setUploadTargetDirForSection}
                                        handleImageUpload={handleImageUpload}
                                        handleDeleteAsset={handleDeleteAsset}
                                        usedAssets={usedAssets}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
        
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
                    className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[300] p-12 overflow-y-auto scroll-smooth"
                    onAnimationComplete={() => {
                        if (activePickerField?.preferredDir) {
                            const el = document.getElementById(`dir-${activePickerField.preferredDir}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                >
                    <div className="container mx-auto max-w-7xl h-full flex flex-col">
                        <header className="flex items-center justify-between mb-16 border-b border-white/10 pb-10">
                            <div className="flex items-center gap-8">
                                <div className="p-5 bg-primary/10 border border-primary/20 rounded-[2rem] text-primary">
                                    <ImageIcon size={32}/>
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
                                <X size={32} className="text-white/20 group-hover:text-red-500 transition-colors"/>
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
                                        onFileChange={onFileChange}
                                        selectedUploadFile={selectedUploadFile}
                                        uploadTargetDirForSection={uploadTargetDirForSection}
                                        setUploadTargetDirForSection={setUploadTargetDirForSection}
                                        handleImageUpload={handleImageUpload}
                                        handleDeleteAsset={handleDeleteAsset}
                                        usedAssets={usedAssets}
                                        onSelect={(fullPath: string) => {
                                            if(activePickerField) {
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
