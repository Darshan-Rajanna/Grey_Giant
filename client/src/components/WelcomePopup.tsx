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
import { Mail, Phone, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import inviteBg from "@assets/popup/invite_bg.png";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);

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
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
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

          {/* Right Side: Contact & Quick Inquiry */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-neutral-950">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-serif text-white mb-2">Connect With Us</DialogTitle>
              <DialogDescription className="text-white/40 text-sm">
                Inquire about your next premium event.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="grid grid-cols-1 gap-4 py-4 border-y border-white/5">
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>hello@greygiant.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Bengaluru, Karnataka</span>
                </div>
              </div>

              {/* Quick Robot Verification */}
              <div className="bg-black/40 border border-white/5 p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="robot-check" 
                    checked={isRobotVerified}
                    onCheckedChange={(checked) => setIsRobotVerified(checked as boolean)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black"
                  />
                  <Label 
                    htmlFor="robot-check"
                    className="text-sm text-white/60 cursor-pointer flex items-center gap-2"
                  >
                    I am not a robot
                    <ShieldCheck className={`w-4 h-4 transition-colors ${isRobotVerified ? "text-primary" : "text-white/20"}`} />
                  </Label>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button 
                  disabled={!isRobotVerified}
                  className="w-full bg-primary text-black hover:bg-primary/90 rounded-none h-12 font-bold uppercase tracking-widest text-xs transition-all duration-300 disabled:opacity-30"
                  onClick={() => setIsOpen(false)}
                >
                  Enter Experience
                </Button>
                <p className="text-[10px] text-center text-white/20 uppercase tracking-tighter">
                  Secure connection verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
