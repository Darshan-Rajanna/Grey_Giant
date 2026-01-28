import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Sparkles, ShieldCheck, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getFirstImageInDir } from "@/lib/asset-utils";

const inviteBg = getFirstImageInDir("Welcome");

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    details: ""
  });

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("welcome_popup_shown");
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("welcome_popup_shown", "true");
      }, 1500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, []);

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

            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center items-center text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <Sparkles className="w-10 h-10 text-primary mb-6" />
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                  Vision Meets <span className="text-primary italic">Excellence</span>
                </h2>
                <p className="text-white/60 font-light tracking-widest uppercase text-xs">
                  You're Invited to Craft Something Extraordinary
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-neutral-950">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-serif text-white mb-2 leading-tight">
                Send an <span className="bg-gradient-to-r from-primary via-[#f8e4b1] to-primary bg-clip-text text-transparent italic">Inquiry</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pop-name" className="text-[10px] uppercase tracking-widest text-primary font-bold">Name</Label>
                  <Input
                    id="pop-name"
                    placeholder="Your Name"
                    className="bg-black/40 border-white/10 rounded-none h-10 text-sm focus:border-primary/50 transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pop-phone" className="text-[10px] uppercase tracking-widest text-primary font-bold">Phone</Label>
                  <Input
                    id="pop-phone"
                    placeholder="Your Phone"
                    className="bg-black/40 border-white/10 rounded-none h-10 text-sm focus:border-primary/50 transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pop-email" className="text-[10px] uppercase tracking-widest text-primary font-bold">Email</Label>
                  <Input
                    id="pop-email"
                    type="email"
                    placeholder="Your Email"
                    className="bg-black/40 border-white/10 rounded-none h-10 text-sm focus:border-primary/50 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Event Type</Label>
                  <Select onValueChange={(val) => setFormData({ ...formData, eventType: val })}>
                    <SelectTrigger className="bg-black/40 border-white/10 rounded-none h-10 text-sm text-white/40 focus:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-none">
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="private">Private Party</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pop-details" className="text-[10px] uppercase tracking-widest text-primary font-bold">Details</Label>
                <Textarea
                  id="pop-details"
                  placeholder="Tell us about your vision..."
                  className="bg-black/40 border-white/10 rounded-none min-h-[100px] text-sm focus:border-primary/50 transition-colors resize-none"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <Button
                  className="w-full bg-primary hover:bg-[#c5a028] text-black rounded-none h-14 font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                  onClick={() => setIsOpen(false)}
                >
                  REQUEST QUOTE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
