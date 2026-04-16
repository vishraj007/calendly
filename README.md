# Schedulr - Modern Scheduling Platform

**Schedulr** is a high-performance, seamless appointment scheduling tool inspired by the premium features of industry standards. It enables individual professionals and large enterprise organizations to eliminate the back-and-forth of scheduling by allowing invitees to pick their preferred time based on real-time availability.

##  Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Date & Time Management:** `date-fns`, `date-fns-tz`

## Architecture Overview

The system is split into two primary layers: a highly responsive React frontend communicating over REST API to an Express backend. The backend manages scheduling logic and persists data to PostgreSQL via Prisma ORM.

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

##  Database Schema Diagram

Below is the representation of our Prisma architecture supporting multi-timezone booking, custom event types, and granular availability override management.

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
        Int bufferBefore
        Int bufferAfter
        Json customQuestions
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
        String meetingLink
    }

    Contact {
        String id PK
        String userId FK
        String name
        String email
        String phone
        String timezone
    }
```

## 🛠 Setup Instructions

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **PostgreSQL** database (running locally or using a service like Supabase/Neon)

### 1. Database Setup

Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/calendly_clone"
PORT=5000

# Optional: Add SMTP credentials for email notifications
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

From the `backend` directory, initialize your database:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push

# Optional: Seed the database with the default host user
npx ts-node prisma/seed.ts
```

### 2. Start the Backend

```bash
cd backend
npm run dev
```
The backend API should now be running on `http://localhost:5000`.

### 3. Start the Frontend

Create a `.env.local` file in the `frontend/` directory (if needed to customize API routes, defaults to port 5000):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install dependencies and run the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend should now be running on `http://localhost:3000`.

### 4. You're set!
Navigate to `http://localhost:3000` to view the landing page and `http://localhost:3000/admin` or `/dashboard` to manage your availability.
