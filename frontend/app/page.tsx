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
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   THREE.JS ANIMATED BACKGROUND
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
   MARQUEE — with inline CSS animation so it NEVER stops
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
  const items = [...LOGOS, ...LOGOS, ...LOGOS]; // triple for seamless wrap
  return (
    <div className="relative z-10 border-t border-gray-100 bg-white/90 backdrop-blur-sm py-9 overflow-hidden">
      <p
        style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}
        className="text-center text-gray-400 uppercase mb-7"
      >
        Trusted by 100,000+ leading organizations worldwide
      </p>

      {/* Fade edges */}
      <div
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {/* Use inline animation — immune to hydration / Tailwind purge */}
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
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "0.55")
              }
            >
              <span style={{ fontSize: 22 }}>{logo.emoji}</span>
              <span
                style={{
                  color: "#4b5563",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe injected via a real <style> tag — always present in DOM */}
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
          <div
            style={{
              width: 36,
              height: 36,
              background: "#0069ff",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,105,255,0.35)",
            }}
          >
            <Calendar size={18} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>Schedulr</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#374151",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#0069ff")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#374151")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
          <Link
            href="/dashboard"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#374151",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 8,
              transition: "color 0.2s",
            }}
          >
            Log in
          </Link>
          <Link
            href="/onboarding"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "white",
              background: "#0069ff",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: 999,
              boxShadow: "0 4px 14px rgba(0,105,255,0.4)",
              transition: "all 0.2s",
            }}
          >
            Get started free
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ padding: 8, background: "none", border: "none", cursor: "pointer" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid #e5e7eb",
            padding: "1rem 2rem",
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                fontSize: 16,
                fontWeight: 600,
                color: "#374151",
                padding: "12px 0",
                textDecoration: "none",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/onboarding"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 16,
              fontSize: 16,
              fontWeight: 700,
              color: "white",
              background: "#0069ff",
              padding: "13px",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            Get started free
          </Link>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   BOOKING PREVIEW
   ═══════════════════════════════════════════════════════ */
