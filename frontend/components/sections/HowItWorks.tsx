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

const HOW_STEPS = [
  {
    id: "browser",
    title: "Browser extensions",
    desc: "Quickly find and share scheduling links from your inbox, LinkedIn, CRM, and more.",
    iconColor: "#0069ff",
    activeColor: "#0069ff",
    activeBg: "#eff6ff",
  },
  {
    id: "workflows",
    title: "Automated workflows",
    desc: "Boost attendance and save time by automating reminders and follow-ups.",
    iconColor: "#7c3aed",
    activeColor: "#7c3aed",
    activeBg: "#f5f3ff",
  },
  {
    id: "routing",
    title: "Routing forms",
    desc: "Instantly qualify, route, and schedule meetings with high-value leads and customers directly from your website.",
    iconColor: "#db2777",
    activeColor: "#db2777",
    activeBg: "#fdf2f8",
  },
  {
    id: "roundrobin",
    title: "Round robin & collective events",
    desc: "Automatically distribute meetings across your team or schedule group events with ease.",
    iconColor: "#d97706",
    activeColor: "#d97706",
    activeBg: "#fffbeb",
  },
  {
    id: "admin",
    title: "Admin management",
    desc: "Team admins enjoy tools to streamline onboarding, ensure consistency, track scheduling trends, maintain security standards, and more.",
    iconColor: "#059669",
    activeColor: "#059669",
    activeBg: "#ecfdf5",
  },
];

