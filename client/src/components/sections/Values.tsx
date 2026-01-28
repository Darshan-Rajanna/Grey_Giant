import { motion, useMotionValue, animate, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, MoveRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";

// --- Helper Components ---

interface ValueItem {
    title: string;
    desc: string;
}

const GlassCard = ({ item }: { item: ValueItem }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-[380px] h-[260px] flex-shrink-0 p-10 backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] relative group/card overflow-hidden flex flex-col justify-center transition-colors duration-500 hover:bg-white/[0.05]"
        >
            {/* Animated Neon Border */}
            <div className="absolute inset-0 rounded-[2.5rem] p-[1px] bg-gradient-to-br from-primary/40 via-transparent to-primary/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-0 rounded-[2.5rem] opacity-20 group-hover/card:opacity-40 transition-opacity pointer-events-none border border-white/5" />
            
            <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
                <div className="text-primary/40 mb-4 group-hover/card:text-primary transition-colors duration-500">
                    <Sparkles size={20} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4 tracking-tight group-hover/card:text-primary transition-colors duration-500">
                    {item.title}
                </h3>
                <p className="text-white/40 group-hover/card:text-white/70 transition-colors duration-500 font-light leading-relaxed text-base italic">
                    "{item.desc}"
                </p>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Bottom Accent */}
            <div className="absolute bottom-6 right-10 opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-x-4 group-hover/card:translate-x-0">
                <MoveRight size={16} className="text-primary" />
            </div>
        </motion.div>
    );
};

export default function Values() {
    const { values: valuesContent } = siteContent;
    const duplicatedValues = [...valuesContent.items, ...valuesContent.items, ...valuesContent.items]; // Triple for buffer
    const x = useMotionValue(0);
    const [isPaused, setIsPaused] = useState(false);
    const scrollAnimationRef = useRef<any>(null);
    
    // Function to start the continuous scroll
    const startInfiniteScroll = useCallback((startingX?: number) => {
        if (scrollAnimationRef.current) scrollAnimationRef.current.stop();
        
        const currentX = startingX !== undefined ? startingX : x.get();
        
        scrollAnimationRef.current = animate(x, [currentX, currentX - 2000], {
            duration: 40,
            ease: "linear",
            repeat: Infinity,
            onUpdate: (latest) => {
                if (latest <= -2000) {
                    x.set(latest + 2000);
                }
            }
        });
    }, [x]);

    useEffect(() => {
        if (!isPaused) {
            startInfiniteScroll();
        } else {
            scrollAnimationRef.current?.stop();
        }

        return () => scrollAnimationRef.current?.stop();
    }, [isPaused, startInfiniteScroll]);

    const handleNudge = useCallback((direction: "left" | "right") => {
        if (scrollAnimationRef.current) scrollAnimationRef.current.stop();
        
        const nudgeAmount = 412; // Card width (380) + Gap (32)
        const targetX = direction === "left" ? x.get() + nudgeAmount : x.get() - nudgeAmount;
        
        animate(x, targetX, {
            type: "spring",
            stiffness: 150,
            damping: 25,
            onComplete: () => {
                if (!isPaused) startInfiniteScroll(targetX);
            }
        });
    }, [x, isPaused, startInfiniteScroll]);

    return (
        <section className="py-32 bg-[#020202] overflow-hidden relative border-t border-white/5 selection:bg-primary/30">
            {/* Abstract Background Noise / Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

            {/* Powerful Dynamic Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Master Title Design */}
                <div className="flex flex-col items-center mb-28 text-center px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-10"
                    >
                        <span className="w-12 h-[1px] bg-primary/20" />
                        <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
                            {valuesContent.eyebrow}
                        </span>
                        <span className="w-12 h-[1px] bg-primary/20" />
                    </motion.div>
                    
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
                        {valuesContent.title.main} <span className="relative inline-block">
                             <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">{valuesContent.title.accent}</span>
                        </span>
                    </h2>
                </div>

                <div className="relative group/carousel">
                    {/* Far-Side Navigation Buttons */}
                    <motion.button 
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleNudge("left")}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-50 p-5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all backdrop-blur-xl shadow-2xl"
                    >
                        <ChevronLeft size={28} />
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleNudge("right")}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 p-5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all backdrop-blur-xl shadow-2xl"
                    >
                        <ChevronRight size={28} />
                    </motion.button>

                    {/* Integrated Gradient Masks */}
                    <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#020202] via-[#020202]/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#020202] via-[#020202]/80 to-transparent z-20 pointer-events-none" />

                    <div className="overflow-hidden">
                        <motion.div
                            style={{ x }}
                            onHoverStart={() => setIsPaused(true)}
                            onHoverEnd={() => setIsPaused(false)}
                            className="flex gap-8"
                        >
                            {duplicatedValues.map((item: ValueItem, i: number) => (
                                <GlassCard key={i} item={item} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
