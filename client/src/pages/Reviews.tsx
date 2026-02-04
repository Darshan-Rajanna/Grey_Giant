import { useState } from "react";
import { Star, Quote, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { getBackground } from "@/lib/asset-utils";


export default function Reviews() {
  const { reviewsPage, reviewItems } = siteContent;
  const bgImg = getBackground(siteContent.backgrounds.reviews);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Split into 2 rows for the marquee
  const threshold = 6;
  const shouldAnimate = reviewItems.length > threshold;
  const half = Math.ceil(reviewItems.length / 2);
  const row1 = reviewItems.slice(0, half);
  const row2 = reviewItems.slice(half);

  return (
    <div className="pt-20 min-h-screen bg-[#020202] relative overflow-hidden selection:bg-primary/30">
      {/* Background Image with Overlay */}
      {bgImg && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={bgImg}
            alt=""
            className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/40 to-[#020202]" />
        </div>
      )}

      {/* Abstract Background Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Dynamic Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="w-12 h-[1px] bg-primary/20" />
              <span className="text-[11px] uppercase tracking-[0.6em] text-primary/60 font-bold">
                {reviewsPage.eyebrow}
              </span>
              <span className="w-12 h-[1px] bg-primary/20" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 tracking-tighter leading-[1.1] py-2">
              {reviewsPage.title.main} <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic pr-4">{reviewsPage.title.accent}</span>
            </h1>
            <p className="text-white/40 max-w-xl font-light italic text-sm md:text-base leading-relaxed font-serif">
              "{reviewsPage.description}"
            </p>
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Edge Masks */}
          {shouldAnimate && (
            <>
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-20 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-20 pointer-events-none" />
            </>
          )}

          <div className="space-y-8 flex flex-col items-center">
            {/* Row 1 */}
            <MarqueeRow
              items={row1}
              animate={shouldAnimate}
              isPaused={isPaused || !!selectedReview}
              onCardClick={setSelectedReview}
            />
            {/* Row 2 */}
            <MarqueeRow
              items={row2}
              reverse
              animate={shouldAnimate}
              isPaused={isPaused || !!selectedReview}
              onCardClick={setSelectedReview}
            />
          </div>
        </div>
      </div>

      {/* Expanded Review Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              layoutId={`review-${selectedReview.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                aria-label="Close review"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center space-y-10">
                <Quote className="w-12 h-12 text-primary/40" />

                <div className="flex justify-center items-center gap-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-6 h-6 ${idx < selectedReview.rating ? "text-primary fill-primary" : "text-white/5"}`}
                    />
                  ))}
                </div>

                <blockquote className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed">
                  "{selectedReview.comment}"
                </blockquote>

                <div className="pt-10 border-t border-white/5 w-full">
                  <h3 className="text-2xl font-serif text-primary/60">{selectedReview.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black mt-2">Verified Testimonial</p>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MarqueeRow = ({ items, reverse = false, animate = true, isPaused, onCardClick }: any) => {
  const content = [...items, ...(animate ? items : [])];

  return (
    <div className={`flex w-full ${animate ? 'px-4 overflow-hidden' : 'px-6 justify-center'}`}>
      <motion.div
        className={`flex gap-8 py-4 ${animate ? 'shrink-0' : 'flex-wrap justify-center'}`}
        animate={animate && !isPaused ? {
          x: reverse ? ["-100%", "0%"] : ["0%", "-100%"]
        } : {}}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ x: !animate ? "0" : undefined }}
      >
        {content.map((testimonial, idx) => (
          <ReviewCard
            key={`${testimonial.id}-${idx}`}
            testimonial={testimonial}
            onClick={() => onCardClick(testimonial)}
          />
        ))}
      </motion.div>
    </div>
  );
};

const ReviewCard = ({ testimonial, onClick }: any) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="group/card relative p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col transition-all duration-500 w-[350px] md:w-[430px] shrink-0 cursor-pointer"
    >
      {/* Top Row: Quote (Left) & Stars (Center) */}
      <div className="relative mb-6 h-6 flex items-center justify-center">
        <Quote className="absolute left-0 top-0 w-5 h-5 text-primary/40" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${idx < testimonial.rating ? "text-primary fill-primary" : "text-white/5"}`}
            />
          ))}
        </div>
      </div>

      {/* Comment Content (Left Aligned) */}
      <div className="flex-grow flex flex-col justify-center text-left">
        <blockquote className="text-[15px] text-white/70 italic leading-relaxed font-serif line-clamp-4">
          "{testimonial.comment}"
        </blockquote>
      </div>

      {/* Footer Row (Name Right Aligned) */}
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
        <h3 className="text-sm font-serif text-white/50">{testimonial.name}</h3>
      </div>

      {/* Glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};
