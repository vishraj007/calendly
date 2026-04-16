/* ──────────────────────────────────────────────
   SVG Brand Integration Icons
   Real brand logos as inline SVG components
   ────────────────────────────────────────────── */

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/* ── Google Calendar (multicolor) ── */
export function GoogleCalendarIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M36 8H12C9.79 8 8 9.79 8 12V36C8 38.21 9.79 40 12 40H36C38.21 40 40 38.21 40 36V12C40 9.79 38.21 8 36 8Z" fill="#fff"/>
      <path d="M36 8H12C9.79 8 8 9.79 8 12V36C8 38.21 9.79 40 12 40H36C38.21 40 40 38.21 40 36V12C40 9.79 38.21 8 36 8Z" fill="#4285F4" fillOpacity="0.08"/>
      <path d="M33.5 6H14.5C10.91 6 8 8.91 8 12.5V14H40V12.5C40 8.91 37.09 6 33.5 6Z" fill="#4285F4"/>
      <path d="M16 20H20V24H16V20Z" fill="#4285F4"/>
      <path d="M22 20H26V24H22V20Z" fill="#4285F4"/>
      <path d="M28 20H32V24H28V20Z" fill="#4285F4"/>
      <path d="M16 26H20V30H16V26Z" fill="#0B8043"/>
      <path d="M22 26H26V30H22V26Z" fill="#0B8043"/>
      <path d="M28 26H32V30H28V26Z" fill="#0B8043"/>
      <path d="M16 32H20V36H16V32Z" fill="#F4B400"/>
      <path d="M22 32H26V36H22V32Z" fill="#F4B400"/>
      <rect x="12" y="10" width="4" height="6" rx="1" fill="#EA4335"/>
      <rect x="32" y="10" width="4" height="6" rx="1" fill="#EA4335"/>
    </svg>
  );
}

/* ── Google Meet (green) ── */
export function GoogleMeetIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M36 14L28 20V16C28 14.9 27.1 14 26 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H26C27.1 34 28 33.1 28 32V28L36 34V14Z" fill="#00897B"/>
      <path d="M26 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H26C27.1 34 28 33.1 28 32V16C28 14.9 27.1 14 26 14Z" fill="#00897B"/>
      <path d="M36 14L28 20V28L36 34V14Z" fill="#00BFA5"/>
      <circle cx="20" cy="22" r="3" fill="white" fillOpacity="0.9"/>
      <path d="M16 29C16 27.34 19.58 26.5 20 26.5C20.42 26.5 24 27.34 24 29V30H16V29Z" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

/* ── Zoom (blue) ── */
export function ZoomIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="12" width="32" height="24" rx="4" fill="#2D8CFF"/>
      <path d="M14 18H26V30H14V18Z" rx="2" fill="white" fillOpacity="0.95"/>
      <path d="M28 21L34 17V31L28 27V21Z" fill="white" fillOpacity="0.95"/>
    </svg>
  );
}

/* ── Microsoft Teams ── */
export function TeamsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="10" width="32" height="28" rx="4" fill="#5059C9"/>
      <circle cx="30" cy="16" r="4" fill="#7B83EB"/>
      <rect x="14" y="18" width="16" height="14" rx="2" fill="white"/>
      <path d="M18 22H26M18 26H24" stroke="#5059C9" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="36" cy="18" r="3" fill="#7B83EB"/>
    </svg>
  );
}

/* ── Outlook Calendar ── */
export function OutlookIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="10" width="20" height="28" rx="3" fill="#0078D4"/>
      <rect x="20" y="14" width="20" height="20" rx="2" fill="#0078D4" fillOpacity="0.6"/>
      <ellipse cx="18" cy="24" rx="6" ry="7" fill="#0078D4"/>
      <text x="18" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">O</text>
    </svg>
  );
}

/* ── Slack ── */
export function SlackIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="18" y="10" width="4" height="12" rx="2" fill="#E01E5A"/>
      <rect x="10" y="22" width="12" height="4" rx="2" fill="#E01E5A"/>
      <rect x="26" y="10" width="4" height="12" rx="2" fill="#36C5F0"/>
      <rect x="26" y="22" width="12" height="4" rx="2" fill="#36C5F0"/>
      <rect x="18" y="26" width="4" height="12" rx="2" fill="#2EB67D"/>
      <rect x="10" y="26" width="12" height="4" rx="2" fill="#2EB67D"/>
      <rect x="26" y="26" width="4" height="12" rx="2" fill="#ECB22E"/>
      <rect x="26" y="26" width="12" height="4" rx="2" fill="#ECB22E"/>
    </svg>
  );
}

