import { Instagram, Facebook, MessageCircle, Twitter, ArrowUpRight, Mail, MapPin, Phone, Linkedin } from "lucide-react";
import logoImg from "@assets/logo/logo1.jpeg";
import { siteContent } from "@/data/siteContent";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export function Footer() {
  const { contact, hero, socials } = siteContent;
  const [location] = useLocation();
  
  if (location.startsWith('/services/')) {
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#020202] pt-20 md:pt-32 pb-10 md:pb-12 border-t border-white/5 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-20 mb-16 md:mb-32">
          
          {/* Brand Identity */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8 md:space-y-10">
            <div className="flex items-center gap-5">
              <div className="relative group text-left">
                 <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <img src={logoImg} alt="Logo" className="relative w-16 h-16 object-contain rounded-2xl border border-white/10" />
              </div>
              <div className="flex flex-col items-start leading-none">
                 <h2 className="text-3xl font-serif italic tracking-tighter">
                   <span className="text-white">Grey</span> <span className="text-primary">Giant</span>
                 </h2>
              </div>
            </div>
            
            <p className="text-white/40 text-[13px] leading-relaxed max-w-md font-medium">
              We believe in the power of the moment. At Grey Giant, we combine unyielding precision with an artistic soul to craft celebrations that resonate long after the music stops.
            </p>

            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18}/>, href: socials.instagram },
                { icon: <Facebook size={18}/>, href: socials.facebook },
                { icon: <Linkedin size={18}/>, href: socials.linkedin },
                { icon: <Twitter size={18}/>, href: (socials as any).twitter }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-6 xl:col-span-3 md:pt-14 space-y-6 md:space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20">Site Navigation</h4>
            <div className="grid grid-cols-1 gap-4">
              {['Home', 'About', 'Services', 'Gallery', 'Reviews'].map((link) => (
                <button 
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary/60 hover:text-primary transition-colors group w-fit"
                >
                  {link} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all"/>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-6 xl:col-span-4 md:pt-14 space-y-6 md:space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20">Get In Touch</h4>
            <div className="space-y-6">
              <div className="flex gap-5">
                 <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/5 text-primary/60 flex-shrink-0">
                    <MapPin size={16}/>
                 </div>
                 <p className="text-[11px] text-primary/60 uppercase tracking-widest leading-loose pt-1">{contact.address}</p>
              </div>
              <div className="flex gap-5">
                 <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/5 text-primary/60 flex-shrink-0">
                    <Mail size={16}/>
                 </div>
                 <p className="text-[11px] text-primary/60 uppercase tracking-widest leading-loose pt-2">{contact.email}</p>
              </div>
              <div className="flex gap-5">
                 <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/5 text-primary/60 flex-shrink-0">
                    <Phone size={16}/>
                 </div>
                 <p className="text-[11px] text-primary/60 uppercase tracking-widest leading-loose pt-2">+{contact.whatsapp}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">
            © 2026 Developed with Precision by <a href="https://github.com/the-gowda-s-hub/" target="_blank" rel="noreferrer" className="text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 animate-pulse ml-2 inline-block hover:bg-primary/20 transition-all">Gowtrix Hub</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
