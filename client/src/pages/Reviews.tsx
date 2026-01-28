import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

const reviews = [
  {
    id: 1,
    name: "Priya S.",
    rating: 5,
    comment: "Absolutely stunning execution for our corporate gala. The black and gold theme was perfection."
  },
  {
    id: 2,
    name: "Rahul M.",
    rating: 5,
    comment: "Grey Giant made our wedding day unforgettable. Seamless coordination and beautiful decor."
  },
  {
    id: 3,
    name: "Anjali K.",
    rating: 5,
    comment: "Very professional team. They handled our social gathering with great attention to detail."
  },
  {
    id: 4,
    name: "Vikram R. (Product Launch)",
    rating: 5,
    comment: "Their product launch management was exceptional. Every detail was handled with precision and flair."
  },
  {
    id: 5,
    name: "Sneha D. (Anniversary)",
    rating: 5,
    comment: "Celebrating our 25th anniversary with Grey Giant was the best decision. A truly magical experience for our family."
  }
];

export default function Reviews() {
  const { reviewsPage } = siteContent;
  
  return (
    <div className="pt-20 min-h-screen bg-[#020202] relative overflow-hidden selection:bg-primary/30">
      {/* Abstract Background Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Dynamic Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col items-center mb-32 text-center px-4">
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
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
            {reviewsPage.title.main} <br />
            <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">{reviewsPage.title.accent}</span>
          </h1>
          <p className="text-white/40 max-w-xl font-light italic text-sm md:text-base leading-relaxed font-serif">
            "{reviewsPage.description}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1300px] mx-auto px-4 justify-center">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="group/card relative p-10 bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-700 hover:bg-white/[0.05] hover:border-primary/40 hover:-translate-y-2"
            >
              {/* Top Row: Quote (Left) & Stars (Center) */}
              <div className="relative mb-10 h-6">
                <Quote className="absolute left-0 top-0 w-6 h-6 text-primary/40" />
                <div className="flex justify-center items-center gap-1.5 w-full">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${idx < review.rating ? "text-primary fill-primary" : "text-white/5"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Comment Content (Left Aligned) */}
              <div className="flex-grow flex flex-col justify-center text-left">
                <p className="text-white/60 group-hover/card:text-white/80 transition-colors duration-700 font-light leading-relaxed text-base md:text-lg font-sans italic">
                  "{review.comment}"
                </p>
              </div>
              
              {/* Footer Row (Name Right Aligned) */}
              <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
                <p className="text-white font-serif text-lg tracking-tight group-hover/card:text-primary transition-colors duration-700 uppercase italic">
                  {review.name}
                </p>
              </div>

              {/* Sophisticated Glow Accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
