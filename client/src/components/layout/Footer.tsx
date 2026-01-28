import { Instagram, Facebook, MessageCircle, Twitter } from "lucide-react";
import logoImg from "@assets/logo/logo1.jpeg";
import { siteContent } from "@/data/siteContent";

export function Footer() {
  const { contact, hero } = siteContent;
  return (
    <footer className="bg-neutral-900 pt-20 pb-6 border-t border-white/5">
      <div className="container mx-auto px-6 text-center flex flex-col items-center">
        <img src={logoImg} alt="Grey Giant Logo" className="w-12 h-12 object-contain mb-6 opacity-80" />
        <h2 className="text-2xl font-serif text-white mb-4">GREY GIANT</h2>
        <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Vision Meets Excellence</p>
        <p className="text-white/20 text-[10px] max-w-lg mb-8 italic">"{hero.description}"</p>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 text-[10px] tracking-[0.2em] text-white/40 uppercase">
          <span>{contact.address}</span>
          <span className="hidden md:inline">•</span>
          <span>{contact.email}</span>
          <span className="hidden md:inline">•</span>
          <span>+{contact.whatsapp}</span>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-8 mb-10">
          <a href={siteContent.socials.instagram} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors hover:scale-110 duration-300">
            <Instagram className="w-5 h-5" />
          </a>
          <a href={siteContent.socials.facebook} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors hover:scale-110 duration-300">
            <Facebook className="w-5 h-5" />
          </a>
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors hover:scale-110 duration-300">
            <MessageCircle className="w-5 h-5" />
          </a>
          <a href={siteContent.socials.linkedin} target="_blank" rel="noreferrer" className="text-white/40 hover:text-primary transition-colors hover:scale-110 duration-300">
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        <p className="text-white/20 text-[8px] uppercase tracking-widest">© 2026 The Gowtrix Hub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
