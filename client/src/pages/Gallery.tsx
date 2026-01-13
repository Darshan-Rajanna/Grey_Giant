import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import all images from the gallery folder
const imageFiles = import.meta.glob("@assets/gallery/*.{png,jpg,jpeg}", { eager: true, import: "default" });

// Sort filenames to maintain consistent order and map to photos array
const photos = Object.keys(imageFiles)
  .sort()
  .map((path, index) => ({
    src: imageFiles[path] as string,
    alt: `Portfolio Event ${index + 1}`,
  }));

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">
            Our <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            A glimpse into the moments of distinction we've crafted for our
            clients.
          </p>
        </motion.div>

        {/* Custom Grid Layout */}
        <div className="grid grid-cols-3 grid-rows-[300px_160px] gap-4">
          {/* Top row: 111 */}

          {[0, 1, 2].map((i) => (
            photos[i] && (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group cursor-pointer overflow-hidden premium-border"
                onClick={() => setSelectedIndex(i)}
              >
                <div className="premium-border-inner h-[300px]">
                  <img
                    src={photos[i].src}
                    alt={photos[i].alt}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            )
          ))}

          {/* Bottom row: 1 0 1 */}
          {photos[3] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer overflow-hidden premium-border"
              onClick={() => setSelectedIndex(3)}
            >
              <div className="premium-border-inner h-[160px]">
                <img
                  src={photos[3].src}
                  alt={photos[3].alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          )}

          {/* Small view image at center */}
          {/* ---------- BOTTOM CENTER – BUTTON ---------- */}
          <div className="flex items-center justify-center h-[160px]">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSelectedIndex(0)}
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-none px-8 h-12 text-base tracking-wide font-bold cursor-pointer"
            >
              View More
            </Button>
          </div>

          {photos[4] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer overflow-hidden premium-border"
              onClick={() => setSelectedIndex(4)}
            >
              <div className="premium-border-inner h-[160px]">
                <img
                  src={photos[4].src}
                  alt={photos[4].alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-[100vw] w-full md:max-w-6xl lg:max-w-7xl bg-black/98 border-white/5 p-0 overflow-y-auto no-scrollbar max-h-[98vh] outline-none overflow-x-hidden">
          {/* Main Lightbox Content wrapper - strictly constrained to viewport */}
          <div className="relative w-full max-w-full flex flex-col items-center justify-between p-4 md:p-8 space-y-6 md:space-y-8 overflow-x-hidden no-scrollbar">
            {selectedIndex !== null && (
              <>
                {/* Large Image Viewport: Constrained and Centered */}
                <div 
                  className="relative w-full max-w-full flex-1 flex flex-col items-center justify-center group/main cursor-pointer min-h-[45vh] md:min-h-[65vh] select-none no-scrollbar"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
                  }}
                >
                  {/* Navigation Arrows: Inside visible bounds */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-4 z-50 pointer-events-none no-scrollbar">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
                      }}
                      className="p-3 md:p-4 bg-black/60 hover:bg-primary hover:text-black rounded-full text-white transition-all duration-300 opacity-0 group-hover/main:opacity-100 shadow-xl border border-white/10 pointer-events-auto backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
                      }}
                      className="p-3 md:p-4 bg-black/60 hover:bg-primary hover:text-black rounded-full text-white transition-all duration-300 opacity-0 group-hover/main:opacity-100 shadow-xl border border-white/10 pointer-events-auto backdrop-blur-sm"
                    >
                      <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                  </div>

                  {/* Main Image: Consistent containment and centering */}
                  <div className="w-full max-w-full h-full max-h-[60vh] md:max-h-[70vh] flex items-center justify-center overflow-visible no-scrollbar">
                    <img
                      src={photos[selectedIndex].src}
                      alt={photos[selectedIndex].alt}
                      className="max-w-full max-h-full object-contain shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out"
                    />
                  </div>
                </div>

                {/* Thumbnails Navigation: Properly constrained scrolling */}
                <div className="w-full max-w-full pt-6 border-t border-white/5">
                  <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar px-4 py-4 justify-start md:justify-center scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent no-scrollbar w-full scroll-smooth">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        id={`thumb-${idx}`}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative w-20 h-14 md:w-28 md:h-20 flex-shrink-0 cursor-pointer overflow-hidden border-2 transition-all duration-500 rounded-sm group/thumb ${
                          selectedIndex === idx
                            ? "border-primary scale-110 z-10 shadow-lg shadow-primary/30 opacity-100"
                            : "border-white/5 opacity-40 hover:opacity-100 hover:border-white/20"
                        }`}
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
