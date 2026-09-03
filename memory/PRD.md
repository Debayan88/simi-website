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

## Implemented (2026-09-03, v4.1)
- Farmstay emblem added to the top of every guest + owner email (all 8 templates, verified 202 sends through the guardrail gate)
- Giant faded logo watermark with slow parallax behind the hero; navbar logo enlarged (56–64px, header 80–96px), footer logo 80px
- Room card photos still stock — no finished-room photos attached yet

## Implemented (2026-09-03, v4)
- Brand corrected to "Dhansiri Farmstay" everywhere (navbar + footer show the official circular logo, hero subtitle EN/BN, WhatsApp prefill message, EMAIL_FROM_NAME so all guest/owner emails send as Dhansiri Farmstay)
- Real construction photo (June 2026) placed in Manifesto chapter 01 "Earth"; hero/room images remain stock until finished-house photos are shared
- Owner date blocking: blocks collection + GET/POST/DELETE /api/blocks (auth); dashboard "Block dates — family use & maintenance" card (room, first/last blocked date, private note, unblock); blocked dates show as taken on the public calendar and reject guest bookings (409)
- Bengali guest emails: booking/enquiry payloads carry lang; booking-received, enquiry-ack, confirmed and cancelled emails have full Bengali templates when guest books from the Bengali site. Owner notifications stay English.

## Implemented (2026-09-02, v3.1)
- Demo data wiped: all 3 test bookings + 1 test enquiry + 4 sample reviews deleted; calendar fully fresh
- Reviews wall hidden from landing page (no real guest words yet); GET /api/reviews and the Reviews component remain in code, DB empty — paste real words to re-enable

## Implemented (2026-09-02, v3)
- Bengali/English toggle in navbar (full landing page i18n incl. hero, manifesto, rooms, availability, booking/enquiry forms, reviews, contact; choice persisted in localStorage). Admin dashboard stays English.
- Guest reviews wall under rooms: GET /api/reviews, 4 seeded sample reviews (bilingual text, stars) — flagged on-page as samples until real guests leave words.
- Owner change-password: POST /api/auth/change-password (auth + current-password check + bcrypt) with Settings card in /admin dashboard. Admin seed now only creates the account when missing — restarts never overwrite an owner-changed password.
- (v2) Rebrand to Dhansiri, owner email alerts, WhatsApp prefilled booking, owner dashboard with confirm/cancel.
- Rebranded to Dhansiri Homestay, Kulpi, West Bengal (20 km from Bakkhali); real phone/WhatsApp +91 99036 90119 and owner email simitaroy69@gmail.com across site and emails
- Owner email alerts: OWNER_EMAIL + EMAIL_REPLY_TO set — every booking/enquiry emails the owner (verified 202 Accepted); guests get confirmation emails
- WhatsApp booking: "Book via WhatsApp" button in booking summary opens wa.me/919903690119 with room/dates/guests/total prefilled
- Owner dashboard at /admin: JWT cookie auth (login/logout/me/refresh, bcrypt, 5-attempt lockout), stats, bookings + enquiries tabs, Confirm / Cancel / Restore with clash guard and automatic guest emails; GET /bookings + /api/enquiries now owner-only; cancelled bookings free their calendar dates
- Admin creds: simitaroy69@gmail.com / 7F1xQurt7HtoeR! (also in test_credentials.md)

## Backlog
- P1: Replace stock photos with real photos of the finished house (user to attach)
- P2: Seasonal pricing, whole-house booking option, multi-language (Bengali), guest reviews section
- P2: Password reset flow UI (endpoint pattern documented in /app/auth_testing.md)

## Test data note
Demo bookings: Sep 10–13 verandah-suite (confirmed), Oct 5–7 double-brick-room (pending), Jul 20–23 verandah-suite (cancelled). One test enquiry. Clear from DB when going live.
