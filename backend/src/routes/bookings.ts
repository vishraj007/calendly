import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { CreateBookingSchema, CancelBookingSchema } from "../schemas";
import { sendSuccess, sendNotFound, sendConflict, sendError } from "../lib/response";
import { DEFAULT_USER_ID, HTTP_STATUS } from "../lib/constants";
import { hasBookingConflict } from "../services/slotService";
import {
  sendBookingConfirmation,
  sendCancellationNotice,
  sendRescheduleNotification,
} from "../services/emailService";
import {
  checkGoogleConflicts,
  createGoogleMeetEvent,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../services/googleService";
import { createZoomMeeting } from "../services/zoomService";

const router = Router();

const bookingInclude = {
  eventType: {
    select: { name: true, duration: true, color: true, location: true, slug: true },
  },
} as const;

// GET /bookings/meetings
router.get("/meetings", asyncHandler(async (req, res) => {
  const { period, status } = req.query;
  const now = new Date();
  const where: Record<string, unknown> = { hostId: DEFAULT_USER_ID };
  if (status) where.status = status;
  if (period === "upcoming") {
    where.startTime = { gte: now };
    where.status = "CONFIRMED";
  } else if (period === "past") {
    where.startTime = { lt: now };
  }
  const meetings = await prisma.booking.findMany({
    where,
    include: bookingInclude,
    orderBy: { startTime: period === "past" ? "desc" : "asc" },
  });
  sendSuccess(res, meetings);
}));

// GET /bookings/meetings/:id
router.get("/meetings/:id", asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id as string },
    include: {
      ...bookingInclude,
      host: { select: { name: true, email: true, timezone: true } },
    },
  });
  if (!booking) { sendNotFound(res, "Booking"); return; }
  sendSuccess(res, booking);
}));

// POST /bookings
router.post("/", validate(CreateBookingSchema), asyncHandler(async (req, res) => {
  const {
    eventTypeId, inviteeName, inviteeEmail,
    startTime, endTime, timezone, notes, customAnswers,
  } = req.body;

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!eventType?.isActive) { sendNotFound(res, "Event type"); return; }

  const start = new Date(startTime);
  const end   = new Date(endTime);

  // 1. Check DB conflicts (existing)
  if (await hasBookingConflict(eventType.userId, start, end)) {
    sendConflict(res, "This time slot is no longer available. Please choose another.");
    return;
  }

  // 2. Check Google Calendar conflicts (new)
  const googleConflict = await checkGoogleConflicts(start, end);
  if (googleConflict) {
    sendConflict(res, "This time conflicts with an existing Google Calendar event.");
    return;
  }

  // 3. Create meeting based on location
  let meetingLink: string | null = null;
  let calendarEventId: string | null = null;
  const location = eventType.location;
  const attendees = [eventType.user.email, inviteeEmail];

  if (location === "Google Meet") {
    // Create Google Calendar event with Meet link
    const meetResult = await createGoogleMeetEvent({
      summary: `${eventType.name} — ${inviteeName}`,
      description: `Booked via Schedulr\nInvitee: ${inviteeName} (${inviteeEmail})`,
      start, end, timezone, attendees,
    });
    if (meetResult) {
      meetingLink = meetResult.meetLink;
      calendarEventId = meetResult.eventId;
    }
  } else if (location === "Zoom") {
    // Create Zoom meeting
    const zoomResult = await createZoomMeeting({
      topic: `${eventType.name} — ${inviteeName}`,
      start,
      durationMinutes: eventType.duration,
      timezone,
      agenda: `Booked via Schedulr by ${inviteeName}`,
    });
    if (zoomResult) {
      meetingLink = zoomResult.joinUrl;
    }

    // Also create Google Calendar event for Zoom meetings
    const calResult = await createCalendarEvent({
      summary: `${eventType.name} — ${inviteeName}`,
      description: `Zoom Meeting: ${meetingLink || "pending"}\nBooked via Schedulr`,
      start, end, timezone, attendees,
    });
    if (calResult) {
      calendarEventId = calResult.eventId;
    }
  } else {
    // For non-virtual locations, still create a Google Calendar event
    const calResult = await createCalendarEvent({
      summary: `${eventType.name} — ${inviteeName}`,
      description: `Location: ${location}\nBooked via Schedulr`,
      start, end, timezone, attendees,
    });
    if (calResult) {
      calendarEventId = calResult.eventId;
    }
  }

  const booking = await prisma.booking.create({
    data: {
      hostId: eventType.userId,
      eventTypeId,
      inviteeName,
      inviteeEmail,
      startTime: start,
      endTime: end,
      timezone,
      notes,
      meetingLink,
      calendarEventId,
      customAnswers: customAnswers ?? {},
    },
    include: {
      ...bookingInclude,
      host: { select: { name: true, email: true } },
    },
  });

  // Auto-create/update contact for the invitee
  prisma.contact.upsert({
    where: { userId_email: { userId: eventType.userId, email: inviteeEmail } },
    create: {
      userId: eventType.userId,
      name: inviteeName,
      email: inviteeEmail,
      timezone,
    },
    update: { name: inviteeName, timezone },
  }).catch((e) => console.error("[Contact upsert]", e.message));

  sendBookingConfirmation({
    inviteeName, inviteeEmail,
    hostName:  eventType.user.name,
    hostEmail: eventType.user.email,
    eventName: eventType.name,
    startTime: start, endTime: end, timezone,
    location:  eventType.location,
    meetingLink,
  }).catch((e) => console.error("[Email]", e.message));

  sendSuccess(res, booking, HTTP_STATUS.CREATED);
}));

