export interface CustomQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

export interface EventType {
  id: string;
  name: string;
  slug: string;
  duration: number;
  description?: string;
  isActive: boolean;
  color: string;
  location: string;
  bufferBefore: number;
  bufferAfter: number;
  customQuestions?: CustomQuestion[];
  createdAt: string;
  _count?: { bookings: number };
  user?: { name: string; email: string; timezone: string };
}

export interface Availability {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AvailabilityOverride {
  id: string;
  date: string;
  isOff: boolean;
  startTime?: string;
  endTime?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  startTimeUTC: string;
  endTimeUTC: string;
}

export interface Booking {
  id: string;
  eventTypeId?: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: "CONFIRMED" | "CANCELLED";
  cancelReason?: string;
  notes?: string;
  customAnswers?: Record<string, string>;
  meetingLink?: string | null;
  calendarEventId?: string | null;
  createdAt: string;
  eventType?: {
    name: string;
    duration: number;
    color: string;
    location: string;
    slug: string;
  };
  host?: { name: string; email: string; timezone: string };
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  linkedin?: string;
  timezone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  meetings?: Booking[];
}

export interface AnalyticsDashboard {
  totalBookings: number;
  thisWeekBookings: number;
  lastWeekBookings: number;
  weekGrowth: number;
  upcomingMeetings: number;
  activeEventTypes: number;
  totalContacts: number;
  cancelledCount: number;
  byEventType: Array<{
    eventTypeId: string;
    name: string;
    color: string;
    count: number;
  }>;
  dayDistribution: number[];
  recentActivity: Booking[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}