import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import api from "../lib/api";

const ROOM_TABS = [
  { id: "verandah-suite", label: "Verandah Suite" },
  { id: "family-clay-room", label: "Family Clay Haven" },
  { id: "double-brick-room", label: "Terracotta Double" },
];

export const Availability = () => {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [roomId, setRoomId] = useState("verandah-suite");
  const [booked, setBooked] = useState({});

  const load = useCallback(() => {
    api.get(`/availability?month=${month}`).then((r) => setBooked(r.data.booked)).catch(() => {});
  }, [month]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const refetch = () => load();
    const onSelect = (e) => setRoomId(e.detail);
    window.addEventListener("refresh-availability", refetch);
    window.addEventListener("select-room", onSelect);
    return () => {
      window.removeEventListener("refresh-availability", refetch);
      window.removeEventListener("select-room", onSelect);
    };
  }, [load]);

  const monthDate = dayjs(`${month}-01`);
  const daysInMonth = monthDate.daysInMonth();
  const startOffset = monthDate.day();
  const today = dayjs().format("YYYY-MM-DD");
  const bookedSet = useMemo(() => new Set(booked[roomId] || []), [booked, roomId]);

  const shiftMonth = (delta) => setMonth(monthDate.add(delta, "month").format("YYYY-MM"));

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(monthDate.date(d).format("YYYY-MM-DD"));

  return (
    <section id="availability" className="py-24 sm:py-32 bg-limewash">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra mb-4">Availability</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-earth">
            Find your <em className="italic text-terra">free</em> dates.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-sand/60 border border-sand-dark rounded-[28px] p-6 sm:p-10"
          data-testid="room-availability-calendar"
        >
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {ROOM_TABS.map((r) => (
              <button
                key={r.id}
                data-testid={`availability-room-tab-${r.id}`}
                onClick={() => setRoomId(r.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                  roomId === r.id
                    ? "bg-terra text-limewash"
                    : "bg-limewash border border-sand-dark text-earth-muted hover:border-terra hover:text-terra"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              data-testid="availability-prev-month"
              onClick={() => shiftMonth(-1)}
              className="w-10 h-10 rounded-full border border-sand-dark bg-limewash flex items-center justify-center text-earth hover:border-terra hover:text-terra transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="font-serif text-2xl sm:text-3xl text-earth" data-testid="availability-month-label">
              {monthDate.format("MMMM YYYY")}
            </p>
            <button
              data-testid="availability-next-month"
              onClick={() => shiftMonth(1)}
              className="w-10 h-10 rounded-full border border-sand-dark bg-limewash flex items-center justify-center text-earth hover:border-terra hover:text-terra transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 font-mono text-[10px] uppercase tracking-wider text-earth-muted text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {cells.map((dateStr, i) => {
              if (!dateStr) return <span key={`e-${i}`} />;
              const isPast = dateStr < today;
              const isBooked = bookedSet.has(dateStr);
              const isToday = dateStr === today;
              return (
                <div
                  key={dateStr}
                  data-testid={`calendar-day-${dateStr}`}
                  data-booked={isBooked}
                  className={`aspect-square rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm transition-colors ${
                    isBooked
                      ? "bg-terra text-limewash line-through decoration-limewash/60"
                      : isPast
                      ? "text-earth-muted/40"
                      : "bg-limewash border border-sand-dark text-earth hover:border-terra"
                  } ${isToday && !isBooked ? "ring-2 ring-terra ring-offset-1 ring-offset-sand" : ""}`}
                >
                  {dayjs(dateStr).date()}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 justify-center font-mono text-[11px] uppercase tracking-wider text-earth-muted">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-limewash border border-sand-dark inline-block" /> Available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-terra inline-block" /> Booked
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-limewash border border-sand-dark ring-2 ring-terra inline-block" /> Today
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
