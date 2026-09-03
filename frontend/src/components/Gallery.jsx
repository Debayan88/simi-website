import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "ArrowRight") setZoom((z) => (z + 1) % PHOTOS.length);
      if (e.key === "ArrowLeft") setZoom((z) => (z - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

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
            <button
              key={i}
              onClick={() => setZoom(i % PHOTOS.length)}
              data-testid={`gallery-photo-${i % PHOTOS.length}`}
              className="group shrink-0 w-[240px] sm:w-[300px] overflow-hidden rounded-[22px] border border-sand-dark shadow-[0_20px_40px_-20px_rgba(140,50,24,0.3)] cursor-zoom-in"
              aria-label={p.alt}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="spotlight-img w-full h-[320px] sm:h-[380px] object-cover pointer-events-none"
              />
            </button>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-limewash to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-limewash to-transparent pointer-events-none" />
      </div>

      <AnimatePresence>
        {zoom !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-earth/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
            onClick={() => setZoom(null)}
            data-testid="gallery-lightbox"
          >
            <button
              onClick={() => setZoom(null)}
              data-testid="gallery-lightbox-close"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-limewash/10 border border-sand/20 text-sand flex items-center justify-center hover:bg-terra transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((zoom - 1 + PHOTOS.length) % PHOTOS.length); }}
              data-testid="gallery-lightbox-prev"
              className="absolute left-3 sm:left-8 w-11 h-11 rounded-full bg-limewash/10 border border-sand/20 text-sand flex items-center justify-center hover:bg-terra transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((zoom + 1) % PHOTOS.length); }}
              data-testid="gallery-lightbox-next"
              className="absolute right-3 sm:right-8 w-11 h-11 rounded-full bg-limewash/10 border border-sand/20 text-sand flex items-center justify-center hover:bg-terra transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <motion.figure
              key={zoom}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={PHOTOS[zoom].src}
                alt={PHOTOS[zoom].alt}
                className="max-h-[78vh] max-w-full rounded-2xl border border-sand/20 object-contain mx-auto"
              />
              <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-sand/70">
                {PHOTOS[zoom].alt} · {zoom + 1} / {PHOTOS.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