function BookingPreview() {
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedTime, setSelectedTime] = useState("11:00am");
  const times = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"];

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
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              background: "#0069ff",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={16} color="white" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>ACME Inc.</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Share your booking page</span>
      </div>

      <div style={{ display: "flex" }}>
        {/* Left */}
        <div
          style={{
            width: 175,
            flexShrink: 0,
            padding: "20px",
            borderRight: "1px solid #f3f4f6",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#60a5fa,#a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 16,
              fontWeight: 800,
              marginBottom: 12,
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            V
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px", fontWeight: 500 }}>Vishal Rawat</p>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px", lineHeight: 1.3 }}>
            Client Check-in
          </p>
          {[
            { Icon: Clock,  text: "30 min" },
            { Icon: Video,  text: "Zoom" },
            { Icon: Globe,  text: "Web conferencing" },
          ].map(({ Icon, text }) => (
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

        {/* Center — calendar */}
        <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>
            Select a Date & Time
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>April 2026</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["‹", "›"].map((c) => (
                <button
                  key={c}
                  style={{
                    width: 26,
                    height: 26,
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Day headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 2,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
              <div key={d} style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
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
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "none",
                    cursor: avail ? "pointer" : "default",
                    fontSize: 12,
                    fontWeight: sel ? 800 : avail ? 700 : 400,
                    background: sel ? "#0069ff" : "transparent",
                    color: sel ? "white" : avail ? "#0069ff" : "#d1d5db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    transition: "all 0.15s",
                    boxShadow: sel ? "0 4px 12px rgba(0,105,255,0.4)" : "none",
                  }}
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

        {/* Right — time slots */}
        <div style={{ width: 160, flexShrink: 0, padding: "20px" }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.4 }}>
            Monday,<br />Apr {selectedDay}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {times.map((t) => (
              <div key={t} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  onClick={() => setSelectedTime(t)}
                  style={{
                    flex: 1,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 4px",
                    borderRadius: 10,
                    border: `1.5px solid ${selectedTime === t ? "#1a1a2e" : "#0069ff"}`,
                    background: selectedTime === t ? "#1a1a2e" : "transparent",
                    color: selectedTime === t ? "white" : "#0069ff",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
                {selectedTime === t && (
                  <Link
                    href="/onboarding"
                    style={{
                      background: "#0069ff",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "8px 10px",
                      borderRadius: 10,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
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
            {/* Badge */}
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
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      background: "#dcfce7",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={12} color="#16a34a" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — booking card */}
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
              <BookingPreview />
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
    <section style={{ padding: "120px 2rem", background: "white", textAlign: "center" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#0069ff",
            marginBottom: 16,
          }}
        >
          Why Schedulr
        </p>
        <h2
          style={{
            fontSize: "clamp(36px, 4.5vw, 64px)",
            fontWeight: 900,
            color: "#1a1a2e",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "0 0 24px",
          }}
        >
          More than a<br />scheduling link
        </h2>
        <p
          style={{
            fontSize: "clamp(17px, 1.4vw, 21px)",
            color: "#6b7280",
            lineHeight: 1.7,
            maxWidth: 640,
            margin: "0 auto 48px",
          }}
        >
          Schedulr&apos;s functionality goes way beyond just a scheduling link, with customizable,
          automated features to help you and your team achieve goals faster.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
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
              padding: "14px 32px",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(0,105,255,0.35)",
            }}
          >
            Sign up for free <ArrowRight size={17} />
          </Link>
          <a
            href="#features"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "white",
              color: "#374151",
              fontSize: 16,
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 999,
              textDecoration: "none",
              border: "2px solid #e5e7eb",
            }}
          >
            Explore features
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: CalendarDays, title: "Event Types",         desc: "Create custom event types with different durations, locations, and questions for every need.",              iconColor: "#0069ff", bg: "#eff6ff" },
  { icon: Clock,        title: "Smart Availability",  desc: "Set weekly hours, date-specific overrides, and buffer times. Only get booked when you're actually free.", iconColor: "#7c3aed", bg: "#f5f3ff" },
  { icon: LinkIcon,     title: "Shareable Links",     desc: "Each event type gets a unique booking link. Share via email, embed on your site, or send directly.",       iconColor: "#059669", bg: "#ecfdf5" },
  { icon: Shield,       title: "No Double Bookings",  desc: "Real-time conflict detection ensures no two meetings ever overlap. Your calendar stays clean.",            iconColor: "#ea580c", bg: "#fff7ed" },
  { icon: Video,        title: "Meeting Locations",   desc: "Google Meet, Zoom, Microsoft Teams, phone calls, or in-person — meet your way.",                         iconColor: "#e11d48", bg: "#fff1f2" },
  { icon: Globe,        title: "Timezone Smart",      desc: "Automatically detect and convert timezones so everyone sees the right time, everywhere.",                 iconColor: "#0891b2", bg: "#ecfeff" },
  { icon: Bell,         title: "Reminders",           desc: "Automatic email reminders and follow-ups reduce no-shows and keep everyone on track.",                   iconColor: "#d97706", bg: "#fffbeb" },
  { icon: BarChart2,    title: "Analytics",           desc: "Track booking trends, peak availability, and meeting patterns with built-in reporting.",                  iconColor: "#4f46e5", bg: "#eef2ff" },
  { icon: RefreshCw,    title: "Reschedule & Cancel", desc: "Allow invitees to reschedule or cancel at their convenience with automatic calendar updates.",           iconColor: "#0891b2", bg: "#ecfeff" },
];

function Features() {
  return (
    <section
      id="features"
      style={{ padding: "100px 2rem", background: "#f8f9ff", position: "relative", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>
            Features
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 3.5vw, 52px)",
              fontWeight: 900,
              color: "#1a1a2e",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
            }}
          >
            Everything you need to<br />schedule smarter
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Powerful features that simplify booking, eliminate back-and-forth, and let you focus on what matters.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "28px",
                border: "1px solid #e5e7eb",
                transition: "all 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <f.icon size={22} color={f.iconColor} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════ */
const HOW_STEPS = [
  { id: "availability", title: "Add your availability",       desc: "Set your weekly schedule, working hours, buffer times, and block out dates you're unavailable.", icon: Clock,        color: "#dbeafe", iconColor: "#1d4ed8" },
  { id: "conferencing", title: "Connect conferencing tools",  desc: "Link Zoom, Google Meet, or Microsoft Teams so every booking automatically gets a meeting link.",  icon: Video,        color: "#fce7f3", iconColor: "#be185d" },
  { id: "events",       title: "Customize your event types",  desc: "Create 15-min, 30-min, or 1-hour events with custom branding, questions, and routing forms.",    icon: CalendarDays, color: "#fef3c7", iconColor: "#b45309" },
  { id: "share",        title: "Share your scheduling link",  desc: "Send one link to anyone. They pick a time, you get notified instantly — zero back-and-forth.",   icon: LinkIcon,     color: "#dcfce7", iconColor: "#15803d" },
];

const STEP_PANELS: Record<string, React.ReactNode> = {
  availability: (
    <div style={{ background: "white", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #f3f4f6", padding: 28, width: "100%", maxWidth: 340 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 28, height: 28, background: "#0069ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Clock size={14} color="white" />
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Weekly Hours</span>
      </div>
      {["Monday","Tuesday","Wednesday","Thursday","Friday"].map((day, i) => (
        <div key={day} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 4 ? "1px solid #f3f4f6" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: i < 4 ? "#4ade80" : "#d1d5db" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{day}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: i < 4 ? "#eff6ff" : "#f3f4f6", color: i < 4 ? "#0069ff" : "#9ca3af" }}>
            {i < 4 ? "9:00 AM – 5:00 PM" : "Unavailable"}
          </span>
        </div>
      ))}
    </div>
  ),
  conferencing: (
    <div style={{ background: "white", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #f3f4f6", padding: 28, width: "100%", maxWidth: 340 }}>
      <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Connect existing calendar</p>
      {[{ name: "Google", sub: "Google calendars", color: "#4285F4", l: "G" },{ name: "Microsoft", sub: "Outlook calendars", color: "#0078D4", l: "M" },{ name: "Microsoft", sub: "Exchange calendars", color: "#0078D4", l: "M" }].map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #f3f4f6", borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: t.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 800 }}>{t.l}</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{t.name}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{t.sub}</p>
            </div>
          </div>
          <ChevronRight size={16} color="#d1d5db" />
        </div>
      ))}
    </div>
  ),
  events: (
    <div style={{ background: "white", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #f3f4f6", padding: 28, width: "100%", maxWidth: 340 }}>
      <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Your event types</p>
      {[{ name: "Quick Chat", dur: "15 min", color: "#0069ff", n: "24 meetings" },{ name: "Discovery Call", dur: "30 min", color: "#7c3aed", n: "12 meetings" },{ name: "Strategy Session", dur: "60 min", color: "#059669", n: "8 meetings" }].map((ev) => (
        <div key={ev.name} style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #f3f4f6", borderRadius: 14, padding: "12px 16px", marginBottom: 10, cursor: "pointer" }}>
          <div style={{ width: 4, height: 36, borderRadius: 99, background: ev.color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{ev.name}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{ev.dur} · {ev.n}</p>
          </div>
          <ChevronRight size={16} color="#d1d5db" />
        </div>
      ))}
    </div>
  ),
  share: (
    <div style={{ background: "white", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #f3f4f6", padding: 28, width: "100%", maxWidth: 340 }}>
      <p style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Share your link</p>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#0069ff", fontWeight: 700 }}>schedulr.com/yourname</span>
        <button style={{ fontSize: 12, fontWeight: 800, color: "white", background: "#0069ff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Copy</button>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", marginBottom: 12 }}>Share via</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {["📧 Email", "🌐 Website", "💬 Slack"].map((ch) => (
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
  ),
};

function HowItWorks() {
  const [activeStep, setActiveStep] = useState("availability");

  return (
    <section id="how-it-works" style={{ padding: "100px 2rem", background: "white", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>
            How It Works
          </p>
          <h2 style={{ fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 900, color: "#1a1a2e", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
            Connect your calendars
          </h2>
          <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Set up once, then let Schedulr handle the rest — automatically.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="how-grid">
          {/* Steps */}
          <div>
            {HOW_STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    opacity: isActive ? 1 : 0.4,
                    transition: "opacity 0.2s",
                  }}
                >
                  <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: 20, marginBottom: 20 }}>
                    {isActive && (
                      <div style={{ height: 3, background: "linear-gradient(90deg,#0069ff,#a855f7)", borderRadius: 99, marginBottom: 20 }} />
                    )}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 14, background: isActive ? step.color : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                        <step.icon size={20} color={isActive ? step.iconColor : "#9ca3af"} />
                      </div>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 800, color: isActive ? "#1a1a2e" : "#6b7280", margin: "0 0 6px", transition: "color 0.2s" }}>
                          {step.title}
                        </p>
                        {isActive && (
                          <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
              {STEP_PANELS[activeStep]}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .how-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   INTEGRATIONS
   ═══════════════════════════════════════════════════════ */
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

function Integrations() {
  return (
    <section id="integrations" style={{ padding: "100px 2rem", background: "#f8f9ff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>Integrations</p>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 900, color: "#1a1a2e", margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Connect Schedulr to the<br />tools you already use
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
            { logo: <svg style={{width:42,height:42}} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, title: "Google suite", desc: "Connect Schedulr to Google Calendar, Meet, Analytics, and more." },
            { logo: <svg style={{width:42,height:42}} viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#7fba00" d="M12 0h11v11H12z"/><path fill="#00a4ef" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>, title: "Microsoft suite", desc: "Connect Schedulr to Microsoft Teams, Outlook, Azure SSO, and more." },
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

/* ═══════════════════════════════════════════════════════
   CUSTOMER RESULTS
   ═══════════════════════════════════════════════════════ */
const RESULTS = [
  { company: "HackerOne",           stat: "169%", label: "return on investment",          blobColor: "#1a1a2e", statColor: "#1a1a2e", borderActive: "#1a1a2e" },
  { company: "Vonage",              stat: "160%", label: "increase in customers reached",  blobColor: "#0069ff", statColor: "#0069ff", borderActive: "#0069ff" },
  { company: "University of Texas", stat: "20%",  label: "decrease in scheduling errors",  blobColor: "#f59e0b", statColor: "#d97706", borderActive: "#f59e0b" },
  { company: "MuckRack",            stat: "8x",   label: "faster meeting scheduling",      blobColor: "#9333ea", statColor: "#7c3aed", borderActive: "#9333ea" },
];

function CustomerResults() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section style={{ padding: "100px 2rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0069ff", marginBottom: 12 }}>Results</p>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 48px)", fontWeight: 900, color: "#1a1a2e", margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Discover how businesses<br />grow with Schedulr
            </h2>
          </div>
          <Link href="/onboarding" style={{ fontSize: 15, fontWeight: 700, color: "#6b7280", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            View all stories <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="results-grid">
          {RESULTS.map((r, idx) => {
            const isActive = activeCard === idx;
            return (
              <div
                key={r.company}
                onClick={() => setActiveCard(isActive ? null : idx)}
                style={{
                  position: "relative",
                  border: `2px solid ${isActive ? r.borderActive : "#e5e7eb"}`,
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  minHeight: 270,
                  transition: "all 0.3s",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  boxShadow: isActive ? "0 24px 60px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {/* Text */}
                <div style={{ position: "relative", zIndex: 10, padding: 28, display: "flex", flexDirection: "column", minHeight: 270 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: isActive ? "white" : "#374151", margin: "0 0 16px", transition: "color 0.3s" }}>
                    {r.company}
                  </p>
                  <p style={{ fontSize: 60, fontWeight: 900, color: isActive ? "white" : r.statColor, margin: "0 0 8px", lineHeight: 1, letterSpacing: "-0.03em", transition: "color 0.3s" }}>
                    {r.stat}
                  </p>
                  <p style={{ fontSize: 15, color: isActive ? "rgba(255,255,255,0.85)" : "#6b7280", flex: 1, margin: "0 0 24px", lineHeight: 1.5, transition: "color 0.3s" }}>
                    {r.label}
                  </p>
                  <Link
                    href="/onboarding"
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: isActive ? "white" : "#374151", textDecoration: "none", transition: "color 0.3s" }}
                  >
                    Read now <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Flooding blob */}
                <div
                  style={{
                    position: "absolute",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    background: r.blobColor,
                    bottom: isActive ? "-10%" : "-32px",
                    right: isActive ? "-10%" : "-32px",
                    width: isActive ? "230%" : "120px",
                    height: isActive ? "230%" : "120px",
                    opacity: isActive ? 1 : 0.13,
                    transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                    zIndex: 0,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@media(max-width:900px){.results-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:600px){.results-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════════════════ */
function Pricing() {
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

        {/* Toggle */}
        <div style={{ display: "inline-flex", background: "white", border: "1px solid #e5e7eb", borderRadius: 999, padding: 4, marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {[{ label: "Yearly", val: true, badge: "Save 16%" }, { label: "Monthly", val: false }].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setYearly(opt.val)}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 700,
                background: yearly === opt.val ? "#0069ff" : "transparent",
                color: yearly === opt.val ? "white" : "#6b7280",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {opt.label}
              {opt.badge && yearly === opt.val && (
                <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 999 }}>
                  {opt.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="pricing-grid">
          {plans.map((p) => (
            <div
              key={p.name}
              style={{
                background: "white",
                borderRadius: 20,
                border: p.badge ? "2px solid #0069ff" : "1px solid #e5e7eb",
                padding: 28,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s",
                boxShadow: p.badge ? "0 8px 32px rgba(0,105,255,0.12)" : "none",
              }}
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
              <Link
                href="/onboarding"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  padding: "13px",
                  borderRadius: 12,
                  margin: "20px 0 24px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  background: p.style === "blue" ? "#0069ff" : p.style === "dark" ? "#1a1a2e" : "transparent",
                  color: p.style === "outline" ? "#374151" : "white",
                  border: p.style === "outline" ? "2px solid #e5e7eb" : "none",
                  boxShadow: p.style === "blue" ? "0 4px 16px rgba(0,105,255,0.35)" : "none",
                }}
              >
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

/* ═══════════════════════════════════════════════════════
   SECURITY
   ═══════════════════════════════════════════════════════ */
function Security() {
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
          <Link
            href="/onboarding"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0069ff", color: "white", fontSize: 16, fontWeight: 700, padding: "14px 32px", borderRadius: 999, textDecoration: "none", boxShadow: "0 6px 20px rgba(0,105,255,0.35)" }}
          >
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
      {/* Three.js-style static gradient blobs */}
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 500, height: 400, background: "linear-gradient(135deg,#f472b6,#a855f7,#818cf8)", borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%", opacity: 0.18, animation: "ctaBlob 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: 400, height: 400, background: "linear-gradient(135deg,#0069ff,#06b6d4)", borderRadius: "50%", opacity: 0.12, animation: "ctaBlob 22s ease-in-out infinite reverse", pointerEvents: "none" }} />

      <style>{`
        @keyframes ctaBlob {
          0%,100% { border-radius:60% 40% 70% 30%/50% 60% 40% 50%; transform:rotate(0deg) scale(1); }
          50%      { border-radius:40% 60% 30% 70%/60% 40% 60% 40%; transform:rotate(15deg) scale(1.08); }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 20px", marginBottom: 32 }}>
          <Star size={14} color="#fbbf24" fill="#fbbf24" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Rated 4.9/5 by 20M+ users</span>
        </div>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px" }}>
          Get started in seconds<br />— for free.
        </h2>
        <p style={{ fontSize: "clamp(17px, 1.5vw, 21px)", color: "rgba(147,197,253,1)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
          Join millions of professionals who use Schedulr to simplify their scheduling. No credit card required.
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

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
function Footer() {
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
              <span style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e" }}>Schedulr</span>
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
          <p style={{ fontSize: 14, color: "#9ca3af" }}>© {new Date().getFullYear()} Schedulr, Inc. All rights reserved.</p>
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

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <Navbar />
      <Hero />
      <ValueProps />
      <Features />
      <HowItWorks />
      <Integrations />
      <CustomerResults />
      <Pricing />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}