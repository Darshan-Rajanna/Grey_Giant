import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

import corporateImg from "@assets/gallery/image_1768032170619.png"; // Launch event
import weddingImg from "@assets/gallery/image_1768032128663.png"; // Engagement sign
import retirementImg from "@assets/gallery/image_1768032161591.png"; // Retirement farewell
import thematicImg from "@assets/gallery/image_1768032149552.png"; // Tropical entrance

const services = [
  {
    id: "corporate",
    title: "Luxury Corporate Events",
    desc: "From high-profile launches to professional conferences, we execute with refined precision.",
    image: corporateImg
  },
  {
    id: "weddings",
    title: "Bespoke Weddings & Engagements",
    desc: "Curating timeless elegance for your most cherished personal milestones.",
    image: weddingImg
  },
  {
    id: "farewell",
    title: "Retirement & Legacy Celebrations",
    desc: "Honoring decades of excellence with sophisticated farewell gatherings.",
    image: retirementImg
  },
  {
    id: "thematic",
    title: "Thematic Social Gatherings",
    desc: "Bringing visions to life through creative, high-impact thematic decor and management.",
    image: thematicImg
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight">Our <span className="text-primary">Catalogue</span></h1>
          <p className="text-gray-400 font-light leading-relaxed">
            Every event is a unique masterpiece. Browse our core service categories designed for those who value distinction and professional excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative h-[350px] md:h-[400px] overflow-hidden border border-white/5"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform translate-y-6 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="text-3xl font-serif text-white mb-4 tracking-wide group-hover:text-primary transition-colors flex items-baseline gap-2">
                  {i % 2 === 0 ? (
                    <> {service.title.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{service.title.split(' ').slice(-1)}</span></>
                  ) : (
                    <>{service.title}</>
                  )}
                </h3>
                <p className="text-gray-300 font-light mb-8 max-w-md opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {service.desc}
                </p>
              </div>
            </motion.div>
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 border border-primary text-primary text-[10px] uppercase font-sans tracking-[0.4em] hover:bg-primary hover:text-black transition-all duration-500"
          >
            Show More
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
