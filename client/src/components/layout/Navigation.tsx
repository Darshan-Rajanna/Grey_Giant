import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled ? "bg-black/95 backdrop-blur-md py-4 border-b border-primary/20" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => scrollToSection('home')} className="flex items-center gap-3 group">
          <img src={logoImg} alt="Grey Giant Logo" className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-110" />
          <span className="text-xl font-serif font-bold text-primary tracking-widest hidden sm:inline-block">
            GREY GIANT
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors font-bold"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-6 md:hidden"
        >
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-sm uppercase tracking-widest text-white/70 hover:text-white text-left font-bold"
            >
              {item.name}
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
