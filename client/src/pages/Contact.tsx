import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@/lib/api-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { getBackground, resolveAsset } from "@/lib/asset-utils";

import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { contactPage } = siteContent;
  const bgImg = getBackground(siteContent.backgrounds.contact);
  const { toast } = useToast();

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertInquiry) => {
    try {
      const subject = `New Inquiry from ${data.name} - ${data.eventType}`;
      const body = `Name: ${data.name}%0D%0APhone: ${data.phone}%0D%0AEmail: ${data.email}%0D%0AEvent Type: ${data.eventType}%0D%0A%0D%0ADetails:%0D%0A${data.message}`;

      window.location.href = `mailto:greygiant01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      toast({
        title: "Inquiry Prepared",
        description: "Your mail client has been opened with the inquiry details.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Could not prepare the inquiry mail. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/30 flex items-center pt-12">
      {/* Background Image with Overlay */}
      {bgImg && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={bgImg}
            alt=""
            className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/40 to-[#020202]" />
        </div>
      )}

      {/* Abstract Background Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />


      {/* Dynamic Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-4 relative z-10 flex flex-col items-center justify-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-7xl items-start">

          {/* Contact Info Side */}
          <div className="lg:col-span-12 xl:col-span-5 h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col h-full"
            >
              <div className="space-y-2 mb-6 text-center xl:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 justify-center xl:justify-start"
                >
                  <span className="w-10 h-[1px] bg-primary/20" />
                  <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
                    Get In Touch
                  </span>
                  <span className="w-10 h-[1px] bg-primary/20 xl:hidden" />
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tighter leading-[1.1] py-2 text-center xl:text-left">
                  Envision Your <br />
                  <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic pr-4">Experience</span>
                </h1>
                <p className="text-white/30 max-w-sm mx-auto xl:mx-0 font-light italic text-[13px] md:text-sm leading-relaxed font-serif">
                  "Connect with our artisans to begin crafting your next milestone event with absolute precision and refined elegance."
                </p>
              </div>

              <div className="grid sm:grid-cols-1 gap-4 max-w-2xl mx-auto xl:mx-0">
                {[
                  { icon: MapPin, label: "Location", value: siteContent.contact.address, href: siteContent.contact.mapsLink },
                  { icon: Phone, label: "Contact", value: `+${siteContent.contact.whatsapp}`, href: `tel:+${siteContent.contact.whatsapp}` },
                  { icon: Mail, label: "Email", value: siteContent.contact.email, href: `mailto:${siteContent.contact.email}` }
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex flex-col xl:flex-row items-center xl:items-center gap-4 p-4 rounded-[1.5rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-primary/20 transition-all duration-500 cursor-pointer text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shrink-0">
                      <item.icon size={18} />
                    </div>
                    <div className="text-center xl:text-left">
                      <p className="text-[9px] uppercase tracking-[0.5em] text-primary/40 font-bold mb-1">{item.label}</p>
                      <p className="text-white/70 font-light text-sm md:text-base leading-snug font-serif italic">{item.value}</p>
                    </div>
                  </motion.a>
                ))}

                {/* Brochure Download Option */}
                {siteContent.contact.brochureLink && (
                  <motion.a
                    href={resolveAsset(siteContent.contact.brochureLink)}
                    download
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group flex flex-col xl:flex-row items-center xl:items-center gap-4 p-4 rounded-[1.5rem] bg-white/[0.01] border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all duration-500 cursor-pointer mt-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </div>
                    <div className="text-center xl:text-left">
                      <p className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-bold mb-1">Resources</p>
                      <p className="text-white/70 group-hover:text-white font-bold text-sm md:text-base leading-snug font-serif italic transition-colors">Download Event Brochure (PDF)</p>
                    </div>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />

              <div className="relative p-6 md:p-8 backdrop-blur-3xl bg-white/[0.01] border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col">
                <h2 className="text-lg font-serif text-white mb-6 italic font-light tracking-tight text-center xl:text-left">"{contactPage.formQuote}"</h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Your Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/[0.03] border-white/10 rounded-xl h-12 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/5 font-light" placeholder="John Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/10 rounded-xl h-12 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/5 font-light" placeholder="+91 00000 00000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/10 rounded-xl h-12 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/5 font-light" placeholder="john@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Type of Event</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger className="bg-white/[0.03] border-white/10 rounded-xl h-12 focus:ring-primary/20 focus:border-primary/30 transition-all text-white/50">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-3xl border-white/10 text-white/70">
                                <SelectItem value="corporate">Luxury Corporate Events</SelectItem>
                                <SelectItem value="weddings">Bespoke Weddings & Engagements</SelectItem>
                                <SelectItem value="dj-nights">DJ Nights & Private Parties</SelectItem>
                                <SelectItem value="bands">Traditional Bands & Grand Openings</SelectItem>
                                <SelectItem value="catering">Catering & Culinary Experiences</SelectItem>
                                <SelectItem value="makeup">Makeup & Styling Services</SelectItem>
                                <SelectItem value="pastries">Pastries & Celebration Cakes</SelectItem>
                                <SelectItem value="balloon">Balloon Décor & Birthday Celebrations</SelectItem>
                                <SelectItem value="social">Private & Social Celebrations</SelectItem>
                                <SelectItem value="institutional">Schools, Colleges & University Events</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Message / Vision</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-white/[0.03] border-white/10 rounded-xl min-h-[100px] focus:ring-primary/20 focus:border-primary/30 transition-all resize-none placeholder:text-white/5 text-white/70 font-light" placeholder="Tell us about your dream event..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.3em] text-[11px] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-500 rounded-none overflow-hidden group relative mt-2"
                    >
                      <span className="relative z-10">{contactPage.submitButton}</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </motion.button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
