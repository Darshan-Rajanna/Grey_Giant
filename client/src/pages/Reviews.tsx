import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="pt-20 min-h-screen bg-background relative">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Client <span className="text-primary">Voices</span></h1>
            <p className="text-white/60 max-w-lg">Hear from those who have experienced the Grey Giant standard of excellence.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 p-8 flex flex-col hover:border-white/30 transition-colors w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <Quote className="w-10 h-10 text-white/20 mb-6" />
              <p className="text-white/80 font-light italic mb-8 flex-grow">"{review.comment}"</p>
              <div className="mt-auto">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-white fill-white" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <p className="text-white font-serif tracking-wide">{review.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
