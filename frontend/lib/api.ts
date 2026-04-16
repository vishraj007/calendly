import type {
  EventType, Availability, AvailabilityOverride,
  TimeSlot, Booking, Contact, AnalyticsDashboard, ApiResponse,
} from "./types";
import type { IntegrationStatus } from "./constants";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || `HTTP ${res.status}`);
  return json.data;
}

const get   = <T>(p: string)              => fetcher<T>(p);
const post  = <T>(p: string, b: unknown)  => fetcher<T>(p, { method: "POST",   body: JSON.stringify(b) });
const put   = <T>(p: string, b: unknown)  => fetcher<T>(p, { method: "PUT",    body: JSON.stringify(b) });
const del   = <T>(p: string, b?: unknown) => fetcher<T>(p, { method: "DELETE", body: b ? JSON.stringify(b) : undefined });
const patch = <T>(p: string)              => fetcher<T>(p, { method: "PATCH" });

export const eventTypesApi = {
  list:      ()                              => get<EventType[]>("/event-types"),
  get:       (id: string)                   => get<EventType>(`/event-types/${id}`),
  getPublic: (slug: string)                 => get<EventType>(`/event-types/${slug}/public`),
  create:    (data: Partial<EventType>)     => post<EventType>("/event-types", data),
  update:    (id: string, d: Partial<EventType>) => put<EventType>(`/event-types/${id}`, d),
  delete:    (id: string)                   => del<{ message: string }>(`/event-types/${id}`),
  toggle:    (id: string)                   => patch<EventType>(`/event-types/${id}/toggle`),
};

export const availabilityApi = {
  get: () =>
    get<{ schedule: Availability[]; timezone: string }>("/availability"),

  save: (availability: Availability[], timezone: string) =>
    put<{ schedule: Availability[]; timezone: string }>("/availability", {
      availability, timezone,
    }),

  getSlots: (eventTypeId: string, date: string, timezone?: string) => {
    const p = new URLSearchParams({ eventTypeId, date, ...(timezone ? { timezone } : {}) });
    return get<TimeSlot[]>(`/availability/slots?${p}`);
  },

  getOverrides: () =>
    get<AvailabilityOverride[]>("/availability/overrides"),

  createOverride: (data: {
    date: string; isOff: boolean; startTime?: string; endTime?: string;
  }) => post<AvailabilityOverride>("/availability/overrides", data),

  deleteOverride: (id: string) =>
    del<{ message: string }>(`/availability/overrides/${id}`),
};

export const bookingsApi = {
  create: (data: {
    eventTypeId: string;
    inviteeName: string;
    inviteeEmail: string;
    startTime: string;
    endTime: string;
    timezone: string;
    notes?: string;
    customAnswers?: Record<string, string>;
  }) => post<Booking>("/bookings", data),

  getMeetings: (params?: { period?: string; status?: string }) => {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    return get<Booking[]>(`/bookings/meetings${qs}`);
  },

  getMeeting: (id: string) => get<Booking>(`/bookings/meetings/${id}`),

  cancel: (id: string, cancelReason?: string) =>
    del<Booking>(`/bookings/meetings/${id}`, { cancelReason }),

  reschedule: (id: string, data: {
    startTime: string; endTime: string; timezone?: string;
  }) => put<Booking>(`/bookings/meetings/${id}/reschedule`, data),
};

export const contactsApi = {
  list: (search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    return get<Contact[]>(`/contacts${qs}`);
  },
  get:    (id: string) => get<Contact>(`/contacts/${id}`),
  create: (data: Partial<Contact>) => post<Contact>("/contacts", data),
  update: (id: string, data: Partial<Contact>) => put<Contact>(`/contacts/${id}`, data),
  delete: (id: string) => del<{ message: string }>(`/contacts/${id}`),
};

export const analyticsApi = {
  getDashboard: () => get<AnalyticsDashboard>("/analytics/dashboard"),
};

export const integrationsApi = {
  getStatus: () => get<IntegrationStatus>("/integrations/status"),
};