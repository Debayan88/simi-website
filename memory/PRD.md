# PRD — Village Homestay Landing Page

## Original Problem Statement
"Build a landing page: A homestay website want to make. Colour will be Terracota and sand colour. Will be tabs for booking and enquiry, availability of rooms."
User provided a concept board (Village Homestay — Terracotta & Sand, two-storey brick house, Mangalore tile roof, open verandahs, brick jaali, village doodle-art walls) and a real construction photo of the house by a pond.

## User Choices (from clarifying Q&A)
- Name/location: user will provide real name later — "Village Homestay" placeholder used throughout
- 3 room types (from floor plans)
- Booking: simple form (saved, no payments) + availability calendar per room (booked/free dates) + enquiry form — BOTH built
- Email every enquiry via Emergent-managed Resend — YES (owner email address still needed from user)
- Contact details: placeholders (+91 98765 43210, hello@villagehomestay.in)

## User Personas
- Urban slow-travel guest browsing rooms, checking dates, requesting a stay
- Prospective guest with questions (whole-house booking, events) using enquiry tab
- Homestay owner receiving booking/enquiry emails and viewing saved requests

## Architecture
- FastAPI backend (/api prefix): GET /rooms, GET /availability?month=YYYY-MM, POST /bookings (validates dates, capacity, double-booking clash → 409), POST /enquiries, GET /bookings, GET /enquiries (owner viewing, no auth yet)
- MongoDB via MONGO_URL/DB_NAME: bookings + enquiries collections
- Emergent managed email proxy (EMAIL_BASE_URL constant, EMERGENT_EMAIL_KEY + EMAIL_FROM_NAME in backend/.env, guardrail gate on every send, server-side templates only). OWNER_EMAIL env var empty — owner notifications skipped until user supplies their real email; guest confirmations always sent.
- React frontend: single-page, lenis smooth scroll, framer-motion reveals/parallax, shadcn Tabs, sonner toasts, dayjs calendar grid. Components: Navbar, Hero (masked line reveal + arch-clipped parallax image + doodle SVG), Marquee, Manifesto (01 Earth / 02 Light / 03 Craft + experiences), Rooms, Availability (per-room month calendar), BookingTabs (Booking + Enquiry), Contact/Footer.

## Implemented (2026-09-02)
- Full landing page with terracotta (#C05621) & sand (#F5EBE1) palette, Cormorant Garamond / Plus Jakarta Sans / JetBrains Mono
- 3 rooms: Bamboo Verandah Suite ₹6,500, Two-Storey Family Clay Haven ₹9,200, Terracotta Double Room ₹4,800
- Live availability calendar per room, month navigation, booked dates struck through in terracotta
- Booking form with live nights/total calculator; enquiry form; both persist + trigger emails
- Verified: curl for all endpoints incl. double-booking rejection; UI booking submitted → toast → calendar blocks dates instantly; email proxy returned 202 Accepted (guest confirmations to resend test address)

## Backlog
- P0: Set OWNER_EMAIL in backend/.env with user's real email (ask user!) so owner gets notifications
- P0: Swap real homestay name/location + real contact details (currently placeholders)
- P1: Owner admin page with login to confirm/cancel bookings (pending → confirmed), protected GET /bookings
- P1: Replace stock photos with real photos of the finished house
- P2: WhatsApp deep-link booking, multi-room cart, seasonal pricing, i18n

## Test data note
Demo bookings exist: verandah-suite Jul 20–22 2026 and Sep 10–12 2026 (both test submissions). Clear from `bookings` collection when going live.
