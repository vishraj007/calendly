

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Video,
  Globe,
  Shield,
  LinkIcon,
  ChevronRight,
  CalendarDays,
  Menu,
  X,
  BarChart2,
  RefreshCw,
  Bell,
  ArrowRight,
  Check,
  Star,
  Users,
  MessageSquare,
  Mail,
} from "lucide-react";

const INT_ICONS = [
  { name: "Zoom",       svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#2D8CFF"/><path d="M10 22a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V22zm30 3.5 10-7v19l-10-7V25.5z" fill="white"/></svg> },
  { name: "Salesforce", svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#00A1E0"/><path d="M26.5 20c2.5-2.6 5.9-4.2 9.7-4.2 5.2 0 9.8 3 12.2 7.4.9-.4 1.9-.6 3-.6 4.2 0 7.6 3.4 7.6 7.6 0 4.2-3.4 7.6-7.6 7.6H18.4c-3.5 0-6.4-2.9-6.4-6.4 0-3.3 2.5-6 5.7-6.3A11.3 11.3 0 0 1 26.5 20z" fill="white"/></svg> },
  { name: "Google Cal", svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/><path d="M44 8H20v8h24V8z" fill="#EA4335"/><rect x="8" y="16" width="48" height="40" rx="2" fill="white"/><path d="M8 16h48v10H8z" fill="#1a73e8"/><text x="32" y="46" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1a73e8">31</text></svg> },
  { name: "Slack",      svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#4A154B"/><path d="M20 14a5 5 0 0 0-5 5 5 5 0 0 0 5 5h5v-5a5 5 0 0 0-5-5zm0 13H9a5 5 0 0 0 0 10h11V27zm30-13a5 5 0 0 0-5 5v5h5a5 5 0 0 0 0-10zm0 13h-5v10h5a5 5 0 0 0 0-10zM14 37a5 5 0 0 0 0 10h5v-5a5 5 0 0 0-5-5zm13 0v10h5a5 5 0 0 0 0-10H27zm13-23v5h5a5 5 0 0 0 0-10 5 5 0 0 0-5 5zm0 13h-5v10h5a5 5 0 0 0 5-5 5 5 0 0 0-5-5z" fill="white" opacity=".9"/></svg> },
  { name: "Teams",      svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#6264A7"/><circle cx="26" cy="18" r="8" fill="white"/><path d="M10 38c0-8.8 7.2-16 16-16s16 7.2 16 16v4H10v-4z" fill="white"/><path d="M36 20a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm8 4h-6a10 10 0 0 1 10 10v2h4v-2a8 8 0 0 0-8-8z" fill="white" opacity=".8"/></svg> },
  { name: "Gmail",      svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1"/><path d="M8 20h48v28H8z" fill="white"/><path d="M8 20l24 18L56 20H8z" fill="#EA4335"/><path d="M8 20v28h12V33L8 20zm48 0L44 33v15h12V20z" fill="#C5221F"/></svg> },
  { name: "Outlook",    svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#0078D4"/><rect x="8" y="14" width="30" height="36" rx="3" fill="#28A8E8"/><rect x="34" y="14" width="22" height="12" rx="2" fill="#50D9FF"/><rect x="34" y="26" width="22" height="12" fill="#28A8E8"/><rect x="34" y="38" width="22" height="12" rx="2" fill="#0078D4"/><circle cx="23" cy="32" r="7" fill="white" opacity=".9"/><circle cx="23" cy="32" r="4" fill="#0078D4"/></svg> },
  { name: "HubSpot",    svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#FF7A59"/><circle cx="42" cy="22" r="7" fill="white"/><circle cx="42" cy="22" r="3.5" fill="#FF7A59"/><path d="M35 22h-9a11 11 0 0 0 0 22h9" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/><circle cx="42" cy="42" r="7" fill="white"/><circle cx="42" cy="42" r="3.5" fill="#FF7A59"/></svg> },
  { name: "Zapier",     svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#FF4F00"/><path d="M32 10L38.9 26.2 56 26.2 42.5 36.2 47.8 52.8 32 42.4 16.2 52.8 21.5 36.2 8 26.2 25.1 26.2Z" fill="white"/></svg> },
  { name: "LinkedIn",   svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#0A66C2"/><rect x="10" y="24" width="12" height="30" rx="2" fill="white"/><circle cx="16" cy="14" r="7" fill="white"/><path d="M28 24h11v4s3-5 10-5c9 0 11 6 11 14v16H48V39c0-4-1-7-5-7s-7 3-7 7v15H28V24z" fill="white"/></svg> },
  { name: "Stripe",     svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#635BFF"/><path d="M28 26c0-2 1.5-3 4-3 3.5 0 7 1.8 9 3.5V17c-2.5-1-5-1.5-9-1.5C24 15.5 18 19 18 27c0 12 16 10 16 16 0 2.5-2 3.5-5 3.5-3.5 0-7.5-1.5-10-4v10c2.5 1.2 5.5 2 10 2 8.5 0 14.5-4 14.5-12C43.5 30 28 31 28 26z" fill="white"/></svg> },
  { name: "Notion",     svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#191919"/><path d="M18 14h18l14 14v22H18V14z" fill="white"/><path d="M36 14v14h14" fill="none" stroke="#e5e7eb" strokeWidth="1.5"/><rect x="22" y="26" width="12" height="2" rx="1" fill="#9ca3af"/><rect x="22" y="32" width="18" height="2" rx="1" fill="#9ca3af"/><rect x="22" y="38" width="14" height="2" rx="1" fill="#9ca3af"/></svg> },
  { name: "Figma",      svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#1e1e1e"/><path d="M24 16a8 8 0 0 0 0 16h8V16h-8z" fill="#FF7262"/><path d="M32 16h8a8 8 0 0 1 0 16h-8V16z" fill="#F24E1E"/><path d="M24 32a8 8 0 0 0 0 16h8V32h-8z" fill="#A259FF"/><path d="M32 40a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" fill="#1ABCFE"/><circle cx="32" cy="32" r="6" fill="white"/></svg> },
  { name: "Webex",      svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#00bceb"/><path d="M20 24l12 16 12-16" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 32c0 9.9 8.1 18 18 18s18-8.1 18-18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> },
  { name: "Intercom",   svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#1F8DED"/><rect x="12" y="12" width="40" height="32" rx="6" fill="white"/><circle cx="22" cy="28" r="3" fill="#1F8DED"/><circle cx="32" cy="28" r="3" fill="#1F8DED"/><circle cx="42" cy="28" r="3" fill="#1F8DED"/><path d="M22 44l10 8 10-8" fill="white"/></svg> },
  { name: "PayPal",     svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#003087"/><path d="M42 20c0 8-6 12-14 12h-4l-3 18H14L20 10h16c4 0 6 3 6 8z" fill="#009CDE"/></svg> },
  { name: "Calendly",   svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><rect width="64" height="64" rx="12" fill="#006BFF"/><circle cx="32" cy="32" r="18" fill="none" stroke="white" strokeWidth="3.5"/><path d="M32 20v14l8 5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: "Chrome",     svg: <svg viewBox="0 0 64 64" style={{width:28,height:28}}><circle cx="32" cy="32" r="32" fill="white"/><path d="M32 12a20 20 0 0 1 17.3 10H32V12z" fill="#EA4335"/><path d="M49.3 22A20 20 0 0 1 41 49.3L32 32l17.3-10z" fill="#FBBC05"/><path d="M41 49.3A20 20 0 0 1 14.7 22L32 32 41 49.3z" fill="#34A853"/><circle cx="32" cy="32" r="8" fill="#4285F4"/><circle cx="32" cy="32" r="5.5" fill="white"/></svg> },
];

 export default function Integrations() {
  return (
    <section id="integrations" style={{ padding: "100px 2rem", background: "#f8f9ff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>Integrations</p>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 900, color: "#1a1a2e", margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Connect Calendly to the<br />tools you already use
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 12 }}>Boost productivity with 100+ integrations</p>
            <Link href="/onboarding" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#0069ff", textDecoration: "none" }}>
              View all integrations <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 12, marginBottom: 32 }}>
          {INT_ICONS.map((item) => (
            <div
              key={item.name}
              title={item.name}
              style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = "none"; }}
            >
              {item.svg}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="suite-grid">
          {[
            { logo: <svg style={{width:42,height:42}} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, title: "Google suite", desc: "Connect Calendly to Google Calendar, Meet, Analytics, and more." },
            { logo: <svg style={{width:42,height:42}} viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#7fba00" d="M12 0h11v11H12z"/><path fill="#00a4ef" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>, title: "Microsoft suite", desc: "Connect Calendly to Microsoft Teams, Outlook, Azure SSO, and more." },
          ].map((s) => (
            <div
              key={s.title}
              style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                {s.logo}
                <ArrowRight size={20} color="#d1d5db" style={{ transform: "rotate(-45deg)" }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:700px){.suite-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
