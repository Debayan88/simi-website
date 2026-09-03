from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import uuid
import logging
import ipaddress
import secrets
import httpx
import bcrypt
import jwt
from bson import ObjectId
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Literal
from datetime import datetime, timezone, date, timedelta
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# Emergent managed email proxy. CONSTANT — never read from os.environ.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL")

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie(key="access_token", value=create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(user_id), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def seed_admin():
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "Owner", "role": "admin",
                                   "created_at": datetime.now(timezone.utc).isoformat()})

ROOMS = [
    {
        "id": "verandah-suite",
        "name": "The Bamboo Verandah Suite",
        "capacity": 3,
        "rate": 6500,
        "tagline": "Private open verandah over the paddy pond",
        "features": ["Private open verandah", "Paddy field & pond view", "Hand-crafted rattan swing", "Lime wash earthen bath"],
    },
    {
        "id": "family-clay-room",
        "name": "Two-Storey Family Clay Haven",
        "capacity": 5,
        "rate": 9200,
        "tagline": "A whole floor for the family, under Mangalore tiles",
        "features": ["Double floor layout", "Mangalore tiled roof balcony", "Brick jaali ambient ventilation", "Private garden courtyard"],
    },
    {
        "id": "double-brick-room",
        "name": "Terracotta Double Room",
        "capacity": 2,
        "rate": 4800,
        "tagline": "Raw brick, warm lantern light, courtyard air",
        "features": ["Raw brick accent wall", "Warm lantern light setup", "Organic cotton bedding", "Courtyard access"],
    },
]


# ---- Email guardrail gate (G2/G3 structural defense) ----
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            resp = await client_http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


async def _try_send(**kwargs):
    try:
        return await send_email(**kwargs)
    except Exception as e:
        logger.warning(f"Email skipped/failed: {e}")
        return None


# ---- Models ----
class BookingCreate(BaseModel):
    room_id: str
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=6, max_length=20)
    check_in: date
    check_out: date
    guests: int = Field(ge=1, le=10)
    message: Optional[str] = Field(default=None, max_length=1000)
    lang: Literal["en", "bn"] = "en"


class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    message: str = Field(min_length=5, max_length=1500)
    lang: Literal["en", "bn"] = "en"


# ---- Routes ----
@api_router.get("/")
async def root():
    return {"message": "Village Homestay API"}


@api_router.get("/rooms")
async def get_rooms():
    return {"rooms": ROOMS}


@api_router.get("/availability")
async def get_availability(month: str):
    try:
        year, mon = month.split("-")
        first = date(int(year), int(mon), 1)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=400, detail="month must be YYYY-MM")
    next_month = date(first.year + 1, 1, 1) if first.month == 12 else date(first.year, first.month + 1, 1)
    last = next_month - timedelta(days=1)
    cursor = db.bookings.find(
        {"status": {"$ne": "cancelled"},
         "check_in": {"$lte": last.isoformat()}, "check_out": {"$gt": first.isoformat()}},
        {"_id": 0, "room_id": 1, "check_in": 1, "check_out": 1},
    )
    booked: Dict[str, List[str]] = {}
    async for b in cursor:
        d0 = date.fromisoformat(b["check_in"])
        d1 = date.fromisoformat(b["check_out"])
        d = max(d0, first)
        end = min(d1, next_month)
        while d < end:
            booked.setdefault(b["room_id"], []).append(d.isoformat())
            d += timedelta(days=1)
    block_cursor = db.blocks.find(
        {"check_in": {"$lte": last.isoformat()}, "check_out": {"$gt": first.isoformat()}},
        {"_id": 0, "room_id": 1, "check_in": 1, "check_out": 1},
    )
    async for b in block_cursor:
        d0 = date.fromisoformat(b["check_in"])
        d1 = date.fromisoformat(b["check_out"])
        d = max(d0, first)
        end = min(d1, next_month)
        while d < end:
            booked.setdefault(b["room_id"], []).append(d.isoformat())
            d += timedelta(days=1)
    return {"month": month, "booked": booked}