const STEP_ICONS: Record<string, React.ReactNode> = {
  browser: (
    <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
      <rect x="4" y="8" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 13h28" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10.5" r="1" fill="currentColor"/>
      <circle cx="13" cy="10.5" r="1" fill="currentColor"/>
    </svg>
  ),
  workflows: (
    <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
      <rect x="4" y="4" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2"/>
      <rect x="20" y="4" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="20" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 16v4M26 16v4M18 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  routing: (
    <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
      <path d="M6 10h10l4 8 4-8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="26" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="26" cy="26" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 18v4M26 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  roundrobin: (
    <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
      <path d="M18 4a14 14 0 1 1-9.9 4.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
      <path d="M18 4l12 5v9c0 7-5 12-12 14C11 30 6 25 6 18V9l12-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M13 18l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const STEP_PANELS: Record<string, React.ReactNode> = {
  browser: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.13)", border: "1px solid #f3f4f6", background: "white" }}>
      {/* Pink/purple blob background */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(135deg,#e879f9,#a855f7,#818cf8)", borderRadius: "0 0 60% 40%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "40%", height: "50%", background: "#3b82f6", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 24px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: "#0069ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 16, fontWeight: 900 }}>C</span>
              </div>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>⋮</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: "#0069ff", color: "white", fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                <span>+</span> Create
              </div>
              <span style={{ fontSize: 18, color: "#9ca3af", cursor: "pointer" }}>×</span>
            </div>
          </div>
          {/* Event types */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Event types</span>
            <span style={{ fontSize: 13, color: "#0069ff", fontWeight: 700 }}>+ New event type</span>
          </div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: "#9ca3af", fontSize: 13 }}>
            <span>🔍</span> Search event types...
          </div>
          {/* User */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>F</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Fatima Sy (you)</span>
            </div>
            <div style={{ display: "flex", gap: 8, color: "#9ca3af", fontSize: 14 }}>
              <span>↗</span><span>☆</span>
            </div>
          </div>
          {/* Event card */}
          <div style={{ border: "2px solid #7c3aed", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Follow-up Call</span>
              <div style={{ display: "flex", gap: 6, color: "#9ca3af", fontSize: 13 }}>
                <span>↗</span><span>☆</span><span>⋮</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 14px" }}>30 min · One on one</p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", border: "1px solid #e5e7eb", borderRadius: 999, padding: "5px 12px", display: "flex", alignItems: "center", gap: 4 }}>📅 Book meeting</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0069ff", border: "1.5px solid #0069ff", borderRadius: 999, padding: "5px 12px", display: "flex", alignItems: "center", gap: 4 }}>↗ Share availability ∧</span>
            </div>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", margin: "14px 0 0" }}>Shared</p>
        </div>
      </div>
    </div>
  ),

  workflows: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.13)", border: "1px solid #f3f4f6", background: "white" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(135deg,#4ade80,#22c55e)", borderRadius: "0 0 60% 40%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "35%", height: "45%", background: "#7c3aed", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "25%", height: "35%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 24px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "24px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 44, height: 44, background: "#0069ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={20} color="white" />
              </div>
              <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={10} color="white" />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, background: "#f3f4f6", borderRadius: 999, padding: "3px 10px", fontWeight: 600, color: "#374151" }}>Workflow</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Send text reminder</span>
            </div>
            <div style={{ width: "100%", border: "1.5px solid #1a1a2e", borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>
              24 hours before event starts
            </div>
            <div style={{ width: 2, height: 16, background: "#d1d5db" }} />
            <div style={{ width: "100%", background: "#f3f4ff", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: "#0069ff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><MessageSquare size={14} color="white" /></div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Send text to invitees</span>
            </div>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 44, height: 44, background: "#0069ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={20} color="white" />
            </div>
            <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: "#7c3aed", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={10} color="white" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, background: "#f3f4f6", borderRadius: 999, padding: "3px 10px", fontWeight: 600, color: "#374151" }}>Workflow</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Send follow-up email</span>
          </div>
        </div>
      </div>
    </div>
  ),

  routing: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.13)", border: "1px solid #f3f4f6", background: "white" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(135deg,#e879f9,#a855f7)", borderRadius: "0 0 60% 40%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "35%", height: "45%", background: "#3b82f6", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "25%", height: "35%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Left form */}
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ l: "C", bg: "#0069ff" }, { l: "H", bg: "#ff7a59" }, { l: "M", bg: "#6366f1" }, { l: "P", bg: "#00a1e0" }].map((i) => (
              <div key={i.l} style={{ width: 36, height: 36, background: i.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800 }}>{i.l}</div>
            ))}
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e", margin: "0 0 12px" }}>Get a demo</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px" }}>Work email</p>
          <div style={{ height: 32, background: "#f3f4f6", borderRadius: 8, marginBottom: 12 }} />
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px" }}>Company size</p>
          <div style={{ height: 36, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "0 12px", display: "flex", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>500 – 1000</span>
          </div>
          <div style={{ background: "#1a1a2e", color: "white", textAlign: "center", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 14 }}>Submit</div>
        </div>
        {/* Right route panel */}
        <div style={{ background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", alignSelf: "center" }}>
          <div style={{ background: "#eff6ff", borderRadius: 999, padding: "4px 12px", display: "inline-block", fontSize: 12, fontWeight: 700, color: "#0069ff", marginBottom: 10 }}>Route to:</div>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", margin: "0 0 2px" }}>Enterprise sales team</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>Round robin for distribution</p>
          {[{ name: "Miguel Padilla" }, { name: "Jim Nobles" }, { name: "Tori Mathers" }].map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{p.name}</p>
                <div style={{ height: 4, width: 60, background: "#e5e7eb", borderRadius: 99, marginTop: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  roundrobin: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.13)", border: "1px solid #f3f4f6", background: "white" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(135deg,#4ade80,#22c55e)", borderRadius: "0 0 60% 40%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "35%", height: "45%", background: "#7c3aed", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "25%", height: "35%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 24px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["A","B","C","D"].map((l, i) => (
              <div key={l} style={{ width: 36, height: 36, borderRadius: "50%", background: ["#0069ff","#7c3aed","#059669","#d97706"][i], display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800, marginLeft: i > 0 ? -8 : 0, border: "2px solid white" }}>{l}</div>
            ))}
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px" }}>Sales team — Round robin</p>
          {[{ name: "Alex Chen", pct: 78 }, { name: "Maria Lopez", pct: 65 }, { name: "James Kim", pct: 52 }].map((m) => (
            <div key={m.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{m.name}</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{m.pct}%</span>
              </div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${m.pct}%`, background: "#0069ff", borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  admin: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.13)", border: "1px solid #f3f4f6", background: "white" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(135deg,#4ade80,#22c55e)", borderRadius: "0 0 60% 40%", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "35%", height: "45%", background: "#7c3aed", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "25%", height: "35%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 24px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ background: "#eff6ff", borderRadius: 999, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#0069ff" }}>
              <span>👑</span> Admin managed events
            </div>
            <span style={{ fontSize: 18, color: "#9ca3af" }}>×</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 14, height: 14, background: "#22c55e", borderRadius: "50%" }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e" }}>Client Check-in</span>
          </div>
          {[
            { label: "Duration", value: "30 min", icon: <Clock size={14} color="#6b7280" /> },
            { label: "Location", value: "Zoom", icon: <Video size={14} color="#0069ff" /> },
            { label: "Availability", value: "Determined by assigned host", icon: null },
            { label: "Invitee limit", value: "No limit for invitees", icon: <Users size={14} color="#6b7280" /> },
          ].map((row) => (
            <div key={row.label} style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12, paddingBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>{row.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {row.icon}
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{row.value}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, color: "#9ca3af" }}>
                <Shield size={14} />
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

 export default function HowItWorks() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);
  const progressRef = useRef<any>(null);
  const DURATION = 4000; // ms per slide
  const TICK = 30;       // ms per progress tick

  const goTo = (idx: number, resetProgress = true) => {
    if (idx === activeIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setDisplayedIdx(idx);
      setActiveIdx(idx);
      setAnimating(false);
      if (resetProgress) setProgress(0);
    }, 220);
  };

  const startCycle = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current);
          return 100;
        }
        return p + (TICK / DURATION) * 100;
      });
    }, TICK);

    intervalRef.current = setTimeout(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % HOW_STEPS.length;
        setAnimating(true);
        setTimeout(() => {
          setDisplayedIdx(next);
          setActiveIdx(next);
          setAnimating(false);
        }, 220);
        return prev;
      });
    }, DURATION);
  };

  useEffect(() => {
    startCycle();
    return () => {
      clearInterval(progressRef.current);
      clearTimeout(intervalRef.current);
    };
  }, [activeIdx]);

  const handleManualClick = (idx: number) => {
    clearInterval(progressRef.current);
    clearTimeout(intervalRef.current);
    setProgress(0);
    if (idx === activeIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setDisplayedIdx(idx);
      setActiveIdx(idx);
      setAnimating(false);
    }, 220);
  };

  return (
   <section id="how-it-works" style={{ padding: "20px 2rem 100px", background: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }} className="how-grid">
          {/* Left — tab list */}
          <div>
            {HOW_STEPS.map((step, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div key={step.id}>
                  <button
                    onClick={() => handleManualClick(idx)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "20px 0", display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: isActive ? step.activeBg : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      <div style={{ color: isActive ? step.activeColor : "#9ca3af" }}>
                        {STEP_ICONS[step.id]}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 16,
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? "#1a1a2e" : "#9ca3af",
                      transition: "all 0.2s",
                    }}>
                      {step.title}
                    </span>
                  </button>

                  {/* Expanded description when active */}
                  {isActive && (
                    <div style={{ paddingLeft: 54, paddingBottom: 8 }}>
                      <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.65, margin: "0 0 12px" }}>{step.desc}</p>
                      <a href="#" style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        Learn more <ArrowRight size={14} />
                      </a>
                    </div>
                  )}

                  {/* Progress bar — fills on active, empty on others */}
                  <div style={{ height: 2, background: "#f3f4f6", borderRadius: 99, margin: "0 0 0 0" }}>
                    <div style={{
                      height: "100%",
                      width: isActive ? `${progress}%` : "0%",
                      background: step.activeColor,
                      borderRadius: 99,
                      transition: isActive ? "none" : "width 0.2s",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — animated panel */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              transition: "opacity 0.22s ease, transform 0.22s ease",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(10px)" : "translateY(0)",
            }}>
              {STEP_PANELS[HOW_STEPS[displayedIdx].id]}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .how-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}