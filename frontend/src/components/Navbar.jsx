import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollToId } from "../hooks/useLenis";

const LINKS = [
  { id: "manifesto", label: "Manifesto", testid: "nav-link-manifesto" },
  { id: "rooms", label: "Rooms", testid: "nav-link-rooms" },
  { id: "availability", label: "Availability", testid: "nav-link-availability" },
  { id: "booking", label: "Booking", testid: "nav-link-booking" },
  { id: "contact", label: "Contact", testid: "nav-link-contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      data-testid="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "bg-limewash/85 backdrop-blur-xl border-sand-dark" : "bg-limewash/40 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
        <button
          data-testid="nav-brand-logo"
          onClick={() => scrollToId("home")}
          className="flex items-center gap-3 group"
        >
          <span className="w-9 h-9 rounded-t-full bg-terra text-limewash flex items-center justify-center font-serif text-lg italic group-hover:bg-terra-deep transition-colors">D</span>
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-earth">
            Dhansiri <span className="italic text-terra">homestay</span>
          </span>
        </button>
        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={l.testid}
              onClick={() => scrollToId(l.id)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-earth-muted hover:text-terra transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>
        <button
          data-testid="nav-btn-reserve-now"
          onClick={() => scrollToId("booking")}
          className="rounded-full bg-terra text-limewash px-5 py-2.5 text-sm font-medium hover:bg-terra-deep active:scale-[0.97] transition-all duration-300"
        >
          Reserve Stay
        </button>
      </div>
    </motion.header>
  );
};
