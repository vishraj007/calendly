
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

 export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  const plans = [
    { name: "Free",       desc: "For personal use",       price: "$0",                   note: "/month",   cta: "Get started free",  style: "dark",    features: ["1 event type","Unlimited bookings","Calendar integrations","Shareable booking page","Email notifications"] },
    { name: "Standard",   desc: "For professionals",      price: yearly ? "$10" : "$12", note: "/seat/mo", cta: "Start free trial",   style: "blue",    save: yearly ? "Save 16%" : "", features: ["Unlimited event types","Everything in Free","Custom questions","Buffer & padding times","Multiple schedules"] },
    { name: "Teams",      desc: "For growing businesses", price: yearly ? "$16" : "$20", note: "/seat/mo", cta: "Start free trial",   style: "blue",    save: yearly ? "Save 20%" : "", badge: "Most popular", features: ["Everything in Standard","Team scheduling pages","Round-robin distribution","Admin management","Advanced analytics"] },
    { name: "Enterprise", desc: "For large companies",    price: "Custom",               note: "",         cta: "Talk to sales",      style: "outline", features: ["Everything in Teams","SAML SSO","Advanced security","SLA & custom contracts","Dedicated success manager"] },
  ];

  return (
    <section id="pricing" style={{ padding: "100px 2rem", background: "#f8f9ff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>Pricing</p>
        <h2 style={{ fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 900, color: "#1a1a2e", margin: "0 0 36px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Pick the perfect plan<br />for your team
        </h2>

        <div style={{ display: "inline-flex", background: "white", border: "1px solid #e5e7eb", borderRadius: 999, padding: 4, marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {[{ label: "Yearly", val: true, badge: "Save 16%" }, { label: "Monthly", val: false }].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setYearly(opt.val)}
              style={{ padding: "10px 24px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, background: yearly === opt.val ? "#0069ff" : "transparent", color: yearly === opt.val ? "white" : "#6b7280", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {opt.label}
              {opt.badge && yearly === opt.val && (
                <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 999 }}>{opt.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="pricing-grid">
          {plans.map((p) => (
            <div
              key={p.name}
              style={{ background: "white", borderRadius: 20, border: p.badge ? "2px solid #0069ff" : "1px solid #e5e7eb", padding: 28, position: "relative", display: "flex", flexDirection: "column", transition: "all 0.25s", boxShadow: p.badge ? "0 8px 32px rgba(0,105,255,0.12)" : "none" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = p.badge ? "0 20px 48px rgba(0,105,255,0.18)" : "0 20px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = p.badge ? "0 8px 32px rgba(0,105,255,0.12)" : "none"; }}
            >
              {p.badge && (
                <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", background: "#0069ff", color: "white", fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,105,255,0.4)" }}>
                  {p.badge}
                </div>
              )}
              <p style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>{p.name}</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px", fontWeight: 500 }}>{p.desc}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.02em" }}>{p.price}</span>
                {p.note && <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{p.note}</span>}
                {p.save && <span style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", background: "#dcfce7", padding: "3px 8px", borderRadius: 999, marginLeft: 4 }}>{p.save}</span>}
              </div>
              <Link href="/onboarding" style={{ display: "block", textAlign: "center", fontSize: 15, fontWeight: 800, padding: "13px", borderRadius: 12, margin: "20px 0 24px", textDecoration: "none", transition: "all 0.2s", background: p.style === "blue" ? "#0069ff" : p.style === "dark" ? "#1a1a2e" : "transparent", color: p.style === "outline" ? "#374151" : "white", border: p.style === "outline" ? "2px solid #e5e7eb" : "none", boxShadow: p.style === "blue" ? "0 4px 16px rgba(0,105,255,0.35)" : "none" }}>
                {p.cta}
              </Link>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 20, height: 20, background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={11} color="#0069ff" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5, fontWeight: 500 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 14, color: "#9ca3af", marginTop: 32, fontWeight: 500 }}>
          All plans include a 14-day free trial · No credit card required
        </p>
      </div>
      <style>{`@media(max-width:1000px){.pricing-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:600px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}