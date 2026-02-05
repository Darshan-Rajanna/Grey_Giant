import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import ONLY GeneralGallery images
const imageFiles = import.meta.glob("@assets/gallery/GeneralGallery/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" });

import { siteContent } from "@/data/siteContent";
import { getBackground, resolveAsset } from "@/lib/asset-utils";

export default function Gallery() {
  const { galleryPage } = siteContent;
  
  const photos = useMemo(() => {
    const savedOrder = galleryPage.galleryItems || [];
    // Only consider files in the gallery folders
    const allFiles = Object.keys(imageFiles).filter(f => f.includes('/gallery/'));

    // We don't filter savedOrder against the local glob because new images
    // might exist on GitHub but not in the local build yet.
    const validSavedOrder = [...savedOrder];
    
    // Find files in the folder that haven't been ordered yet
    const remainingFiles = allFiles.filter(path => {
      return !validSavedOrder.some(s => path.endsWith(`/${s}`));
    });

    // Combine them: Manual Order first, then the rest
    const finalDisplayOrder = [...validSavedOrder, ...remainingFiles];

    return finalDisplayOrder.map((pathOrItem, index) => {
      // Find the actual file key for imageFiles
      const fileKey = allFiles.find(f => f.endsWith(`/${pathOrItem}`)) || pathOrItem;
      return {
        src: (imageFiles[fileKey] || resolveAsset(pathOrItem)) as string,
        alt: `Gallery Item ${index + 1}`,
        id: pathOrItem
      };
    });
  }, [galleryPage.galleryItems]);

  const INITIAL_COUNT = 10; 
  const [displayLimit, setDisplayLimit] = useState(INITIAL_COUNT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const bgImg = getBackground(siteContent.backgrounds.gallery);

  const visiblePhotos = photos.slice(0, displayLimit);

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
      {/* Background Overlay */}
      {bgImg && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={bgImg} alt="" className="w-full h-full object-cover opacity-60 grayscale-[0.2]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/40 to-[#020202]" />
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center mb-16 md:mb-28 px-4">
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-10 tracking-tighter leading-[1.1] py-2">
            {galleryPage.title.main} <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic pr-4">{galleryPage.title.accent}</span>
          </h1>
          <p className="text-white/40 max-w-xl font-light italic text-sm md:text-base leading-relaxed font-serif">
            "{galleryPage.description}"
          </p>
        </motion.div>

        {/* The Grid: Items appear in the order defined in galleryItems */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, i) => (
              <motion.div
                key={photo.id} // Using stable path as key
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden cursor-pointer group p-2 bg-black/20 border border-primary/30 shadow-2xl rounded-sm w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-1rem)]"
                onClick={() => setSelectedIndex(i)}
              >
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover rounded-sm transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <Maximize2 className="text-primary w-5 h-5" aria-label="View Large" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More / View Less Controls */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-16 px-4">
          {displayLimit < photos.length && (
            <Button
              onClick={() => setDisplayLimit(prev => prev + INITIAL_COUNT)}
              className="w-full md:w-auto bg-transparent border border-primary/30 text-primary hover:bg-primary hover:text-black px-10 py-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black transition-all"
            >
              <Plus className="mr-2 h-4 w-4" /> View More Masterpieces
            </Button>
          )}
          
          {displayLimit > INITIAL_COUNT && (
            <Button
              onClick={() => setDisplayLimit(prev => Math.max(INITIAL_COUNT, prev - INITIAL_COUNT))}
              className="w-full md:w-auto bg-transparent border border-white/10 text-white/40 hover:text-white px-10 py-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black transition-all"
            >
              <Minus className="mr-2 h-4 w-4" /> View Less
            </Button>
          )}
        </div>
      </div>

      {/* Lightbox remains same but uses 'photos' array */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="max-w-7xl bg-transparent border-none p-0 outline-none shadow-none flex items-center justify-center h-[90vh]">
          {selectedIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20 group">
              <button onClick={handlePrev} className="absolute left-4 z-50 p-4 bg-white/5 rounded-full text-white/40 hover:text-primary transition-all" aria-label="Previous Image">
                <ChevronLeft size={32} />
              </button>
              
              <motion.div key={selectedIndex} className="relative max-w-full max-h-full p-2 bg-black/40 rounded-sm border border-primary/30">
                <img src={photos[selectedIndex].src} alt="" className="max-w-full max-h-[80vh] object-contain" />
              </motion.div>

              <button onClick={handleNext} className="absolute right-4 z-50 p-4 bg-white/5 rounded-full text-white/40 hover:text-primary transition-all" aria-label="Next Image">
                <ChevronRight size={32} />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
