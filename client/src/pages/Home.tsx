import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import heroImg from "@assets/gallery/luxury_corporate_eve_632147c4.jpg";

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
            <h2 className="text-sm md:text-base font-sans tracking-[0.3em] uppercase text-primary/80 mb-6 font-bold">
              Premium Event Management
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white mb-8 leading-tight">
              GREY <span className="text-primary">GIANT</span>
            </h1>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10">
              Specializing in luxury corporate events, bespoke weddings, and exclusive gatherings.
              <br className="hidden md:block" />
              Vision meets excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary text-black hover:bg-primary/90 rounded-none px-8 h-14 text-base tracking-wide border-primary cursor-pointer">
                    Get a Quote
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-primary/20 text-white p-12 text-center max-w-2xl">
                  <DialogHeader>
                    <Star className="w-12 h-12 text-primary mx-auto mb-8 animate-pulse" />
                    <DialogTitle className="text-3xl md:text-4xl font-serif mb-6 leading-relaxed italic">
                      "We don’t just plan events, we create memories wrapped in elegance."
                    </DialogTitle>
                    <DialogDescription className="text-xl text-primary/80 font-light tracking-widest uppercase">
                      Every occasion, a signature of distinction.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-12 flex justify-center">
                    <Button asChild className="bg-primary text-black hover:bg-primary/90 rounded-none px-6 h-14 text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase transition-all duration-500 w-full md:w-auto mx-auto whitespace-normal md:whitespace-nowrap text-center leading-relaxed">
                      <Link href="/contact">Define Your Celebration & Experience the Difference</Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-none px-8 h-14 text-base tracking-wide font-bold cursor-pointer"
              >
                View Catalogue
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
