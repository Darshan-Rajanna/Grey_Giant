import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

export default function Contact() {
  const { contactPage, contact: contactInfo } = siteContent;
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
    const subject = `New Inquiry from ${data.name} - ${data.eventType}`;
    const body = `Name: ${data.name}%0D%0APhone: ${data.phone}%0D%0AEmail: ${data.email}%0D%0AEvent Type: ${data.eventType}%0D%0A%0D%0ADetails:%0D%0A${data.message}`;

    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    form.reset();
  };

  return (
    <div className="pt-20 min-h-screen bg-[#020202] relative overflow-hidden selection:bg-primary/30">
      {/* Abstract Background Noise / Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Dynamic Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-24 relative z-10 flex flex-col items-center">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 w-full max-w-7xl items-start">
          
          {/* Contact Info Side */}
          <div className="lg:col-span-12 xl:col-span-5 h-full">
            <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <div className="space-y-8 mb-16 text-center xl:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 justify-center xl:justify-start"
              >
                <span className="w-10 h-[1px] bg-primary/20" />
                <span className="text-[10px] uppercase tracking-[0.7em] text-primary/60 font-bold">
                  {contactPage.eyebrow}
                </span>
                <span className="w-10 h-[1px] bg-primary/20 xl:hidden" />
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tighter leading-[0.9]">
                {contactPage.title.main} <br />
                <span className="bg-gradient-to-b from-primary via-[#f8e4b1] to-primary/40 bg-clip-text text-transparent italic">{contactPage.title.accent}</span>
              </h1>
              <p className="text-white/30 max-w-sm mx-auto xl:mx-0 font-light italic text-base md:text-lg leading-relaxed font-serif">
                "{contactPage.description}"
              </p>
            </div>

            <div className="grid sm:grid-cols-1 gap-6 max-w-2xl mx-auto xl:mx-0 mt-auto">
              {[
                { icon: MapPin, label: "Location", value: contactInfo.address },
                { icon: Phone, label: "Contact", value: `+${contactInfo.whatsapp}` },
                { icon: Mail, label: "Email", value: contactInfo.email }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col xl:flex-row items-center xl:items-center gap-6 p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-primary/20 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div className="text-center xl:text-left">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-primary/40 font-bold mb-2">{item.label}</p>
                    <p className="text-white/70 font-light text-base md:text-lg lg:text-xl leading-snug font-serif italic">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

          {/* Contact Form */}
          <div className="lg:col-span-12 xl:col-span-7 h-full">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />
            
            <div className="relative h-full p-10 md:p-14 backdrop-blur-3xl bg-white/[0.01] border border-white/5 rounded-[3rem] shadow-2xl flex flex-col">
              <h2 className="text-2xl font-serif text-white mb-10 italic font-light tracking-tight text-center xl:text-left">"{contactPage.formQuote}"</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Your Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/[0.03] border-white/10 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/5" placeholder="John Doe" />
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
                          <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/10 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/5" placeholder="+91 00000 00000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="bg-white/[0.03] border-white/10 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/5" placeholder="john@example.com" />
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
                          <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Type of Event</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="bg-white/[0.03] border-white/10 rounded-2xl h-14 focus:ring-primary/20 focus:border-primary/30 transition-all text-white/50">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-3xl border-white/10 text-white/70">
                              <SelectItem value="corporate">Corporate Gala</SelectItem>
                              <SelectItem value="wedding">Bespoke Wedding</SelectItem>
                              <SelectItem value="social">Private Celebration</SelectItem>
                              <SelectItem value="other">Other Event</SelectItem>
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
                        <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold px-1">Message / Vision</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white/[0.03] border-white/10 rounded-2xl min-h-[160px] focus:ring-primary/20 focus:border-primary/30 transition-all resize-none placeholder:text-white/5 text-white/70" placeholder="Tell us about your dream event..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-6 bg-primary text-black font-bold uppercase tracking-[0.3em] text-[11px] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-500 rounded-none overflow-hidden group relative mt-4"
                  >
                    <span className="relative z-10">Send Inquiry</span>
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
