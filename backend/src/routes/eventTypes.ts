import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { CreateEventTypeSchema, UpdateEventTypeSchema } from "../schemas";
import { sendSuccess, sendNotFound, sendConflict } from "../lib/response";
import { DEFAULT_USER_ID, HTTP_STATUS } from "../lib/constants";

const router = Router();

const eventTypeSelect = {
  id: true,
  name: true,
  slug: true,
  duration: true,
  description: true,
  isActive: true,
  color: true,
  location: true,
  bufferBefore: true,
  bufferAfter: true,
  customQuestions: true,
  createdAt: true,
  _count: { select: { bookings: true } },
} as const;

const findById = (id: string) =>
  prisma.eventType.findUnique({ where: { id } });


// ✅ GET ALL
router.get("/", asyncHandler(async (_req, res) => {
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: DEFAULT_USER_ID },
    select: eventTypeSelect,
    orderBy: { createdAt: "asc" },
  });
  sendSuccess(res, eventTypes);
}));


// ✅ PUBLIC BY SLUG
router.get("/:slug/public", asyncHandler(async (req, res) => {
  const eventType = await prisma.eventType.findUnique({
    where: { slug: req.params.slug as string },
    include: {
      user: { select: { name: true, email: true, timezone: true } },
    },
  });

  if (!eventType || !eventType.isActive) {
    sendNotFound(res, "Event type");
    return;
  }

  sendSuccess(res, eventType);
}));


// ✅ GET BY ID
router.get("/:id", asyncHandler(async (req, res) => {
  const eventType = await findById(req.params.id as string);
  if (!eventType) {
    sendNotFound(res, "Event type");
    return;
  }
  sendSuccess(res, eventType);
}));


// ✅ CREATE
router.post(
  "/",
  validate(CreateEventTypeSchema),
  asyncHandler(async (req, res) => {
    const existing = await prisma.eventType.findUnique({
      where: { slug: req.body.slug },
    });

    if (existing) {
      sendConflict(res, "An event type with this slug already exists.");
      return;
    }

    const eventType = await prisma.eventType.create({
      data: {
        ...req.body,
        userId: DEFAULT_USER_ID,
        isActive: req.body.isActive ?? true, // ✅ ensure default
      },
      select: eventTypeSelect,
    });

    sendSuccess(res, eventType, HTTP_STATUS.CREATED);
  })
);


// ✅ UPDATE (🔥 FIXED MAIN BUG HERE)
router.put(
  "/:id",
  validate(UpdateEventTypeSchema),
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;

    const existing = await findById(id);
    if (!existing) {
      sendNotFound(res, "Event type");
      return;
    }

    // 🔍 Slug conflict check
    if (req.body.slug && req.body.slug !== existing.slug) {
      const conflict = await prisma.eventType.findFirst({
        where: {
          slug: req.body.slug,
          id: { not: id },
        },
      });

      if (conflict) {
        sendConflict(res, "Slug already taken.");
        return;
      }
    }

    // ✅ SAFE UPDATE (only update provided fields)
    const updated = await prisma.eventType.update({
      where: { id },
      data: {
        ...(req.body.name !== undefined && { name: req.body.name }),
        ...(req.body.slug !== undefined && { slug: req.body.slug }),
        ...(req.body.duration !== undefined && { duration: req.body.duration }),
        ...(req.body.description !== undefined && { description: req.body.description }),
        ...(req.body.isActive !== undefined && { isActive: req.body.isActive }),
        ...(req.body.color !== undefined && { color: req.body.color }),
        ...(req.body.location !== undefined && { location: req.body.location }),
        ...(req.body.bufferBefore !== undefined && { bufferBefore: req.body.bufferBefore }),
        ...(req.body.bufferAfter !== undefined && { bufferAfter: req.body.bufferAfter }),
        ...(req.body.customQuestions !== undefined && { customQuestions: req.body.customQuestions }),
      },
      select: eventTypeSelect,
    });

    sendSuccess(res, updated);
  })
);


// ✅ DELETE
router.delete("/:id", asyncHandler(async (req, res) => {
  const id = req.params.id as string;

  const existing = await findById(id);
  if (!existing) {
    sendNotFound(res, "Event type");
    return;
  }

  await prisma.eventType.delete({ where: { id } });

  sendSuccess(res, { message: "Event type deleted" });
}));


// ✅ TOGGLE ACTIVE
router.patch("/:id/toggle", asyncHandler(async (req, res) => {
  const id = req.params.id as string;

  const existing = await findById(id);
  if (!existing) {
    sendNotFound(res, "Event type");
    return;
  }

  const updated = await prisma.eventType.update({
    where: { id },
    data: { isActive: !existing.isActive },
    select: eventTypeSelect,
  });

  sendSuccess(res, updated);
}));

export default router;