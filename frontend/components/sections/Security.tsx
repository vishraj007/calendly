
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
 export default function Security() {
  const items = [
    { icon: Shield,   title: "SOC 2 Type II",  desc: "Independently audited security controls and data protection." },
    { icon: Globe,    title: "GDPR Compliant", desc: "Full compliance with European data protection regulations." },
    { icon: LinkIcon, title: "SSO & SAML",     desc: "Enterprise single sign-on with any identity provider." },
    { icon: Users,    title: "Admin Controls", desc: "Granular permissions, audit logs, and team management." },
  ];

  return (
    <section style={{ padding: "100px 2rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="sec-grid">
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>Security</p>
          <h2 style={{ fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 900, color: "#1a1a2e", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
            Built to keep your<br />organization secure
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.7, margin: "0 0 40px" }}>
            Keep your scheduling data secure with enterprise-grade admin management, security integrations, data governance, compliance audits, and privacy protections.
          </p>
          <Link href="/onboarding" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0069ff", color: "white", fontSize: 16, fontWeight: 700, padding: "14px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,105,255,0.35)" }}>
            Learn about security <ArrowRight size={17} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {items.map((item) => (
            <div
              key={item.title}
              style={{ background: "#f8f9ff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 24, transition: "all 0.2s", cursor: "default" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = "none"; }}
            >
              <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <item.icon size={22} color="#0069ff" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>{item.title}</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.sec-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════ */
function CTA() {
  return (
    <section style={{ padding: "120px 2rem", background: "#1a1a2e", position: "relative", overflow: "hidden", textAlign: "center" }}>
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 500, height: 400, background: "linear-gradient(135deg,#f472b6,#a855f7,#818cf8)", borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%", opacity: 0.18, animation: "ctaBlob 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: 400, height: 400, background: "linear-gradient(135deg,#0069ff,#06b6d4)", borderRadius: "50%", opacity: 0.12, animation: "ctaBlob 22s ease-in-out infinite reverse", pointerEvents: "none" }} />
      <style>{`@keyframes ctaBlob{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%;transform:rotate(0deg) scale(1);}50%{border-radius:40% 60% 30% 70%/60% 40% 60% 40%;transform:rotate(15deg) scale(1.08);}}`}</style>
      <div style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 20px", marginBottom: 32 }}>
          <Star size={14} color="#fbbf24" fill="#fbbf24" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Rated 4.9/5 by 20M+ users</span>
        </div>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          Get started in seconds<br />— for free.
        </h2>
        <p style={{ fontSize: "clamp(17px, 1.5vw, 21px)", color: "rgba(147,197,253,1)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
          Join millions of professionals who use Calendly to simplify their scheduling. No credit card required.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/onboarding" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0069ff", color: "white", fontSize: 17, fontWeight: 800, padding: "16px 40px", borderRadius: 999, textDecoration: "none", boxShadow: "0 8px 28px rgba(0,105,255,0.5)", transition: "all 0.2s" }}>
            Start for free <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "2px solid rgba(255,255,255,0.25)", color: "white", fontSize: 17, fontWeight: 800, padding: "16px 40px", borderRadius: 999, textDecoration: "none", transition: "all 0.2s" }}>
            See a live demo <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}