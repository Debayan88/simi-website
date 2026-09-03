import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Send, CalendarCheck, MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import api from "../lib/api";
import { useLang } from "../i18n";

const inputCls =
  "w-full rounded-xl border border-sand-dark bg-limewash px-4 py-3 text-sm text-earth placeholder:text-earth-muted/60 focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-all";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.2em] text-earth-muted mb-2";

export const BookingTabs = () => {
  const [rooms, setRooms] = useState([]);
  const [sending, setSending] = useState(false);
  const { t, lang } = useLang();
  const roomData = t("rooms.data");

  const [bk, setBk] = useState({
    room_id: "verandah-suite",
    name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 2,
    message: "",
  });
  const [eq, setEq] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    api.get("/rooms").then((r) => setRooms(r.data.rooms)).catch(() => {});
  }, []);

  const room = useMemo(() => rooms.find((r) => r.id === bk.room_id), [rooms, bk.room_id]);
  const roomName = room ? (roomData[room.id]?.name || room.name) : "";
  const nights = bk.check_in && bk.check_out ? dayjs(bk.check_out).diff(dayjs(bk.check_in), "day") : 0;
  const total = room && nights > 0 ? nights * room.rate : 0;

  const waLink = useMemo(() => {
    if (!room || nights <= 0) return null;
    const msg = `Hello Dhansiri Farmstay! I'd like to book the ${room.name}.\nCheck-in: ${bk.check_in}\nCheck-out: ${bk.check_out}\nGuests: ${bk.guests}${bk.name ? `\nName: ${bk.name}` : ""}\nEstimated total: ₹${total.toLocaleString("en-IN")}`;
    return `https://wa.me/919903690119?text=${encodeURIComponent(msg)}`;
  }, [room, nights, bk, total]);

  const set = (k) => (e) => setBk((s) => ({ ...s, [k]: e.target.value }));
  const setE = (k) => (e) => setEq((s) => ({ ...s, [k]: e.target.value }));

  const submitBooking = async (e) => {
    e.preventDefault();
    if (nights <= 0) {
      toast.error(t("booking.dateErr"));
      return;
    }
    setSending(true);
    try {
      await api.post("/bookings", { ...bk, lang });
      toast.success(t("booking.toastOk"));
      setBk((s) => ({ ...s, name: "", email: "", phone: "", check_in: "", check_out: "", message: "" }));
      window.dispatchEvent(new Event("refresh-availability"));
    } catch (err) {
      toast.error(err.response?.data?.detail || t("booking.toastErr"));
    } finally {
      setSending(false);
    }
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/enquiries", eq);
      toast.success(t("booking.enquiryOk"));
      setEq({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || t("booking.enquiryErr"));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="booking" className="py-24 sm:py-32 bg-earth relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(192,86,33,0.18),transparent_55%)]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-terra-light mb-4">{t("booking.kicker")}</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-sand">
            {t("booking.h2a")}<em className="italic text-terra-light">{t("booking.h2em")}</em>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tabs defaultValue="booking" data-testid="booking-enquiry-tabs">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 bg-earth-muted/60 border border-sand/10 rounded-full p-1.5 h-auto">
              <TabsTrigger
                value="booking"
                data-testid="tab-booking-form"
                className="rounded-full py-3 font-mono text-xs uppercase tracking-[0.18em] data-[state=active]:bg-terra data-[state=active]:text-limewash text-sand/70 transition-all"
              >
                {t("booking.tabBooking")}
              </TabsTrigger>
              <TabsTrigger
                value="enquiry"
                data-testid="tab-enquiry-form"
                className="rounded-full py-3 font-mono text-xs uppercase tracking-[0.18em] data-[state=active]:bg-terra data-[state=active]:text-limewash text-sand/70 transition-all"
              >
                {t("booking.tabEnquiry")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking" className="mt-10">
              <form onSubmit={submitBooking} className="bg-limewash rounded-[28px] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8" data-testid="booking-form">
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="select-room-type">{t("booking.room")}</label>
                    <select id="select-room-type" data-testid="select-room-type" value={bk.room_id} onChange={set("room_id")} className={inputCls}>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>{roomData[r.id]?.name || r.name} — ₹{r.rate.toLocaleString("en-IN")}{t("rooms.night")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="input-checkin-date">{t("booking.checkin")}</label>
                    <input id="input-checkin-date" data-testid="input-checkin-date" type="date" required min={dayjs().format("YYYY-MM-DD")} value={bk.check_in} onChange={set("check_in")} className={`${inputCls} font-mono`} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="input-checkout-date">{t("booking.checkout")}</label>
                    <input id="input-checkout-date" data-testid="input-checkout-date" type="date" required min={bk.check_in || dayjs().format("YYYY-MM-DD")} value={bk.check_out} onChange={set("check_out")} className={`${inputCls} font-mono`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>{t("booking.guests")}</label>
                    <div className="flex items-center gap-4" data-testid="input-guest-count">
                      <button type="button" onClick={() => setBk((s) => ({ ...s, guests: Math.max(1, s.guests - 1) }))} className="w-10 h-10 rounded-full border border-sand-dark bg-limewash flex items-center justify-center hover:border-terra hover:text-terra transition-colors" aria-label="Fewer guests" data-testid="guests-minus-btn">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-lg text-earth w-8 text-center">{bk.guests}</span>
                      <button type="button" onClick={() => setBk((s) => ({ ...s, guests: Math.min(room?.capacity || 10, s.guests + 1) }))} className="w-10 h-10 rounded-full border border-sand-dark bg-limewash flex items-center justify-center hover:border-terra hover:text-terra transition-colors" aria-label="More guests" data-testid="guests-plus-btn">
                        <Plus className="w-4 h-4" />
                      </button>
                      {room && <span className="font-mono text-[11px] text-earth-muted">{t("booking.max")} {room.capacity}</span>}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="input-guest-name">{t("booking.name")}</label>
                    <input id="input-guest-name" data-testid="input-guest-name" required minLength={2} value={bk.name} onChange={set("name")} placeholder={t("booking.namePh")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="input-guest-phone">{t("booking.phone")}</label>
                    <input id="input-guest-phone" data-testid="input-guest-phone" required minLength={6} value={bk.phone} onChange={set("phone")} placeholder={t("booking.phonePh")} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="input-guest-email">{t("booking.email")}</label>
                    <input id="input-guest-email" data-testid="input-guest-email" type="email" required value={bk.email} onChange={set("email")} placeholder={t("booking.emailPh")} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="input-special-request">{t("booking.requests")}</label>
                    <textarea id="input-special-request" data-testid="input-special-request" rows={3} value={bk.message} onChange={set("message")} placeholder={t("booking.requestsPh")} className={`${inputCls} resize-none`} />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-sand/70 border border-sand-dark rounded-2xl p-6 h-full flex flex-col" data-testid="booking-summary">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-terra">{t("booking.yourStay")}</p>
                    <p className="font-serif text-2xl text-earth mt-3 leading-snug">{roomName || "—"}</p>
                    <div className="mt-5 space-y-2.5 font-mono text-xs text-earth-muted">
                      <p className="flex justify-between"><span>{t("booking.nights")}</span><span className="text-earth">{nights > 0 ? nights : "—"}</span></p>
                      <p className="flex justify-between"><span>{t("booking.rate")}</span><span className="text-earth">{room ? `₹${room.rate.toLocaleString("en-IN")}` : "—"}</span></p>
                      <p className="flex justify-between border-t border-sand-dark pt-2.5 text-sm"><span>{t("booking.total")}</span><span className="text-terra text-base font-medium">{total ? `₹${total.toLocaleString("en-IN")}` : "—"}</span></p>
                    </div>
                    <p className="text-xs text-earth-muted mt-4 leading-relaxed">{t("booking.noPayment")}</p>
                    <button
                      type="submit"
                      data-testid="btn-submit-booking"
                      disabled={sending}
                      className="mt-auto w-full rounded-full bg-terra text-limewash py-3.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-terra-deep active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
                    >
                      <CalendarCheck className="w-4 h-4" /> {sending ? t("booking.sending") : t("booking.request")}
                    </button>
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="btn-whatsapp-booking"
                        className="mt-3 w-full rounded-full bg-paddy text-limewash py-3.5 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-300"
                      >
                        <MessageCircle className="w-4 h-4" /> {t("booking.whatsapp")}
                      </a>
                    ) : (
                      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-earth-muted" data-testid="whatsapp-hint">
                        {t("booking.waHint")}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="enquiry" className="mt-10">
              <form onSubmit={submitEnquiry} className="bg-limewash rounded-[28px] p-6 sm:p-10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5" data-testid="enquiry-form">
                <div>
                  <label className={labelCls} htmlFor="input-enquiry-name">{t("booking.name")}</label>
                  <input id="input-enquiry-name" data-testid="input-enquiry-name" required minLength={2} value={eq.name} onChange={setE("name")} placeholder={t("booking.namePh")} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="input-enquiry-phone">{t("booking.phoneOptional")}</label>
                  <input id="input-enquiry-phone" data-testid="input-enquiry-phone" value={eq.phone} onChange={setE("phone")} placeholder={t("booking.phonePh")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="input-enquiry-email">{t("booking.email")}</label>
                  <input id="input-enquiry-email" data-testid="input-enquiry-email" type="email" required value={eq.email} onChange={setE("email")} placeholder={t("booking.emailPh")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="input-enquiry-message">{t("booking.message")}</label>
                  <textarea id="input-enquiry-message" data-testid="input-enquiry-message" required minLength={5} rows={5} value={eq.message} onChange={setE("message")} placeholder={t("booking.messagePh")} className={`${inputCls} resize-none`} />
                </div>
                <button
                  type="submit"
                  data-testid="btn-submit-enquiry"
                  disabled={sending}
                  className="sm:col-span-2 rounded-full bg-terra text-limewash py-3.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-terra-deep active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" /> {sending ? t("booking.sending") : t("booking.sendEnquiry")}
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};
