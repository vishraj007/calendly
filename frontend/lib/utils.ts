import { format } from "date-fns";
import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const DAY_NAMES = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
];

export const formatTime = (date: string | Date) =>
  format(new Date(date), "h:mm a");

export const isMeetingPast = (startTime: string) =>
  new Date(startTime) < new Date();

export const generateSlug = (name: string) =>
  name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

export const DURATION_OPTIONS = [
  { value: 15,  label: "15 min" },
  { value: 30,  label: "30 min" },
  { value: 45,  label: "45 min" },
  { value: 60,  label: "1 hour" },
  { value: 90,  label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export const LOCATION_OPTIONS = [
  "Google Meet","Zoom","Microsoft Teams","Phone Call","In Person",
];

export const COLOR_OPTIONS = [
  "#0069ff","#ff4f00","#7b2ff7","#00a854",
  "#e11d48","#f59e0b","#06b6d4","#ec4899",
];

export const TIMEZONES = [
  { value: "Asia/Kolkata",        label: "India (IST)" },
  { value: "America/New_York",    label: "Eastern (ET)" },
  { value: "America/Chicago",     label: "Central (CT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London",       label: "London (GMT)" },
  { value: "Europe/Paris",        label: "Paris (CET)" },
  { value: "Asia/Tokyo",          label: "Tokyo (JST)" },
  { value: "Asia/Dubai",          label: "Dubai (GST)" },
  { value: "Australia/Sydney",    label: "Sydney (AEST)" },
  { value: "America/Sao_Paulo",   label: "São Paulo (BRT)" },
];

export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  const value = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  const label = format(new Date(2024, 0, 1, h, m), "h:mm a");
  return { value, label };
});

export const BUFFER_OPTIONS = [
  { value: 0,  label: "None" },
  { value: 5,  label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
];