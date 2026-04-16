import { PrismaClient, BookingStatus } from "@prisma/client";
import { addDays, subDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();
const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || "default-user-cuid";

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.booking.deleteMany();
  await prisma.availabilityOverride.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventType.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      id: DEFAULT_USER_ID,
      name: "Alex Johnson",
      email: "alex@schedulr.dev",
      timezone: "Asia/Kolkata",
    },
  });

  // Mon-Fri 9-6, Sat 10-2, Sun off
  await prisma.availability.createMany({
    data: [
      { userId: user.id, dayOfWeek: 0, startTime: "09:00", endTime: "18:00", isActive: false },
      { userId: user.id, dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: true },
      { userId: user.id, dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isActive: true },
      { userId: user.id, dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isActive: true },
      { userId: user.id, dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isActive: true },
      { userId: user.id, dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isActive: true },
      { userId: user.id, dayOfWeek: 6, startTime: "10:00", endTime: "14:00", isActive: true },
    ],
  });

  // Date override — next Monday half day
  const nextMonday = addDays(
    new Date(),
    ((1 + 7 - new Date().getDay()) % 7) || 7
  );
  nextMonday.setHours(0, 0, 0, 0);

  await prisma.availabilityOverride.create({
    data: {
      userId: user.id,
      date: nextMonday,
      isOff: false,
      startTime: "09:00",
      endTime: "13:00",
    },
  });

  const [quickChat, thirtyMin, deepDive] = await Promise.all([
    prisma.eventType.create({
      data: {
        userId: user.id,
        name: "Quick Chat",
        slug: "quick-chat",
        duration: 15,
        description: "A quick 15-minute intro or catch-up call.",
        color: "#0069ff",
        location: "Google Meet",
        bufferBefore: 0,
        bufferAfter: 5,
        customQuestions: [],
      },
    }),
    prisma.eventType.create({
      data: {
        userId: user.id,
        name: "30 Min Meeting",
        slug: "30-min-meeting",
        duration: 30,
        description: "Standard meeting for discussions and planning.",
        color: "#ff4f00",
        location: "Zoom",
        bufferBefore: 5,
        bufferAfter: 5,
        customQuestions: [
          {
            id: "q1",
            label: "What would you like to discuss?",
            type: "text",
            required: true,
          },
        ],
      },
    }),
    prisma.eventType.create({
      data: {
        userId: user.id,
        name: "Deep Dive",
        slug: "deep-dive",
        duration: 60,
        description: "An in-depth session for complex topics.",
        color: "#7b2ff7",
        location: "Google Meet",
        bufferBefore: 10,
        bufferAfter: 10,
        customQuestions: [
          {
            id: "q1",
            label: "What topics should we cover?",
            type: "textarea",
            required: true,
          },
          {
            id: "q2",
            label: "Have we worked together before?",
            type: "select",
            required: false,
            options: ["Yes", "No"],
          },
        ],
      },
    }),
  ]);

  const now = new Date();

  await prisma.booking.createMany({
    data: [
      {
        hostId: user.id,
        eventTypeId: thirtyMin.id,
        inviteeName: "Priya Sharma",
        inviteeEmail: "priya@example.com",
        startTime: setMinutes(setHours(addDays(now, 1), 10), 0),
        endTime: setMinutes(setHours(addDays(now, 1), 10), 30),
        timezone: "Asia/Kolkata",
        status: BookingStatus.CONFIRMED,
        notes: "Discuss Q4 roadmap",
        customAnswers: { q1: "Product roadmap and timeline" },
      },
      {
        hostId: user.id,
        eventTypeId: quickChat.id,
        inviteeName: "Rahul Verma",
        inviteeEmail: "rahul@example.com",
        startTime: setMinutes(setHours(addDays(now, 2), 14), 0),
        endTime: setMinutes(setHours(addDays(now, 2), 14), 15),
        timezone: "Asia/Kolkata",
        status: BookingStatus.CONFIRMED,
      },
      {
        hostId: user.id,
        eventTypeId: deepDive.id,
        inviteeName: "Sarah Connor",
        inviteeEmail: "sarah@example.com",
        startTime: setMinutes(setHours(addDays(now, 3), 11), 0),
        endTime: setMinutes(setHours(addDays(now, 3), 12), 0),
        timezone: "America/New_York",
        status: BookingStatus.CONFIRMED,
        notes: "Architecture review",
        customAnswers: {
          q1: "System design and scaling",
          q2: "No",
        },
      },
      {
        hostId: user.id,
        eventTypeId: thirtyMin.id,
        inviteeName: "John Smith",
        inviteeEmail: "john@example.com",
        startTime: setMinutes(setHours(subDays(now, 2), 15), 0),
        endTime: setMinutes(setHours(subDays(now, 2), 15), 30),
        timezone: "Asia/Kolkata",
        status: BookingStatus.CONFIRMED,
        customAnswers: { q1: "Weekly sync" },
      },
      {
        hostId: user.id,
        eventTypeId: quickChat.id,
        inviteeName: "Emma Wilson",
        inviteeEmail: "emma@example.com",
        startTime: setMinutes(setHours(subDays(now, 5), 9), 0),
        endTime: setMinutes(setHours(subDays(now, 5), 9), 15),
        timezone: "Europe/London",
        status: BookingStatus.CANCELLED,
        cancelReason: "Schedule conflict",
      },
    ],
  });

  // Seed contacts (auto-created + manual)
  await prisma.contact.createMany({
    data: [
      { userId: user.id, name: "Priya Sharma", email: "priya@example.com", company: "Acme Corp", jobTitle: "Product Manager", timezone: "Asia/Kolkata" },
      { userId: user.id, name: "Rahul Verma", email: "rahul@example.com", company: "TechStart", jobTitle: "Software Engineer", timezone: "Asia/Kolkata" },
      { userId: user.id, name: "Sarah Connor", email: "sarah@example.com", company: "Nexus Labs", jobTitle: "Architect", timezone: "America/New_York" },
      { userId: user.id, name: "John Smith", email: "john@example.com", company: "DataFlow Inc", jobTitle: "Sales Director", timezone: "Asia/Kolkata" },
      { userId: user.id, name: "Emma Wilson", email: "emma@example.com", company: "CloudBase", jobTitle: "Customer Success Lead", timezone: "Europe/London" },
    ],
  });

  console.log("✅ Seed complete!");
  console.log(`   User: ${user.email}`);
  console.log(`   Event types: quick-chat, 30-min-meeting, deep-dive`);
  console.log(`   Bookings: 5 (3 upcoming, 1 past, 1 cancelled)`);
  console.log(`   Contacts: 5`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());