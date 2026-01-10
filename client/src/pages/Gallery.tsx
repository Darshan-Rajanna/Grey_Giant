import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

import image1 from "@assets/image_1768032128663.png";
import image2 from "@assets/image_1768032149552.png";
import image3 from "@assets/image_1768032161591.png";
import image4 from "@assets/image_1768032170619.png";
import image5 from "@assets/image_1768032178787.png";

const photos = [
  { src: image1, alt: "Engagement Welcome Sign" },
  { src: image2, alt: "Ice Tropical Thrill Entrance" },
  { src: image3, alt: "Retirement Farewell Decor" },
  { src: image4, alt: "Event Launch Stage" },
  { src: image5, alt: "Elegant Floral Centerpiece" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60", alt: "Corporate Gala" }
];

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Our Portfolio</h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            A glimpse into the moments of distinction we've crafted for our clients.
          </p>
        </motion.div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden border border-white/10 rounded-sm"
              onClick={() => setSelectedPhoto(photo.src)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 z-10 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm tracking-widest uppercase font-light">
                  View Project
                </span>
              </div>
              <img 
                src={photo.src} 
                alt={photo.alt} 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl bg-black/95 border-white/10 p-0 overflow-hidden outline-none">
          <div className="relative flex items-center justify-center">
            <button 
              onClick={() => setSelectedPhoto(null)} 
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full text-white transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedPhoto && (
              <img 
                src={selectedPhoto} 
                alt="Portfolio view" 
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