ROW_LABELS = {
    "en": {"room": "Room", "in": "Check-in", "out": "Check-out", "guests": "Guests", "name": "Name", "email": "Email", "phone": "Phone", "req": "Requests"},
    "bn": {"room": "ঘর", "in": "আগমন", "out": "প্রস্থান", "guests": "অতিথি", "name": "নাম", "email": "ইমেইল", "phone": "ফোন", "req": "অনুরোধ"},
}


def _booking_email_rows(b: dict, room: dict, lang: str = "en") -> str:
    L = ROW_LABELS.get(lang, ROW_LABELS["en"])
    rows = [
        (L["room"], room["name"]),
        (L["in"], b["check_in"]),
        (L["out"], b["check_out"]),
        (L["guests"], str(b["guests"])),
        (L["name"], b["name"]),
        (L["email"], b["email"]),
        (L["phone"], b["phone"]),
        (L["req"], b.get("message") or "—"),
    ]
    return "".join(
        f'<tr><td style="padding:8px 16px 8px 0;color:#8C3218;font-size:13px;vertical-align:top">{escape(k)}</td>'
        f'<td style="padding:8px 0;font-size:13px;color:#231F1D">{escape(v)}</td></tr>'
        for k, v in rows
    )


@api_router.post("/bookings")
async def create_booking(input: BookingCreate):
    room = next((r for r in ROOMS if r["id"] == input.room_id), None)
    if not room:
        raise HTTPException(status_code=400, detail="Unknown room")
    if input.check_out <= input.check_in:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")
    if input.guests > room["capacity"]:
        raise HTTPException(status_code=400, detail=f"{room['name']} sleeps up to {room['capacity']} guests")
    clash = await db.bookings.find_one(
        {"room_id": input.room_id, "status": {"$ne": "cancelled"},
         "check_in": {"$lt": input.check_out.isoformat()},
         "check_out": {"$gt": input.check_in.isoformat()}},
        {"_id": 0},
    )
    if not clash:
        clash = await db.blocks.find_one(
            {"room_id": input.room_id,
             "check_in": {"$lt": input.check_out.isoformat()},
             "check_out": {"$gt": input.check_in.isoformat()}},
            {"_id": 0},
        )
    if clash:
        raise HTTPException(status_code=409, detail="Those dates are already reserved for this room")

    doc = input.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["check_in"] = input.check_in.isoformat()
    doc["check_out"] = input.check_out.isoformat()
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)

    if OWNER_EMAIL:
        owner_html = (
            '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
            '<tr><td style="font-family:Georgia,serif">'
            f'<h2 style="color:#C05621;margin:0 0 12px">New booking request</h2>'
            f'<table>{_booking_email_rows(doc, room)}</table>'
            f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)} booking system.</p>'
            '</td></tr></table>'
        )
        await _try_send(to=OWNER_EMAIL, subject=f"New booking request — {room['name']}", html=owner_html)

    if doc.get("lang") == "bn":
        guest_html = (
            '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
            '<tr><td style="font-family:Georgia,serif">'
            f'<h2 style="color:#C05621;margin:0 0 12px">আপনার থাকার অনুরোধ পৌঁছে গেছে</h2>'
            f'<p style="font-size:14px;color:#231F1D">প্রিয় {escape(doc["name"])}, {escape(EMAIL_FROM_NAME)} বেছে নেওয়ার জন্য ধন্যবাদ।</p>'
            f'<table>{_booking_email_rows(doc, room, "bn")}</table>'
            '<p style="font-size:13px;color:#3D3531">আমরা শীঘ্রই আপনার বুকিং নিশ্চিত করব।</p>'
            f'<p style="font-size:12px;color:#888;margin-top:16px">{escape(EMAIL_FROM_NAME)} থেকে পাঠানো। আমরা কখনোই ইমেইলে পাসওয়ার্ড বা কার্ডের তথ্য চাই না।</p>'
            '</td></tr></table>'
        )
        subject = f"আপনার {EMAIL_FROM_NAME} থাকার অনুরোধ"
    else:
        guest_html = (
            '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
            '<tr><td style="font-family:Georgia,serif">'
            f'<h2 style="color:#C05621;margin:0 0 12px">We have received your stay request</h2>'
            f'<p style="font-size:14px;color:#231F1D">Dear {escape(doc["name"])}, thank you for choosing {escape(EMAIL_FROM_NAME)}.</p>'
            f'<table>{_booking_email_rows(doc, room)}</table>'
            '<p style="font-size:13px;color:#3D3531">We will confirm your reservation shortly.</p>'
            f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)}. We never ask for passwords or card details by email.</p>'
            '</td></tr></table>'
        )
        subject = f"Your {EMAIL_FROM_NAME} stay request"
    await _try_send(to=doc["email"], subject=subject, html=guest_html)
    return {"status": "success", "booking": doc}


