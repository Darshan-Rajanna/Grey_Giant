import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Gallery from "@/pages/Gallery";
import Reviews from "@/pages/Reviews";
import Contact from "@/pages/Contact";
import ServiceDetails from "@/pages/ServiceDetails";
import Distinction from "@/components/sections/Distinction";
import Values from "@/components/sections/Values";
import WelcomePopup from "@/components/modals/WelcomePopup";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import Admin from "@/pages/Admin";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";

function MainContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white z-[60] origin-left" style={{ scaleX }} />
      <div id="home"><Home /></div>
      <div id="about"><About /></div>
      <div id="story"><Distinction /></div>
      <div id="values"><Values /></div>
      <div id="services"><Services /></div>
      <div id="gallery"><Gallery /></div>
      <div id="reviews"><Reviews /></div>
      <div id="contact"><Contact /></div>
    </>
  );
}

function Router() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={MainContent} />
          <Route path="/admin" component={Admin} />
          <Route path="/services/:id" component={ServiceDetails} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
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
