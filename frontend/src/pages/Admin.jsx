import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Check, X, RotateCcw, Phone, Mail } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuth, formatApiErrorDetail } from "../context/AuthContext";

const inputCls =
  "w-full rounded-xl border border-sand-dark bg-limewash px-4 py-3 text-sm text-earth placeholder:text-earth-muted/60 focus:outline-none focus:ring-2 focus:ring-terra focus:border-terra transition-all";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-stone-200 text-stone-500 border-stone-300",
};

const LoginForm = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-limewash flex items-center justify-center px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-white border border-sand-dark rounded-[28px] p-8 shadow-[0_30px_60px_-25px_rgba(140,50,24,0.25)]"
        data-testid="admin-login-form"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-terra">Owner only</p>
        <h1 className="font-serif text-3xl font-semibold text-earth mt-2">Dhansiri <em className="italic text-terra">dashboard</em></h1>
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-earth-muted mt-7 mb-2" htmlFor="admin-email">Email</label>
        <input id="admin-email" data-testid="admin-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-earth-muted mt-4 mb-2" htmlFor="admin-password">Password</label>
        <input id="admin-password" data-testid="admin-password-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
        {error && <p className="text-sm text-red-700 mt-3" data-testid="admin-login-error">{error}</p>}
        <button type="submit" data-testid="admin-login-submit" disabled={busy} className="mt-6 w-full rounded-full bg-terra text-limewash py-3.5 text-sm font-medium hover:bg-terra-deep active:scale-[0.98] transition-all disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="block text-center font-mono text-[11px] text-earth-muted hover:text-terra mt-5 transition-colors" data-testid="admin-back-to-site">← Back to site</a>
      </motion.form>
    </div>
  );
};

const BookingRow = ({ b, rooms, onStatus }) => {
  const room = rooms.find((r) => r.id === b.room_id);
  const nights = dayjs(b.check_out).diff(dayjs(b.check_in), "day");
  return (
    <div className="bg-white border border-sand-dark rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-4" data-testid={`booking-row-${b.id}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-serif text-xl text-earth font-semibold">{b.name}</p>
          <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status] || STATUS_STYLES.pending}`} data-testid={`booking-status-${b.id}`}>{b.status}</span>
        </div>
        <p className="text-sm text-earth-muted mt-1">{room?.name || b.room_id} · {b.guests} guest{b.guests > 1 ? "s" : ""} · {nights} night{nights !== 1 ? "s" : ""}</p>
        <p className="font-mono text-xs text-terra mt-1">{b.check_in} → {b.check_out}</p>
        {b.message && <p className="text-sm text-earth-muted mt-2 italic">“{b.message}”</p>}
        <p className="font-mono text-[11px] text-earth-muted mt-2 flex flex-wrap gap-4">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</span>
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{b.email}</span>
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        {b.status !== "confirmed" && (
          <button onClick={() => onStatus(b.id, "confirmed")} data-testid={`booking-confirm-${b.id}`} className="rounded-full bg-paddy text-limewash px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:opacity-90 active:scale-[0.97] transition-all">
            <Check className="w-3.5 h-3.5" /> Confirm
          </button>
        )}
        {b.status !== "cancelled" && (
          <button onClick={() => onStatus(b.id, "cancelled")} data-testid={`booking-cancel-${b.id}`} className="rounded-full border border-red-300 text-red-700 px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 active:scale-[0.97] transition-all">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
        {b.status === "cancelled" && (
          <button onClick={() => onStatus(b.id, "pending")} data-testid={`booking-restore-${b.id}`} className="rounded-full border border-sand-dark text-earth-muted px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:border-terra hover:text-terra active:scale-[0.97] transition-all">
            <RotateCcw className="w-3.5 h-3.5" /> Restore
          </button>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [rooms, setRooms] = useState([]);

  const load = useCallback(() => {
    api.get("/bookings").then((r) => setBookings(r.data.bookings)).catch(() => {});
    api.get("/enquiries").then((r) => setEnquiries(r.data.enquiries)).catch(() => {});
    api.get("/rooms").then((r) => setRooms(r.data.rooms)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const onStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (e) { /* ignore */ }
    setUser(false);
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-limewash" data-testid="admin-dashboard">
      <header className="bg-limewash/85 backdrop-blur-xl border-b border-sand-dark sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <p className="font-serif text-xl font-semibold text-earth">Dhansiri <em className="italic text-terra">dashboard</em></p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-mono text-[11px] text-earth-muted">{user.email}</span>
            <a href="/" className="font-mono text-[11px] uppercase tracking-wider text-earth-muted hover:text-terra transition-colors" data-testid="admin-view-site">Site</a>
            <button onClick={logout} data-testid="admin-logout-btn" className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-earth-muted hover:text-red-700 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Requests", value: bookings.length },
            { label: "Pending", value: pendingCount },
            { label: "Enquiries", value: enquiries.length },
          ].map((s) => (
            <div key={s.label} className="bg-sand/60 border border-sand-dark rounded-2xl p-5 text-center" data-testid={`stat-${s.label.toLowerCase()}`}>
              <p className="font-serif text-3xl text-terra font-semibold">{s.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-earth-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {["bookings", "enquiries"].map((t) => (
            <button key={t} onClick={() => setTab(t)} data-testid={`admin-tab-${t}`} className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${tab === t ? "bg-terra text-limewash" : "bg-white border border-sand-dark text-earth-muted hover:border-terra hover:text-terra"}`}>
              {t === "bookings" ? `Bookings (${bookings.length})` : `Enquiries (${enquiries.length})`}
            </button>
          ))}
        </div>

        {tab === "bookings" ? (
          <div className="space-y-4">
            {bookings.length === 0 && <p className="text-center text-earth-muted py-16 font-serif text-xl italic">No booking requests yet.</p>}
            {bookings.map((b) => <BookingRow key={b.id} b={b} rooms={rooms} onStatus={onStatus} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.length === 0 && <p className="text-center text-earth-muted py-16 font-serif text-xl italic">No enquiries yet.</p>}
            {enquiries.map((e2) => (
              <div key={e2.id} className="bg-white border border-sand-dark rounded-2xl p-5" data-testid={`enquiry-row-${e2.id}`}>
                <p className="font-serif text-xl text-earth font-semibold">{e2.name}</p>
                <p className="font-mono text-[11px] text-earth-muted mt-1">{e2.email}{e2.phone ? ` · ${e2.phone}` : ""}</p>
                <p className="text-sm text-earth-muted mt-3 leading-relaxed">{e2.message}</p>
                <p className="font-mono text-[10px] text-earth-muted/70 mt-3">{dayjs(e2.created_at).format("DD MMM YYYY, HH:mm")}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default function Admin() {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-screen bg-limewash flex items-center justify-center">
        <p className="font-serif text-2xl italic text-earth-muted animate-pulse">Loading…</p>
      </div>
    );
  }
  return user ? <Dashboard /> : <LoginForm />;
}
