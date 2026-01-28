import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

import { siteContent } from "@/data/siteContent";

export default function Services() {
  const [showAll, setShowAll] = useState(false);
  const { servicesPage } = siteContent;

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-32 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="w-12 h-[1px] bg-primary/20" />
            <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
              {servicesPage.eyebrow}
            </span>
            <span className="w-12 h-[1px] bg-primary/20" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
            {servicesPage.title.main} <br />
            <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">{servicesPage.title.accent}</span>
          </h1>
          <p className="text-white/40 max-w-xl font-light italic text-sm md:text-base leading-relaxed font-serif">
            "{servicesPage.description}"
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, showAll ? services.length : 6).map((service, i) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group relative h-[350px] md:h-[400px] overflow-hidden border-white/5 cursor-pointer premium-border"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform translate-y-6 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="text-3xl font-serif text-white mb-4 tracking-wide group-hover:text-primary transition-colors flex items-baseline gap-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 font-light mb-8 max-w-md opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {service.desc}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    View Details <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              setShowAll(!showAll);
            }}
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-none px-8 h-12 text-base tracking-wide font-bold cursor-pointer"
          >
            {showAll ? "Show Less" : "Show More"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
