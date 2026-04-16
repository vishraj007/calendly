import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { CreateEventTypeSchema, UpdateEventTypeSchema } from "../schemas";
import { sendSuccess, sendNotFound, sendConflict } from "../lib/response";
import { DEFAULT_USER_ID, HTTP_STATUS } from "../lib/constants";

const router = Router();

const eventTypeSelect = {
  id: true, name: true, slug: true, duration: true,
  description: true, isActive: true, color: true, location: true,
  bufferBefore: true, bufferAfter: true, customQuestions: true,
  createdAt: true,
  _count: { select: { bookings: true } },
} as const;

const findById = (id: string) =>
  prisma.eventType.findUnique({ where: { id } });

// GET /event-types
router.get("/", asyncHandler(async (_req, res) => {
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: DEFAULT_USER_ID },
    select: eventTypeSelect,
    orderBy: { createdAt: "asc" },
  });
  sendSuccess(res, eventTypes);
}));

// GET /event-types/:slug/public
router.get("/:slug/public", asyncHandler(async (req, res) => {
  const eventType = await prisma.eventType.findUnique({
    where: { slug: req.params.slug as string },
    include: { user: { select: { name: true, email: true, timezone: true } } },
  });
  if (!eventType || !eventType.isActive) {
    sendNotFound(res, "Event type");
    return;
  }
  sendSuccess(res, eventType);
}));

// GET /event-types/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const eventType = await findById(req.params.id as string);
  if (!eventType) { sendNotFound(res, "Event type"); return; }
  sendSuccess(res, eventType);
}));

// POST /event-types
router.post("/", validate(CreateEventTypeSchema), asyncHandler(async (req, res) => {
  const existing = await prisma.eventType.findUnique({ where: { slug: req.body.slug } });
  if (existing) { sendConflict(res, "An event type with this slug already exists."); return; }
  const eventType = await prisma.eventType.create({
    data: { ...req.body, userId: DEFAULT_USER_ID },
    select: eventTypeSelect,
  });
  sendSuccess(res, eventType, HTTP_STATUS.CREATED);
}));

// PUT /event-types/:id
router.put("/:id", validate(UpdateEventTypeSchema), asyncHandler(async (req, res) => {
  const existing = await findById(req.params.id as string );
  if (!existing) { sendNotFound(res, "Event type"); return; }
  if (req.body.slug && req.body.slug !== existing.slug) {
    const conflict = await prisma.eventType.findFirst({
      where: { slug: req.body.slug, id: { not: req.params.id  as string } },
    });
    if (conflict) { sendConflict(res, "Slug already taken."); return; }
  }
  const updated = await prisma.eventType.update({
    where: { id: req.params.id as string  },
    data: req.body,
    select: eventTypeSelect,
  });
  sendSuccess(res, updated);
}));

// DELETE /event-types/:id
router.delete("/:id", asyncHandler(async (req, res) => {
  const existing = await findById(req.params.id as string);
  if (!existing) { sendNotFound(res, "Event type"); return; }
  await prisma.eventType.delete({ where: { id: req.params.id as string } });
  sendSuccess(res, { message: "Event type deleted" });
}));

// PATCH /event-types/:id/toggle
router.patch("/:id/toggle", asyncHandler(async (req, res) => {
  const existing = await findById(req.params.id as string);
  if (!existing) { sendNotFound(res, "Event type"); return; }
  const updated = await prisma.eventType.update({
    where: { id: req.params.id as string },
    data: { isActive: !existing.isActive },
    select: eventTypeSelect,
  });
  sendSuccess(res, updated);
}));

export default router;