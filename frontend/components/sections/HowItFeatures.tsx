

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
const WHAT_FEATURES = [
  {
    id: "calendars",
    title: "Connect your calendars",
    desc: "Calendly connects up to six calendars to automate scheduling with real-time availability.",
    activeColor: "#0069ff",
    activeBg: "#eff6ff",
  },
  {
    id: "availability",
    title: "Add your availability",
    desc: "Keep invitees informed of your availability. Take control of your calendar with detailed availability settings, scheduling rules, buffers, and more.",
    activeColor: "#7c3aed",
    activeBg: "#f5f3ff",
  },
  {
    id: "conferencing",
    title: "Connect conferencing tools",
    desc: "Sync your video conferencing tools and set preferences for in-person meetings or calls.",
    activeColor: "#db2777",
    activeBg: "#fdf2f8",
  },
  {
    id: "eventtypes",
    title: "Customize your event types",
    desc: "Choose from pre-built templates or quickly create custom event types for any meeting you need to schedule.",
    activeColor: "#d97706",
    activeBg: "#fffbeb",
  },
  {
    id: "share",
    title: "Share your scheduling link",
    desc: "Share your Calendly link via email, website, or social media. Invitees pick a time and you're booked.",
    activeColor: "#059669",
    activeBg: "#ecfdf5",
  },
];

