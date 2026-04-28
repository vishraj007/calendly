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


import Footer from "@/components/layout/Footer";


import HowItFeatures from "@/components/sections/HowItFeatures";
import Integrations from "@/components/sections/Integrations";

import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import CustomerResults from "@/components/sections/CustomerResults";
import Security from "@/components/sections/Security";


/* ═══════════════════════════════════════════════════════
   THREE.JS BACKGROUND — organic blob shapes matching
   the Calendly screenshot exactly:
   • Top-right: large blue organic blob (partially off-screen)
   • Bottom-left: large pink/magenta organic blob (partially off-screen)
   • Bottom-right: medium blue accent blob (partially off-screen)
   ═══════════════════════════════════════════════════════ */
function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let renderer: any, scene: any, camera: any;
    const meshes: any[] = [];

    async function init() {
      const THREE = await import("three");
      const el = mountRef.current;
      if (!el) return;

      const W = el.clientWidth;
      const H = el.clientHeight;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.z = 5;

      /* ── blob geometry helper ── */
      const blobData = [
        {
          color: 0xf472b6,   // pink
          color2: 0xa855f7,  // purple
          x: 3.2, y: 1.8, z: -1,
          scale: 2.6,
          speedX: 0.0031, speedY: 0.0019, speedZ: 0.0023,
        },
        {
          color: 0x0069ff,  // blue
          color2: 0x06b6d4, // cyan
          x: 3.8, y: -2.0, z: -0.5,
          scale: 1.8,
          speedX: 0.0024, speedY: 0.0037, speedZ: 0.0018,
        },
        {
          color: 0xec4899,  // fuchsia
          color2: 0x8b5cf6, // violet
          x: 2.5, y: 0.3, z: 0.5,
          scale: 1.3,
          speedX: 0.0041, speedY: 0.0028, speedZ: 0.0033,
        },
        {
          color: 0x22d3ee,  // cyan
          color2: 0x3b82f6, // blue
          x: 4.5, y: -0.5, z: -1.5,
          scale: 1.0,
          speedX: 0.0035, speedY: 0.0042, speedZ: 0.0027,
        },
      ];

      blobData.forEach((b) => {
        const geo = new THREE.IcosahedronGeometry(1, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(b.color),
          emissive: new THREE.Color(b.color2),
          emissiveIntensity: 0.4,
          roughness: 0.3,
          metalness: 0.1,
          transparent: true,
          opacity: 0.82,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(b.x, b.y, b.z);
        mesh.scale.setScalar(b.scale);
        mesh.userData = {
          speedX: b.speedX,
          speedY: b.speedY,
          speedZ: b.speedZ,
          offset: Math.random() * Math.PI * 2,
        };
        scene.add(mesh);
        meshes.push(mesh);
      });

      /* ── lights ── */
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const dir1 = new THREE.DirectionalLight(0xf472b6, 1.5);
      dir1.position.set(5, 5, 5);
      scene.add(dir1);
      const dir2 = new THREE.DirectionalLight(0x0069ff, 1.2);
      dir2.position.set(-5, -3, 2);
      scene.add(dir2);
      const point = new THREE.PointLight(0xa855f7, 1.8, 20);
      point.position.set(0, 0, 3);
      scene.add(point);

      /* ── morph blobs via vertex displacement ── */
      const posArrays = meshes.map((m) => {
        const pos = m.geometry.attributes.position;
        return Float32Array.from(pos.array);
      });

      /* ── resize ── */
      const onResize = () => {
        if (!el) return;
        const w = el.clientWidth;
        const h = el.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      /* ── animate ── */
      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.012;

        meshes.forEach((mesh, mi) => {
          const { speedX, speedY, speedZ, offset } = mesh.userData;
          mesh.rotation.x += speedX;
          mesh.rotation.y += speedY;
          mesh.rotation.z += speedZ;

          /* gentle bob */
          mesh.position.y += Math.sin(t + offset) * 0.002;
          mesh.position.x += Math.cos(t * 0.7 + offset) * 0.001;

          /* vertex morph */
          const pos = mesh.geometry.attributes.position;
          const orig = posArrays[mi];
          for (let i = 0; i < pos.count; i++) {
            const ix = i * 3;
            const ox = orig[ix], oy = orig[ix + 1], oz = orig[ix + 2];
            const noise =
              Math.sin(ox * 2.5 + t + offset) *
              Math.cos(oy * 2.5 + t * 0.8) *
              Math.sin(oz * 2.5 + t * 0.6) * 0.18;
            pos.setXYZ(
              i,
              ox + ox * noise,
              oy + oy * noise,
              oz + oz * noise
            );
          }
          pos.needsUpdate = true;
          mesh.geometry.computeVertexNormals();
        });

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    const cleanup = init();

    return () => {
      cancelAnimationFrame(animId);
      cleanup.then((fn) => fn?.());
      if (renderer) {
        renderer.dispose();
        const canvas = mountRef.current?.querySelector("canvas");
        canvas?.remove();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════════════════════ */
const LOGOS = [
  { name: "Dropbox",            emoji: "📦" },
  { name: "Gong",               emoji: "🔔" },
  { name: "Carnival",           emoji: "🚢" },
  { name: "Indiana University", emoji: "🎓" },
  { name: "DoorDash",           emoji: "🚗" },
  { name: "Lyft",               emoji: "🚕" },
  { name: "Compass",            emoji: "🧭" },
  { name: "Zendesk",            emoji: "💬" },
  { name: "Notion",             emoji: "📝" },
  { name: "Figma",              emoji: "🎨" },
  { name: "Stripe",             emoji: "💳" },
  { name: "HubSpot",            emoji: "🧡" },
];

function TrustedByMarquee() {
  const items = [...LOGOS, ...LOGOS, ...LOGOS];
  return (
    <div className="relative z-10 border-t border-gray-100 bg-white/90 backdrop-blur-sm py-9 overflow-hidden">
      <p
        style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}
        className="text-center text-gray-400 uppercase mb-7"
      >
        Trusted by 100,000+ leading organizations worldwide
      </p>
      <div
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "3.5rem",
            width: "max-content",
            animation: "marqueeScroll 35s linear infinite",
          }}
        >
          {items.map((logo, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
                opacity: 0.55,
                transition: "opacity 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.55")}
            >
              <span style={{ fontSize: 22 }}>{logo.emoji}</span>
              <span style={{ color: "#4b5563", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { href: "#features",     label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing",      label: "Pricing" },
    { href: "#integrations", label: "Integrations" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 #e5e7eb" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "#0069ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,105,255,0.35)" }}>
            <Calendar size={18} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>Calendly</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{ fontSize: 15, fontWeight: 600, color: "#374151", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0069ff")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#374151")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
          <Link
            href="/onboarding"
            style={{ fontSize: 15, fontWeight: 700, color: "white", background: "#0069ff", textDecoration: "none", padding: "10px 24px", borderRadius: 999, boxShadow: "0 4px 14px rgba(0,105,255,0.4)", transition: "all 0.2s" }}
          >
            Get started free
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ padding: 8, background: "none", border: "none", cursor: "pointer" }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background: "white", borderTop: "1px solid #e5e7eb", padding: "1rem 2rem" }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: "block", fontSize: 16, fontWeight: 600, color: "#374151", padding: "12px 0", textDecoration: "none", borderBottom: "1px solid #f3f4f6" }}
            >
              {l.label}
            </a>
          ))}
          <Link href="/onboarding" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 16, fontWeight: 700, color: "white", background: "#0069ff", padding: "13px", borderRadius: 999, textDecoration: "none" }}>
            Get started free
          </Link>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   BOOKING PREVIEW CARD — Slide 1
   ═══════════════════════════════════════════════════════ */
