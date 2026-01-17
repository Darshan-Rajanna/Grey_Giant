import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import corporateImg from "@assets/gallery/luxury_corporate_eve_632147c4.jpg";
import weddingImg from "@assets/gallery/elegant_wedding_rece_fa4a2b09.jpg";
import djImg from "@assets/gallery/social_gathering_new.jpg";
import bandImg from "@assets/gallery/corporate_event_new.png";
import cateringImg from "@assets/gallery/image_1768032128663.png";
import makeupImg from "@assets/gallery/wedding_event_new.jpg";
import pastriesImg from "@assets/gallery/image_1768032161591.png";
import balloonImg from "@assets/gallery/birthday_celebration_05d1cd5e.jpg";
import socialImg from "@assets/gallery/corporate_social_gat_3217eb15.jpg";

// New high-end assets
const vipLoungeImg = "/c:/Users/amuly/.gemini/antigravity/brain/ea5f671e-d888-4720-929e-e4632e9a7fc5/corporate_vip_lounge_1768396392423.png";
const planningImg = "/c:/Users/amuly/.gemini/antigravity/brain/ea5f671e-d888-4720-929e-e4632e9a7fc5/corporate_planning_session_1768396424569.png";

type ServiceDetail = {
  title: string;
  buttonText: string;
  description: string;
  image: string;
};