/* ── HubSpot ── */
export function HubSpotIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" fill="#FF7A59"/>
      <circle cx="24" cy="20" r="4" fill="white"/>
      <path d="M18 30C18 27.24 20.69 25 24 25C27.31 25 30 27.24 30 30V32H18V30Z" fill="white"/>
      <circle cx="32" cy="16" r="2.5" fill="white"/>
      <line x1="28" y1="20" x2="30" y2="17" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── Salesforce ── */
export function SalesforceIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M14 28C14 22 18 18 24 18C30 18 34 22 34 28C34 34 30 38 24 38C18 38 14 34 14 28Z" fill="#00A1E0"/>
      <path d="M10 24C10 20 13 17 17 17C19 17 21 18 22 19.5C20 16 17 14 14 14C9 14 6 18.5 6 24C6 29.5 9 34 14 34C17 34 20 32 22 28.5C21 30 19 31 17 31C13 31 10 28 10 24Z" fill="#00A1E0"/>
      <text x="24" y="32" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">sf</text>
    </svg>
  );
}

/* ── Stripe ── */
export function StripeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="12" width="32" height="24" rx="4" fill="#635BFF"/>
      <path d="M22.5 20C21 20 20 20.8 20 22C20 24.8 25 23.6 25 26C25 27.4 23.8 28.2 22 28.2C20.6 28.2 19.2 27.6 18.5 27L18 28.5C18.8 29.1 20.3 29.6 22 29.6C24.2 29.6 26 28.4 26 26.2C26 23.2 21 24.4 21 22.2C21 21.4 21.8 20.8 22.8 20.8C23.8 20.8 24.8 21.2 25.3 21.6L25.8 20.2C25 19.6 23.8 20 22.5 20Z" fill="white"/>
    </svg>
  );
}

/* ── Zapier ── */
export function ZapierIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" fill="#FF4F00"/>
      <path d="M24 14V22L30 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 34V26L18 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 24H22L16 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 24H26L32 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Webhooks ── */
export function WebhooksIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="12" width="32" height="24" rx="4" fill="#374151"/>
      <path d="M16 20L20 24L16 28" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="22" y1="28" x2="32" y2="28" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Google Analytics ── */
export function GoogleAnalyticsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="12" y="28" width="6" height="12" rx="1" fill="#F9AB00"/>
      <rect x="21" y="20" width="6" height="20" rx="1" fill="#E37400"/>
      <rect x="30" y="12" width="6" height="28" rx="1" fill="#E37400"/>
      <circle cx="33" cy="12" r="3" fill="#F9AB00"/>
    </svg>
  );
}

/* ── Phone ── */
export function PhoneIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="32" height="32" rx="16" fill="#10B981"/>
      <path d="M19 16C19 16 18 16 18 17C18 20 21 28 28 30C29 30 30 29 30 29L32 27L28 24L27 25C27 25 24 23 23 20L24 19L21 16L19 16Z" fill="white"/>
    </svg>
  );
}

/* ── In Person ── */
export function InPersonIcon({ className, size = 24 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="32" height="32" rx="16" fill="#8B5CF6"/>
      <path d="M24 14C25.66 14 27 15.34 27 17C27 18.66 25.66 20 24 20C22.34 20 21 18.66 21 17C21 15.34 22.34 14 24 14Z" fill="white"/>
      <path d="M18 28C18 25 20.68 23 24 23C27.32 23 30 25 30 28V30C30 30.55 29.55 31 29 31H19C18.45 31 18 30.55 18 30V28Z" fill="white"/>
      <circle cx="24" cy="34" r="2" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

/* ═════════════════════════════════════════════
   Integration Icon Resolver
   Maps integration ID → SVG component
   ═════════════════════════════════════════════ */

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  "google-calendar": GoogleCalendarIcon,
  "google-meet": GoogleMeetIcon,
  zoom: ZoomIcon,
  "outlook-calendar": OutlookIcon,
  "microsoft-teams": TeamsIcon,
  slack: SlackIcon,
  hubspot: HubSpotIcon,
  salesforce: SalesforceIcon,
  stripe: StripeIcon,
  zapier: ZapierIcon,
  webhooks: WebhooksIcon,
  "google-analytics": GoogleAnalyticsIcon,
  phone: PhoneIcon,
  "in-person": InPersonIcon,
};

export function IntegrationIcon({
  id,
  className,
  size = 24,
}: IconProps & { id: string }) {
  const Component = ICON_MAP[id];
  if (!Component) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.5,
        }}
      >
        ⚙️
      </div>
    );
  }
  return <Component className={className} size={size} />;
}
