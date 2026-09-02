import { motion } from "framer-motion";

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 2.2, delay, ease: [0.16, 1, 0.3, 1] },
});

export const DoodleScene = ({ className = "" }) => (
  <svg viewBox="0 0 320 220" fill="none" className={className} aria-hidden="true">
    <motion.path d="M40 190 L40 120 L95 78 L150 120 L150 190" stroke="#C05621" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...draw(0)} />
    <motion.path d="M30 122 L95 72 L160 122" stroke="#C05621" strokeWidth="2.4" strokeLinecap="round" {...draw(0.3)} />
    <motion.path d="M82 190 L82 146 L108 146 L108 190" stroke="#C05621" strokeWidth="2.2" {...draw(0.6)} />
    <motion.path d="M52 138 L68 138 L68 154 L52 154 Z" stroke="#C05621" strokeWidth="2" {...draw(0.8)} />
    <motion.path d="M205 190 C205 150 200 118 192 92 M192 92 C178 84 168 88 160 100 M192 92 C206 82 218 86 224 100 M192 92 C186 76 174 70 162 74 M192 92 C200 74 214 70 226 76 M192 92 C192 78 196 66 206 60" stroke="#3B5838" strokeWidth="2.2" strokeLinecap="round" {...draw(0.4)} />
    <motion.path d="M250 66 a16 16 0 1 0 0.1 0 M250 44 L250 34 M272 52 L280 46 M228 52 L220 46" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" {...draw(1)} />
    <motion.path d="M176 190 q8 -26 4 -44 M186 190 q10 -22 8 -40" stroke="#3B5838" strokeWidth="2" strokeLinecap="round" {...draw(1.1)} />
    <motion.path d="M20 196 q40 -8 80 0 q40 8 80 0 q40 -8 80 0 q20 4 40 2" stroke="#C05621" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" {...draw(1.3)} />
    <motion.path d="M118 44 q6 -8 12 0 M132 36 q6 -8 12 0" stroke="#231F1D" strokeWidth="2" strokeLinecap="round" {...draw(1.5)} />
  </svg>
);

export const DoodlePaddy = ({ className = "" }) => (
  <svg viewBox="0 0 60 90" fill="none" className={className} aria-hidden="true">
    <motion.path d="M30 86 L30 30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...draw(0)} />
    <motion.path d="M30 52 C20 46 14 36 14 26 M30 52 C40 46 46 36 46 26 M30 34 C24 28 22 20 24 12 M30 34 C36 28 38 20 36 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...draw(0.4)} />
  </svg>
);

export const DoodleLantern = ({ className = "" }) => (
  <svg viewBox="0 0 60 90" fill="none" className={className} aria-hidden="true">
    <motion.path d="M30 6 L30 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...draw(0)} />
    <motion.path d="M18 26 Q30 16 42 26 L40 62 Q30 70 20 62 Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" {...draw(0.3)} />
    <motion.path d="M30 40 q6 8 0 14 q-6 -6 0 -14" stroke="currentColor" strokeWidth="2.2" {...draw(0.7)} />
    <motion.path d="M24 76 L36 76" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...draw(0.9)} />
  </svg>
);