const services = [
  {
    id: "corporate",
    title: "Luxury Corporate Events",
    desc: "Strategic gatherings designed with precision and brand excellence.",
    image: corporateImg,
    details: [
      {
        title: "Explore Corporate Events",
        buttonText: "Explore Events",
        image: corporateImg,
        description: "Visual of full event setup—lighting, seating, and stage setups that showcase seamless coordination."
      },
      {
        title: "View Corporate Experiences",
        buttonText: "View Experiences",
        image: vipLoungeImg,
        description: "VIP lounge areas and interactive sessions highlighting client engagement and brand impact."
      },
      {
        title: "Plan a Corporate Event",
        buttonText: "Plan Event",
        image: planningImg,
        description: "Personalized planning and client management focus, transforming ideas into flawless reality."
      },
      {
        title: "Discover More",
        buttonText: "Discover More",
        image: bandImg,
        description: "Behind-the-scenes technical expertise, meticulous tech setups, and coordination."
      }
    ]
  },
  {
    id: "weddings",
    title: "Bespoke Weddings & Engagements",
    desc: "Personalized celebrations crafted with timeless elegance.",
    image: weddingImg,
    details: [
      {
        title: "View Wedding Experiences",
        buttonText: "View Experiences",
        image: weddingImg,
        description: "Elegant wedding reception with candlelit tables, floral décor, and happy guests showcasing curated setups."
      },
      {
        title: "Design Your Wedding",
        buttonText: "Design Your Wedding",
        image: planningImg,
        description: "Emphasizes personalized planning and client collaboration with mood boards and décor sketches."
      },
      {
        title: "Explore Celebrations",
        buttonText: "Explore Celebrations",
        image: socialImg,
        description: "Highlighting a variety of celebration styles beyond weddings, including engagements and anniversaries."
      },
      {
        title: "Begin Your Wedding Journey",
        buttonText: "Begin Journey",
        image: weddingImg,
        description: "An aspirational invite to start your bespoke wedding journey with our dedicated coordination team."
      }
    ]
  },
  {
    id: "dj-nights",
    title: "DJ Nights & Private Parties",
    desc: "High-energy music experiences designed to elevate celebrations.",
    image: djImg,
    details: [
      {
        title: "Explore Party Experiences",
        buttonText: "Explore Experiences",
        image: djImg,
        description: "Showcases exciting, high-energy party setups and immersive event experiences."
      },
      {
        title: "View DJ Services",
        buttonText: "View DJ Services",
        image: djImg,
        description: "Highlights our professional DJ lineup and music expertise, creating unforgettable vibes."
      },
      {
        title: "Turn Up the Celebration",
        buttonText: "Turn Up Celebration",
        image: djImg,
        description: "Captures the fun and thrill of our private parties, showing how celebrations come alive."
      },
      {
        title: "Plan a Party",
        buttonText: "Plan a Party",
        image: planningImg,
        description: "Direct CTA emphasizing personalized party planning for perfectly executed celebrations."
      }
    ]
  },
  {
    id: "bands",
    title: "Traditional Bands & Brand Openings",
    desc: "Cultural performances and ceremonial elements for grand launches.",
    image: bandImg,
    details: [
      {
        title: "Explore Brand Openings",
        buttonText: "Explore Openings",
        image: bandImg,
        description: "Expertise in organizing memorable brand launch events with full ceremonial flair."
      },
      {
        title: "View Traditional Performances",
        buttonText: "View Performances",
        image: bandImg,
        description: "Showcases authentic cultural elements and live performance experiences for events."
      },
      {
        title: "Create a Grand Opening",
        buttonText: "Create Grand Opening",
        image: bandImg,
        description: "Emphasizing personalized planning for impactful and prestigious brand launches."
      },
      {
        title: "Discover Ceremonial Events",
        buttonText: "Discover Ceremonies",
        image: bandImg,
        description: "Grand, culturally rich ceremonial experiences with elaborate traditional setups."
      }
    ]
  },
  {
    id: "catering",
    title: "Catering & Culinary Experiences",
    desc: "Curated menus and refined presentation for every occasion.",
    image: cateringImg,
    details: [
      {
        title: "Explore Catering Services",
        buttonText: "Explore Services",
        image: cateringImg,
        description: "Showcases our professional catering capabilities and attention to culinary detail."
      },
      {
        title: "View Culinary Experiences",
        buttonText: "View Experiences",
        image: cateringImg,
        description: "Highlights interactive, memorable culinary experiences for clients and their guests."
      },
      {
        title: "Taste the Experience",
        buttonText: "Taste Experience",
        image: cateringImg,
        description: "Focuses on refined presentation and the luxury of taste for food connoisseurs."
      },
      {
        title: "Discover Menus",
        buttonText: "Discover Menus",
        image: cateringImg,
        description: "Invites clients to explore curated menus and thematic food layouts for every occasion."
      }
    ]
  },
  {
    id: "makeup",
    title: "Makeup & Styling Services",
    desc: "Professional artistry designed for elegance and confidence.",
    image: makeupImg,
    details: [
      {
        title: "Explore Styling Services",
        buttonText: "Explore Services",
        image: makeupImg,
        description: "Comprehensive styling expertise covering bridal, party looks, and overall grooming."
      },
      {
        title: "View Makeup Artistry",
        buttonText: "View Artistry",
        image: makeupImg,
        description: "Highlights professional skills, emphasizing precision across all event types."
      },
      {
        title: "Enhance Your Look",
        buttonText: "Enhance Look",
        image: makeupImg,
        description: "Before-and-after transformations offering complete beauty solutions for all your events."
      },
      {
        title: "Discover Beauty Services",
        buttonText: "Discover Services",
        image: makeupImg,
        description: "Explores the full range of bridal makeup, hair styling, and professional beauty care."
      }
    ]
  },
  {
    id: "pastries",
    title: "Pastries & Celebration Cakes",
    desc: "Artfully crafted desserts designed for memorable moments.",
    image: pastriesImg,
    details: [
      {
        title: "Explore Dessert Creations",
        buttonText: "Explore Creations",
        image: pastriesImg,
        description: "Assorted gourmet desserts elegantly plated on a luxury table setup."
      },
      {
        title: "View Cake Designs",
        buttonText: "View Designs",
        image: pastriesImg,
        description: "Highlights our creative cake artistry and ability to craft unique designs."
      },
      {
        title: "Sweeten Your Celebration",
        buttonText: "Sweeten Celebration",
        image: pastriesImg,
        description: "Demonstrates how our desserts enhance the overall celebration experience."
      },
      {
        title: "Discover Pastries",
        buttonText: "Discover Pastries",
        image: pastriesImg,
        description: "Delicate pastries, tarts, and gourmet treats displayed with elegance."
      }
    ]
  },
  {
    id: "balloon",
    title: "Balloon Décor & Birthday Celebrations",
    desc: "Creative balloon styling for joyful and vibrant occasions.",
    image: balloonImg,
    details: [
      {
        title: "Explore Birthday Décor",
        buttonText: "Explore Décor",
        image: balloonImg,
        description: "Vibrant themed birthday setups with balloon arches and creative party props."
      },
      {
        title: "View Balloon Designs",
        buttonText: "View Designs",
        image: balloonImg,
        description: "Artistic balloon arrangements and custom styling for a memorable visual impact."
      },
      {
        title: "Celebrate in Style",
        buttonText: "Celebrate in Style",
        image: balloonImg,
        description: "Festive vibes and enhanced guest experiences through our creative décor."
      },
      {
        title: "Plan a Birthday Event",
        buttonText: "Plan Event",
        image: planningImg,
        description: "Personalized birthday planning ensuring a flawless and joyful celebration."
      }
    ]
  },
  {
    id: "social",
    title: "Private & Social Celebrations",
    desc: "Intimate gatherings designed with elegance and personal touch.",
    image: socialImg,
    details: [
      {
        title: "Explore Private Events",
        buttonText: "Explore Events",
        image: socialImg,
        description: "Intimate and elegant home or small venue setups with curated décor."
      },
      {
        title: "View Social Gatherings",
        buttonText: "View Gatherings",
        image: socialImg,
        description: "Personalized social events with a strong focus on ambiance and guest experience."
      },
      {
        title: "Create Your Celebration",
        buttonText: "Create Celebration",
        image: planningImg,
        description: "Customized planning sessions for personal events and intimate gatherings."
      },
      {
        title: "Discover Experiences",
        buttonText: "Discover Experiences",
        image: socialImg,
        description: "Meaningful and memorable private experiences through our tailored services."
      }
    ]
  }
];

