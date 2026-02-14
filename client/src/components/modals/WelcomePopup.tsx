import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@/lib/api-schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X as CloseIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { siteContent } from "@/data/siteContent";
import { resolveAsset } from "@/lib/asset-utils";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const content = (siteContent as any).welcomePopup;
  const inviteBg = resolveAsset(content.image);

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: { name: "", phone: "", email: "", eventType: "", message: "" },
  });

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("welcome_popup_shown");
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("welcome_popup_shown", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const onSubmit = (data: InsertInquiry) => {
    try {
      const subject = `Welcome Inquiry: ${data.name} - ${data.eventType}`;
      const body = `Name: ${data.name}%0D%0APhone: ${data.phone}%0D%0AEmail: ${data.email}%0D%0AEvent Type: ${data.eventType}%0D%0A%0D%0ADetails:%0D%0A${data.message}`;
      window.location.href = `mailto:greygiant01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      toast({ title: "Inquiry Prepared", description: "Your mail client has been opened." });
      setIsOpen(false);
      form.reset();
    } catch {
      toast({ title: "Submission Failed", description: "Error preparing your inquiry.", variant: "destructive" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl bg-neutral-900/60 backdrop-blur-3xl border border-primary/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(212,175,55,0.2)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white rounded-full border-2 border-primary shadow-xl flex items-center justify-center hover:scale-110 hover:rotate-90 active:scale-95 transition-all duration-500 z-[60] group"
              >
                <CloseIcon className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
              </button>

              {/* Left Side: Visual Storytelling */}
              <div className="relative w-full md:w-1/2 min-h-[250px] md:min-h-[500px] overflow-hidden flex flex-col items-center justify-center flex-shrink-0">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={inviteBg}
                    alt="Invitation Background"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/85 via-black/30 to-transparent" />
                </div>
                
                {/* Brand Content */}
                <div className="relative z-10 p-6 md:p-10 flex flex-col items-center justify-center text-center w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-full"
                  >
                    <div className="relative mb-6 md:mb-8">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
                      <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto relative z-10 animate-spin-slow" />
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6 md:mb-8 tracking-tight">
                      {content.title.main}{" "}
                      <span className="bg-gradient-to-r from-primary via-[#f8e4b1] to-primary bg-clip-text text-transparent italic block mt-2">
                        {content.title.accent}
                      </span>
                    </h2>
                    
                    <div className="flex items-center justify-center gap-4 w-full px-4">
                      <div className="h-[1px] flex-1 max-w-[40px] bg-primary/20 shrink-0" />
                      <p className="text-primary/60 font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase text-[9px] md:text-[11px] leading-relaxed max-w-[280px] md:max-w-sm whitespace-pre-wrap">
                        {content.description}
                      </p>
                      <div className="h-[1px] flex-1 max-w-[40px] bg-primary/20 shrink-0" />
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Accent Line for Mobile */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent md:hidden" />
              </div>

              {/* Right Side: Luxury Form */}
              <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col bg-neutral-950/40 overflow-y-auto no-scrollbar overflow-x-hidden">
                <DialogHeader className="mb-8 md:mb-12 text-left">
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary/50 font-black">Private Inquiry</span>
                  </div>
                  <DialogTitle className="text-3xl md:text-5xl font-serif text-white leading-[1.1] tracking-tight">
                    Start Your <span className="italic text-primary">Vision</span>
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                      {["name", "phone"].map((field) => (
                        <FormField
                          key={field}
                          control={form.control}
                          name={field as "name" | "phone"}
                          render={({ field }) => (
                            <FormItem className="space-y-2.5">
                              <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black ml-1">
                                {field.name}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={field.name === "phone" ? "+91..." : "Full Name"}
                                  className="bg-white/[0.01] border-white/5 rounded-2xl h-12 md:h-14 text-sm focus:border-primary/40 focus:bg-white/[0.03] transition-all duration-500 placeholder:text-white/5"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px] text-red-500/60" />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black ml-1">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Contact Email"
                                className="bg-white/[0.01] border-white/5 rounded-2xl h-12 md:h-14 text-sm focus:border-primary/40 focus:bg-white/[0.03] transition-all duration-500 placeholder:text-white/5"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] text-red-500/60" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem className="space-y-2.5">
                            <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black ml-1">
                              Occasion
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/[0.01] border-white/5 rounded-2xl h-12 md:h-14 text-sm text-white/50 focus:border-primary/40 transition-all">
                                  <SelectValue placeholder="Event Type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#0a0a0a] border-white/10 text-white/80 backdrop-blur-3xl rounded-2xl z-[10000]">
                                {[
                                  "Luxury Corporate Events",
                                  "Bespoke Weddings & Engagements",
                                  "DJ Nights & Private Parties",
                                  "Traditional Bands & Grand Openings",
                                  "Catering & Culinary Experiences",
                                  "Makeup & Styling Services",
                                  "Pastries & Celebration Cakes",
                                  "Balloon Décor & Birthday Celebrations",
                                  "Private & Social Celebrations",
                                  "Institutional Events",
                                ].map((option) => (
                                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, "-")} className="focus:bg-primary/10 transition-colors py-3">
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[10px] text-red-500/60" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-2.5">
                          <FormLabel className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black ml-1">
                            Your vision
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Briefly describe your dream event..."
                              className="bg-white/[0.01] border-white/5 rounded-2xl min-h-[120px] text-sm focus:border-primary/40 focus:bg-white/[0.03] transition-all duration-500 resize-none no-scrollbar placeholder:text-white/5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] text-red-500/60" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 md:pt-6">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary via-[#f8e4b1] to-primary text-black rounded-2xl h-14 md:h-16 font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-700 border border-white/10"
                      >
                        REQUEST A PERSONAL CALL
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </Dialog>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </AnimatePresence>
  );
}
