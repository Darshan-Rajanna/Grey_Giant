import { Instagram, MessageCircle, Twitter } from "lucide-react";
import logoImg from "@assets/logo/logo1.jpeg";
import { siteContent } from "@/data/siteContent";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const SidebarBubbles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => {
        const isLeft = i < 10;
        const isGold = Math.random() > 0.4;
        const size = Math.random() * 6 + 3;
        const duration = Math.random() * 15 + 10;
        const initialOpacity = Math.random() * 0.3 + 0.1;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{
              left: isLeft ? `${Math.random() * 15}%` : `${85 + Math.random() * 15}%`,
              top: `${100 + Math.random() * 20}%`,
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: -800,
              opacity: [0, initialOpacity, initialOpacity, 0],
              x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: -Math.random() * duration
            }}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: isGold ? 'radial-gradient(circle at 30% 30%, #f8e4b1, #d4af37)' : 'radial-gradient(circle at 30% 30%, #ffffff, #f1f1f1)',
              boxShadow: isGold ? `0 0 ${size}px rgba(212, 175, 55, 0.4)` : `0 0 ${size}px rgba(255, 255, 255, 0.3)`,
              filter: 'blur(0.5px)',
            }}
          />
        );
      })}
    </div>
  );
};

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
    <footer className="relative bg-[#020202] py-8 md:py-10 border-t border-white/5 overflow-hidden">
      <SidebarBubbles />
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-10 md:space-y-12">

          {/* Brand Identity */}
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150"></div>
                <img
                  src={logoImg}
                  alt="Grey Giant Logo"
                  className="relative w-16 h-16 object-contain rounded-2xl border border-white/10 transition-transform duration-700 group-hover:scale-110 group-hover:border-primary/30 shadow-2xl"
                />
              </div>
              <div className="flex flex-col items-center leading-none transition-transform duration-700">
                <h2 className="text-3xl font-serif tracking-tight uppercase" style={{ color: '#f8e4b1' }}>
                  Grey Giant
                </h2>
                <p className="text-[10px] uppercase tracking-[0.5em] mt-3 font-bold" style={{ color: '#B8860B' }}>
                  Vision Meets Excellence
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              {[
                { icon: <Instagram size={20} />, href: socials.instagram, label: "Instagram" },
                { icon: <Twitter size={20} />, href: (socials as any).twitter, label: "Twitter" },
                {
                  icon: <MessageCircle size={20} />,
                  href: `https://wa.me/${socials.whatsapp}`,
                  label: "WhatsApp"
                }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/5 rounded-2xl text-primary/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-white/5 w-full max-w-2xl flex flex-col items-center gap-4">
            <p className="text-[9px] uppercase tracking-[0.6em] text-white/20 font-bold">
              © 2026 Developed with Precision by <a href="https://github.com/the-gowda-s-hub/" target="_blank" rel="noreferrer" className="text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all duration-500">Gowtrix Hub</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