const WHAT_ICONS: Record<string, React.ReactNode> = {
  calendars: (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <rect x="4" y="8" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 14h28" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 4v6M24 4v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  availability: (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <path d="M18 4l12 5v9c0 7-5 12-12 14C11 30 6 25 6 18V9l12-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M13 18l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  conferencing: (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <rect x="3" y="9" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M25 15l8-5v14l-8-5V15z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  eventtypes: (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="20" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="4" y="20" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="20" y="20" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  share: (
    <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
      <circle cx="28" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="18" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="28" cy="28" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 16l12-6M12 20l12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const WHAT_PANELS: Record<string, React.ReactNode> = {
  calendars: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 400 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,#e879f9,#a855f7,#818cf8)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "40%", height: "50%", background: "#3b82f6", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ background: "#eff6ff", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#0069ff", display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={12} color="#0069ff" /> Availability
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Connect existing calendar</span>
          </div>
          {/* Google */}
          <div style={{ border: "1px solid #f3f4f6", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="white"/><path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z" fill="#4285F4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6C4.7 19.9 8.1 22 12 22z" fill="#34A853"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1A9.9 9.9 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5L6.4 14z" fill="#FBBC05"/><path d="M12 5.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.5 14.6 1.5 12 1.5 8.1 1.5 4.7 3.6 3.1 7l3.3 2.6C7.2 7.1 9.4 5.4 12 5.4z" fill="#EA4335"/></svg>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Google</span>
            </div>
            <div style={{ border: "1px solid #f3f4f6", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#374151" }}>Google calendars</span>
              <ChevronRight size={16} color="#9ca3af" />
            </div>
          </div>
          {/* Microsoft */}
          <div style={{ border: "1px solid #f3f4f6", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <svg style={{ width: 28, height: 28 }} viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#7fba00" d="M12 0h11v11H12z"/><path fill="#00a4ef" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Microsoft</span>
            </div>
            {["Outlook calendars", "Exchange calendars"].map((c) => (
              <div key={c} style={{ border: "1px solid #f3f4f6", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "#374151" }}>{c}</span>
                <ChevronRight size={16} color="#9ca3af" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  availability: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 400 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,#4ade80,#22c55e)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "35%", height: "45%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "25%", height: "40%", background: "#7c3aed", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "#eff6ff", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#0069ff", display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={12} color="#0069ff" /> Availability
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Meeting hours</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <RefreshCw size={14} color="#374151" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Weekly hours</span>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 14px" }}>Set when you are typically available for meetings</p>
          {[
            { day: "S", label: "Sun", avail: false },
            { day: "M", label: "Mon", from: "9:00 am", to: "4:30 pm", avail: true },
            { day: "T", label: "Tue", avail: false },
            { day: "W", label: "Wed", from: "9:30 am", to: "5:00 pm", avail: true },
            { day: "Th", label: "Thu", from: "10:00 am", to: "6:00 pm", avail: true },
            { day: "F", label: "Fri", from: "10:00 am", to: "3:00 pm", avail: true },
            { day: "S", label: "Sat", avail: false },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 6 ? "1px solid #f9fafb" : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: row.avail ? "#1a1a2e" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: row.avail ? "white" : "#9ca3af" }}>{row.day}</span>
              </div>
              {row.avail ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                  <div style={{ background: "#f3f4f6", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#374151" }}>{row.from}</div>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>–</span>
                  <div style={{ background: "#f3f4f6", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#374151" }}>{row.to}</div>
                </div>
              ) : (
                <span style={{ fontSize: 13, color: "#9ca3af", flex: 1 }}>Unavailable</span>
              )}
            </div>
          ))}
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
            <strong>Timezone:</strong> Eastern time – US & Canada ∨
          </p>
        </div>
      </div>
    </div>
  ),

  conferencing: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 400 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,#e879f9,#a855f7)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "35%", height: "45%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "20%", height: "35%", background: "#3b82f6", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ background: "#f3f4f6", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#374151" }}>Meeting location</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Video conferencing</span>
          </div>
          {[
            { name: "Zoom", color: "#2D8CFF", letter: "Z", icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#2D8CFF"/><path d="M5 11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7zm15 1.75 5-3.5v9.5l-5-3.5v-2.5z" fill="white"/></svg> },
            { name: "Microsoft Teams", color: "#6264A7", letter: "T", icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#6264A7"/><circle cx="13" cy="10" r="4" fill="white"/><path d="M5 22c0-4.4 3.6-8 8-8s8 3.6 8 8v2H5v-2z" fill="white"/><path d="M18 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4 2h-3a6 6 0 0 1 6 6v1h2v-1a5 5 0 0 0-5-5z" fill="white" opacity=".8"/></svg> },
            { name: "Google Meet", color: "#00AC47", letter: "G", icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="white"/><path d="M19 16l6-4v8l-6-4z" fill="#00AC47"/><rect x="6" y="10" width="13" height="12" rx="2" fill="#00AC47"/></svg> },
            { name: "Webex", color: "#00bceb", letter: "W", icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#00bceb"/><path d="M10 12l6 8 6-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 16a9 9 0 0 0 18 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg> },
          ].map((tool) => (
            <div key={tool.name} style={{ border: "1px solid #f3f4f6", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {tool.icon}
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>{tool.name}</span>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  eventtypes: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 400 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,#fbbf24,#f59e0b)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "35%", height: "45%", background: "#dc2626", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "20%", height: "35%", background: "#db2777", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ background: "#f3f4f6", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
              <LinkIcon size={11} /> Event types
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Ways to meet</span>
          </div>
          {[
            { name: "One-on-one", color: "#0069ff", bg: "#eff6ff", hosts: "1 host", arrow: "→", invitees: "1 invitee", desc: "Good for 1:1 check-ins, screening calls, etc." },
            { name: "Collective", color: "#059669", bg: "#ecfdf5", hosts: "Multiple hosts", arrow: "→", invitees: "1 invitee", desc: "Co-host meetings, group interviews, etc." },
            { name: "Round robin", color: "#7c3aed", bg: "#f5f3ff", hosts: "Rotating hosts", arrow: "→", invitees: "1 invitee", desc: "Distribute between team members" },
            { name: "Group", color: "#d97706", bg: "#fffbeb", hosts: "1 host", arrow: "→", invitees: "Multiple invitees", desc: "Webinars, tours, and classes" },
          ].map((t) => (
            <div key={t.name} style={{ background: t.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: t.color, margin: "0 0 4px" }}>{t.name}</p>
              <p style={{ fontSize: 13, color: "#374151", margin: "0 0 2px" }}>{t.hosts} {t.arrow} {t.invitees}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  share: (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 400 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,#4ade80,#22c55e)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "35%", height: "45%", background: "#1e3a8a", borderRadius: "0 60% 0 0", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "25%", height: "40%", background: "#7c3aed", borderRadius: "60% 0 0 0", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 0" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px" }}>Share your link</p>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#0069ff", fontWeight: 700 }}>calendly.com/yourname</span>
            <button style={{ fontSize: 12, fontWeight: 800, color: "white", background: "#0069ff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Copy</button>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", marginBottom: 12 }}>Share via</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {["📧 Email", "🌐 Website", "💬 LinkedIn"].map((ch) => (
              <div key={ch} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 6px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>{ch}</div>
            ))}
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, background: "#4ade80", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={12} color="white" strokeWidth={3} />
            </div>
            <p style={{ fontSize: 13, color: "#15803d", fontWeight: 600, margin: 0 }}>Your booking page is live!</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

 export default function HowItFeatures() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [displayedIdx, setDisplayedIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);
  const progressRef = useRef<any>(null);
  const DURATION = 4000;
  const TICK = 30;

  const startCycle = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(progressRef.current); return 100; }
        return p + (TICK / DURATION) * 100;
      });
    }, TICK);

    intervalRef.current = setTimeout(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % WHAT_FEATURES.length;
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
    return () => { clearInterval(progressRef.current); clearTimeout(intervalRef.current); };
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
    <section id="how-it-works" style={{ padding: "100px 2rem", background: "#f8f9ff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <h2 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 900, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
            Calendly makes<br />scheduling simple
          </h2>
          <p style={{ fontSize: "clamp(16px, 1.4vw, 19px)", color: "#6b7280", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 32px" }}>
            Calendly&apos;s easy enough for individual users, and powerful enough to meet the needs of enterprise organizations — including 86% of the Fortune 500 companies.
          </p>
          <Link href="/onboarding" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0069ff", color: "white", fontSize: 16, fontWeight: 700, padding: "14px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,105,255,0.35)" }}>
            Sign up for free
          </Link>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }} className="how-grid">

          {/* Left — steps */}
          <div>
            {WHAT_FEATURES.map((step, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div key={step.id}>
                  <button
                    onClick={() => handleManualClick(idx)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "18px 0", display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: isActive ? step.activeBg : "transparent",
                      color: isActive ? step.activeColor : "#9ca3af",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {WHAT_ICONS[step.id]}
                    </div>
                    <span style={{ fontSize: 16, fontWeight: isActive ? 800 : 500, color: isActive ? "#1a1a2e" : "#9ca3af", transition: "all 0.2s" }}>
                      {step.title}
                    </span>
                  </button>

                  {isActive && (
                    <div style={{ paddingLeft: 52, paddingBottom: 8 }}>
                      <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.65, margin: "0 0 10px" }}>{step.desc}</p>
                      <a href="#" style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Learn more <ArrowRight size={14} />
                      </a>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div style={{ height: 2, background: "#e5e7eb", borderRadius: 99 }}>
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

          {/* Right — panel */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              transition: "opacity 0.22s ease, transform 0.22s ease",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(10px)" : "translateY(0)",
            }}>
              {WHAT_PANELS[WHAT_FEATURES[displayedIdx].id]}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .how-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}