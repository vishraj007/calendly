import { google, calendar_v3 } from "googleapis";

/* ──────────────────────────────────────────────
   Google Calendar + Meet service
   Uses pre-generated OAuth tokens stored in .env
   ────────────────────────────────────────────── */

function getOAuth2Client() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
    process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    return null;
  }

  const oauth2 = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
    access_token: process.env.GOOGLE_ACCESS_TOKEN || undefined,
  });

  return oauth2;
}

function getCalendar(): calendar_v3.Calendar | null {
  const auth = getOAuth2Client();
  if (!auth) return null;
  return google.calendar({ version: "v3", auth });
}

/* ── Check real Google Calendar conflicts ── */
export async function checkGoogleConflicts(
  start: Date,
  end: Date
): Promise<boolean> {
  const cal = getCalendar();
  if (!cal) return false; // skip if not configured

  try {
    const resp = await cal.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    const busy = resp.data.calendars?.primary?.busy ?? [];
    return busy.length > 0;
  } catch (err) {
    console.error("[Google] FreeBusy check failed:", (err as Error).message);
    return false;
  }
}

/* ── Create a plain Google Calendar event ── */
export async function createCalendarEvent(data: {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  timezone: string;
  attendees: string[];
}): Promise<{ eventId: string; htmlLink: string } | null> {
  const cal = getCalendar();
  if (!cal) return null;

  try {
    const resp = await cal.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: data.summary,
        description: data.description,
        start: { dateTime: data.start.toISOString(), timeZone: data.timezone },
        end: { dateTime: data.end.toISOString(), timeZone: data.timezone },
        attendees: data.attendees.map((email) => ({ email })),
        reminders: { useDefault: true },
      },
    });

    return {
      eventId: resp.data.id || "",
      htmlLink: resp.data.htmlLink || "",
    };
  } catch (err) {
    console.error("[Google] Create event failed:", (err as Error).message);
    return null;
  }
}

/* ── Create Google Calendar event WITH Google Meet ── */
export async function createGoogleMeetEvent(data: {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  timezone: string;
  attendees: string[];
}): Promise<{
  eventId: string;
  meetLink: string;
  htmlLink: string;
} | null> {
  const cal = getCalendar();
  if (!cal) return null;

  try {
    const resp = await cal.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: data.summary,
        description: data.description,
        start: { dateTime: data.start.toISOString(), timeZone: data.timezone },
        end: { dateTime: data.end.toISOString(), timeZone: data.timezone },
        attendees: data.attendees.map((email) => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `schedulr-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: { useDefault: true },
      },
    });

    return {
      eventId: resp.data.id || "",
      meetLink:
        resp.data.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video"
        )?.uri || "",
      htmlLink: resp.data.htmlLink || "",
    };
  } catch (err) {
    console.error("[Google] Create Meet event failed:", (err as Error).message);
    return null;
  }
}

/* ── Update existing Google Calendar event ── */
export async function updateCalendarEvent(
  eventId: string,
  data: { start: Date; end: Date; timezone: string }
): Promise<boolean> {
  const cal = getCalendar();
  if (!cal) return false;

  try {
    await cal.events.patch({
      calendarId: "primary",
      eventId,
      requestBody: {
        start: { dateTime: data.start.toISOString(), timeZone: data.timezone },
        end: { dateTime: data.end.toISOString(), timeZone: data.timezone },
      },
    });
    return true;
  } catch (err) {
    console.error("[Google] Update event failed:", (err as Error).message);
    return false;
  }
}

/* ── Delete Google Calendar event ── */
export async function deleteCalendarEvent(
  eventId: string
): Promise<boolean> {
  const cal = getCalendar();
  if (!cal) return false;

  try {
    await cal.events.delete({ calendarId: "primary", eventId });
    return true;
  } catch (err) {
    console.error("[Google] Delete event failed:", (err as Error).message);
    return false;
  }
}

/* ── Test connection — lightweight API call ── */
export async function testGoogleConnection(): Promise<boolean> {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
    process.env;

  console.log("[Google] Testing connection...");
  console.log("[Google] CLIENT_ID present:", !!GOOGLE_CLIENT_ID);
  console.log("[Google] CLIENT_SECRET present:", !!GOOGLE_CLIENT_SECRET);
  console.log("[Google] REFRESH_TOKEN present:", !!GOOGLE_REFRESH_TOKEN);

  const cal = getCalendar();
  if (!cal) {
    console.log("[Google] Calendar client is null — missing credentials");
    return false;
  }

  try {
    await cal.calendarList.list({ maxResults: 1 });
    console.log("[Google] Connection successful ✓");
    return true;
  } catch (err) {
    console.error("[Google] Connection test FAILED:", (err as Error).message);
    return false;
  }
}
