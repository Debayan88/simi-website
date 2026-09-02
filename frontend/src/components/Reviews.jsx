import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import api from "../lib/api";
import { useLang } from "../i18n";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { lang, t } = useLang();

  useEffect(() => {
    api.get("/reviews").then((r) => setReviews(r.data.reviews)).catch(() => {});
  }, []);

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-limewash relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra mb-4">{t("reviews.kicker")}</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-earth">
            {t("reviews.h2a")}<em className="italic text-terra">{t("reviews.h2em")}</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="reviews-wall">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.id}
              data-testid={`review-card-${r.id}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-sand/60 hover:bg-sand border border-sand-dark rounded-[24px] p-7 flex flex-col transition-colors duration-300 hover:-translate-y-1"
            >
              <Quote className="w-6 h-6 text-terra/50 group-hover:text-terra transition-colors" />
              <blockquote className="font-serif text-lg leading-relaxed text-earth mt-4 flex-1">
                {lang === "bn" ? r.text_bn : r.text_en}
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-sand-dark">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: r.stars }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-terra text-terra" />
                  ))}
                </div>
                <p className="font-mono text-xs text-earth font-medium">{r.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-earth-muted mt-0.5">{r.place}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-earth-muted/70 mt-8" data-testid="reviews-sample-note">
          {t("reviews.sample")}
        </p>
      </div>
    </section>
  );
};
