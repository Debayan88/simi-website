# Auth Testing Playbook — Dhansiri Homestay

Auth: custom email/password JWT (httpOnly cookies: access_token 15min, refresh_token 7d, samesite=none secure). bcrypt hashes. Brute-force: 5 failed logins per ip:email → 15 min lockout (login_attempts collection).

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: hash starts with `$2b$`; unique index on users.email; index on login_attempts.identifier.

## Step 2: API Testing
```
curl -c cookies.txt -X POST <BACKEND_URL>/api/auth/login -H "Content-Type: application/json" -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>"}'
curl -b cookies.txt <BACKEND_URL>/api/auth/me
curl <BACKEND_URL>/api/bookings            # expect 401 without cookie
curl -b cookies.txt <BACKEND_URL>/api/bookings   # expect 200 with cookie
```

Owner actions: PATCH /api/bookings/{id}/status {"status":"confirmed"|"cancelled"|"pending"} (auth required). Cancelled bookings free their dates on /api/availability; confirm/cancel emails go to the guest automatically.
