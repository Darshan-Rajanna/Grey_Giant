import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, Github, Save, CheckCircle, AlertCircle, Image as ImageIcon, Send, X, Plus, Trash2, ArrowRight } from "lucide-react";
import { siteContent, type SiteContent } from "@/data/siteContent";
import { updateGitHubFile, uploadGitHubImage, type GitHubConfig } from "@/lib/github-api";

// --- Types ---
interface AuthState {
  isLoggedIn: boolean;
  step: "credentials" | "otp";
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
}

type Tab = "hero" | "about" | "distinction" | "contact" | "socials" | "images";

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

  // Image Upload State
  const [uploadDir, setUploadDir] = useState("Hero");
  const [selectedImage, setSelectedImage] = useState<{ name: string; base64: string } | null>(null);

  // Load GitHub config from local storage if exists
  useEffect(() => {
    const savedToken = localStorage.getItem("gh_token");
    const savedOwner = localStorage.getItem("gh_owner");
    const savedRepo = localStorage.getItem("gh_repo");
    if (savedToken && savedOwner && savedRepo) {
      setAuth(prev => ({ ...prev, githubToken: savedToken, githubOwner: savedOwner, githubRepo: savedRepo }));
    }
  }, []);

  // --- Handlers ---

  const sendOtp = async () => {
    if (!auth.githubToken || !auth.githubOwner || !auth.githubRepo) {
      setStatus({ type: "error", message: "Please fill in all GitHub credentials." });
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    console.log("OTP for Site Admin (Demo):", code);
    setAuth(prev => ({ ...prev, step: "otp" }));
    setStatus({ type: "success", message: `OTP generated. (Note: In this environment, check the console or use: ${code})` });
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setAuth(prev => ({ ...prev, isLoggedIn: true }));
      localStorage.setItem("gh_token", auth.githubToken);
      localStorage.setItem("gh_owner", auth.githubOwner);
      localStorage.setItem("gh_repo", auth.githubRepo);
      setStatus(null);
    } else {
      setStatus({ type: "error", message: "Invalid OTP." });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const config: GitHubConfig = {
      owner: auth.githubOwner,
      repo: auth.githubRepo,
      token: auth.githubToken
    };

    const result = await updateGitHubFile(
      config,
      "client/src/data/siteContent.json",
      JSON.stringify(formData, null, 2),
      "Admin Update: Data changes via CMS Dashboard"
    );

    setIsSaving(false);
    if (result.success) {
      setStatus({ type: "success", message: "Changes saved! GitHub will update the live site in ~2 min." });
    } else {
      setStatus({ type: "error", message: `Save failed: ${result.message}` });
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    setIsSaving(true);
    
    const config: GitHubConfig = {
      owner: auth.githubOwner,
      repo: auth.githubRepo,
      token: auth.githubToken
    };

    const result = await uploadGitHubImage(
      config,
      uploadDir,
      selectedImage.name,
      selectedImage.base64.split(",")[1], // Strip metadata prefix
      `Admin Upload: New image for ${uploadDir}`
    );

    setIsSaving(false);
    if (result.success) {
      setStatus({ type: "success", message: `Image uploaded to ${uploadDir}! It will be live shortly.` });
      setSelectedImage(null);
    } else {
      setStatus({ type: "error", message: `Upload failed: ${result.message}` });
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          name: file.name,
          base64: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Render Sections ---

  if (!auth.isLoggedIn) {
     return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[3rem] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
        >
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              <Lock size={32} />
            </div>
            <h1 className="text-4xl font-serif text-white italic tracking-tight">Admin Vault</h1>
          </div>

          <AnimatePresence mode="wait">
            {auth.step === "credentials" ? (
              <motion.div key="creds" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-3 block px-1">Access Token</label>
                  <input type="password" placeholder="ghp_..." className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-5 text-white focus:border-primary/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/5" value={auth.githubToken} onChange={(e) => setAuth(prev => ({ ...prev, githubToken: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-3 block px-1">Repo Owner</label>
                    <input type="text" placeholder="User" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-5 text-white focus:border-primary/40 outline-none transition-all placeholder:text-white/5" value={auth.githubOwner} onChange={(e) => setAuth(prev => ({ ...prev, githubOwner: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-3 block px-1">Repo Name</label>
                    <input type="text" placeholder="Project" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-5 text-white focus:border-primary/40 outline-none transition-all placeholder:text-white/5" value={auth.githubRepo} onChange={(e) => setAuth(prev => ({ ...prev, githubRepo: e.target.value }))} />
                  </div>
                </div>
                <button onClick={sendOtp} className="w-full py-5 bg-primary text-black font-bold uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-4 group">
                  Identify <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                <p className="text-white/40 text-center text-xs tracking-widest uppercase mb-4 font-bold">Waiting for Email OTP...</p>
                <input type="text" maxLength={6} className="w-full bg-white/[0.03] border-white/10 rounded-3xl h-20 text-center text-4xl tracking-[0.8em] font-serif italic text-primary focus:border-primary/50 outline-none transition-all" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button onClick={verifyOtp} className="w-full py-5 bg-primary text-black font-bold uppercase tracking-[0.4em] text-[11px] rounded-2xl transition-all">Grant Access</button>
                <button onClick={() => setAuth(prev => ({ ...prev, step: "credentials" }))} className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-bold block w-full text-center hover:text-white transition-colors">Abort Access</button>
              </motion.div>
            )}
          </AnimatePresence>

          {status && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-10 p-5 rounded-2xl text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-4 ${status.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/10" : "bg-red-500/10 text-red-400 border border-red-500/10"}`}>
              {status.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {status.message}
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white py-32 selection:bg-primary/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
          <div>
            <h1 className="text-5xl font-serif italic mb-4 tracking-tight">Administrative Suite</h1>
            <p className="text-primary/40 text-[10px] uppercase tracking-[0.6em] font-bold">Synchronizing with GitHub Repository</p>
          </div>
          <div className="flex gap-8 items-center">
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-white/20 text-[9px] uppercase tracking-widest font-bold hover:text-red-400 transition-colors">Sign Out</button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={isSaving} className="px-14 py-5 bg-primary text-black font-bold uppercase tracking-[0.4em] text-[11px] rounded-full hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all flex items-center gap-4">
              {isSaving ? "Syncing..." : <><Save size={16} /> Publish Changes</>}
            </motion.button>
          </div>
        </div>

        {status && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`mb-12 p-8 rounded-3xl text-sm flex items-center justify-center gap-6 font-medium ${status.type === "success" ? "bg-green-500/5 text-green-400 border border-green-500/10" : "bg-red-500/5 text-red-400 border border-red-500/10"}`}>
            {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.message}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {(["hero", "about", "distinction", "contact", "socials", "images"] as Tab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left p-8 rounded-[2rem] border transition-all group flex items-center justify-between ${activeTab === tab ? "bg-primary border-primary text-black shadow-[0_10px_40px_rgba(212,175,55,0.2)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.02] text-white/40 hover:text-white"}`}>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black">{tab === "hero" ? "Front Page" : tab}</span>
                <AnimatePresence>
                  {activeTab === tab && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle size={14} /></motion.div>}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Main Content Dashboard */}
          <div className="lg:col-span-9 bg-white/[0.01] border border-white/5 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl relative overflow-hidden min-h-[700px]">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
             
             <AnimatePresence mode="wait">
               {/* --- TAB: HERO --- */}
               {activeTab === "hero" && (
                 <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                   <h2 className="text-3xl font-serif italic text-primary/80 mb-12">Hero Section Content</h2>
                   <div className="grid gap-10">
                     <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                         <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Primary Title</label>
                         <input type="text" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-white text-lg focus:border-primary/40 outline-none transition-all" value={formData.hero.title.first} onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, title: { ...prev.hero.title, first: e.target.value } } }))} />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Accent Title</label>
                         <input type="text" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-white text-lg focus:border-primary/40 outline-none transition-all italic font-serif" value={formData.hero.title.second} onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, title: { ...prev.hero.title, second: e.target.value } } }))} />
                       </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Hero Description Paragraph (Italicized on Home)</label>
                        <textarea className="w-full bg-white/[0.03] border-white/5 rounded-3xl min-h-[160px] p-8 text-white focus:border-primary/40 outline-none transition-all resize-none font-serif italic text-lg leading-relaxed" value={formData.hero.description} onChange={(e) => setFormData(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))} />
                     </div>
                   </div>
                 </motion.div>
               )}

               {/* --- TAB: ABOUT --- */}
                {activeTab === "about" && (
                 <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                   <h2 className="text-3xl font-serif italic text-primary/80 mb-12">Organization Identity</h2>
                   {formData.about.description.map((para, idx) => (
                      <div key={idx} className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Paragraph {idx + 1}</label>
                        <textarea className="w-full bg-white/[0.03] border-white/5 rounded-2xl min-h-[100px] p-6 text-white/80 focus:border-primary/40 outline-none transition-all resize-none text-sm" value={para} onChange={(e) => {
                          const newDesc = [...formData.about.description];
                          newDesc[idx] = e.target.value;
                          setFormData(prev => ({ ...prev, about: { ...prev.about, description: newDesc } }));
                        }} />
                      </div>
                   ))}
                 </motion.div>
               )}

               {/* --- TAB: DISTINCTION --- */}
                {activeTab === "distinction" && (
                 <motion.div key="distinction" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                   <h2 className="text-3xl font-serif italic text-primary/80 mb-12">Heritage Narrative</h2>
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Intro Overview</label>
                      <textarea className="w-full bg-white/[0.03] border-white/5 rounded-2xl min-h-[120px] p-6 text-white/80 focus:border-primary/40 outline-none transition-all resize-none text-sm" value={formData.distinction.shortDesc} onChange={(e) => setFormData(prev => ({ ...prev, distinction: { ...prev.distinction, shortDesc: e.target.value } }))} />
                   </div>
                   <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 pt-8 border-t border-white/5">Full Story Paragraphs</h4>
                   {formData.distinction.dialog.paragraphs.map((para, idx) => (
                      <div key={idx} className="space-y-3">
                        <textarea className="w-full bg-white/[0.03] border-white/5 rounded-2xl min-h-[100px] p-6 text-white/60 focus:border-primary/40 outline-none transition-all resize-none text-xs" value={para} onChange={(e) => {
                          const newParas = [...formData.distinction.dialog.paragraphs];
                          newParas[idx] = e.target.value;
                          setFormData(prev => ({ ...prev, distinction: { ...prev.distinction, dialog: { ...prev.distinction.dialog, paragraphs: newParas } } }));
                        }} />
                      </div>
                   ))}
                 </motion.div>
               )}

               {/* --- TAB: CONTACT --- */}
               {activeTab === "contact" && (
                 <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                   <h2 className="text-3xl font-serif italic text-primary/80 mb-12">Contact Infrastructure</h2>
                   <div className="grid md:grid-cols-2 gap-10">
                     <div className="space-y-3">
                       <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">WhatsApp (Numeric only)</label>
                       <input type="text" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-white focus:border-primary/40 outline-none transition-all" value={formData.contact.whatsapp} onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, whatsapp: e.target.value } }))} />
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Email Address</label>
                       <input type="text" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-white focus:border-primary/40 outline-none transition-all" value={formData.contact.email} onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} />
                     </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2">Studio Address</label>
                      <input type="text" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-white focus:border-primary/40 outline-none transition-all font-serif italic" value={formData.contact.address} onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} />
                   </div>
                 </motion.div>
               )}

               {/* --- TAB: SOCIALS --- */}
                {activeTab === "socials" && (
                 <motion.div key="socials" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                   <h2 className="text-3xl font-serif italic text-primary/80 mb-12">Social Connectors</h2>
                   <div className="grid gap-10">
                     {Object.keys(formData.socials).map((platform) => (
                       <div key={platform} className="space-y-3">
                         <label className="text-[10px] uppercase tracking-widest text-white/30 font-black block px-2 capitalize">{platform} URL</label>
                         <input type="text" className="w-full bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-white/60 focus:border-primary/40 outline-none transition-all" value={(formData.socials as any)[platform]} onChange={(e) => setFormData(prev => ({ ...prev, socials: { ...prev.socials, [platform]: e.target.value } }))} />
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}

               {/* --- TAB: IMAGES --- */}
               {activeTab === "images" && (
                 <motion.div key="images" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                   <h2 className="text-3xl font-serif italic text-primary/80 mb-12">Digital Asset Manager</h2>
                   
                   <div className="p-12 md:p-20 border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01] flex flex-col items-center text-center gap-12">
                     <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary group animate-pulse border border-primary/10 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                        <ImageIcon size={32} />
                     </div>
                     <div className="space-y-6">
                       <h3 className="text-2xl font-serif italic">Deploy New Visual Asset</h3>
                       <p className="text-white/30 text-xs tracking-[0.2em] leading-loose max-w-sm mx-auto uppercase">Image will be pushed directly to site directories. Duplicates overwrite same-name files.</p>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                        {["Hero", "About", "OurStory", "Welcome"].map(dir => (
                          <button key={dir} onClick={() => setUploadDir(dir)} className={`py-5 rounded-3xl text-[10px] uppercase tracking-widest font-black transition-all ${uploadDir === dir ? "bg-primary text-black" : "bg-white/5 text-white/30 hover:bg-white/10"}`}>{dir}</button>
                        ))}
                     </div>

                     <div className="w-full max-w-xl">
                        <input type="file" onChange={onFileChange} className="hidden" id="asset-upload" accept="image/*" />
                        <label htmlFor="asset-upload" className="w-full inline-block p-10 border border-white/5 border-dashed rounded-[2rem] text-xs tracking-[0.4em] font-bold cursor-pointer hover:bg-white/[0.03] transition-all text-white/20 uppercase hover:text-white/40">
                          {selectedImage ? (
                            <div className="flex flex-col items-center gap-4">
                              <span className="text-primary">{selectedImage.name}</span>
                              <span className="text-[10px] text-white/20 italic">(Click to change)</span>
                            </div>
                          ) : "Browse Local File System"}
                        </label>
                     </div>

                     {selectedImage && (
                       <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={handleImageUpload} disabled={isSaving} className="w-full max-w-md py-6 bg-primary text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-full shadow-[0_20px_60px_rgba(212,175,55,0.3)] hover:shadow-[0_20px_80px_rgba(212,175,55,0.5)] transition-all">
                         Push to Repository
                       </motion.button>
                     )}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
