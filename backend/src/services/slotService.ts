import { parse, addMinutes, isBefore, isAfter, format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "../lib/prisma";

export interface TimeSlot {
  startTime: string;
  endTime: string;
  startTimeUTC: string;
  endTimeUTC: string;
}

interface GenerateSlotsOptions {
  availStart: string;
  availEnd: string;
  durationMin: number;
  bufferBefore: number;
  bufferAfter: number;
  dateStr: string;
  timezone: string;
  existingBookings: Array<{ startTime: Date; endTime: Date }>;
}

/**
 * Pure function — no DB calls, fully testable.
 * Generates slots with buffer-aware conflict detection.
 */
function generateSlots({
  availStart,
  availEnd,
  durationMin,
  bufferBefore,
  bufferAfter,
  dateStr,
  timezone,
  existingBookings,
}: GenerateSlotsOptions): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  const dayStart = parse(`${dateStr} ${availStart}`, "yyyy-MM-dd HH:mm", new Date());
  const dayEnd   = parse(`${dateStr} ${availEnd}`,   "yyyy-MM-dd HH:mm", new Date());

  let cursor = dayStart;

  while (true) {
    const slotEnd = addMinutes(cursor, durationMin);
    if (isAfter(slotEnd, dayEnd)) break;

    const slotStartUTC = fromZonedTime(cursor,  timezone);
    const slotEndUTC   = fromZonedTime(slotEnd, timezone);

    if (!isBefore(slotStartUTC, now)) {
      const hasConflict = existingBookings.some((b) => {
        const bufferedStart = addMinutes(b.startTime, -bufferBefore);
        const bufferedEnd   = addMinutes(b.endTime,    bufferAfter);
        return (
          isBefore(slotStartUTC, bufferedEnd) &&
          isAfter(slotEndUTC, bufferedStart)
        );
      });

      if (!hasConflict) {
        slots.push({
          startTime:    format(cursor,  "HH:mm"),
          endTime:      format(slotEnd, "HH:mm"),
          startTimeUTC: slotStartUTC.toISOString(),
          endTimeUTC:   slotEndUTC.toISOString(),
        });
      }
    }

    cursor = addMinutes(cursor, durationMin);
  }

  return slots;
}

/**
 * Orchestrator: fetches data, applies override priority, generates slots.
 * Priority: AvailabilityOverride > WeeklyAvailability
 */
export async function getAvailableSlots(
  eventTypeId: string,
  dateStr: string,
  timezone: string
): Promise<TimeSlot[]> {
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: { user: { select: { id: true, timezone: true } } },
  });

  if (!eventType?.isActive) return [];

  const date      = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const hostTz    = timezone || eventType.user.timezone;

  // Check date-specific override first
  const override = await prisma.availabilityOverride.findUnique({
    where: { userId_date: { userId: eventType.userId, date } },
  });

  let availStart: string;
  let availEnd: string;

  if (override) {
    if (override.isOff || !override.startTime || !override.endTime) return [];
    availStart = override.startTime;
    availEnd   = override.endTime;
  } else {
    const avail = await prisma.availability.findUnique({
      where: { userId_dayOfWeek: { userId: eventType.userId, dayOfWeek } },
    });
    if (!avail?.isActive) return [];
    availStart = avail.startTime;
    availEnd   = avail.endTime;
  }

  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd   = new Date(`${dateStr}T23:59:59.999Z`);

  const existingBookings = await prisma.booking.findMany({
    where: {
      hostId:    eventType.userId,
      status:    "CONFIRMED",
      startTime: { gte: dayStart },
      endTime:   { lte: new Date(dayEnd.getTime() + 24 * 60 * 60 * 1000) },
    },
    select: { startTime: true, endTime: true },
  });

  return generateSlots({
    availStart,
    availEnd,
    durationMin:  eventType.duration,
    bufferBefore: eventType.bufferBefore,
    bufferAfter:  eventType.bufferAfter,
    dateStr,
    timezone: hostTz,
    existingBookings,
  });
}

export async function hasBookingConflict(
  hostId:    string,
  startTime: Date,
  endTime:   Date,
  excludeId?: string
): Promise<boolean> {
  const conflict = await prisma.booking.findFirst({
    where: {
      hostId,
      status: "CONFIRMED",
      id:     excludeId ? { not: excludeId } : undefined,
      AND: [
        { startTime: { lt: endTime } },
        { endTime:   { gt: startTime } },
      ],
    },
  });
  return !!conflict;
}