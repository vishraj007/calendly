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
 export default function Footer() {
  const cols = [
    { title: "Product",   links: [{ l: "Features", h: "#features" },{ l: "Pricing", h: "#pricing" },{ l: "Integrations", h: "#integrations" },{ l: "Security", h: "#" },{ l: "Changelog", h: "#" }] },
    { title: "Resources", links: [{ l: "Help Center", h: "#" },{ l: "Blog", h: "#" },{ l: "API Docs", h: "#" },{ l: "Community", h: "#" },{ l: "Templates", h: "#" }] },
    { title: "Company",   links: [{ l: "About Us", h: "#" },{ l: "Careers", h: "#" },{ l: "Contact", h: "#" },{ l: "Privacy Policy", h: "#" },{ l: "Terms", h: "#" }] },
  ];

  return (
    <footer style={{ background: "white", borderTop: "1px solid #f3f4f6", padding: "80px 2rem 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }} className="footer-grid">
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, background: "#0069ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,105,255,0.3)" }}>
                <Calendar size={20} color="white" />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e" }}>Calendly</span>
            </Link>
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, maxWidth: 280, marginBottom: 28 }}>
              The modern scheduling platform that makes finding time a breeze for teams of all sizes.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["𝕏", "in", "f", "▶"].map((s, i) => (
                <a key={i} href="#" style={{ width: 38, height: 38, background: "#f3f4f6", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#6b7280", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "#0069ff"; el.style.color = "white"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "#f3f4f6"; el.style.color = "#6b7280"; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: "#1a1a2e", marginBottom: 20, letterSpacing: "0.12em", textTransform: "uppercase" }}>{title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(({ l, h }) => (
                  <li key={l}>
                    <a href={h} style={{ fontSize: 15, color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0069ff")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#6b7280")}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 14, color: "#9ca3af" }}>© {new Date().getFullYear()} Calendly, Inc. All rights reserved.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>All systems operational</span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.footer-grid{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  );
}