@api_router.post("/enquiries")
async def create_enquiry(input: EnquiryCreate):
    doc = input.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.enquiries.insert_one(doc)
    doc.pop("_id", None)

    if OWNER_EMAIL:
        owner_html = (
            '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
            '<tr><td style="font-family:Georgia,serif">'
            f'<h2 style="color:#C05621;margin:0 0 12px">New enquiry</h2>'
            f'<p style="font-size:13px;color:#231F1D"><strong>{escape(doc["name"])}</strong> '
            f'({escape(doc["email"])}{", " + escape(doc["phone"]) if doc.get("phone") else ""}) wrote:</p>'
            f'<p style="font-size:14px;color:#231F1D;border-left:3px solid #C05621;padding-left:12px">{escape(doc["message"])}</p>'
            f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)} enquiry system.</p>'
            '</td></tr></table>'
        )
        await _try_send(to=OWNER_EMAIL, subject=f"New enquiry from {doc['name']}", html=owner_html)

    if doc.get("lang") == "bn":
        guest_html = (
            '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
            '<tr><td style="font-family:Georgia,serif">'
            f'<h2 style="color:#C05621;margin:0 0 12px">আপনার জিজ্ঞাসার জন্য ধন্যবাদ</h2>'
            f'<p style="font-size:14px;color:#231F1D">প্রিয় {escape(doc["name"])}, আপনার বার্তা পেয়েছি — শীঘ্রই উত্তর দেওয়া হবে।</p>'
            f'<p style="font-size:12px;color:#888;margin-top:16px">{escape(EMAIL_FROM_NAME)} থেকে পাঠানো। আমরা কখনোই ইমেইলে পাসওয়ার্ড বা কার্ডের তথ্য চাই না।</p>'
            '</td></tr></table>'
        )
        subject = f"আপনার {EMAIL_FROM_NAME} জিজ্ঞাসা"
    else:
        guest_html = (
            '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
            '<tr><td style="font-family:Georgia,serif">'
            f'<h2 style="color:#C05621;margin:0 0 12px">Thank you for your enquiry</h2>'
            f'<p style="font-size:14px;color:#231F1D">Dear {escape(doc["name"])}, we have received your message and will reply soon.</p>'
            f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)}. We never ask for passwords or card details by email.</p>'
            '</td></tr></table>'
        )
        subject = f"Your {EMAIL_FROM_NAME} enquiry"
    await _try_send(to=doc["email"], subject=subject, html=guest_html)
    return {"status": "success", "enquiry": doc}


@api_router.get("/bookings")
async def list_bookings(user=Depends(get_current_user)):
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"bookings": items}


@api_router.get("/enquiries")
async def list_enquiries(user=Depends(get_current_user)):
    items = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"enquiries": items}


class StatusUpdate(BaseModel):
    status: Literal["pending", "confirmed", "cancelled"]


