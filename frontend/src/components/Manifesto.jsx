import { motion } from "framer-motion";
import { Footprints, Paintbrush, UtensilsCrossed, Star } from "lucide-react";
import { DoodlePaddy } from "./Doodle";

const CHAPTERS = [
  {
    no: "01",
    title: "Earth",
    body: "Walls of raw terracotta brick, laid by village hands. Lime wash that breathes with the seasons. A Mangalore clay-tile roof that sings in the monsoon.",
    img: "https://images.unsplash.com/photo-1614209466587-1ab355e015ba?crop=entropy&cs=srgb&fm=jpg&q=85",
    alt: "Brick and clay architecture of the homestay",
  },
  {
    no: "02",
    title: "Light",
    body: "Open verandahs pull in daylight and village air. Brick jaali screens scatter the afternoon sun. At dusk, lanterns take over — slow, warm, deliberate.",
    img: "https://images.unsplash.com/photo-1575281340462-65340b91626d?crop=entropy&cs=srgb&fm=jpg&q=85",
    alt: "Paddy fields and pond setting around the homestay",
  },
  {
    no: "03",
    title: "Craft",
    body: "Rattan swings, bamboo railings, clay pots from the kiln down the road. Doodle murals on every wall — the village, drawn by the village.",
    img: "https://images.unsplash.com/photo-1777613112957-a43891adf2fd?crop=entropy&cs=srgb&fm=jpg&q=85",
    alt: "Clay-pot village dining",
  },
];

const EXPERIENCES = [
  { icon: Footprints, label: "Paddy walks at dawn" },
  { icon: Paintbrush, label: "Pottery making" },
  { icon: UtensilsCrossed, label: "Clay-pot dining" },
  { icon: Star, label: "Lantern-lit stargazing" },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

export const Manifesto = () => (
  <section id="manifesto" className="relative py-24 sm:py-32 bg-limewash overflow-hidden">
    <DoodlePaddy className="absolute top-16 right-8 w-14 text-terra/30 hidden lg:block" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.p {...reveal} className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra mb-4">
        The Manifesto
      </motion.p>
      <motion.h2 {...reveal} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-earth max-w-3xl">
        Three things we built <em className="italic text-terra">this house</em> around.
      </motion.h2>

      <div className="mt-20 space-y-24">
        {CHAPTERS.map((c, i) => (
          <div
            key={c.no}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${i % 2 ? "" : ""}`}
          >
            <motion.div {...reveal} className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
              <span className="font-mono text-sm text-terra tracking-[0.2em]">{c.no}</span>
              <h3 className="font-serif text-4xl sm:text-5xl font-medium text-earth mt-3">{c.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-earth-muted max-w-md">{c.body}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className={`lg:col-span-7 group ${i % 2 ? "lg:order-1" : ""}`}
            >
              <div className={`overflow-hidden border border-sand-dark ${i % 2 ? "rounded-[28px] rounded-tr-[120px]" : "rounded-[28px] rounded-tl-[120px]"}`}>
                <img src={c.img} alt={c.alt} loading="lazy" className="spotlight-img w-full h-72 sm:h-96 object-cover" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div {...reveal} id="experiences" className="mt-28 border-t border-sand-dark pt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra mb-8">While you are here</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {EXPERIENCES.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group bg-sand/60 hover:bg-sand border border-sand-dark rounded-2xl p-6 transition-colors duration-300"
              data-testid={`experience-card-${i}`}
            >
              <e.icon className="w-6 h-6 text-terra group-hover:-translate-y-1 transition-transform duration-300" />
              <p className="font-serif text-xl text-earth mt-4">{e.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);
