import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import introductionImg from "@assets/gallery/introduction_decor_new.jpg";

export default function Distinction() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-50" />
                        <img
                            src={introductionImg}
                            alt="Architecture"
                            className="relative z-10 w-full max-h-[600px] object-cover mx-auto brightness-75 contrast-125 rounded-sm shadow-2xl"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                            Crafting Moments of <span className="italic text-primary">Distinction</span>
                        </h2>
                        <p className="text-white/60 leading-relaxed font-light text-lg">
                            Grey Giant Events & Services is a premium event management company in Bengaluru.
                            We provide end-to-end planning, ensuring every event is seamless, elegant, and stress-free.
                            From concept creation to flawless on-site management, every detail is thoughtfully curated
                            with precision and refined aesthetics.
                        </p>
                        <div className="pt-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="inline-flex items-center text-white text-sm tracking-widest uppercase hover:text-white/70 transition-colors group">
                                        Read Our Story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <div className="prose prose-invert prose-lg text-white/70 font-light mt-4 space-y-6">
                                        <p>
                                            Grey Giant Events & Services is a distinguished event management company dedicated to creating extraordinary experiences with refined elegance. We specialize in luxury corporate events, bespoke weddings, milestone celebrations, and exclusive social gatherings, delivering events that are both visually captivating and impeccably executed.
                                        </p>
                                        <p>
                                            With a strong focus on end-to-end planning, seamless coordination, and flawless execution, we transform concepts into memorable realities. From initial ideation to meticulous on-site management, every element is thoughtfully curated, ensuring sophistication, precision, and effortless flow.
                                        </p>
                                        <p>
                                            Whether orchestrating a prestigious corporate engagement or an intimate personal celebration, we design tailor-made experiences that embody class, professionalism, and timeless style. At Grey Giant, we don’t just manage events — we craft moments of distinction, where vision is elevated through excellence and every occasion leaves a lasting impression.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