@api_router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, input: StatusUpdate, user=Depends(get_current_user)):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if input.status != "cancelled":
        clash = await db.bookings.find_one(
            {"id": {"$ne": booking_id}, "room_id": booking["room_id"], "status": {"$ne": "cancelled"},
             "check_in": {"$lt": booking["check_out"]}, "check_out": {"$gt": booking["check_in"]}},
            {"_id": 0},
        )
        if clash:
            raise HTTPException(status_code=409, detail="Dates clash with another active booking")
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": input.status}})
    room = next((r for r in ROOMS if r["id"] == booking["room_id"]), {"name": booking["room_id"]})
    if input.status == "confirmed":
        if booking.get("lang") == "bn":
            html = (
                '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
                '<tr><td style="font-family:Georgia,serif">'
                f'<h2 style="color:#3B5838;margin:0 0 12px">আপনার থাকা নিশ্চিত হয়েছে</h2>'
                f'<p style="font-size:14px;color:#231F1D">প্রিয় {escape(booking["name"])}, {escape(EMAIL_FROM_NAME)}-এ আপনাকে স্বাগত জানাতে আমরা অপেক্ষা করছি।</p>'
                f'<table>{_booking_email_rows(booking, room, "bn")}</table>'
                f'<p style="font-size:12px;color:#888;margin-top:16px">{escape(EMAIL_FROM_NAME)} থেকে পাঠানো।</p>'
                '</td></tr></table>'
            )
            subject = f"আপনার {EMAIL_FROM_NAME} থাকা নিশ্চিত হয়েছে"
        else:
            html = (
                '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
                '<tr><td style="font-family:Georgia,serif">'
                f'<h2 style="color:#3B5838;margin:0 0 12px">Your stay is confirmed</h2>'
                f'<p style="font-size:14px;color:#231F1D">Dear {escape(booking["name"])}, we look forward to hosting you at {escape(EMAIL_FROM_NAME)}.</p>'
                f'<table>{_booking_email_rows(booking, room)}</table>'
                f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)}.</p>'
                '</td></tr></table>'
            )
            subject = f"Your {EMAIL_FROM_NAME} stay is confirmed"
        await _try_send(to=booking["email"], subject=subject, html=html)
    elif input.status == "cancelled":
        if booking.get("lang") == "bn":
            html = (
                '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
                '<tr><td style="font-family:Georgia,serif">'
                f'<h2 style="color:#8C3218;margin:0 0 12px">আপনার বুকিং বাতিল হয়েছে</h2>'
                f'<p style="font-size:14px;color:#231F1D">প্রিয় {escape(booking["name"])}, {escape(room["name"])} '
                f'({escape(booking["check_in"])} থেকে {escape(booking["check_out"])})-এর আপনার বুকিং বাতিল করা হয়েছে। তারিখগুলো আবার খালি আছে।</p>'
                f'<p style="font-size:12px;color:#888;margin-top:16px">{escape(EMAIL_FROM_NAME)} থেকে পাঠানো।</p>'
                '</td></tr></table>'
            )
            subject = f"আপনার {EMAIL_FROM_NAME} বুকিং বাতিল"
        else:
            html = (
                '<table role="presentation" width="100%" style="background:#FCF9F2;padding:24px">'
                '<tr><td style="font-family:Georgia,serif">'
                f'<h2 style="color:#8C3218;margin:0 0 12px">Your booking was cancelled</h2>'
                f'<p style="font-size:14px;color:#231F1D">Dear {escape(booking["name"])}, your booking for {escape(room["name"])} '
                f'({escape(booking["check_in"])} to {escape(booking["check_out"])}) has been cancelled. The dates are free again.</p>'
                f'<p style="font-size:12px;color:#888;margin-top:16px">Sent by {escape(EMAIL_FROM_NAME)}.</p>'
                '</td></tr></table>'
            )
            subject = f"Your {EMAIL_FROM_NAME} booking was cancelled"
        await _try_send(to=booking["email"], subject=subject, html=html)
    return {"status": "success", "booking_id": booking_id, "new_status": input.status}