function BookingCard() {
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedTime, setSelectedTime] = useState("11:00am");
  const times = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"];

  return (
    <div style={{ padding: "0 0 20px" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: "#0069ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar size={16} color="white" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>ACME Inc.</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Share your booking page</span>
      </div>

      <div style={{ display: "flex" }}>
        {/* Left profile */}
        <div style={{ width: 175, flexShrink: 0, padding: "20px", borderRight: "1px solid #f3f4f6", background: "#fafafa" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, fontWeight: 800, marginBottom: 12, boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
            V
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px", fontWeight: 500 }}>Vishal Rawat</p>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px", lineHeight: 1.3 }}>Client Check-in</p>
          {[{ Icon: Clock, text: "30 min" }, { Icon: Video, text: "Zoom" }, { Icon: Globe, text: "Web conferencing" }].map(({ Icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon size={13} color="#0069ff" />
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{text}</span>
            </div>
          ))}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 6 }}>
            {[100, 80, 65].map((w) => (
              <div key={w} style={{ height: 6, background: "#e5e7eb", borderRadius: 99, width: `${w}%` }} />
            ))}
          </div>
        </div>

        {/* Center calendar */}
        <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>Select a Date & Time</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>April 2026</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["‹", "›"].map((c) => (
                <button key={c} style={{ width: 26, height: 26, background: "#f3f4f6", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 14, color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center", marginBottom: 8 }}>
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
              <div key={d} style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 12 }}>
            {[...Array(3)].map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const avail = [14,15,16,17,18,21,22,23,24,25,28,29,30].includes(day);
              const sel = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => avail && setSelectedDay(day)}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: avail ? "pointer" : "default", fontSize: 12, fontWeight: sel ? 800 : avail ? 700 : 400, background: sel ? "#0069ff" : "transparent", color: sel ? "white" : avail ? "#0069ff" : "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", transition: "all 0.15s", boxShadow: sel ? "0 4px 12px rgba(0,105,255,0.4)" : "none" }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 4 }}>Time zone</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Globe size={12} color="#9ca3af" />
              <span style={{ fontSize: 12, color: "#6b7280" }}>India Standard Time ▾</span>
            </div>
          </div>
        </div>

        {/* Right time slots */}
        <div style={{ width: 160, flexShrink: 0, padding: "20px" }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.4 }}>
            Monday,<br />Apr {selectedDay}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {times.map((t) => (
              <div key={t} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  onClick={() => setSelectedTime(t)}
                  style={{ flex: 1, fontSize: 12, fontWeight: 700, padding: "8px 4px", borderRadius: 10, border: `1.5px solid ${selectedTime === t ? "#1a1a2e" : "#0069ff"}`, background: selectedTime === t ? "#1a1a2e" : "transparent", color: selectedTime === t ? "white" : "#0069ff", cursor: "pointer", transition: "all 0.15s" }}
                >
                  {t}
                </button>
                {selectedTime === t && (
                  <Link href="/onboarding" style={{ background: "#0069ff", color: "white", fontSize: 11, fontWeight: 800, padding: "8px 10px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
                    ✓
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WORKFLOW CARD — Slide 2
   ═══════════════════════════════════════════════════════ */
function WorkflowCard() {
  return (
    <div style={{ padding: "28px 28px 24px" }}>
      <h3 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 28px", lineHeight: 1.25 }}>
        Reduce no-shows and<br />stay on track
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Workflow 1 */}
        <div style={{ background: "#f0f4ff", borderRadius: 16, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", background: "white", borderRadius: 6, padding: "3px 10px", border: "1px solid #e5e7eb" }}>Workflow</span>
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <div style={{ width: 36, height: 36, background: "#0069ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquare size={18} color="white" />
              </div>
              <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, background: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={9} color="white" />
              </div>
            </div>
          </div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px" }}>Send text reminder</p>
          <div style={{ background: "white", border: "1.5px solid #0069ff", borderRadius: 10, padding: "10px 14px", marginBottom: 8, textAlign: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>24 hours before event starts</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ borderLeft: "2px dashed #d1d5db", height: 16 }} />
          </div>
          <div style={{ background: "#eff6ff", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "#0069ff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageSquare size={12} color="white" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Send text to invitees</span>
          </div>
        </div>

        {/* Workflow 2 */}
        <div style={{ background: "#f0f4ff", borderRadius: 16, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", background: "white", borderRadius: 6, padding: "3px 10px", border: "1px solid #e5e7eb" }}>Workflow</span>
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <div style={{ width: 36, height: 36, background: "#7c3aed", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={18} color="white" />
              </div>
              <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, background: "#a855f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={9} color="white" />
              </div>
            </div>
          </div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px" }}>Send follow-up email</p>
          <div style={{ background: "white", border: "1.5px solid #7c3aed", borderRadius: 10, padding: "10px 14px", marginBottom: 8, textAlign: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>2 hours after event ends</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ borderLeft: "2px dashed #d1d5db", height: 16 }} />
          </div>
          <div style={{ background: "#f5f3ff", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "#7c3aed", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Mail size={12} color="white" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Send email to invitees</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO SLIDESHOW — cycles BookingCard ↔ WorkflowCard
   ═══════════════════════════════════════════════════════ */
function HeroSlideshow() {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const totalSlides = 2;

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((slide + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [slide]);

  const goToSlide = (idx: number) => {
    if (animating || idx === slide) return;
    setAnimating(true);
    setTimeout(() => {
      setSlide(idx);
      setAnimating(false);
    }, 320);
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        boxShadow: "0 25px 80px rgba(0,0,0,0.18)",
        border: "1px solid rgba(255,255,255,0.8)",
        overflow: "hidden",
        width: "100%",
        maxWidth: 700,
        position: "relative",
      }}
    >
      <div
        style={{
          transition: "opacity 0.32s ease, transform 0.32s ease",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(12px)" : "translateY(0)",
        }}
      >
        {slide === 0 ? <BookingCard /> : <WorkflowCard />}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingBottom: 16, paddingTop: 4 }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer", background: i === slide ? "#0069ff" : "#d1d5db", padding: 0, transition: "all 0.3s ease" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingTop: 68,
      }}
    >
      <ThreeBackground />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 2rem 60px",
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
            width: "100%",
          }}
          className="hero-grid"
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,105,255,0.08)",
                border: "1px solid rgba(0,105,255,0.2)",
                borderRadius: 999,
                padding: "6px 16px",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: "#0069ff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0069ff" }}>
                Trusted by 20M+ professionals
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(48px, 5.5vw, 80px)",
                fontWeight: 900,
                color: "#1a1a2e",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: "0 0 24px",
              }}
            >
              Easy<br />
              <span style={{ color: "#0069ff" }}>scheduling</span>
              <br />ahead
            </h1>

            <p
              style={{
                fontSize: "clamp(17px, 1.5vw, 20px)",
                color: "#6b7280",
                lineHeight: 1.7,
                maxWidth: 440,
                margin: "0 0 40px",
              }}
            >
              Join millions of professionals who easily book meetings with the{" "}
              <strong style={{ color: "#1a1a2e" }}>#1 scheduling tool</strong>.
              No back-and-forth. No hassle.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
              <Link
                href="/onboarding"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0069ff",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "15px 32px",
                  borderRadius: 999,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(0,105,255,0.4)",
                  transition: "all 0.2s",
                }}
              >
                Get started — it&apos;s free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "white",
                  color: "#374151",
                  fontSize: 16,
                  fontWeight: 700,
                  padding: "15px 32px",
                  borderRadius: 999,
                  textDecoration: "none",
                  border: "2px solid #e5e7eb",
                  transition: "all 0.2s",
                }}
              >
                View demo
              </Link>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["Free forever plan", "No credit card required"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 20, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={12} color="#16a34a" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — slideshow card */}
          <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                position: "absolute",
                inset: "-20px",
                background: "radial-gradient(ellipse at center, rgba(0,105,255,0.12) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
              <HeroSlideshow />
            </div>
          </div>
        </div>
      </div>

      <TrustedByMarquee />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   VALUE PROPS
   ═══════════════════════════════════════════════════════ */
function ValueProps() {
  return (
   <section style={{ padding: "120px 2rem 40px", background: "white", textAlign: "center" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 16 }}>
          Why Calendly
        </p>
        <h2 style={{ fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 900, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          More than a<br />scheduling link
        </h2>
        <p style={{ fontSize: "clamp(17px, 1.4vw, 21px)", color: "#6b7280", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 48px" }}>
          Calendly&apos;s functionality goes way beyond just a scheduling link, with customizable,
          automated features to help you and your team achieve goals faster.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/onboarding" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0069ff", color: "white", fontSize: 16, fontWeight: 700, padding: "14px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,105,255,0.35)" }}>
            Sign up for free <ArrowRight size={17} />
          </Link>
          
        </div>
      </div>
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



export default function HomePage() {
  return (
    <main style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <Navbar />
      <Hero />
     
      <HowItFeatures/>
    <Integrations />
     <ValueProps />
      <HowItWorks />

      <Pricing />
      <CustomerResults />
    
      
   
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}