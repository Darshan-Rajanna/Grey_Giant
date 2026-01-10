import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@assets/stock_images/luxury_corporate_eve_632147c4.jpg";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Luxury Event Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-sm md:text-base font-sans tracking-[0.3em] uppercase text-primary/80 mb-6">
              Premium Event Management
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white mb-8 leading-tight">
              GREY <span className="text-primary">GIANT</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10">
              Specializing in luxury corporate events, bespoke weddings, and exclusive gatherings. 
              <br className="hidden md:block"/>
              Vision meets excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-black hover:bg-primary/90 rounded-none px-8 h-14 text-base tracking-wide border-primary">
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-none px-8 h-14 text-base tracking-wide">
                <Link href="/services">View Catalogue</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-50" />
              {/* minimalist black architecture abstract - Keeping unsplash for variety */}
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
                alt="Architecture"
                className="relative z-10 w-full aspect-[4/5] object-cover brightness-75 contrast-125"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Crafting Moments of <span className="italic text-white/60">Distinction</span>
              </h2>
              <p className="text-white/60 leading-relaxed font-light text-lg">
                Grey Giant Events & Services is a premium event management company in Bengaluru. 
                We provide end-to-end planning, ensuring every event is seamless, elegant, and stress-free. 
                From concept creation to flawless on-site management, every detail is thoughtfully curated 
                with precision and refined aesthetics.
              </p>
              <div className="pt-4">
                <Link href="/about" className="inline-flex items-center text-white text-sm tracking-widest uppercase hover:text-white/70 transition-colors group">
                  Read Our Story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES STRIP */}
      <section className="border-y border-white/10 bg-neutral-900/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { title: "Corporate Events", desc: "High-profile gatherings executed with precision." },
              { title: "Bespoke Weddings", desc: "Timeless elegance for your special day." },
              { title: "Social Gatherings", desc: "Exclusive parties and milestone celebrations." }
            ].map((item, i) => (
              <div key={i} className="p-10 md:p-12 text-center group hover:bg-white/5 transition-colors cursor-pointer">
                <Star className="w-8 h-8 text-white/40 mx-auto mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
