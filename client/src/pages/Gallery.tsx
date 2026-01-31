import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import all portfolio images from the gallery folder
const imageFiles = import.meta.glob("@assets/gallery/**/*.{png,jpg,jpeg}", { eager: true, import: "default" });

const photos = Object.keys(imageFiles)
  .sort()
  .map((path, index) => ({
    src: imageFiles[path] as string,
    alt: `Portfolio Event ${index + 1}`,
  }));

import { siteContent } from "@/data/siteContent";
import { getBackground } from "@/lib/asset-utils";

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [displayRows, setDisplayRows] = useState(2);
  const { galleryPage } = siteContent;
  const bgImg = getBackground(siteContent.backgrounds.gallery);
  const cols = 5;
  const visibleCount = displayRows * cols;
  const visiblePhotos = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white py-12 md:py-20 selection:bg-primary/30 relative overflow-hidden">
      {/* Background Image with Overlay */}
      {bgImg && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={bgImg}
            alt=""
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/50 to-[#020202]" />
        </div>
      )}

      {/* Abstract Background Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-16 md:mb-28 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8 md:mb-10"
          >
            <span className="w-12 h-[1px] bg-primary/20" />
            <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
              {galleryPage.eyebrow}
            </span>
            <span className="w-12 h-[1px] bg-primary/20" />
          </motion.div>

          <h1 className="text-5xl md:text-8xl lg:text-8xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
            {galleryPage.title.main} <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">{galleryPage.title.accent}</span>
          </h1>
          <p className="text-white/40 max-w-xl font-light italic text-sm md:text-base leading-relaxed font-serif">
            "{galleryPage.description}"
          </p>
        </motion.div>

        {/* Dynamic Centered Flex Grid (5-Cols Look) */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: (i % visibleCount) * 0.05 }}
                className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden cursor-pointer group p-2 bg-black/20 border border-primary/30 shadow-2xl rounded-sm w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-1rem)]"
                onClick={() => setSelectedIndex(i)}
              >
                {/* Image */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover rounded-sm transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="p-3 bg-primary/10 rounded-full border border-primary/20 scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Maximize2 className="text-primary w-5 h-5" />
                  </div>
                </div>

                {/* Glow Border */}
                <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/40 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More / Less Controls */}
        <div className="flex justify-center mt-20 gap-6">
          {hasMore && (
            <Button
              variant="outline"
              onClick={() => setDisplayRows(prev => prev + 2)}
              className="bg-white/5 border-white/10 text-white/60 hover:text-primary hover:border-primary/40 hover:bg-primary/5 rounded-full px-10 h-14 text-sm tracking-[0.2em] uppercase font-medium transition-all group"
            >
              <Plus size={16} className="mr-3 group-hover:rotate-90 transition-transform duration-500" />
              {galleryPage.viewMore}
            </Button>
          )}

          {displayRows > 2 && (
            <Button
              variant="outline"
              onClick={() => setDisplayRows(2)}
              className="bg-white/5 border-white/10 text-white/40 hover:text-white/70 rounded-full px-10 h-14 text-sm tracking-[0.2em] uppercase font-medium transition-all group"
            >
              <Minus size={16} className="mr-3 group-hover:scale-125 transition-transform duration-500" />
              {galleryPage.viewLess}
            </Button>
          )}
        </div>
      </div>

      {/* Simplified Lightbox */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-7xl bg-transparent border-none p-0 outline-none shadow-none flex items-center justify-center overflow-hidden h-[90vh]">
          {selectedIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20 group">
              {/* Main Image Container with Gold Frame */}
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-full max-h-full flex items-center justify-center p-2 bg-black/40 backdrop-blur-3xl rounded-sm border border-primary/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
              >
                <img
                  src={photos[selectedIndex].src}
                  alt={photos[selectedIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-sm"
                />

                {/* Subtle Label */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[10px] tracking-[0.2em] uppercase text-white/40 italic">
                  {selectedIndex + 1} / {photos.length}
                </div>
              </motion.div>

              {/* Navigation Buttons on Sides */}
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 p-4 md:p-6 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-full text-white/40 hover:text-primary transition-all backdrop-blur-xl shadow-2xl active:scale-90"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 p-4 md:p-6 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-full text-white/40 hover:text-primary transition-all backdrop-blur-xl shadow-2xl active:scale-90"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
