import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { getFirstImageInDir } from "@/lib/asset-utils";

const About_img = getFirstImageInDir("About");

export default function About() {
  const { about } = siteContent;
  return (
    <div className="min-h-fit bg-[#020202] text-white py-24 selection:bg-primary/30 relative overflow-hidden">
      {/* Premium Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <section className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch">

          {/* LEFT COLUMN: Header & Text */}
          <div className="flex-1 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-start mb-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-10"
              >
                <span className="w-10 h-[1px] bg-primary/20" />
                <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
                  {about.eyebrow}
                </span>
                <span className="w-10 h-[1px] bg-primary/20 lg:hidden" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 tracking-tighter leading-[0.9] whitespace-nowrap">
                {about.title.main} <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">{about.title.accent}</span>
              </h1>
            </motion.div>

            {/* Descriptive Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none text-white/70 font-light leading-relaxed text-justify space-y-8"
            >
              {about.description.map((paragraph, i) => (
                <p key={i} className={i === 0 ? "first-letter:text-6xl first-letter:text-primary first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:leading-none" : ""}>
                  {i === 0 ? `"${paragraph}"` : paragraph}
                </p>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Image with Popping Elements & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 relative mt-4 lg:mt-0 flex flex-col"
          >
            {/* Top Label */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-primary/30" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-primary/80 font-bold">
                {about.labels}
              </span>
              <span className="w-8 h-[1px] bg-primary/30" />
            </div>

            {/* Main Image Container */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:h-[600px] overflow-hidden rounded-sm border border-white/5 shadow-2xl">
              <img
                src={About_img}
                alt="Grey Giant Event Setup"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Label (Optional, but matching the screenshot's symmetry) */}
            <div className="flex items-center justify-center gap-4 mt-6 opacity-40">
              <span className="text-[8px] uppercase tracking-[0.6em] text-white/60 font-medium">
                {about.labels}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elegant Bottom Section Divider */}
      <div className="absolute bottom-0 left-0 w-full border-b border-white/5" />
    </div>
  );
}
