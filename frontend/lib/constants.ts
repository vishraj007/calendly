/* ──────────────────────────────────────────────
   Shared constants — single source of truth
   Used by: integrations page, event type form, sidebar
   ────────────────────────────────────────────── */

export const INTEGRATION_IDS = {
  GOOGLE_CALENDAR: "google-calendar",
  GOOGLE_MEET: "google-meet",
  ZOOM: "zoom",
  OUTLOOK_CALENDAR: "outlook-calendar",
  MICROSOFT_TEAMS: "microsoft-teams",
  SLACK: "slack",
  HUBSPOT: "hubspot",
  SALESFORCE: "salesforce",
  STRIPE: "stripe",
  ZAPIER: "zapier",
  WEBHOOKS: "webhooks",
  GOOGLE_ANALYTICS: "google-analytics",
} as const;

export interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  badge?: string;
}

export const INTEGRATION_CATEGORIES = [
  "All",
  "Video Conferencing",
  "Calendars",
  "Communication",
  "Sales & CRM",
  "Payments",
  "Automation",
  "Developer Tools",
  "Analytics",
] as const;

export const DEFAULT_INTEGRATIONS: IntegrationConfig[] = [
 
  {
    id: INTEGRATION_IDS.GOOGLE_MEET,
    name: "Google Meet",
    description:
      "Include Google Meet details in your Calendly events. Participants receive a unique meeting link.",
    category: "Video Conferencing",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.GOOGLE_CALENDAR,
    name: "Google Calendar",
    description:
      "Sync your Google Calendar to check for conflicts and add new events automatically.",
    category: "Calendars",
    connected: false,
  },
   {
    id: INTEGRATION_IDS.ZOOM,
    name: "Zoom",
    description:
      "Include Zoom details in your Calendly events. Automatically create unique Zoom meetings for each booking.",
    category: "Video Conferencing",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.OUTLOOK_CALENDAR,
    name: "Outlook Calendar",
    description:
      "Connect your Outlook calendar to prevent double-bookings and sync events.",
    category: "Calendars",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.MICROSOFT_TEAMS,
    name: "Microsoft Teams",
    description:
      "Add Microsoft Teams conferencing to your events for seamless video meetings.",
    category: "Video Conferencing",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.SLACK,
    name: "Slack",
    description:
      "Get real-time Slack notifications when meetings are booked, cancelled, or rescheduled.",
    category: "Communication",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.HUBSPOT,
    name: "HubSpot",
    description:
      "Sync meeting data to your CRM. Add instant, account-matched scheduling to your routing forms.",
    category: "Sales & CRM",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.SALESFORCE,
    name: "Salesforce",
    description:
      "Create and update records as meetings are scheduled. Plus, route meetings via real-time Salesforce lookup.",
    category: "Sales & CRM",
    connected: false,
    badge: "Admin",
  },
  {
    id: INTEGRATION_IDS.STRIPE,
    name: "Stripe",
    description:
      "Collect payments, tips, or donations when invitees book meetings with you.",
    category: "Payments",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.ZAPIER,
    name: "Zapier",
    description:
      "Connect Calendly to 5,000+ apps. Automate workflows without code.",
    category: "Automation",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.WEBHOOKS,
    name: "Webhooks",
    description:
      "Send real-time booking data to any URL endpoint for custom integrations.",
    category: "Developer Tools",
    connected: false,
  },
  {
    id: INTEGRATION_IDS.GOOGLE_ANALYTICS,
    name: "Google Analytics",
    description:
      "Track booking page visits and conversion rates with Google Analytics.",
    category: "Analytics",
    connected: false,
  },
];

/* ── Location → Integration ID mapping ── */
export const LOCATION_TO_INTEGRATION: Record<string, string> = {
  "Google Meet": INTEGRATION_IDS.GOOGLE_MEET,
  Zoom: INTEGRATION_IDS.ZOOM,
  "Microsoft Teams": INTEGRATION_IDS.MICROSOFT_TEAMS,
  "Phone Call": "phone",
  "In Person": "in-person",
};

/* ── Event type categories for Create dropdown (Calendly-style) ── */
export const EVENT_TYPE_CATEGORIES = [
  {
    section: "Event type",
    items: [
      {
        title: "One-on-one",
        sub: "1 host  →  1 invitee",
        desc: "Good for coffee chats, 1:1 interviews, etc.",
      },
      {
        title: "Group",
        sub: "1 host  →  Multiple invitees",
        desc: "Webinars, online classes, etc.",
      },
      {
        title: "Round robin",
        sub: "Rotating hosts  →  1 invitee",
        desc: "Distribute meetings between team members",
      },
      {
        title: "Collective",
        sub: "Multiple hosts  →  1 invitee",
        desc: "Panel interviews, group sales calls, etc.",
      },
    ],
  },
  {
    section: "More ways to meet",
    items: [
      {
        title: "One-off meeting",
        sub: "",
        desc: "Offer time outside your normal schedule",
      },
      {
        title: "Meeting poll",
        sub: "",
        desc: "Let invitees vote on a time to meet",
      },
    ],
  },
] as const;

/* ── Integration status API response type ── */
export interface IntegrationStatus {
  googleCalendar: boolean;
  googleMeet: boolean;
  zoom: boolean;
  outlookCalendar: boolean;
  microsoftTeams: boolean;
  slack: boolean;
  hubspot: boolean;
  salesforce: boolean;
  stripe: boolean;
  zapier: boolean;
  webhooks: boolean;
  googleAnalytics: boolean;
}

/* ── API ID → Integration status key mapping ── */
export const INTEGRATION_STATUS_MAP: Record<string, keyof IntegrationStatus> = {
  [INTEGRATION_IDS.GOOGLE_CALENDAR]: "googleCalendar",
  [INTEGRATION_IDS.GOOGLE_MEET]: "googleMeet",
  [INTEGRATION_IDS.ZOOM]: "zoom",
  [INTEGRATION_IDS.OUTLOOK_CALENDAR]: "outlookCalendar",
  [INTEGRATION_IDS.MICROSOFT_TEAMS]: "microsoftTeams",
  [INTEGRATION_IDS.SLACK]: "slack",
  [INTEGRATION_IDS.HUBSPOT]: "hubspot",
  [INTEGRATION_IDS.SALESFORCE]: "salesforce",
  [INTEGRATION_IDS.STRIPE]: "stripe",
  [INTEGRATION_IDS.ZAPIER]: "zapier",
  [INTEGRATION_IDS.WEBHOOKS]: "webhooks",
  [INTEGRATION_IDS.GOOGLE_ANALYTICS]: "googleAnalytics",
};
