import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { scrollToId } from "../hooks/useLenis";
import { DoodleScene } from "./Doodle";

const HERO_IMG = "https://images.unsplash.com/photo-1615976384429-b02ca1cbb8f1?crop=entropy&cs=srgb&fm=jpg&q=85";

const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
    <motion.span
      className="block will-change-transform"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden bg-limewash">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(192,86,33,0.10),transparent_55%)]" />
      <DoodleScene className="absolute -bottom-6 -left-8 w-64 sm:w-80 opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center relative">
        <motion.div style={{ y: textY }} className="lg:col-span-7 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] text-terra mb-6"
            data-testid="hero-kicker"
          >
            Est. 2026 · Kulpi, West Bengal · 20 km from Bakkhali
          </motion.p>

          <h1
            data-testid="hero-title"
            className="font-serif font-semibold tracking-tight leading-[1.02] text-earth text-5xl sm:text-6xl lg:text-7xl xl:text-[5.4rem]"
          >
            <MaskedLine delay={0.45}>A house of clay,</MaskedLine>
            <MaskedLine delay={0.58}>
              light &amp; <em className="italic font-medium text-terra">slow</em>
            </MaskedLine>
            <MaskedLine delay={0.71}>mornings.</MaskedLine>
          </h1>

          <motion.p
            data-testid="hero-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-earth-muted"
          >
            Dhansiri is a two-storey village homestay of raw brick, Mangalore tile and lime
            wash — open verandahs over the paddy pond, lantern light at dusk, and doodle-art
            walls that tell the village's story.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="hero-cta-book"
              onClick={() => scrollToId("booking")}
              className="group rounded-full bg-terra text-limewash pl-7 pr-5 py-3.5 text-sm font-medium flex items-center gap-2 hover:bg-terra-deep active:scale-[0.97] transition-all duration-300"
            >
              Reserve your stay
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              data-testid="hero-cta-enquire"
              onClick={() => scrollToId("booking")}
              className="rounded-full border border-terra/40 text-terra px-7 py-3.5 text-sm font-medium hover:bg-sand hover:border-terra active:scale-[0.97] transition-all duration-300"
            >
              Send an enquiry
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-12 flex gap-10 font-mono text-[11px] uppercase tracking-[0.18em] text-earth-muted"
          >
            <span><span className="text-terra text-base font-medium">03</span> Rooms</span>
            <span><span className="text-terra text-base font-medium">02</span> Floors</span>
            <span><span className="text-terra text-base font-medium">01</span> Pond</span>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-t-[999px] rounded-b-[28px] overflow-hidden border border-sand-dark shadow-[0_40px_80px_-30px_rgba(140,50,24,0.35)]"
          >
            <motion.img
              src={HERO_IMG}
              alt="Terracotta village homestay exterior"
              style={{ y: imgY }}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-[420px] sm:h-[520px] lg:h-[600px] object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-terra-deep/25 via-transparent to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="absolute -bottom-5 -left-5 sm:-left-8 bg-limewash/90 backdrop-blur-xl border border-sand-dark rounded-2xl px-5 py-4 shadow-lg"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-terra">Now hosting</p>
            <p className="font-serif text-lg text-earth mt-1">Monsoon season stays</p>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={() => scrollToId("manifesto")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-earth-muted hover:text-terra transition-colors"
        aria-label="Scroll down"
        data-testid="hero-scroll-indicator"
      >
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
};
