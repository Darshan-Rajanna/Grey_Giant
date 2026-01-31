import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { getImagesFromDir } from "@/lib/asset-utils";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ServiceDetails() {
    const [, params] = useRoute("/services/:id");
    const service = siteContent.services.find((s) => s.id === params?.id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!service) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-serif mb-4">Service Not Found</h1>
                    <Button onClick={() => window.location.href = '/'} className="bg-primary text-black rounded-none">
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    // Handle navigation to sections on home page
    const navigateToSection = (sectionId: string) => {
        window.location.href = `/#${sectionId}`;
    };

    return (
        <div className="relative min-h-screen bg-[#020202] pt-32 pb-10 overflow-hidden selection:bg-primary/30">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={service.image.includes("/") ? `/src/assets/gallery/${service.image}` : getImagesFromDir(service.id)[0] || service.image}
                    alt=""
                    className="w-full h-full object-cover opacity-45 grayscale-[0.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 mb-10"
                    >
                        <span className="w-12 h-[1px] bg-primary/20" />
                        <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
                            The Offering
                        </span>
                        <span className="w-12 h-[1px] bg-primary/20" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-10 tracking-tight leading-tight">
                        {service.title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">
                            {service.title.split(' ').slice(-1)}
                        </span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto font-light italic text-base md:text-lg leading-relaxed font-serif">
                        "{service.desc}"
                    </p>
                </motion.div>

                {/* Details Section: Vertical Stack */}
                {service.details && (
                    <div className="space-y-24">
                        {service.details.map((detail, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.8 }}
                                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                            >
                                {/* Detail Image with Gold Frame */}
                                <div className="w-full lg:w-3/5 aspect-[16/9] overflow-hidden p-2 bg-black/20 border border-primary/30 group rounded-sm shadow-2xl flex items-center justify-center relative">
                                    <img
                                        src={detail.image.includes("/") ? `/src/assets/gallery/${detail.image}` : getImagesFromDir(service.id)[idx] || detail.image}
                                        alt={detail.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 rounded-sm"
                                    />
                                    <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                                </div>

                                {/* Detail Text */}
                                <div className="w-full lg:w-2/5 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-primary font-serif italic text-2xl">0{idx + 1}</span>
                                        <div className="h-[1px] flex-grow bg-primary/20" />
                                    </div>
                                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-tight">
                                        {detail.title}
                                    </h4>
                                    <p className="text-white/50 font-light leading-relaxed text-base md:text-lg">
                                        {detail.description}
                                    </p>
                                    <Button
                                        onClick={() => navigateToSection('contact')}
                                        variant="outline"
                                        className="border-primary/20 text-primary hover:bg-primary hover:text-black rounded-none uppercase tracking-[0.2em] text-[10px] h-12 px-8 transition-all duration-500"
                                    >
                                        {detail.buttonText}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center pt-20"
                        >
                            <Button
                                onClick={() => navigateToSection('contact')}
                                className="bg-gradient-to-r from-primary via-[#f8e4b1] to-primary text-black font-bold uppercase tracking-[0.3em] text-[11px] h-16 px-16 rounded-none hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all duration-500"
                            >
                                Plan Event
                            </Button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
