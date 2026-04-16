import { formatInTimeZone } from "date-fns-tz";

/* ──────────────────────────────────────────────
   Enhanced Calendly-style email service
   DRY: shared emailShell / emailRow helpers
   ────────────────────────────────────────────── */

interface BookingEmailData {
  inviteeName:   string;
  inviteeEmail:  string;
  hostName:      string;
  hostEmail?:    string;
  eventName:     string;
  startTime:     Date;
  endTime:       Date;
  timezone:      string;
  location:      string;
  meetingLink?:  string | null;
  cancelReason?: string;
  previousStartTime?: Date;
  previousEndTime?:   Date;
}

async function getTransporter() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const nodemailer = await import("nodemailer");
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/* ── DRY helpers ── */

function emailRow(label: string, value: string): string {
  return `<div class="row"><span class="lbl">${label}</span><span>${value}</span></div>`;
}

function meetingLinkBlock(link: string | null | undefined): string {
  if (!link) return "";
  return `
    <div style="margin-top:16px; padding:12px 16px; background:#eff6ff; border-radius:8px; border:1px solid #bfdbfe;">
      <p style="margin:0 0 4px; font-size:12px; font-weight:600; color:#1d4ed8; text-transform:uppercase; letter-spacing:0.5px;">Join Meeting</p>
      <a href="${link}" style="color:#006bff; font-weight:600; font-size:14px; text-decoration:none; word-break:break-all;">${link}</a>
    </div>`;
}

