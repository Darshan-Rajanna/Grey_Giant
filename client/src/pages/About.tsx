import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="py-20 md:py-32 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8">
            About The Giant
          </h1>
          <div className="w-24 h-1 bg-white/20 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="prose prose-invert prose-lg text-white/70 font-light">
            <p className="lead text-white text-xl">
              "Grey Giant Events & Services is a premium event management company specializing in luxury corporate events, bespoke weddings, birthday celebrations, and exclusive social gatherings."
            </p>
            <p>
              We provide end-to-end planning, coordination, and execution, ensuring every event is seamless, elegant, and stress-free. From concept creation to flawless on-site management, every detail is thoughtfully curated with precision and refined aesthetics.
            </p>
            <p>
              Whether it is a high-profile corporate gathering or a personal milestone celebration, we deliver customized experiences that reflect class, professionalism, and timeless elegance. At Grey Giant, we craft moments of distinction where vision meets excellence and every event leaves a lasting impression.
            </p>
          </div>
          <div className="relative">
             {/* minimalist stage setup black and white */}
            <img 
              src="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=60"
              alt="Event Setup" 
              className="w-full h-full object-cover grayscale opacity-90"
            />
            <div className="absolute -bottom-8 -left-8 bg-neutral-900 p-8 border border-white/10 hidden md:block">
              <p className="font-serif text-3xl text-white mb-2">24/7</p>
              <p className="text-xs uppercase tracking-widest text-white/50">Support & Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-neutral-900 border-t border-white/5">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif text-center mb-16 text-white">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Precision", desc: "Attention to detail is our hallmark. Nothing is left to chance." },
              { title: "Elegance", desc: "We believe in refined aesthetics that speak volumes." },
              { title: "Excellence", desc: "Delivering beyond expectations is our standard." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 border border-white/5 bg-black hover:border-white/20 transition-colors"
              >
                <h3 className="text-xl font-serif text-white mb-4">{item.title}</h3>
                <p className="text-white/50 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
