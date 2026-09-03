import { motion } from "framer-motion";
import { useLang } from "../i18n";

const PHOTOS = [
  { src: "https://customer-assets-lqy194kg.emergentagent.net/job_room-availability-13/artifacts/k45dc78a_WhatsApp%20Image%202026-08-31%20at%206.08.43%20PM.jpeg", alt: "Dhansiri house seen through paddy grass" },
  { src: "https://customer-assets-lqy194kg.emergentagent.net/job_room-availability-13/artifacts/bqllrox0_WhatsApp%20Image%202026-08-31%20at%206.08.45%20PM%20%281%29.jpeg", alt: "Dhansiri house across the pond" },
  { src: "https://customer-assets-lqy194kg.emergentagent.net/job_room-availability-13/artifacts/b4tspf7k_WhatsApp%20Image%202026-08-31%20at%206.08.44%20PM.jpeg", alt: "Brick facade of Dhansiri by the water" },
  { src: "https://customer-assets-rejwkqb3.emergentagent.net/job_952784df-8b7c-47b6-9073-5b1a9a34f77f/artifacts/vndszagt_IMG20260614093335.webp", alt: "Dhansiri under construction, June 2026" },
  { src: "https://customer-assets-lqy194kg.emergentagent.net/job_room-availability-13/artifacts/s59l9sbc_WhatsApp%20Image%202026-08-31%20at%206.08.44%20PM%20%281%29.jpeg", alt: "Dhansiri side view with young palms" },
];

export const Gallery = () => {
  const { t } = useLang();
  return (
    <section id="gallery" className="py-20 sm:py-24 bg-limewash overflow-hidden" data-testid="photo-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra"
        >
          {t("gallery.kicker")}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-earth-muted"
        >
          {t("gallery.caption")}
        </motion.p>
      </div>

      <div className="relative">
        <div className="gallery-track flex gap-5 px-5">
          {[...PHOTOS, ...PHOTOS].map((p, i) => (
            <div
              key={i}
              className="group shrink-0 w-[240px] sm:w-[300px] overflow-hidden rounded-[22px] border border-sand-dark shadow-[0_20px_40px_-20px_rgba(140,50,24,0.3)]"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="spotlight-img w-full h-[320px] sm:h-[380px] object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-limewash to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-limewash to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
