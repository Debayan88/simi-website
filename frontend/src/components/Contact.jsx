import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { DoodleLantern } from "./Doodle";
import { useLang } from "../i18n";

const LOGO = "https://customer-assets-lqy194kg.emergentagent.net/job_room-availability-13/artifacts/0fscfhjg_file_000000002644720891c00d296e98d019.png";

export const Contact = () => {
  const { t } = useLang();
  const CARDS = [
    { icon: Phone, label: t("contact.call"), value: "+91 99036 90119", href: "tel:+919903690119", testid: "contact-strip-phone" },
    { icon: MessageCircle, label: t("contact.whatsapp"), value: "+91 99036 90119", href: "https://wa.me/919903690119", testid: "contact-strip-whatsapp" },
    { icon: Mail, label: t("contact.write"), value: "simitaroy69@gmail.com", href: "mailto:simitaroy69@gmail.com", testid: "contact-strip-email" },
  ];
  return (
    <section id="contact" className="py-24 sm:py-32 bg-limewash relative overflow-hidden">
      <DoodleLantern className="absolute top-14 left-8 w-12 text-terra/30 hidden lg:block" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra mb-4">{t("contact.kicker")}</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-earth">
            {t("contact.h2a")}<em className="italic text-terra">{t("contact.h2em")}</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.testid}
              href={c.href}
              data-testid={c.testid}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group bg-sand/60 hover:bg-terra border border-sand-dark hover:border-terra rounded-2xl p-8 text-center transition-all duration-400 active:scale-[0.98]"
            >
              <c.icon className="w-6 h-6 mx-auto text-terra group-hover:text-limewash transition-colors" />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-earth-muted group-hover:text-sand/80 mt-4 transition-colors">{c.label}</p>
              <p className="font-serif text-xl text-earth group-hover:text-limewash mt-2 transition-colors break-all">{c.value}</p>
            </motion.a>
          ))}
        </div>

        <footer className="mt-24 border-t border-sand-dark pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg text-earth flex items-center gap-3">
            <img src={LOGO} alt="Dhansiri Farmstay logo" className="w-12 h-12 rounded-full object-cover ring-1 ring-sand-dark" data-testid="footer-logo" />
            Dhansiri <span className="italic text-terra">farmstay</span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-earth-muted" data-testid="footer-coordinates">
            {t("contact.coords")}
          </p>
        </footer>
      </div>
    </section>
  );
};