function emailShell(headerColor: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f9fafb; margin:0; padding:24px; }
  .header { background:${headerColor}; color:white; padding:20px 32px; border-radius:12px 12px 0 0; }
  .header h1 { margin:0; font-size:20px; font-weight:700; }
  .header p { margin:4px 0 0; font-size:13px; opacity:0.9; }
  .card { background:white; border-radius:0 0 12px 12px; padding:28px 32px; max-width:500px; margin:0 auto; border:1px solid #e5e7eb; border-top:none; }
  .top-card { max-width:500px; margin:0 auto; }
  .icon { font-size:36px; text-align:center; margin-bottom:12px; }
  .row { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151; }
  .lbl { color:#9ca3af; width:95px; flex-shrink:0; font-weight:500; }
  .footer { text-align:center; margin-top:20px; padding-top:16px; border-top:1px solid #f3f4f6; font-size:12px; color:#9ca3af; }
  .footer a { color:#006bff; text-decoration:none; font-weight:600; }
</style>
</head>
<body>
<div class="top-card">
  <div class="header">
    <h1>${content.includes("Cancelled") ? "❌" : content.includes("Rescheduled") ? "🔄" : "✅"} ${content.split("<!--TITLE-->")[1] || ""}</h1>
    <p>${content.split("<!--SUB-->")[1] || ""}</p>
  </div>
  <div class="card">
    ${content.split("<!--BODY-->")[1] || content}
    <div class="footer">
      Powered by <a href="#">Schedulr</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

function buildEmailHtml(
  icon: string,
  title: string,
  subtitle: string,
  rows: string,
  meetLink?: string | null
): string {
  const headerColor = title.includes("Cancelled")
    ? "#dc2626"
    : title.includes("Rescheduled")
    ? "#f59e0b"
    : "#006bff";

  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f9fafb; margin:0; padding:24px; }
  .wrapper { max-width:500px; margin:0 auto; }
  .header { background:${headerColor}; color:white; padding:20px 28px; border-radius:12px 12px 0 0; }
  .header h1 { margin:0; font-size:18px; font-weight:700; }
  .header p { margin:4px 0 0; font-size:13px; opacity:0.9; }
  .card { background:white; border-radius:0 0 12px 12px; padding:24px 28px; border:1px solid #e5e7eb; border-top:none; }
  .row { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f3f4f6; font-size:14px; color:#374151; }
  .lbl { color:#9ca3af; width:95px; flex-shrink:0; font-weight:500; }
  .footer { text-align:center; margin-top:20px; padding-top:16px; border-top:1px solid #f3f4f6; font-size:12px; color:#9ca3af; }
  .footer a { color:#006bff; text-decoration:none; font-weight:600; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>${icon} ${title}</h1>
    <p>${subtitle}</p>
  </div>
  <div class="card">
    ${rows}
    ${meetingLinkBlock(meetLink)}
    <div class="footer">
      Powered by <a href="#">Schedulr</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

/* ── Send to both host AND invitee ── */
async function sendToAll(
  transporter: ReturnType<Awaited<ReturnType<typeof getTransporter>> extends infer T ? T extends null ? never : () => T : never>,
  recipients: string[],
  subject: string,
  html: string
) {
  for (const to of recipients) {
    await transporter.sendMail({
      from: `"Schedulr" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }
}

/* ═══════════════════════════════════════════
   Public API
   ═══════════════════════════════════════════ */

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log("[Email] SMTP not configured — skipping");
    return;
  }

  const tz = data.timezone || "UTC";
  const dateStr = formatInTimeZone(data.startTime, tz, "EEEE, MMMM d, yyyy");
  const timeStr = `${formatInTimeZone(data.startTime, tz, "h:mm a")} – ${formatInTimeZone(data.endTime, tz, "h:mm a")}`;

  const rows = [
    emailRow("Event", `<strong>${data.eventName}</strong>`),
    emailRow("Host", data.hostName),
    emailRow("Date", dateStr),
    emailRow("Time", timeStr),
    emailRow("Timezone", data.timezone),
    emailRow("Location", data.location),
  ].join("");

  const html = buildEmailHtml(
    "✅",
    "Meeting Confirmed!",
    "Your meeting has been scheduled successfully.",
    rows,
    data.meetingLink
  );

  const recipients = [data.inviteeEmail];
  if (data.hostEmail) recipients.push(data.hostEmail);

  for (const to of recipients) {
    await transporter.sendMail({
      from: `"Schedulr" <${process.env.SMTP_USER}>`,
      to,
      subject: `Confirmed: ${data.eventName} with ${data.hostName}`,
      html,
    });
  }

  console.log(`[Email] Confirmation → ${recipients.join(", ")}`);
}

export async function sendCancellationNotice(data: BookingEmailData): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log("[Email] SMTP not configured — skipping");
    return;
  }

  const tz = data.timezone || "UTC";
  const dateStr = formatInTimeZone(data.startTime, tz, "EEEE, MMMM d, yyyy");
  const timeStr = `${formatInTimeZone(data.startTime, tz, "h:mm a")} – ${formatInTimeZone(data.endTime, tz, "h:mm a")}`;

  const rows = [
    emailRow("Event", `<strong>${data.eventName}</strong>`),
    emailRow("Date", dateStr),
    emailRow("Time", timeStr),
    ...(data.cancelReason ? [emailRow("Reason", data.cancelReason)] : []),
  ].join("");

  const html = buildEmailHtml(
    "❌",
    "Meeting Cancelled",
    "Your scheduled meeting has been cancelled.",
    rows
  );

  const recipients = [data.inviteeEmail];
  if (data.hostEmail) recipients.push(data.hostEmail);

  for (const to of recipients) {
    await transporter.sendMail({
      from: `"Schedulr" <${process.env.SMTP_USER}>`,
      to,
      subject: `Cancelled: ${data.eventName}`,
      html,
    });
  }

  console.log(`[Email] Cancellation → ${recipients.join(", ")}`);
}

export async function sendRescheduleNotification(data: BookingEmailData): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log("[Email] SMTP not configured — skipping");
    return;
  }

  const tz = data.timezone || "UTC";
  const newDateStr = formatInTimeZone(data.startTime, tz, "EEEE, MMMM d, yyyy");
  const newTimeStr = `${formatInTimeZone(data.startTime, tz, "h:mm a")} – ${formatInTimeZone(data.endTime, tz, "h:mm a")}`;

  const prevInfo = data.previousStartTime
    ? emailRow(
        "Previous",
        `<s>${formatInTimeZone(data.previousStartTime, tz, "MMM d, h:mm a")} – ${formatInTimeZone(
          data.previousEndTime!,
          tz,
          "h:mm a"
        )}</s>`
      )
    : "";

  const rows = [
    emailRow("Event", `<strong>${data.eventName}</strong>`),
    emailRow("New Date", newDateStr),
    emailRow("New Time", newTimeStr),
    emailRow("Timezone", data.timezone),
    prevInfo,
    emailRow("Location", data.location),
  ].join("");

  const html = buildEmailHtml(
    "🔄",
    "Meeting Rescheduled",
    "Your meeting has been rescheduled to a new time.",
    rows,
    data.meetingLink
  );

  const recipients = [data.inviteeEmail];
  if (data.hostEmail) recipients.push(data.hostEmail);

  for (const to of recipients) {
    await transporter.sendMail({
      from: `"Schedulr" <${process.env.SMTP_USER}>`,
      to,
      subject: `Rescheduled: ${data.eventName} with ${data.hostName}`,
      html,
    });
  }

  console.log(`[Email] Reschedule → ${recipients.join(", ")}`);
}