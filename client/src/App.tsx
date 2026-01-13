import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { Link, useLocation } from "wouter";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import WelcomePopup from "@/components/WelcomePopup";
import logoImg from "@assets/logo/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/95 backdrop-blur-md py-4 border-b border-primary/20" : "bg-transparent py-6"}`}>
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

function MainLayout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-black">
      <Navbar />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white z-[60] origin-left" style={{ scaleX }} />
      <div id="home"><Home /></div>
      <div id="about"><AboutSection /></div>
      <div id="services"><ServicesSection /></div>
      <div id="story"><DistinctionSection /></div>
      <div id="values"><ValuesSection /></div>
      <div id="gallery"><GallerySection /></div>
      <div id="reviews"><ReviewsSection /></div>
      <div id="contact"><ContactSection /></div>
      <Footer />
    </div>
  );
}

// Wrapper components to remove their internal padding/min-h-screen where needed for single page flow
import About from "@/pages/About";
import Distinction from "@/components/sections/Distinction";
import Values from "@/components/sections/Values";
import Services from "@/pages/Services";
import Gallery from "@/pages/Gallery";
import Reviews from "@/pages/Reviews";
import Contact from "@/pages/Contact";

function AboutSection() { return <div className="py-20"><About /></div>; }
function DistinctionSection() { return <div id="story"><Distinction /></div>; }
function ValuesSection() { return <div id="values"><Values /></div>; }
function ServicesSection() { return <div className="py-20"><Services /></div>; }
function GallerySection() { return <div className="py-20"><Gallery /></div>; }
function ReviewsSection() { return <div className="py-20"><Reviews /></div>; }
function ContactSection() { return <div className="py-20"><Contact /></div>; }

function Footer() {
  return (
    <footer className="bg-neutral-900 py-20 border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-serif text-white mb-4">GREY GIANT</h2>
        <p className="text-white/40 text-sm tracking-widest uppercase mb-8">Vision Meets Excellence</p>
        <p className="text-white/20 text-xs">© 2026 Grey Giant Events & Services. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLayout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WelcomePopup />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
