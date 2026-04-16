import axios from "axios";

/* ──────────────────────────────────────────────
   Zoom Server-to-Server OAuth service
   Uses ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET
   ────────────────────────────────────────────── */

let tokenCache: { token: string; expiresAt: number } | null = null;

/* ── Get S2S access token (cached) ── */
export async function getZoomAccessToken(): Promise<string | null> {
  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) return null;

  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  try {
    const credentials = Buffer.from(
      `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
    ).toString("base64");

    const resp = await axios.post(
      "https://zoom.us/oauth/token",
      new URLSearchParams({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    tokenCache = {
      token: resp.data.access_token,
      expiresAt: Date.now() + resp.data.expires_in * 1000,
    };

    return tokenCache.token;
  } catch (err) {
    console.error("[Zoom] Token fetch failed:", (err as Error).message);
    return null;
  }
}

/* ── Create a Zoom meeting ── */
export async function createZoomMeeting(data: {
  topic: string;
  start: Date;
  durationMinutes: number;
  timezone: string;
  agenda?: string;
}): Promise<{
  meetingId: number;
  joinUrl: string;
  startUrl: string;
  password: string;
} | null> {
  const token = await getZoomAccessToken();
  if (!token) return null;

  try {
    const resp = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: data.topic,
        type: 2, // scheduled meeting
        start_time: data.start.toISOString(),
        duration: data.durationMinutes,
        timezone: data.timezone,
        agenda: data.agenda || "",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          waiting_room: false,
          auto_recording: "none",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      meetingId: resp.data.id,
      joinUrl: resp.data.join_url,
      startUrl: resp.data.start_url,
      password: resp.data.password || "",
    };
  } catch (err) {
    console.error("[Zoom] Create meeting failed:", (err as Error).message);
    return null;
  }
}

/* ── Test connection ── */
export async function testZoomConnection(): Promise<boolean> {
  const token = await getZoomAccessToken();
  if (!token) return false;

  try {
    await axios.get("https://api.zoom.us/v2/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch {
    return false;
  }
}