// DELETE /bookings/meetings/:id — cancel
router.delete("/meetings/:id", validate(CancelBookingSchema), asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id  as string},
    include: { ...bookingInclude, host: { select: { name: true, email: true } } },
  });
  if (!booking) { sendNotFound(res, "Booking"); return; }
  if (booking.status === "CANCELLED") {
    sendError(res, "Already cancelled.", HTTP_STATUS.BAD_REQUEST);
    return;
  }

  const cancelReason = req.body?.cancelReason;

  // Delete Google Calendar event if exists
  if (booking.calendarEventId) {
    deleteCalendarEvent(booking.calendarEventId).catch((e) =>
      console.error("[Google] Delete event failed:", e.message)
    );
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id  as string },
    data: { status: "CANCELLED", cancelReason },
    include: { ...bookingInclude, host: { select: { name: true, email: true } } },
  });

  sendCancellationNotice({
    inviteeName:  booking.inviteeName,
    inviteeEmail: booking.inviteeEmail,
    hostName:     booking.host.name,
    hostEmail:    booking.host.email,
    eventName:    booking.eventType.name,
    startTime:    booking.startTime,
    endTime:      booking.endTime,
    timezone:     booking.timezone,
    location:     booking.eventType.location,
    meetingLink:  booking.meetingLink,
    cancelReason,
  }).catch((e) => console.error("[Email]", e.message));

  sendSuccess(res, updated);
}));

// PUT /bookings/meetings/:id/reschedule
router.put("/meetings/:id/reschedule", asyncHandler(async (req, res) => {
  const { startTime, endTime, timezone } = req.body;
  if (!startTime || !endTime) {
    sendError(res, "startTime and endTime required", HTTP_STATUS.BAD_REQUEST);
    return;
  }
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id as string  },
    include: {
      eventType: { select: { name: true, location: true } },
      host: { select: { name: true, email: true } },
    },
  });
  if (!booking) { sendNotFound(res, "Booking"); return; }
  if (booking.status === "CANCELLED") {
    sendError(res, "Cannot reschedule a cancelled booking", HTTP_STATUS.BAD_REQUEST);
    return;
  }

  const start = new Date(startTime);
  const end   = new Date(endTime);

  if (await hasBookingConflict(booking.hostId, start, end, booking.id)) {
    sendConflict(res, "New time slot is not available.");
    return;
  }

  // Update Google Calendar event if exists
  if (booking.calendarEventId) {
    updateCalendarEvent(booking.calendarEventId, {
      start, end,
      timezone: timezone || booking.timezone,
    }).catch((e) => console.error("[Google] Update event failed:", e));
  }

  const updated = await prisma.booking.update({
    where: { id: req.params.id  as string },
    data: { startTime: start, endTime: end, timezone: timezone || booking.timezone },
    include: { ...bookingInclude, host: { select: { name: true, email: true } } },
  });

  // Send reschedule email
  sendRescheduleNotification({
    inviteeName:  booking.inviteeName,
    inviteeEmail: booking.inviteeEmail,
    hostName:     booking.host.name,
    hostEmail:    booking.host.email,
    eventName:    booking.eventType.name,
    startTime:    start,
    endTime:      end,
    timezone:     timezone || booking.timezone,
    location:     booking.eventType.location,
    meetingLink:  booking.meetingLink,
    previousStartTime: booking.startTime,
    previousEndTime:   booking.endTime,
  }).catch((e) => console.error("[Email]", e.message));

  sendSuccess(res, updated);
}));

export default router;