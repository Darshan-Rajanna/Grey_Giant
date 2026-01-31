import { motion } from "framer-motion";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] text-white overflow-hidden p-6 relative">
      {/* Subtle Grain/Dot Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center space-y-8"
      >
        <div className="space-y-2">
          <motion.h1 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-9xl md:text-[12rem] font-serif italic text-white/5 leading-none select-none"
          >
            404
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-serif italic text-primary/80 tracking-widest mt-[-2rem] md:mt-[-4rem]"
          >
            NOT FOUND
          </motion.h2>
        </div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="pt-12"
        >
          <Link href={import.meta.env.BASE_URL} className="group relative text-[10px] uppercase tracking-[0.6em] text-white/40 hover:text-primary transition-colors duration-500">
            <span className="relative z-10">Return to Excellence</span>
            <div className="absolute -bottom-2 left-0 w-0 h-px bg-primary/40 group-hover:w-full transition-all duration-700" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