export default function Services() {
  const [showAll, setShowAll] = useState(false);

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
              The Offering
            </span>
            <span className="w-12 h-[1px] bg-primary/20" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 tracking-tighter leading-[0.9]">
            Our Exclusive <br />
            <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">Crafted Offerings</span>
          </h1>
          <p className="text-white/40 max-w-xl font-light italic text-sm md:text-base leading-relaxed font-serif">
            "Explore our curated suite of services, where every element is designed to elevate your celebration into a masterpiece of distinction."
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.slice(0, showAll ? services.length : 4).map((service, i) => (
            <Dialog key={service.id}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative h-[350px] md:h-[400px] overflow-hidden border border-white/5 cursor-pointer"
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
              </DialogTrigger>

              <DialogContent className="max-w-5xl bg-neutral-900 border-primary/20 text-white p-0 overflow-hidden rounded-none no-scrollbar max-h-[90vh] overflow-y-auto">
                <div className="p-8 md:p-12">
                  <DialogHeader className="mb-12">
                    <DialogTitle className="text-3xl md:text-5xl font-serif text-white text-center">
                      {service.title.split(' ').map((word, idx) => (
                        <span key={idx} className={idx === service.title.split(' ').length - 1 ? "text-primary ml-2" : ""}>
                          {word}
                        </span>
                      ))}
                    </DialogTitle>
                    <p className="text-center text-gray-400 mt-4 font-light tracking-widest uppercase text-sm">Experience the Difference</p>
                  </DialogHeader>

                  {service.details ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      {service.details.map((detail, idx) => (
                        <div key={idx} className="group/item bg-black/40 border border-white/5 p-6 hover:border-primary/30 transition-all duration-500">
                          <div className="aspect-video overflow-hidden mb-6 relative">
                            <img src={detail.image} alt={detail.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover/item:bg-transparent transition-colors duration-500" />
                          </div>
                          <h4 className="text-xl font-serif text-white mb-3 group-hover/item:text-primary transition-colors">{detail.title}</h4>
                          <p className="text-gray-400 font-light text-sm mb-6 leading-relaxed">
                            {detail.description}
                          </p>
                          <Button className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black rounded-none transition-all duration-300 uppercase text-xs tracking-widest font-bold h-10">
                            {detail.buttonText}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-gray-400 font-light italic">Detailed insights for this category coming soon.</p>
                      <Button className="mt-8 bg-primary text-black rounded-none px-8 font-bold uppercase tracking-widest">Inquire Now</Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
            onClick={() => setShowAll(!showAll)}
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-none px-8 h-12 text-base tracking-wide font-bold cursor-pointer"
          >
            {showAll ? "Show Less" : "Show More"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
