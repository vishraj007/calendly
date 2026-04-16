import { z } from "zod";

const TimeString = z.string().regex(/^\d{2}:\d{2}$/, "Must be HH:MM format");
const SlugString = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only");

export const CustomQuestionSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(200),
  type: z.enum(["text", "textarea", "select"]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export const CreateEventTypeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: SlugString,
  duration: z.number().int().positive().max(480),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0069ff"),
  location: z.string().max(100).default("Google Meet"),
  bufferBefore: z.number().int().min(0).max(60).default(0),
  bufferAfter: z.number().int().min(0).max(60).default(0),
  customQuestions: z.array(CustomQuestionSchema).optional(),
});

export const UpdateEventTypeSchema = CreateEventTypeSchema.partial();

export const AvailabilityItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: TimeString,
  endTime: TimeString,
  isActive: z.boolean().default(true),
});

export const SaveAvailabilitySchema = z.object({
  availability: z.array(AvailabilityItemSchema),
  timezone: z.string().min(1),
});

export const CreateOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  isOff: z.boolean().default(false),
  startTime: TimeString.optional(),
  endTime: TimeString.optional(),
});

export const CreateBookingSchema = z.object({
  eventTypeId: z.string().cuid(),
  inviteeName: z.string().min(1).max(100),
  inviteeEmail: z.string().email(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  timezone: z.string().default("Asia/Kolkata"),
  notes: z.string().max(500).optional(),
  customAnswers: z.record(z.string(), z.string()).optional(),
});

export const SlotsQuerySchema = z.object({
  eventTypeId: z.string().cuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string().optional(),
});

export const CancelBookingSchema = z.object({
  cancelReason: z.string().max(300).optional(),
});

// ── Contact schemas ──
export const CreateContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  linkedin: z.string().max(200).optional(),
  timezone: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

export const UpdateContactSchema = CreateContactSchema.partial();

// ── Inferred types ──
export type CreateEventTypeInput = z.infer<typeof CreateEventTypeSchema>;
export type UpdateEventTypeInput = z.infer<typeof UpdateEventTypeSchema>;
export type AvailabilityItem = z.infer<typeof AvailabilityItemSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type SlotsQuery = z.infer<typeof SlotsQuerySchema>;
export type CustomQuestion = z.infer<typeof CustomQuestionSchema>;
export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;