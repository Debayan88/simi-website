import { createContext, useContext, useEffect, useState } from "react";

export const T = {
  en: {
    nav: { manifesto: "Manifesto", rooms: "Rooms", availability: "Availability", booking: "Booking", contact: "Contact", reserve: "Reserve Stay" },
    hero: {
      kicker: "Est. 2026 · Kulpi, West Bengal · 20 km from Bakkhali",
      l1: "A house of clay,", l2a: "light & ", l2em: "slow", l3: "mornings.",
      subtitle: "Dhansiri is a two-storey village farmstay of raw brick, Mangalore tile and lime wash — open verandahs over the paddy pond, lantern light at dusk, and doodle-art walls that tell the village's story.",
      book: "Reserve your stay", enquire: "Send an enquiry",
      stats: ["Rooms", "Floors", "Pond"],
      hosting: "Now hosting", hostingSub: "Monsoon season stays",
    },
    marquee: ["Terracotta & Sand", "Paddy Walks", "Lantern Nights", "Clay-Pot Dining", "Open Verandahs", "Village Doodle Art", "Mangalore Tile Roofs"],
    manifesto: {
      kicker: "The Manifesto",
      h2a: "Three things we built ", h2em: "this house", h2b: " around.",
      chapters: [
        { no: "01", title: "Earth", body: "Walls of raw terracotta brick, laid by village hands. Lime wash that breathes with the seasons. A Mangalore clay-tile roof that sings in the monsoon." },
        { no: "02", title: "Light", body: "Open verandahs pull in daylight and village air. Brick jaali screens scatter the afternoon sun. At dusk, lanterns take over — slow, warm, deliberate." },
        { no: "03", title: "Craft", body: "Rattan swings, bamboo railings, clay pots from the kiln down the road. Doodle murals on every wall — the village, drawn by the village." },
      ],
      experiencesKicker: "While you are here",
      experiences: ["Paddy walks at dawn", "Pottery making", "Clay-pot dining", "Lantern-lit stargazing"],
    },
    rooms: {
      kicker: "Stay",
      h2a: "Three rooms, ", h2em: "one roof", h2b: " of clay tile.",
      note: "RATES PER NIGHT · BREAKFAST FROM THE CLAY STOVE INCLUDED",
      upto: "Up to", guestsWord: "guests", night: "/ night", check: "Check availability",
      data: {
        "verandah-suite": { name: "The Bamboo Verandah Suite", tagline: "Private open verandah over the paddy pond", features: ["Private open verandah", "Paddy field & pond view", "Hand-crafted rattan swing", "Lime wash earthen bath"] },
        "family-clay-room": { name: "Two-Storey Family Clay Haven", tagline: "A whole floor for the family, under Mangalore tiles", features: ["Double floor layout", "Mangalore tiled roof balcony", "Brick jaali ambient ventilation", "Private garden courtyard"] },
        "double-brick-room": { name: "Terracotta Double Room", tagline: "Raw brick, warm lantern light, courtyard air", features: ["Raw brick accent wall", "Warm lantern light setup", "Organic cotton bedding", "Courtyard access"] },
      },
    },
    availability: {
      kicker: "Availability",
      h2a: "Find your ", h2em: "free", h2b: " dates.",
      tabs: { "verandah-suite": "Verandah Suite", "family-clay-room": "Family Clay Haven", "double-brick-room": "Terracotta Double" },
      days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      available: "Available", booked: "Booked", today: "Today",
    },
    booking: {
      kicker: "Reserve",
      h2a: "Book the house, ", h2em: "or just say hello.",
      tabBooking: "Booking", tabEnquiry: "Enquiry",
      room: "Room", checkin: "Check-in", checkout: "Check-out", guests: "Guests", max: "max",
      name: "Full name", namePh: "Asha Rao", phone: "Phone", phonePh: "+91 99036 90119",
      email: "Email", emailPh: "you@example.com", requests: "Special requests",
      requestsPh: "Early check-in, dietary needs, pottery session…",
      yourStay: "Your stay", nights: "Nights", rate: "Rate", total: "Total",
      noPayment: "No payment now — we confirm availability and reserve the dates for you.",
      request: "Request booking", sending: "Sending…", whatsapp: "Book via WhatsApp",
      waHint: "Pick dates to book via WhatsApp",
      toastOk: "Stay request received — we will confirm shortly by email.",
      toastErr: "Could not send your booking. Please try again.",
      dateErr: "Check-out must be after check-in",
      phoneOptional: "Phone (optional)", message: "Message",
      messagePh: "Ask us anything — whole-house bookings, events, long stays…",
      sendEnquiry: "Send enquiry",
      enquiryOk: "Enquiry sent — we will reply to your email soon.",
      enquiryErr: "Could not send your enquiry. Please try again.",
    },
    reviews: {
      kicker: "The guest book",
      h2a: "Kind words from ", h2em: "the verandah.",
      sample: "Sample reviews — real guest words arriving soon.",
    },
    contact: {
      kicker: "Contact",
      h2a: "The kettle is ", h2em: "always on.",
      call: "Call us", whatsapp: "WhatsApp", write: "Write to us",
      coords: "Kulpi, West Bengal · 22.08° N, 88.24° E",
    },
  },
  bn: {
    nav: { manifesto: "আমাদের কথা", rooms: "ঘর", availability: "খালি তারিখ", booking: "বুকিং", contact: "যোগাযোগ", reserve: "বুক করুন" },
    hero: {
      kicker: "স্থাপিত ২০২৬ · কুলপি, পশ্চিমবঙ্গ · বাকখালি থেকে ২০ কিমি",
      l1: "মাটির ঘর,", l2a: "আলো আর ", l2em: "ধীর", l3: "সকাল।",
      subtitle: "ধানসিরি — কুলপির একটি দোতলা গ্রামের ফার্মস্টে; কাঁচা ইট, ম্যাঙ্গালোর টাইল আর চুনকামের দেয়াল — ধানক্ষেতের পুকুরের উপর খোলা বারান্দা, সন্ধ্যায় হারিকেনের আলো, আর দেয়ালে গাঁয়ের গল্পের আঁকিবুঁকি।",
      book: "থাকার জায়গা বুক করুন", enquire: "জিজ্ঞাসা পাঠান",
      stats: ["ঘর", "তলা", "পুকুর"],
      hosting: "এখন চলছে", hostingSub: "বর্ষাকালীন অতিথি আপ্যায়ন",
    },
    marquee: ["টেরাকোটা ও বালি", "ধানক্ষেতে হাঁটা", "হারিকেনের রাত", "মাটির হাঁড়িতে ভোজ", "খোলা বারান্দা", "গাঁয়ের আঁকিবুঁকি", "ম্যাঙ্গালোর টাইলের ছাদ"],
    manifesto: {
      kicker: "আমাদের কথা",
      h2a: "তিনটি জিনিস ঘিরে ", h2em: "এই ঘর", h2b: " গড়া।",
      chapters: [
        { no: "০১", title: "মাটি", body: "গ্রামের মানুষের হাতে গড়া কাঁচা টেরাকোটা ইটের দেয়াল। ঋতুর সঙ্গে নিঃশ্বাস নেওয়া চুনকাম। বর্ষায় গেয়ে ওঠা ম্যাঙ্গালোর মাটির টাইলের ছাদ।" },
        { no: "০২", title: "আলো", body: "খোলা বারান্দায় ঢুকে পড়ে দিনের আলো আর গাঁয়ের বাতাস। ইটের জালির পর্দা বিকেলের রোদ ছড়িয়ে দেয়। সন্ধ্যায় হারিকেন জ্বলে ওঠে — ধীরে, উষ্ণ, মন দিয়ে।" },
        { no: "০৩", title: "কারুকাজ", body: "বেতের ঝুলন, বাঁশের রেলিং, রাস্তার ওপারের কুমোরের মাটির হাঁড়ি। প্রতিটি দেয়ালে আঁকিবুঁকি — গ্রাম, গ্রামের হাতে আঁকা।" },
      ],
      experiencesKicker: "এখানে থাকাকালীন",
      experiences: ["ভোরে ধানক্ষেতে হাঁটা", "মাটির পাত্র তৈরি", "মাটির হাঁড়িতে ভোজ", "হারিকেনের আলোয় তারাদর্শন"],
    },
    rooms: {
      kicker: "থাকুন",
      h2a: "তিনটি ঘর, ", h2em: "এক ছাদ", h2b: " মাটির টাইলের।",
      note: "প্রতি রাতের ভাড়া · মাটির চুলার সকালের নাশতা অন্তর্ভুক্ত",
      upto: "সর্বাধিক", guestsWord: "জন অতিথি", night: "/ রাত", check: "খালি তারিখ দেখুন",
      data: {
        "verandah-suite": { name: "বাঁশের বারান্দা স্যুট", tagline: "ধানক্ষেতের পুকুরের উপর নিজস্ব খোলা বারান্দা", features: ["নিজস্ব খোলা বারান্দা", "ধানক্ষেত ও পুকুরের দৃশ্য", "হাতে বোনা বেতের দোলনা", "চুনকামের মাটির গোসলখানা"] },
        "family-clay-room": { name: "দোতলা পারিবারিক মাটির আশ্রয়", tagline: "ম্যাঙ্গালোর টাইলের নিচে পরিবারের জন্য পুরো একতলা", features: ["দোতলা বিন্যাস", "ম্যাঙ্গালোর টাইলের ছাদের ব্যালকনি", "ইটের জালির স্বাভাবিক বাতাস", "নিজস্ব বাগানের আঙিনা"] },
        "double-brick-room": { name: "টেরাকোটা ডাবল রুম", tagline: "কাঁচা ইট, হারিকেনের উষ্ণ আলো, আঙিনার বাতাস", features: ["কাঁচা ইটের সাজানো দেয়াল", "হারিকেনের উষ্ণ আলো", "সুতির তুলোর বিছানা", "আঙিনায় যাওয়ার পথ"] },
      },
    },
    availability: {
      kicker: "খালি তারিখ",
      h2a: "আপনার পছন্দের ", h2em: "খালি", h2b: " তারিখ খুঁজুন।",
      tabs: { "verandah-suite": "বারান্দা স্যুট", "family-clay-room": "পারিবারিক ঘর", "double-brick-room": "টেরাকোটা ডাবল" },
      days: ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"],
      available: "খালি আছে", booked: "বুকড", today: "আজ",
    },
    booking: {
      kicker: "বুকিং",
      h2a: "ঘর বুক করুন, ", h2em: "কিংবা শুধু নমস্কার জানান।",
      tabBooking: "বুকিং", tabEnquiry: "জিজ্ঞাসা",
      room: "ঘর", checkin: "আগমনের তারিখ", checkout: "প্রস্থানের তারিখ", guests: "অতিথি", max: "সর্বাধিক",
      name: "পুরো নাম", namePh: "আশা রাও", phone: "ফোন", phonePh: "+91 99036 90119",
      email: "ইমেইল", emailPh: "you@example.com", requests: "বিশেষ অনুরোধ",
      requestsPh: "আগে আগমন, খাবারের প্রয়োজন, মৃৎশিল্পের অধিবেশন…",
      yourStay: "আপনার থাকা", nights: "রাত", rate: "ভাড়া", total: "মোট",
      noPayment: "এখন কোনো পেমেন্ট নয় — আমরা খালি তারিখ নিশ্চিত করে আপনার জন্য রেখে দেব।",
      request: "বুকিং অনুরোধ পাঠান", sending: "পাঠানো হচ্ছে…", whatsapp: "WhatsApp-এ বুক করুন",
      waHint: "WhatsApp-এ বুক করতে তারিখ বাছুন",
      toastOk: "আপনার থাকার অনুরোধ পৌঁছেছে — শীঘ্রই ইমেইলে নিশ্চিত করা হবে।",
      toastErr: "বুকিং পাঠানো গেল না। আবার চেষ্টা করুন।",
      dateErr: "প্রস্থানের তারিখ আগমনের তারিখের পরে হতে হবে",
      phoneOptional: "ফোন (ঐচ্ছিক)", message: "বার্তা",
      messagePh: "যা জানতে চান তা জিজ্ঞাসা করুন — পুরো বাড়ি বুকিং, অনুষ্ঠান, দীর্ঘ থাকা…",
      sendEnquiry: "জিজ্ঞাসা পাঠান",
      enquiryOk: "জিজ্ঞাসা পাঠানো হয়েছে — শীঘ্রই আপনার ইমেইলে উত্তর দেওয়া হবে।",
      enquiryErr: "জিজ্ঞাসা পাঠানো গেল না। আবার চেষ্টা করুন।",
    },
    reviews: {
      kicker: "অতিথি বই",
      h2a: "বারান্দা থেকে ", h2em: "ভালোবাসার কথা।",
      sample: "নমুনা রিভিউ — আসল অতিথিদের কথা শীঘ্রই আসছে।",
    },
    contact: {
      kicker: "যোগাযোগ",
      h2a: "কেটলিতে সবসময় ", h2em: "গরম জল আছে।",
      call: "ফোন করুন", whatsapp: "WhatsApp", write: "ইমেইল লিখুন",
      coords: "কুলপি, পশ্চিমবঙ্গ · ২২.০৮° উ, ৮৮.২৪° পূ",
    },
  },
};

const LangContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("dhansiri-lang") || "en");
  useEffect(() => {
    localStorage.setItem("dhansiri-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), T[lang]) ?? path;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
