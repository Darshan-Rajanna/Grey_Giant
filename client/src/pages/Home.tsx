import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowRight, Star, X as CloseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { siteContent } from "@/data/siteContent";
import { getFirstImageInDir } from "@/lib/asset-utils";

const heroImg = getFirstImageInDir("Hero");

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hero } = siteContent;

  return (
    <div className="min-h-screen bg-[#020202] overflow-hidden selection:bg-primary/30">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background Noise / Grid */}
        <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

        {/* Dynamic Glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[150px] rounded-full pointer-events-none z-10" />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Luxury Event Background"
            className="w-full h-full object-cover opacity-40 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent" />
        </div>

        <div className="container relative z-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Standardized Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="w-12 h-[1px] bg-primary/20" />
              <span className="text-[12px] uppercase tracking-[0.5em] text-primary/60 font-semibold">
                {hero.eyebrow}
              </span>
              <span className="w-12 h-[1px] bg-primary/20" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
              {hero.title.first} <span className="relative inline-block">
                <span className="inline-block bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic pr-4">{hero.title.second}&nbsp;</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-2xl mx-auto text-base md:text-lg text-white/50 font-light leading-relaxed mb-16 italic font-serif"
            >
              "{hero.description}"
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setShowPopup(false);
              }}>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-12 py-5 bg-gradient-to-r from-primary via-[#f8e4b1] to-primary text-black font-bold uppercase tracking-[0.3em] text-[11px] overflow-hidden group transition-all duration-500 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] rounded-none"
                  >
                    <span className="relative z-10">{hero.ctaPrimary}</span>
                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a]/98 backdrop-blur-3xl border-white/5 text-white p-12 md:p-16 max-w-2xl rounded-[3rem] selection:bg-primary/30 outline-none">
                  <DialogHeader className="flex flex-col items-center text-center">
                    <div className="mx-auto mb-10 p-5 rounded-full bg-primary/5 border border-primary/10 w-fit">
                      <Star className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <DialogTitle className="text-3xl md:text-5xl font-serif mb-10 leading-[1.1] italic text-white font-light text-center">
                      "{hero.dialog.quote.split(',').map((part, i) => (
                        <span key={i}>
                          {i > 0 && ", "}
                          {part.includes("elegance") ? (
                            <>
                              {part.replace("elegance", "")}
                              <span className="text-primary not-italic">elegance</span>
                            </>
                          ) : part}
                        </span>
                      ))}"
                    </DialogTitle>
                    <DialogDescription className="text-[10px] text-primary/40 font-semibold tracking-[0.5em] uppercase mb-10 text-center">
                      {hero.dialog.eyebrow}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={() => {
                        setShowPopup(true);
                        setTimeout(() => {
                          setDialogOpen(false);
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }, 3000);
                      }}
                      className="bg-gradient-to-r from-primary to-[#f8e4b1] text-black hover:bg-white transition-all duration-500 rounded-none px-12 h-16 text-[10px] tracking-[0.3em] font-bold uppercase w-full md:w-auto cursor-pointer"
                    >
                      {hero.dialog.button}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showPopup && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-2xl z-[100] p-6 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 20 }}
                          className="relative max-w-lg w-full p-8 md:p-12 bg-neutral-900/50 border border-primary/10 shadow-[0_0_100px_rgba(212,175,55,0.1)] overflow-hidden"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPopup(false);
                            }}
                            className="absolute top-6 right-6 text-primary/40 hover:text-primary transition-all duration-300 z-[110] cursor-pointer p-2 hover:bg-white/5 rounded-full"
                          >
                            <CloseIcon className="w-6 h-6" />
                          </button>

                          <div className="mb-10 flex justify-center">
                            <div className="w-20 h-20 rounded-full border border-primary/10 flex items-center justify-center bg-primary/5">
                              <Star className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-serif italic text-white leading-tight mb-6">
                            "{hero.redirectPopup.quote.split('&').map((part, i) => (
                              <span key={i}>
                                {i > 0 && <br />}
                                {part.includes("Experience the Difference") ? (
                                  <span className="text-primary not-italic">{part.trim()}</span>
                                ) : part}
                              </span>
                            ))}"
                          </h3>

                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 2.5 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-10"
                          />

                          <div className="flex items-center justify-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                            <p className="text-[10px] uppercase tracking-[0.6em] text-primary/50 font-bold">
                              {hero.redirectPopup.status}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DialogContent>
              </Dialog>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 bg-white/[0.02] backdrop-blur-2xl border border-white/10 text-white/60 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 hover:text-white hover:border-white/20 rounded-none relative overflow-hidden group"
              >
                <span className="relative z-10">{hero.ctaSecondary}</span>
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