class LoginInput(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    window_start = (datetime.now(timezone.utc) - timedelta(minutes=15)).isoformat()
    fails = await db.login_attempts.count_documents({"identifier": identifier, "at": {"$gte": window_start}})
    if fails >= 5:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.insert_one({"identifier": identifier, "at": datetime.now(timezone.utc).isoformat()})
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_many({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name", "Owner"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "success"}


@api_router.get("/auth/me")
async def auth_me(user=Depends(get_current_user)):
    return {"id": user["_id"], "email": user["email"], "name": user.get("name", "Owner"), "role": user.get("role", "admin")}


@api_router.post("/auth/refresh")
async def refresh_session(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie(key="access_token", value=create_access_token(str(user["_id"]), user["email"]),
                        httponly=True, secure=True, samesite="none", max_age=900, path="/")
    return {"status": "success"}


class ChangePasswordInput(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


@api_router.post("/auth/change-password")
async def change_password(input: ChangePasswordInput, user=Depends(get_current_user)):
    doc = await db.users.find_one({"_id": ObjectId(user["_id"])})
    if not doc or not verify_password(input.current_password, doc["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if input.new_password == input.current_password:
        raise HTTPException(status_code=400, detail="New password must be different")
    await db.users.update_one({"_id": doc["_id"]}, {"$set": {"password_hash": hash_password(input.new_password)}})
    return {"status": "success"}


SAMPLE_REVIEWS = [
    {
        "name": "Anindita & Rahul", "place": "Kolkata", "stars": 5,
        "text_en": "We woke to mist over the pond and the smell of rice on the clay stove. The verandah swing alone is worth the drive from Kolkata.",
        "text_bn": "পুকুরের উপর কুয়াশা আর মাটির চুলায় ভাতের গন্ধে ঘুম ভাঙল। কলকাতা থেকে শুধু বারান্দার দোলনার জন্যই আসা যায়।",
    },
    {
        "name": "Meera Dasgupta", "place": "New Delhi", "stars": 5,
        "text_en": "Raw brick, lantern light, and the quietest nights I have slept in years. The fish curry in a clay pot is unreal.",
        "text_bn": "কাঁচা ইট, হারিকেনের আলো, আর বহু বছরের মধ্যে সবচেয়ে শান্ত রাতের ঘুম। মাটির হাঁড়িতে মাছের ঝোল অসাধারণ।",
    },
    {
        "name": "The Banerjee Family", "place": "Bakkhali", "stars": 5,
        "text_en": "Twenty minutes from Bakkhali and a world away. The kids watched egrets in the paddy while we did absolutely nothing. Perfect.",
        "text_bn": "বাকখালি থেকে মিনিট কুড়ি, অথচ একেবারে অন্য জগৎ। বাচ্চারা ধানক্ষেতে বক দেখল, আমরা একদম কিছুই করলাম না। দারুণ।",
    },
    {
        "name": "Arjun Mehta", "place": "Mumbai", "stars": 5,
        "text_en": "Booked over WhatsApp in two minutes. The doodle walls, the jaali light, the pond at dusk — my camera roll is full.",
        "text_bn": "WhatsApp-এ দুই মিনিটে বুকিং। দেয়ালের আঁকিবুঁকি, জালির আলো, সন্ধ্যায় পুকুর — আমার ক্যামেরা রোল ভরে গেছে।",
    },
]


async def seed_reviews():
    if await db.reviews.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        await db.reviews.insert_many(
            [{**r, "id": str(uuid.uuid4()), "created_at": now} for r in SAMPLE_REVIEWS]
        )


@api_router.get("/reviews")
async def list_reviews():
    items = await db.reviews.find({}, {"_id": 0}).to_list(50)
    return {"reviews": items}


class BlockCreate(BaseModel):
    room_id: str
    check_in: date
    check_out: date
    note: Optional[str] = Field(default=None, max_length=200)


@api_router.get("/blocks")
async def list_blocks(user=Depends(get_current_user)):
    items = await db.blocks.find({}, {"_id": 0}).sort("check_in", 1).to_list(500)
    return {"blocks": items}


@api_router.post("/blocks")
async def create_block(input: BlockCreate, user=Depends(get_current_user)):
    if not any(r["id"] == input.room_id for r in ROOMS):
        raise HTTPException(status_code=400, detail="Unknown room")
    if input.check_out <= input.check_in:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    doc = {
        "id": str(uuid.uuid4()),
        "room_id": input.room_id,
        "check_in": input.check_in.isoformat(),
        "check_out": input.check_out.isoformat(),
        "note": input.note,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.blocks.insert_one(doc)
    doc.pop("_id", None)
    return {"status": "success", "block": doc}


@api_router.delete("/blocks/{block_id}")
async def delete_block(block_id: str, user=Depends(get_current_user)):
    res = await db.blocks.delete_one({"id": block_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Block not found")
    return {"status": "success"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
