import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { SaveAvailabilitySchema, SlotsQuerySchema, CreateOverrideSchema } from "../schemas";
import { sendSuccess, sendNotFound, sendError } from "../lib/response";
import { DEFAULT_USER_ID, HTTP_STATUS } from "../lib/constants";
import { getAvailableSlots } from "../services/slotService";

const router = Router();

// GET /availability
router.get("/", asyncHandler(async (_req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
    select: { timezone: true },
  });
  const saved = await prisma.availability.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { dayOfWeek: "asc" },
  });
  const dayMap = new Map(saved.map((a) => [a.dayOfWeek, a]));
  const schedule = Array.from({ length: 7 }, (_, day) => ({
    dayOfWeek: day,
    startTime: "09:00",
    endTime: "18:00",
    isActive: false,
    ...dayMap.get(day),
  }));
  sendSuccess(res, { schedule, timezone: user?.timezone || "Asia/Kolkata" });
}));

// PUT /availability
router.put("/", validate(SaveAvailabilitySchema), asyncHandler(async (req, res) => {
  const { availability, timezone } = req.body;
  await prisma.user.update({
    where: { id: DEFAULT_USER_ID },
    data: { timezone },
  });
  await prisma.$transaction(
    availability.map((a: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }) =>
      prisma.availability.upsert({
        where: { userId_dayOfWeek: { userId: DEFAULT_USER_ID, dayOfWeek: a.dayOfWeek } },
        create: { ...a, userId: DEFAULT_USER_ID },
        update: { startTime: a.startTime, endTime: a.endTime, isActive: a.isActive },
      })
    )
  );
  const result = await prisma.availability.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { dayOfWeek: "asc" },
  });
  sendSuccess(res, { schedule: result, timezone });
}));

// GET /availability/slots
router.get("/slots", validate(SlotsQuerySchema, "query"), asyncHandler(async (req, res) => {
  const { eventTypeId, date, timezone } = req.query as {
    eventTypeId: string;
    date: string;
    timezone?: string;
  };
  const slots = await getAvailableSlots(eventTypeId, date, timezone || "Asia/Kolkata");
  sendSuccess(res, slots);
}));

// GET /availability/overrides
router.get("/overrides", asyncHandler(async (_req, res) => {
  const overrides = await prisma.availabilityOverride.findMany({
    where: { userId: DEFAULT_USER_ID },
    orderBy: { date: "asc" },
  });
  sendSuccess(res, overrides);
}));

// POST /availability/overrides
router.post("/overrides", validate(CreateOverrideSchema), asyncHandler(async (req, res) => {
  const { date, isOff, startTime, endTime } = req.body;
  if (!isOff && (!startTime || !endTime)) {
    sendError(res, "startTime and endTime required when not a day off", HTTP_STATUS.BAD_REQUEST);
    return;
  }
  const override = await prisma.availabilityOverride.upsert({
    where: { userId_date: { userId: DEFAULT_USER_ID, date: new Date(date) } },
    create: {
      userId: DEFAULT_USER_ID,
      date: new Date(date),
      isOff,
      startTime: isOff ? null : startTime,
      endTime: isOff ? null : endTime,
    },
    update: {
      isOff,
      startTime: isOff ? null : startTime,
      endTime: isOff ? null : endTime,
    },
  });
  sendSuccess(res, override, HTTP_STATUS.CREATED);
}));

// DELETE /availability/overrides/:id
router.delete("/overrides/:id", asyncHandler(async (req, res) => {
  const existing = await prisma.availabilityOverride.findUnique({
    where: { id: req.params.id as string  },
  });
  if (!existing) { sendNotFound(res, "Override"); return; }
  await prisma.availabilityOverride.delete({ where: { id: req.params.id as string } });
  sendSuccess(res, { message: "Override deleted" });
}));

export default router;