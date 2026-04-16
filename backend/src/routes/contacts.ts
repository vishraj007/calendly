import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";
import { CreateContactSchema, UpdateContactSchema } from "../schemas";
import { sendSuccess, sendNotFound, sendConflict } from "../lib/response";
import { DEFAULT_USER_ID, HTTP_STATUS } from "../lib/constants";

const router = Router();

// GET /contacts — list with optional search
router.get("/", asyncHandler(async (req, res) => {
  const { search } = req.query;
  const where: Record<string, unknown> = { userId: DEFAULT_USER_ID };

  if (search && typeof search === "string") {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
    ];
  }

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  sendSuccess(res, contacts);
}));

// GET /contacts/:id — single contact + meeting history
router.get("/:id", asyncHandler(async (req, res) => {
  const contact = await prisma.contact.findUnique({
    where: { id: req.params.id as string },
  });
  if (!contact) { sendNotFound(res, "Contact"); return; }

  // Fetch meetings with this contact's email
  const meetings = await prisma.booking.findMany({
    where: { hostId: DEFAULT_USER_ID, inviteeEmail: contact.email },
    include: {
      eventType: { select: { name: true, duration: true, color: true, location: true } },
    },
    orderBy: { startTime: "desc" },
    take: 20,
  });

  sendSuccess(res, { ...contact, meetings });
}));

// POST /contacts — create
router.post("/", validate(CreateContactSchema), asyncHandler(async (req, res) => {
  const existing = await prisma.contact.findUnique({
    where: { userId_email: { userId: DEFAULT_USER_ID, email: req.body.email } },
  });
  if (existing) {
    sendConflict(res, "A contact with this email already exists.");
    return;
  }

  const contact = await prisma.contact.create({
    data: { ...req.body, userId: DEFAULT_USER_ID },
  });
  sendSuccess(res, contact, HTTP_STATUS.CREATED);
}));

// PUT /contacts/:id — update
router.put("/:id", validate(UpdateContactSchema), asyncHandler(async (req, res) => {
  const existing = await prisma.contact.findUnique({
    where: { id: req.params.id as string },
  });
  if (!existing) { sendNotFound(res, "Contact"); return; }

  const updated = await prisma.contact.update({
    where: { id: req.params.id as string },
    data: req.body,
  });
  sendSuccess(res, updated);
}));

// DELETE /contacts/:id
router.delete("/:id", asyncHandler(async (req, res) => {
  const existing = await prisma.contact.findUnique({
    where: { id: req.params.id as string },
  });
  if (!existing) { sendNotFound(res, "Contact"); return; }

  await prisma.contact.delete({ where: { id: req.params.id as string } });
  sendSuccess(res, { message: "Contact deleted" });
}));

export default router;
