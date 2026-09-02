import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowUpRight, Check } from "lucide-react";
import api from "../lib/api";
import { scrollToId } from "../hooks/useLenis";
import { useLang } from "../i18n";

const ROOM_IMAGES = {
  "verandah-suite": "https://images.unsplash.com/photo-1778726444642-3f374cbffef5?crop=entropy&cs=srgb&fm=jpg&q=85",
  "family-clay-room": "https://images.unsplash.com/photo-1774280954999-9758f11f3d41?crop=entropy&cs=srgb&fm=jpg&q=85",
  "double-brick-room": "https://images.unsplash.com/photo-1778331246390-2b91f56864e4?crop=entropy&cs=srgb&fm=jpg&q=85",
};

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const { t } = useLang();
  const roomData = t("rooms.data");

  useEffect(() => {
    api.get("/rooms").then((r) => setRooms(r.data.rooms)).catch(() => {});
  }, []);

  const pick = (id) => {
    window.dispatchEvent(new CustomEvent("select-room", { detail: id }));
    scrollToId("availability");
  };

  return (
    <section id="rooms" className="py-24 sm:py-32 bg-sand/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra mb-4">{t("rooms.kicker")}</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-earth">
              {t("rooms.h2a")}<em className="italic text-terra">{t("rooms.h2em")}</em>{t("rooms.h2b")}
            </h2>
          </div>
          <p className="font-mono text-xs text-earth-muted tracking-wider max-w-[240px] sm:text-right">
            {t("rooms.note")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rooms.map((room, i) => {
            const rd = roomData[room.id] || {};
            return (
              <motion.article
                key={room.id}
                data-testid={`room-card-${room.id}`}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-limewash border border-sand-dark rounded-[28px] overflow-hidden hover:shadow-[0_30px_60px_-25px_rgba(140,50,24,0.35)] hover:-translate-y-1.5 transition-all duration-500"
              >
                <div className="relative overflow-hidden rounded-t-[28px]">
                  <img
                    src={ROOM_IMAGES[room.id]}
                    alt={rd.name || room.name}
                    loading="lazy"
                    className="spotlight-img w-full h-64 object-cover"
                  />
                  <span className="absolute top-4 left-4 font-mono text-[11px] tracking-wider bg-limewash/90 backdrop-blur px-3 py-1.5 rounded-full text-terra border border-sand-dark">
                    ₹{room.rate.toLocaleString("en-IN")} {t("rooms.night")}
                  </span>
                </div>
                <div className="p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-terra/80 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> {t("rooms.upto")} {room.capacity} {t("rooms.guestsWord")}
                  </p>
                  <h3 className="font-serif text-2xl font-semibold text-earth mt-3 leading-snug">{rd.name || room.name}</h3>
                  <p className="text-sm text-earth-muted mt-2 italic font-serif">{rd.tagline || room.tagline}</p>
                  <ul className="mt-5 space-y-2">
                    {(rd.features || room.features).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-earth-muted">
                        <Check className="w-4 h-4 text-paddy mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    data-testid={`room-check-availability-${room.id}`}
                    onClick={() => pick(room.id)}
                    className="mt-7 w-full rounded-full border border-terra/40 text-terra py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-terra hover:text-limewash active:scale-[0.98] transition-all duration-300"
                  >
                    {t("rooms.check")} <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
