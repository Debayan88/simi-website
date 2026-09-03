import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { scrollToId } from "../hooks/useLenis";
import { useLang } from "../i18n";

const LOGO = "https://customer-assets-lqy194kg.emergentagent.net/job_room-availability-13/artifacts/0fscfhjg_file_000000002644720891c00d296e98d019.png";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLang();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const LINKS = [
    { id: "manifesto", label: t("nav.manifesto"), testid: "nav-link-manifesto" },
    { id: "rooms", label: t("nav.rooms"), testid: "nav-link-rooms" },
    { id: "availability", label: t("nav.availability"), testid: "nav-link-availability" },
    { id: "booking", label: t("nav.booking"), testid: "nav-link-booking" },
    { id: "contact", label: t("nav.contact"), testid: "nav-link-contact" },
  ];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        <button
          data-testid="nav-brand-logo"
          onClick={() => scrollToId("home")}
          className="flex items-center gap-3 group"
        >
          <img src={LOGO} alt="Dhansiri Farmstay logo" data-testid="nav-logo-img" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-1 ring-sand-dark group-hover:ring-terra transition-all" />
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-earth">
            Dhansiri <span className="italic text-terra">farmstay</span>
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
        <div className="flex items-center gap-3">
          <button
            data-testid="lang-toggle"
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-terra/40 text-terra px-4 py-2 text-xs font-medium hover:bg-sand hover:border-terra active:scale-[0.97] transition-all duration-300"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "বাংলা" : "EN"}
          </button>
          <button
            data-testid="nav-btn-reserve-now"
            onClick={() => scrollToId("booking")}
            className="rounded-full bg-terra text-limewash px-5 py-2.5 text-sm font-medium hover:bg-terra-deep active:scale-[0.97] transition-all duration-300"
          >
            {t("nav.reserve")}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
