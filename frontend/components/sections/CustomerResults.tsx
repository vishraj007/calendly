
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
const RESULTS = [
  { company: "HackerOne",           stat: "169%", label: "return on investment",          blobColor: "#1a1a2e", statColor: "#1a1a2e", borderActive: "#1a1a2e" },
  { company: "Vonage",              stat: "160%", label: "increase in customers reached",  blobColor: "#0069ff", statColor: "#0069ff", borderActive: "#0069ff" },
  { company: "University of Texas", stat: "20%",  label: "decrease in scheduling errors",  blobColor: "#f59e0b", statColor: "#d97706", borderActive: "#f59e0b" },
  { company: "MuckRack",            stat: "8x",   label: "faster meeting scheduling",      blobColor: "#9333ea", statColor: "#7c3aed", borderActive: "#9333ea" },
];

export default function CustomerResults() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section style={{ padding: "100px 2rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>
              Results
            </p>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 900, color: "#1a1a2e", margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Discover how businesses<br />grow with Calendly
            </h2>
          </div>
          <a href="/stories" style={{ fontSize: 15, fontWeight: 700, color: "#6b7280", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            View all stories →
          </a>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="results-grid">
          {RESULTS.map((r, idx) => {
            const isHovered = hoveredCard === idx;
            return (
              <div
                key={r.company}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  border: `2px solid ${isHovered ? r.borderActive : "#e5e7eb"}`,
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  minHeight: 300,
                  background: "white",
                  transition: "border-color 0.3s, transform 0.3s",
                  transform: isHovered ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Content */}
                <div style={{ position: "relative", zIndex: 10, padding: 28, display: "flex", flexDirection: "column", minHeight: 300 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: isHovered ? "white" : "#374151", margin: "0 0 24px", transition: "color 0.5s" }}>
                    {r.company}
                  </p>
                  <p style={{ fontSize: 60, fontWeight: 900, color: isHovered ? "white" : r.statColor, margin: "0 0 8px", lineHeight: 1, letterSpacing: "-0.03em", transition: "color 0.5s" }}>
                    {r.stat}
                  </p>
                  <p style={{ fontSize: 15, color: isHovered ? "rgba(255,255,255,0.9)" : "#6b7280", flex: 1, margin: "0 0 32px", lineHeight: 1.5, transition: "color 0.5s" }}>
                    {r.label}
                  </p>
                  
                  
                </div>

                {/* Blob — fills card on hover */}
                <div
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    background: r.blobColor,
                    zIndex: 5,
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    bottom: isHovered ? "-20%" : "-18px",
                    left:   isHovered ? "-20%" : "-18px",
                    width:  isHovered ? "160%" : "75%",
                    height: isHovered ? "160%" : "45%",
                    borderRadius: isHovered ? "50%" : "60% 80% 0% 0% / 70% 90% 0% 0%",
                    animation: isHovered ? "none" : "blobWave 4s ease-in-out infinite",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes blobWave {
          0%, 100% { border-radius: 60% 80% 0% 0% / 70% 90% 0% 0%; }
          50%       { border-radius: 70% 60% 0% 0% / 80% 70% 0% 0%; }
        }
        @media(max-width:900px){.results-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.results-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

