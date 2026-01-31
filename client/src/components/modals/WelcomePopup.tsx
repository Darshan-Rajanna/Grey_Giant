import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@/lib/api-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      eventType: "",
      message: ""
    }
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
      
      toast({
        title: "Inquiry Prepared",
        description: "Your mail client has been opened with the inquiry details.",
      });
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error preparing your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Side: Visual Invitation */}
          <div className="relative w-full md:w-1/2 min-h-[250px] md:min-h-full overflow-hidden">
            <img
              src={inviteBg}
              alt="Invitation Background"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center items-center text-center text-balance">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <Sparkles className="w-10 h-10 text-primary mb-6" />
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  {content.title.main} <span className="text-primary italic">{content.title.accent}</span>
                </h2>
                <p className="text-white/40 font-bold tracking-[0.6em] uppercase text-[10px]">
                  {content.description}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-neutral-950">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-4xl font-serif text-white mb-4 leading-tight">
                Send an <span className="bg-gradient-to-r from-primary via-[#f8e4b1] to-primary bg-clip-text text-transparent italic">Inquiry</span>
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] uppercase tracking-widest text-primary font-bold">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            className="bg-black/40 border-white/10 rounded-none h-10 text-sm focus:border-primary/50 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[9px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] uppercase tracking-widest text-primary font-bold">Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10-digit number"
                            className="bg-black/40 border-white/10 rounded-none h-10 text-sm focus:border-primary/50 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[9px]" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] uppercase tracking-widest text-primary font-bold">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Your Email"
                            className="bg-black/40 border-white/10 rounded-none h-10 text-sm focus:border-primary/50 transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[9px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[10px] uppercase tracking-widest text-primary font-bold">Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/40 border-white/10 rounded-none h-10 text-sm text-white/40 focus:border-primary/50 transition-colors">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-none">
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
                        <FormMessage className="text-[9px]" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] uppercase tracking-widest text-primary font-bold">Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your vision..."
                          className="bg-black/40 border-white/10 rounded-none min-h-[100px] text-sm focus:border-primary/50 transition-colors resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#c5a028] text-black rounded-none h-14 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                  >
                    REQUEST QUOTE
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
