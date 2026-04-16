<div align="center">
  
# Schedulr

**The Modern, Open-Source Scheduling Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Schedulr is a high-performance, seamless appointment scheduling tool inspired by the premium features of industry standards like Calendly. It eliminates the back-and-forth of scheduling by allowing invitees to easily pick their preferred times based on real-time availability.

</div>

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)

---

## Features

- **⚡ Blazing Fast UI:** Built with Next.js App Router for optimal rendering performance.
- **📅 Dynamic Availability:** Set weekly working hours and specific date overrides (e.g., holidays, vacations).
- **🛡️ Conflict Prevention:** Real-time database checks prevent double-booking.
- **🌐 Timezone Intelligence:** Seamlessly converts and formats slots based on user and invitee timezones using `date-fns-tz`.
- **✉️ Automated Notifications:** Nodemailer integration for booking confirmations, cancellations, and reschedules.
- **🎨 Premium Aesthetic:** High-fidelity UI using Tailwind CSS designed to mirror professional enterprise software.

---

## Architecture Overview

The system utilizes a decoupled architecture, separating the client interface from the business logic layer, communicating via a RESTful API.

```mermaid
flowchart TD
    Client[Client Browser] <-->|REST API| NextJS[Next.js Frontend]
    NextJS <-->|API Calls| Express[Express.js / Node Backend]
    Express <-->|Prisma ORM| Postgres[(PostgreSQL DB)]
    
    subgraph Backend Services
        Express --> SlotService[Availability & Slot Generator]
        Express --> EmailService[Nodemailer / Notifications]
        Express --> Integrations[Google/Zoom Connectors]
    end
```

---

## Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State/Fetching:** Custom Hooks & Native Fetch

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Time Logic:** `date-fns` & `date-fns-tz`

### Database
- **Engine:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)

---

## Database Schema Diagram

The database architecture is designed to support multi-timezone booking, distinct event types, contact mapping, and granular availability management.

```mermaid
erDiagram
    User ||--o{ EventType : "creates"
    User ||--o{ Availability : "sets weekly"
    User ||--o{ AvailabilityOverride : "sets specific date"
    User ||--o{ Booking : "hosts"
    User ||--o{ Contact : "manages"
    EventType ||--o{ Booking : "has many"

    User {
        String id PK
        String name
        String email
        String timezone
        DateTime createdAt
    }

    EventType {
        String id PK
        String userId FK
        String name
        String slug
        Int duration
        Boolean isActive
        String color
        String location
    }

    Availability {
        String id PK
        String userId FK
        Int dayOfWeek
        String startTime
        String endTime
        Boolean isActive
    }

    AvailabilityOverride {
        String id PK
        String userId FK
        DateTime date
        Boolean isOff
        String startTime
        String endTime
    }

    Booking {
        String id PK
        String hostId FK
        String eventTypeId FK
        String inviteeName
        String inviteeEmail
        DateTime startTime
        DateTime endTime
        String timezone
        Enum status "CONFIRMED | CANCELLED"
    }

    Contact {
        String id PK
        String userId FK
        String name
        String email
    }
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Locally or via a service like Neon/Supabase)

### 1. Clone & Install
Begin by installing dependencies for both the frontend and backend.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` files in both directories. Refer to the [Environment Variables](#environment-variables) section below for the required keys.

### 3. Initialize Database
Navigate to the backend to set up your PostgreSQL schema and seed the initial data.
```bash
cd backend
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
```

### 4. Run Development Servers
Start both servers concurrently.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Server runs on http://localhost:3000
```

---

## Environment Variables

### Backend `.env`
Located in `/backend/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/calendly_db"
PORT=5000

# Email configurations (Optional, for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Frontend `.env`
Located in `/frontend/.env` or `/frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## API Overview

The Express backend exposes RESTful endpoints under `/api`. Below are the core routes module boundaries:

- **`/api/event-types`**: Management of meeting types (durations, limits, specifics).
- **`/api/availability`**: Schedule generation and availability lookup (resolving base hours + overrides against existing bookings).
- **`/api/bookings`**: Creation, rescheduling, and cancellation of meetings. Integrates heavily with `EmailService`.
- **`/api/contacts`**: Auto-generated CRM records based on historical bookings. 
