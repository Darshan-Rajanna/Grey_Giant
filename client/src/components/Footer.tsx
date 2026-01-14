import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-white">GREY GIANT</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where vision meets excellence. Creating timeless, bespoke events with precision and refined aesthetics.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest mb-6 text-sm">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-muted-foreground hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest mb-6 text-sm">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/40 shrink-0" />
                <span>Post-office, Kamakshipalya,<br />Bengaluru, Karnataka 560079</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/40 shrink-0" />
                <span>+91 7483216698</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/40 shrink-0" />
                <span>greygiant01@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest mb-6 text-sm">Hours</h4>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Monday - Sunday</p>
              <p className="text-white font-medium">Open 24 Hours</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <p>&copy; {new Date().getFullYear()} Grey Darshan Events & Services. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/40">Privacy Policy</a>
            <a href="#" className="hover:text-white/40">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
