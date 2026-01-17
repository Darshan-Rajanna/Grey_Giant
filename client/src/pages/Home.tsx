import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import heroImg from "@assets/gallery/luxury_corporate_eve_632147c4.jpg";

export default function Home() {
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
                Premium Event Management
              </span>
              <span className="w-12 h-[1px] bg-primary/20" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
              GREY <span className="relative inline-block">
                <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">GIANT</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-2xl mx-auto text-base md:text-lg text-white/50 font-light leading-relaxed mb-16 italic font-serif"
            >
              "Specializing in luxury corporate events, bespoke weddings, and exclusive gatherings. Where vision meets excellence."
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-12 py-5 bg-gradient-to-r from-primary via-[#f8e4b1] to-primary text-black font-bold uppercase tracking-[0.3em] text-[11px] overflow-hidden group transition-all duration-500 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] rounded-none"
                  >
                    <span className="relative z-10">Get a Quote</span>
                    <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a]/98 backdrop-blur-3xl border-white/5 text-white p-12 md:p-16 text-center max-w-2xl rounded-[3rem] selection:bg-primary/30 outline-none">
                  <DialogHeader>
                    <div className="mx-auto mb-10 p-5 rounded-full bg-primary/5 border border-primary/10 w-fit">
                      <Star className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <DialogTitle className="text-3xl md:text-5xl font-serif mb-10 leading-[1.1] italic text-white font-light">
                      "We don’t just plan events, we create memories wrapped in <span className="text-primary not-italic">elegance</span>."
                    </DialogTitle>
                    <DialogDescription className="text-[10px] text-primary/40 font-semibold tracking-[0.5em] uppercase mb-10">
                      Every occasion, a signature of distinction.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <Button asChild className="bg-gradient-to-r from-primary to-[#f8e4b1] text-black hover:bg-white transition-all duration-500 rounded-none px-12 h-16 text-[10px] tracking-[0.3em] font-bold uppercase w-full md:w-auto">
                      <Link href="/contact">Define Your Celebration</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 bg-white/[0.02] backdrop-blur-2xl border border-white/10 text-white/60 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 hover:text-white hover:border-white/20 rounded-none relative overflow-hidden group"
              >
                <span className="relative z-10">View Crafted Offerings</span>
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
