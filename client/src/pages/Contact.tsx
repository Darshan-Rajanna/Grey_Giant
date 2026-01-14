// import { useCreateInquiry } from "@/hooks/use-inquiries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
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

    window.location.href = `mailto:greygiant01@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    form.reset();
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">

        {/* Contact Info Side */}
        <div className="bg-neutral-900 p-10 lg:p-20 flex flex-col justify-center border-r border-primary/10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-12">Get in <span className="text-primary">Touch</span></h1>

            <div className="space-y-12">
              <div className="flex gap-6">
                <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-white font-medium uppercase tracking-widest mb-2">Location</h3>
                  <a href="https://maps.app.goo.gl/p6miECt3U0FevDmiC" target="_blank" rel="noopener noreferrer" className="group block">
                    <p className="text-white/60 font-light leading-relaxed group-hover:text-primary transition-colors">
                      Post-office, Kamakshipalya,<br />
                      Bengaluru, Karnataka 560079
                    </p>
                    <div className="mt-4 flex gap-4 text-sm text-primary/80 group-hover:text-primary transition-colors">
                      <span className="flex items-center gap-2"><Navigation className="w-4 h-4" /> Get Directions</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="flex gap-6">
                <Clock className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-white font-medium uppercase tracking-widest mb-2">Hours</h3>
                  <p className="text-white/60 font-light">
                    Open 24 Hours<br />
                    Monday - Sunday
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <Phone className="w-6 h-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-white font-medium uppercase tracking-widest mb-2">Contact</h3>
                  <p className="text-white/60 font-light">
                    7483216698<br />
                    greygiant01@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Side */}
        <div className="p-10 lg:p-20 flex flex-col justify-center bg-black">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-serif text-white mb-8">Send an <span className="text-primary">Inquiry</span></h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Phone</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Email</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80">Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none bg-neutral-900 border-white/10 text-white">
                            <SelectItem value="corporate">Corporate Event</SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday">Birthday</SelectItem>
                            <SelectItem value="social">Social Gathering</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                    <FormItem>
                      <FormLabel className="text-primary/80">Details</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-primary" placeholder="Tell us about your vision..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-primary text-black hover:bg-primary/90 rounded-none text-base tracking-wide uppercase font-medium border-primary"
                >
                  Request Quote
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
