import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { sendSuccess } from "../lib/response";
import { DEFAULT_USER_ID } from "../lib/constants";

const router = Router();

// GET /analytics/dashboard — aggregated stats from real data
router.get("/dashboard", asyncHandler(async (_req, res) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Run all queries in parallel for performance
  const [
    totalBookings,
    thisWeekBookings,
    lastWeekBookings,
    upcomingMeetings,
    activeEventTypes,
    totalContacts,
    bookingsByEventType,
    bookingsByDay,
    recentBookings,
    cancelledCount,
  ] = await Promise.all([
    prisma.booking.count({ where: { hostId: DEFAULT_USER_ID } }),

    prisma.booking.count({
      where: { hostId: DEFAULT_USER_ID, createdAt: { gte: weekAgo } },
    }),

    prisma.booking.count({
      where: {
        hostId: DEFAULT_USER_ID,
        createdAt: { gte: twoWeeksAgo, lt: weekAgo },
      },
    }),

    prisma.booking.count({
      where: {
        hostId: DEFAULT_USER_ID,
        startTime: { gte: now },
        status: "CONFIRMED",
      },
    }),

    prisma.eventType.count({
      where: { userId: DEFAULT_USER_ID, isActive: true },
    }),

    prisma.contact.count({ where: { userId: DEFAULT_USER_ID } }),

    // Bookings grouped by event type
    prisma.booking.groupBy({
      by: ["eventTypeId"],
      where: { hostId: DEFAULT_USER_ID },
      _count: { id: true },
    }),

    // Bookings by day of week (raw query for extraction)
    prisma.booking.findMany({
      where: { hostId: DEFAULT_USER_ID },
      select: { startTime: true },
    }),

    // Recent activity
    prisma.booking.findMany({
      where: { hostId: DEFAULT_USER_ID },
      include: {
        eventType: { select: { name: true, color: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    prisma.booking.count({
      where: { hostId: DEFAULT_USER_ID, status: "CANCELLED" },
    }),
  ]);

  // Resolve event type names for the groupBy
  const eventTypeIds = bookingsByEventType.map((b) => b.eventTypeId);
  const eventTypes = await prisma.eventType.findMany({
    where: { id: { in: eventTypeIds } },
    select: { id: true, name: true, color: true },
  });
  const etMap = new Map(eventTypes.map((et) => [et.id, et]));

  const byEventType = bookingsByEventType.map((b) => ({
    eventTypeId: b.eventTypeId,
    name: etMap.get(b.eventTypeId)?.name || "Unknown",
    color: etMap.get(b.eventTypeId)?.color || "#ccc",
    count: b._count.id,
  }));

  // Compute day-of-week distribution
  const dayDistribution = [0, 0, 0, 0, 0, 0, 0]; // Sun - Sat
  bookingsByDay.forEach((b) => {
    dayDistribution[b.startTime.getDay()]++;
  });

  const weekGrowth =
    lastWeekBookings === 0
      ? thisWeekBookings > 0 ? 100 : 0
      : Math.round(((thisWeekBookings - lastWeekBookings) / lastWeekBookings) * 100);

  sendSuccess(res, {
    totalBookings,
    thisWeekBookings,
    lastWeekBookings,
    weekGrowth,
    upcomingMeetings,
    activeEventTypes,
    totalContacts,
    cancelledCount,
    byEventType,
    dayDistribution,
    recentActivity: recentBookings,
  });
}));

export default router;
