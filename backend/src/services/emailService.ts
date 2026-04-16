import { formatInTimeZone } from "date-fns-tz";

interface BookingEmailData {
  inviteeName:        string;
  inviteeEmail:       string;
  hostName:           string;
  hostEmail?:         string;
  eventName:          string;
  startTime:          Date;
  endTime:            Date;
  timezone:           string;
  location:           string;
  meetingLink?:       string | null;
  cancelReason?:      string;
  cancelledBy?:       "host" | "invitee";
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
      Powered by <a href="#">Calendly</a>
    </div>
  </div>
</div>
</body>
</html>`;
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log("[Email] SMTP not configured — skipping");
    return;
  }

  const tz = data.timezone || "UTC";
  const dateStr = formatInTimeZone(data.startTime, tz, "EEEE, MMMM d, yyyy");
  const timeStr = `${formatInTimeZone(data.startTime, tz, "h:mm a")} – ${formatInTimeZone(data.endTime, tz, "h:mm a")}`;

  const inviteeRows = [
    emailRow("Event",    `<strong>${data.eventName}</strong>`),
    emailRow("Host",     data.hostName),
    emailRow("Date",     dateStr),
    emailRow("Time",     timeStr),
    emailRow("Timezone", data.timezone),
    emailRow("Location", data.location),
  ].join("");

  const inviteeHtml = buildEmailHtml(
    "✅",
    "Meeting Confirmed!",
    `Your meeting with ${data.hostName} has been scheduled.`,
    inviteeRows,
    data.meetingLink
  );

  await transporter.sendMail({
    from:    `"Calendly" <${process.env.SMTP_USER}>`,
    to:      data.inviteeEmail,
    subject: `Confirmed: ${data.eventName} with ${data.hostName}`,
    html:    inviteeHtml,
  });

  console.log(`[Email] Confirmation → invitee: ${data.inviteeEmail}`);

  if (data.hostEmail) {
    const hostRows = [
      emailRow("Event",    `<strong>${data.eventName}</strong>`),
      emailRow("Invitee",  `<strong>${data.inviteeName}</strong>`),
      emailRow("Email",    data.inviteeEmail),
      emailRow("Date",     dateStr),
      emailRow("Time",     timeStr),
      emailRow("Timezone", data.timezone),
      emailRow("Location", data.location),
    ].join("");

    const hostHtml = buildEmailHtml(
      "✅",
      "New Meeting Booked!",
      `${data.inviteeName} has scheduled a meeting with you.`,
      hostRows,
      data.meetingLink
    );

    await transporter.sendMail({
      from:    `"Calendly" <${process.env.SMTP_USER}>`,
      to:      data.hostEmail,
      subject: `New Booking: ${data.eventName} with ${data.inviteeName}`,
      html:    hostHtml,
    });

    console.log(`[Email] Confirmation → host: ${data.hostEmail}`);
  }
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
  const cancelledByHost = data.cancelledBy === "host";

  // ── Cancellation email to INVITEE ──
  const inviteeRows = [
    emailRow("Event",    `<strong>${data.eventName}</strong>`),
    emailRow("Host",     data.hostName),
    emailRow("Date",     dateStr),
    emailRow("Time",     timeStr),
    emailRow("Timezone", data.timezone),
    ...(data.cancelReason ? [emailRow("Reason", data.cancelReason)] : []),
  ].join("");

  const inviteeHtml = buildEmailHtml(
    "❌",
    "Meeting Cancelled",
    cancelledByHost
      ? `${data.hostName} has cancelled your meeting.`
      : `Your meeting with ${data.hostName} has been cancelled.`,
    inviteeRows
  );

  await transporter.sendMail({
    from:    `"Calendly" <${process.env.SMTP_USER}>`,
    to:      data.inviteeEmail,
    subject: `Cancelled: ${data.eventName} with ${data.hostName}`,
    html:    inviteeHtml,
  });

  console.log(`[Email] Cancellation → invitee: ${data.inviteeEmail}`);

  // ── Cancellation email to HOST ──
  if (data.hostEmail) {
    const hostRows = [
      emailRow("Event",    `<strong>${data.eventName}</strong>`),
      emailRow("Invitee",  `<strong>${data.inviteeName}</strong>`),
      emailRow("Email",    data.inviteeEmail),
      emailRow("Date",     dateStr),
      emailRow("Time",     timeStr),
      emailRow("Timezone", data.timezone),
      ...(data.cancelReason ? [emailRow("Reason", data.cancelReason)] : []),
    ].join("");

    const hostHtml = buildEmailHtml(
      "❌",
      "Meeting Cancelled",
      cancelledByHost
        ? `You cancelled the meeting with ${data.inviteeName}.`
        : `${data.inviteeName} has cancelled their meeting with you.`,
      hostRows
    );

    await transporter.sendMail({
      from:    `"Calendly" <${process.env.SMTP_USER}>`,
      to:      data.hostEmail,
      subject: cancelledByHost
        ? `You cancelled: ${data.eventName} with ${data.inviteeName}`
        : `Cancelled: ${data.eventName} with ${data.inviteeName}`,
      html:    hostHtml,
    });

    console.log(`[Email] Cancellation → host: ${data.hostEmail}`);
  }
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

  const prevInfo =
    data.previousStartTime && data.previousEndTime
      ? emailRow(
          "Previous",
          `<s>${formatInTimeZone(data.previousStartTime, tz, "MMM d, h:mm a")} – ${formatInTimeZone(
            data.previousEndTime,
            tz,
            "h:mm a"
          )}</s>`
        )
      : "";

  // ── Reschedule email to INVITEE ──
  const inviteeRows = [
    emailRow("Event",    `<strong>${data.eventName}</strong>`),
    emailRow("Host",     data.hostName),
    emailRow("New Date", newDateStr),
    emailRow("New Time", newTimeStr),
    emailRow("Timezone", data.timezone),
    prevInfo,
    emailRow("Location", data.location),
  ].join("");

  const inviteeHtml = buildEmailHtml(
    "🔄",
    "Meeting Rescheduled",
    `Your meeting with ${data.hostName} has been rescheduled.`,
    inviteeRows,
    data.meetingLink
  );

  await transporter.sendMail({
    from:    `"Calendly" <${process.env.SMTP_USER}>`,
    to:      data.inviteeEmail,
    subject: `Rescheduled: ${data.eventName} with ${data.hostName}`,
    html:    inviteeHtml,
  });

  console.log(`[Email] Reschedule → invitee: ${data.inviteeEmail}`);

  // ── Reschedule email to HOST ──
  if (data.hostEmail) {
    const hostRows = [
      emailRow("Event",    `<strong>${data.eventName}</strong>`),
      emailRow("Invitee",  `<strong>${data.inviteeName}</strong>`),
      emailRow("Email",    data.inviteeEmail),
      emailRow("New Date", newDateStr),
      emailRow("New Time", newTimeStr),
      emailRow("Timezone", data.timezone),
      prevInfo,
      emailRow("Location", data.location),
    ].join("");

    const hostHtml = buildEmailHtml(
      "🔄",
      "Meeting Rescheduled",
      `${data.inviteeName} has rescheduled their meeting with you.`,
      hostRows,
      data.meetingLink
    );

    await transporter.sendMail({
      from:    `"Calendly" <${process.env.SMTP_USER}>`,
      to:      data.hostEmail,
      subject: `Rescheduled: ${data.eventName} with ${data.inviteeName}`,
      html:    hostHtml,
    });

    console.log(`[Email] Reschedule → host: ${data.hostEmail}`);
  }
}