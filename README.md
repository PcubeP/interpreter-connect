# 🤟 InterpreterConnect

A friendly platform that connects people with **sign-language interpreters** for events,
appointments, classrooms, and everything in between.

Interpreters create a profile listing the sign languages they know — **Indian Sign Language (ISL)**,
**American Sign Language (ASL)**, **British Sign Language (BSL)**, and more, in any combination —
and clients browse, filter, and send booking requests in a few clicks.

## Features

- **Secure accounts** — passwords are hashed client-side with PBKDF2-SHA256 (150k iterations,
  per-user salt) via the Web Crypto API; raw passwords are never stored.
- **Two roles** — _clients_ who book interpreters and _interpreters_ who offer services.
- **Interpreter onboarding** — pick sign languages, specializations, rate, availability, and more.
- **Browse & filter** — search interpreters by sign language, specialization, and availability.
- **Booking flow** — request an interpreter for a specific event with date, time, duration, and notes.
- **Dashboards** — interpreters accept/decline/complete requests; clients track and cancel bookings.
- **Soft pastel UI** — a calm, happy, self-explanatory design.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router

Data is persisted in the browser's `localStorage`, so the app runs entirely in the front end
with no backend required.

> **Note on security:** client-only storage is great for a demo/prototype. For production you
> would move authentication and data to a real server with HTTPS and a protected database.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Create one account as an **interpreter** (complete the profile)
and another as a **client** to try the full booking flow.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run typecheck` — type-check only
