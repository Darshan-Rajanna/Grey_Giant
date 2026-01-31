import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Github, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import logoImg from "@assets/logo/logo1.jpeg";

const navItems = [
  { name: "Home", href: "home" },
  { name: "About", href: "about" },
  { name: "Our Story", href: "story" },
  { name: "Values", href: "values" },
  { name: "Services", href: "services" },
  { name: "Gallery", href: "gallery" },
  { name: "Reviews", href: "reviews" },
  { name: "Contact", href: "contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const basePath = import.meta.env.BASE_URL;
    if (window.location.pathname !== basePath && window.location.pathname !== basePath.replace(/\/$/, "")) {
      window.location.href = `${basePath}#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-[100] transition-all duration-700 pointer-events-none">
      <div className="container mx-auto px-6 py-6 flex justify-center">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-12 px-8 py-3 rounded-full transition-all duration-700 border",
            scrolled 
              ? "bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] w-full max-w-6xl" 
              : "bg-white/5 backdrop-blur-md border-white/5 w-full max-w-7xl"
          )}
        >
          {/* Logo Section */}
          <button 
            onClick={() => scrollToSection('home')} 
            className="flex items-center gap-4 group text-left"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-colors duration-500 rounded-full"></div>
              <img 
                src={logoImg} 
                alt="Grey Giant" 
                className="relative w-10 h-10 object-contain rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-serif italic tracking-tight">
                <span className="text-white">Grey</span> <span className="text-primary">Giant</span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-full border border-white/5">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="relative px-5 py-2 group overflow-hidden"
              >
                <span className="relative z-10 text-[9px] uppercase tracking-[0.2em] font-black text-white/40 group-hover:text-primary transition-colors duration-500">
                  {item.name}
                </span>
                <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
              </button>
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-4">
             <button 
               className="p-2 text-white/60 hover:text-white transition-colors" 
               onClick={() => setIsOpen(!isOpen)}
             >
               {isOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#020202] z-[150] pointer-events-auto flex flex-col items-center justify-start p-6 overflow-y-auto"
          >
            <div className="w-full flex justify-end mb-8 pt-4">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-4 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white active:scale-95 transition-all"
              >
                <X size={24}/>
              </button>
            </div>

            <div className="flex flex-col items-center w-full max-w-sm pb-12">
              <div className="flex flex-col items-center mb-10">
                 <img src={logoImg} className="w-16 h-16 mb-4 rounded-2xl border border-primary/20" alt="Logo"/>
                 <h2 className="text-3xl font-serif italic text-white uppercase tracking-tighter">Explore</h2>
                 <p className="text-[9px] uppercase tracking-[0.8em] text-primary/40 mt-1 font-black">Discover the Difference</p>
              </div>

              <div className="grid grid-cols-1 w-full gap-3">
                {navItems.map((item, idx) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] uppercase tracking-[0.3em] font-black text-white/60 hover:text-primary hover:border-primary/20 transition-all duration-300"
                  >
                    {item.name}
                    <ArrowUpRight size={14}/>
                  </motion.button>
                ))}
              </div>

              {/* Mobile Socials */}
              <div className="flex items-center gap-10 mt-12 pt-10 border-t border-white/5 w-full justify-center">
                 <Instagram className="text-white/20 hover:text-primary transition-colors cursor-pointer" size={20}/>
                 <Facebook className="text-white/20 hover:text-primary transition-colors cursor-pointer" size={20}/>
                 <MessageCircle className="text-white/20 hover:text-primary transition-colors cursor-pointer" size={20}/>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
