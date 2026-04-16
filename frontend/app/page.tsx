"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Check,
  Star,
  Video,
  Globe,
  Shield,
  Zap,
  LinkIcon,
  ChevronRight,
  CalendarDays,
  Menu,
  X,
  BarChart2,
  RefreshCw,
  Bell,
} from "lucide-react";

/* ─────────────── Navbar ─────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0069ff] rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1a1a2e]">Schedulr</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#0069ff] transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#0069ff] transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-[#0069ff] transition-colors">Pricing</a>
          <a href="#integrations" className="text-sm font-medium text-gray-600 hover:text-[#0069ff] transition-colors">Integrations</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/onboarding"
            className="text-sm font-semibold text-white bg-[#0069ff] hover:bg-[#0052cc] px-5 py-2.5 rounded-full transition-all"
          >
            Get started free
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#pricing" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Pricing</a>
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link href="/onboarding" className="block text-center text-sm font-semibold text-white bg-[#0069ff] py-2.5 rounded-md">Get started free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────── Hero ─────────────── */
function Hero() {
  return (
    <section className="pt-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1a1a2e] leading-[1.1] mb-6 tracking-tight">
            Easy<br />scheduling<br />ahead
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
            Join 20 million professionals who easily book meetings with the <strong>#1 scheduling tool</strong>.
          </p>
          <div className="flex flex-col gap-3 mb-6 max-w-xs">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-3 bg-[#0069ff] text-white text-base font-semibold px-6 py-3.5 rounded-full hover:bg-[#0052cc] transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign up with Google
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-3 bg-[#1a1a2e] text-white text-base font-semibold px-6 py-3.5 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#7fba00" d="M12 0h11v11H12z"/><path fill="#00a4ef" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>
              Sign up with Microsoft
            </Link>
          </div>
        </div>

        {/* Right: Booking preview + decorative blobs */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-56 h-56 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-15 blur-2xl pointer-events-none" />
          <div className="absolute top-10 -right-8 w-40 h-40 bg-gradient-to-br from-fuchsia-500 to-pink-300 rounded-full opacity-25 blur-xl pointer-events-none" />
          <div className="relative z-10">
            <BookingPreview />
          </div>
        </div>
      </div>

      {/* ── MARQUEE LOGO STRIP ── */}
      <TrustedByMarquee />
    </section>
  );
}

/* ─────────────── Marquee (Screenshot 1) ─────────────── */
const LOGOS = [
  { name: "Dropbox",           emoji: "📦" },
  { name: "Gong",              emoji: "🔔" },
  { name: "Carnival",          emoji: "🚢" },
  { name: "Indiana University",emoji: "🎓" },
  { name: "DoorDash",          emoji: "🚗" },
  { name: "Lyft",              emoji: "🚕" },
  { name: "Compass",           emoji: "🧭" },
  { name: "Zendesk",           emoji: "💬" },
  { name: "Notion",            emoji: "📝" },
  { name: "Figma",             emoji: "🎨" },
];

function TrustedByMarquee() {
  // duplicate for seamless loop
  const items = [...LOGOS, ...LOGOS];

  return (
    <div className="border-t border-b border-gray-100 bg-gray-50 py-8 overflow-hidden">
      <p className="text-center text-sm font-semibold text-gray-500 mb-6">
        Trusted by more than <strong>100,000</strong> of the world's leading organizations
      </p>

      {/* Outer mask: fade edges */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="flex gap-14 animate-marquee w-max">
          {items.map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-2 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="text-xl">{logo.emoji}</span>
              <span className="text-gray-700 font-bold text-sm tracking-wide uppercase whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function BookingPreview() {
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedTime, setSelectedTime] = useState("11:00am");

  const times = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"];

  return (
    <div className="w-full max-w-[680px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-[#0069ff] px-6 py-3 text-center">
        <p className="text-white text-xs font-semibold tracking-wide">Share your booking page</p>
      </div>

      <div className="flex">
        {/* Left: Event details */}
        <div className="w-[150px] shrink-0 p-4 border-r border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#0069ff] rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">ACME Inc.</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 mb-2 flex items-center justify-center text-white text-xs font-bold">V</div>
          <p className="text-[11px] text-gray-500 mb-0.5">Vishal Rawat</p>
          <p className="text-sm font-bold text-gray-900 mb-3">Client Check-in</p>
          <div className="flex items-center gap-1 mb-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-gray-600">30 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-gray-600">Zoom</span>
          </div>
        </div>

        {/* Center: Calendar */}
        <div className="flex-1 p-4 border-r border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-2">Select a Date & Time</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">April 2026</span>
            <div className="flex gap-1">
              <button className="w-5 h-5 bg-gray-100 rounded text-gray-400 text-xs flex items-center justify-center">‹</button>
              <button className="w-5 h-5 bg-gray-100 rounded text-gray-400 text-xs flex items-center justify-center">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-gray-400 mb-1.5 font-semibold">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => <div key={i}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center text-xs mb-3">
            {[...Array(3)].map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isAvail = [14,15,16,17,18,21,22,23,24,25,28,29,30].includes(day);
              const isSelected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => isAvail && setSelectedDay(day)}
                  className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto transition-all text-[11px]
                    ${isSelected ? "bg-[#0069ff] text-white font-bold" : ""}
                    ${!isSelected && isAvail ? "text-[#0069ff] font-semibold hover:bg-blue-50 cursor-pointer" : ""}
                    ${!isSelected && !isAvail ? "text-gray-300" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-2">
            <p className="text-[11px] text-gray-600 flex items-center gap-1">
              <span className="font-semibold">Time zone</span>
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Globe className="w-3 h-3 text-gray-400" />
              <span className="text-[11px] text-gray-500">India Standard Time ▾</span>
            </div>
          </div>
        </div>

        {/* Right: Time slots */}
        <div className="w-[140px] shrink-0 p-4">
          <p className="text-xs font-bold text-gray-700 mb-3">
            Monday, Apr {selectedDay}
          </p>
          <div className="flex flex-col gap-1.5">
            {times.map((t) => (
              <div key={t} className="flex gap-1 items-center">
                <button
                  onClick={() => setSelectedTime(t)}
                  className={`flex-1 text-[11px] font-semibold py-1.5 rounded border transition-all ${
                    selectedTime === t
                      ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                      : "border-[#0069ff] text-[#0069ff] hover:bg-blue-50"
                  }`}
                >
                  {t}
                </button>
                {selectedTime === t && (
                  <Link
                    href="/onboarding"
                    className="bg-[#0069ff] text-white text-[10px] font-bold px-2 py-1.5 rounded hover:bg-[#0052cc] transition-all"
                  >
                    Confirm
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

/* ─────────────── Value Props ─────────────── */
function ValueProps() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-[56px] font-extrabold text-[#1a1a2e] mb-6 leading-[1.1] tracking-tight">
          More than a<br />scheduling link
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Schedulr&apos;s functionality goes way beyond just a scheduling link, with customizable, automated features to help you and your team achieve goals faster.
        </p>
        <Link href="/onboarding" className="inline-flex items-center justify-center gap-2 bg-[#0069ff] text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#0052cc] transition-all">
          Sign up for free
        </Link>
      </div>
    </section>
  );
}

/* ─────────────── Features ─────────────── */
const FEATURES = [
  { icon: CalendarDays, title: "Event Types", description: "Create custom event types with different durations, locations, and custom questions for every need.", color: "text-[#0069ff] bg-blue-50" },
  { icon: Clock, title: "Smart Availability", description: "Set weekly hours, date-specific overrides, and buffer times. Only get booked when you're actually free.", color: "text-purple-600 bg-purple-50" },
  { icon: LinkIcon, title: "Shareable Links", description: "Each event type gets a unique booking link. Share it via email, embed on your site, or send directly.", color: "text-green-600 bg-green-50" },
  { icon: Shield, title: "No Double Bookings", description: "Real-time conflict detection ensures no two meetings ever overlap. Your calendar stays clean.", color: "text-orange-600 bg-orange-50" },
  { icon: Video, title: "Meeting Locations", description: "Google Meet, Zoom, Microsoft Teams, phone calls, or in-person — meet your way.", color: "text-rose-600 bg-rose-50" },
  { icon: Globe, title: "Timezone Smart", description: "Automatically detect and convert timezones so everyone sees the right time, everywhere.", color: "text-teal-600 bg-teal-50" },
  { icon: Bell, title: "Reminders & Follow-ups", description: "Automatic email reminders and follow-ups reduce no-shows and keep everyone on track.", color: "text-amber-600 bg-amber-50" },
  { icon: BarChart2, title: "Analytics", description: "Track booking trends, peak availability, and meeting patterns with built-in reporting.", color: "text-indigo-600 bg-indigo-50" },
  { icon: RefreshCw, title: "Reschedule & Cancel", description: "Allow invitees to reschedule or cancel at their convenience with automatic calendar updates.", color: "text-cyan-600 bg-cyan-50" },
];

function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0069ff] text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            Everything you need to schedule smarter
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Powerful features that simplify booking, eliminate back-and-forth, and let you focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1a1a2e] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It Works ─────────────── */
const STEPS = [
  { step: "01", title: "Create your event types", description: "Set up different meeting types with custom durations — from 15-minute quick chats to hour-long deep dives.", icon: CalendarDays },
  { step: "02", title: "Set your availability", description: "Define your weekly hours, add buffer times, and override specific dates. You stay in control.", icon: Clock },
  { step: "03", title: "Share your link", description: "Send your unique booking link to anyone. They pick a time that works, you get notified instantly.", icon: LinkIcon },
  { step: "04", title: "Meet & grow", description: "View upcoming meetings, reschedule when needed, and never miss a beat. It's that simple.", icon: Users },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0069ff] text-sm font-semibold tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            Get started in minutes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Four simple steps from signup to your first booked meeting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s, idx) => (
            <div key={s.step} className="relative">
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-0.5 bg-gray-200" />
              )}
              <div className="text-center group">
                <div className="relative mx-auto w-16 h-16 mb-5">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0069ff] transition-colors">
                    <s.icon className="w-7 h-7 text-[#0069ff] group-hover:text-white transition-colors" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#0069ff] rounded-full text-white text-xs font-bold flex items-center justify-center shadow">
                    {parseInt(s.step)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1a1a2e] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Integrations ─────────────── */
const INTEGRATION_ICONS = [
  { name: "Zoom", bg: "#2D8CFF" },
  { name: "Salesforce", bg: "#00A1E0" },
  { name: "Google Cal", bg: "#4285F4" },
  { name: "Slack", bg: "#4A154B" },
  { name: "Teams", bg: "#6264A7" },
  { name: "Gmail", bg: "#EA4335" },
  { name: "Outlook", bg: "#0078D4" },
  { name: "Chrome", bg: "#4285F4" },
  { name: "Webex", bg: "#00bceb" },
  { name: "HubSpot", bg: "#FF7A59" },
  { name: "Zapier", bg: "#FF4F00" },
  { name: "LinkedIn", bg: "#0A66C2" },
  { name: "Stripe", bg: "#635BFF" },
  { name: "Notion", bg: "#000" },
  { name: "Intercom", bg: "#1F8DED" },
  { name: "PayPal", bg: "#003087" },
  { name: "Calendly", bg: "#006BFF" },
  { name: "Figma", bg: "#F24E1E" },
];

function Integrations() {
  return (
    <section id="integrations" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-4 lg:mb-0">
            Connect Schedulr to the<br />tools you already use
          </h2>
          <div>
            <p className="text-gray-600 text-base mb-2">Boost productivity with 100+ integrations</p>
            <Link href="/onboarding" className="inline-flex items-center gap-2 text-[#1a1a2e] font-bold text-sm hover:text-[#0069ff] transition-colors">
              View all integrations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Icon grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-9 gap-4 mb-10">
          {INTEGRATION_ICONS.map((item) => (
            <div key={item.name} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-center hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer aspect-square">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform" style={{ backgroundColor: item.bg }}>
                {item.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Suite cards */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0069ff] transition-colors -rotate-45" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Google suite</h3>
            <p className="text-sm text-gray-600">Get your job done faster by connecting Schedulr to Google Calendar, Meet, Analytics, and more.</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <svg className="w-10 h-10" viewBox="0 0 23 23"><path fill="#f25022" d="M0 0h11v11H0z"/><path fill="#7fba00" d="M12 0h11v11H12z"/><path fill="#00a4ef" d="M0 12h11v11H0z"/><path fill="#ffb900" d="M12 12h11v11H12z"/></svg>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0069ff] transition-colors -rotate-45" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Microsoft suite</h3>
            <p className="text-sm text-gray-600">Make your day easier with Schedulr integrations for Microsoft Teams, Outlook, Azure SSO, and more.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Social Proof / Stats ─────────────── */
function SocialProof() {
  return (
    <section className="py-16 bg-[#0069ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: "20M+", label: "Active Users" },
            { value: "100K+", label: "Organizations" },
            { value: "500M+", label: "Meetings Booked" },
            { value: "4.9/5", label: "User Rating", icon: <Star className="w-4 h-4 inline text-yellow-300" /> },
          ].map(({ value, label, icon }) => (
            <div key={label}>
              <p className="text-3xl lg:text-4xl font-extrabold mb-1">{value} {icon}</p>
              <p className="text-sm text-blue-200 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Customer Results (Screenshot 2 style) ─────────────── */
type ResultCard = {
  company: string;
  stat: string;
  label: string;
  /** Tailwind bg class for the blob fill */
  blobBg: string;
  /** Tailwind text class for the stat number */
  statColor: string;
  /** When card is "active" (clicked/selected), the blob covers the card */
  activeBg: string;
  activeText: string;
};

const RESULTS: ResultCard[] = [
  {
    company: "HackerOne",
    stat: "169%",
    label: "return on investment",
    blobBg: "bg-[#1a1a2e]",
    statColor: "text-[#1a1a2e]",
    activeBg: "bg-[#1a1a2e]",
    activeText: "text-white",
  },
  {
    company: "Vonage",
    stat: "160%",
    label: "increase in customers reached",
    blobBg: "bg-[#0069ff]",
    statColor: "text-[#0069ff]",
    activeBg: "bg-[#0069ff]",
    activeText: "text-white",
  },
  {
    company: "University of Texas",
    stat: "20%",
    label: "decrease in scheduling errors",
    blobBg: "bg-amber-500",
    statColor: "text-amber-500",
    activeBg: "bg-amber-500",
    activeText: "text-white",
  },
  {
    company: "MuckRack",
    stat: "8x",
    label: "faster meeting scheduling",
    blobBg: "bg-purple-600",
    statColor: "text-purple-600",
    activeBg: "bg-purple-600",
    activeText: "text-white",
  },
];

function CustomerResults() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#0069ff] text-sm font-semibold tracking-widest uppercase mb-3">Results</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e]">
              Discover how businesses<br />grow with Schedulr
            </h2>
          </div>
          <Link href="/onboarding" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0069ff] transition-colors">
            View all stories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {RESULTS.map((r, idx) => {
            const isActive = activeCard === idx;
            return (
              <div
                key={r.company}
                onClick={() => setActiveCard(isActive ? null : idx)}
                className={`relative border rounded-2xl p-6 overflow-hidden cursor-pointer transition-all duration-300 select-none
                  ${isActive
                    ? `${r.activeBg} border-transparent shadow-xl scale-[1.02]`
                    : "bg-white border-gray-200 hover:shadow-lg hover:scale-[1.01]"
                  }`}
              >
                {/* Company name */}
                <p className={`text-sm font-bold mb-4 transition-colors duration-300 ${isActive ? "text-white/80" : "text-gray-800"}`}>
                  {r.company}
                </p>

                {/* Big stat */}
                <p className={`text-5xl font-extrabold mb-2 transition-colors duration-300 ${isActive ? "text-white" : r.statColor}`}>
                  {r.stat}
                </p>

                {/* Label */}
                <p className={`text-sm mb-5 transition-colors duration-300 ${isActive ? "text-white/80" : "text-gray-600"}`}>
                  {r.label}
                </p>

                {/* Read now link */}
                <Link
                  href="/onboarding"
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors duration-300
                    ${isActive ? "text-white hover:text-white/70" : "text-gray-700 hover:text-[#0069ff]"}`}
                >
                  Read now <ArrowRight className="w-3 h-3" />
                </Link>

                {/* Decorative blob — small when inactive, expands when active */}
                <div
                  className={`absolute transition-all duration-500 rounded-full pointer-events-none
                    ${r.blobBg}
                    ${isActive
                      ? "w-[300px] h-[300px] -bottom-20 -right-20 opacity-30"
                      : "w-24 h-24 -bottom-6 -right-6 opacity-20"
                    }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Pricing ─────────────── */
function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-[#0069ff] text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-6">
            Pick the perfect plan<br />for your team
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={yearly} onChange={() => setYearly(true)} className="accent-[#0069ff]" />
              <span className="text-sm font-semibold text-gray-700">Billed yearly</span>
              {yearly && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save 16%</span>}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={!yearly} onChange={() => setYearly(false)} className="accent-[#0069ff]" />
              <span className="text-sm font-semibold text-gray-700">Billed monthly</span>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl">
          <PricingCard
            name="Free"
            desc="For personal use"
            price="Always free"
            priceNote=""
            cta="Get started"
            ctaStyle="dark"
            features={["1 event type", "Unlimited bookings", "Calendar integrations", "Booking page"]}
          />
          <PricingCard
            name="Standard"
            desc="For professionals"
            price={yearly ? "$10" : "$12"}
            priceNote="/seat/mo"
            saveBadge={yearly ? "Save 16%" : undefined}
            cta="Get started"
            ctaStyle="blue"
            features={["Unlimited event types", "Everything in Free", "Custom questions", "Buffer times", "Multiple schedules"]}
          />
          <PricingCard
            name="Teams"
            desc="For growing businesses"
            price={yearly ? "$16" : "$20"}
            priceNote="/seat/mo"
            saveBadge={yearly ? "Save 20%" : undefined}
            cta="Try for Free"
            ctaStyle="blue"
            badge="Recommended plan"
            features={["Everything in Standard", "Team scheduling", "Round-robin meetings", "Admin management", "Analytics"]}
          />
          <PricingCard
            name="Enterprise"
            desc="For large companies"
            price="Starts at $15k"
            priceNote="/yr"
            cta="Talk to sales"
            ctaStyle="blue"
            features={["Everything in Teams", "SSO integration", "Advanced security", "Custom contracts", "Dedicated support"]}
          />
        </div>

        <Link href="/pricing" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0069ff] transition-colors">
          Learn more on our pricing page <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function PricingCard({ name, desc, price, priceNote, cta, ctaStyle, features, badge, saveBadge }: {
  name: string; desc: string; price: string; priceNote?: string; cta: string;
  ctaStyle: "dark" | "blue"; features: string[]; badge?: string; saveBadge?: string;
}) {
  return (
    <div className={`bg-white border rounded-2xl p-7 relative flex flex-col hover:shadow-lg transition-all ${badge ? "border-[#0069ff] shadow-md" : "border-gray-200"}`}>
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0069ff] text-white text-xs font-bold px-4 py-1 rounded-full">
          {badge}
        </div>
      )}
      <p className="text-base font-bold text-[#1a1a2e] mb-1">{name}</p>
      <p className="text-xs text-gray-500 mb-4">{desc}</p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-extrabold text-[#1a1a2e]">{price}</span>
        {priceNote && <span className="text-xs text-gray-400">{priceNote}</span>}
        {saveBadge && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-1">{saveBadge}</span>}
      </div>
      <Link
        href="/onboarding"
        className={`block text-center text-sm font-bold py-3 rounded-lg mt-4 mb-6 transition-all ${
          ctaStyle === "dark"
            ? "bg-[#1a1a2e] text-white hover:bg-gray-800"
            : "bg-[#0069ff] text-white hover:bg-[#0052cc]"
        }`}
      >
        {cta}
      </Link>
      <ul className="space-y-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-[#0069ff] shrink-0 mt-0.5" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────── Security ─────────────── */
function Security() {
  return (
    <section className="py-20 lg:py-28 bg-[#f8f9ff]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-[#0069ff]" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-4">
          Built to keep your<br />organization secure
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Keep your scheduling data secure with enterprise-grade admin management, security integrations, data governance, compliance audits, and privacy protections.
        </p>
        <Link href="/onboarding" className="inline-flex items-center gap-2 text-[#0069ff] font-semibold text-sm hover:underline">
          Learn more <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

/* ─────────────── CTA ─────────────── */
function CTA() {
  return (
    <section className="py-20 lg:py-24 bg-[#1a1a2e]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
          Get started in seconds — for free.
        </h2>
        <p className="text-lg text-blue-200 mb-8 max-w-xl mx-auto">
          Join millions of professionals who use Schedulr to simplify their scheduling.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-[#0069ff] text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-blue-500 transition-all"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
          >
            Get a demo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0069ff] rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#1a1a2e]">Schedulr</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The modern scheduling platform that makes finding time a breeze for teams of all sizes.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Integrations", href: "#integrations" },
                { label: "Security", href: "#" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Help Center", href: "#" },
                { label: "Blog", href: "#" },
                { label: "API Docs", href: "#" },
                { label: "Community", href: "#" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Privacy Policy", href: "#" },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-[#1a1a2e] mb-4 uppercase tracking-widest">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-gray-500 hover:text-[#0069ff] transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Schedulr. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-[#0069ff] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#0069ff] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#0069ff] transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */
export default function HomePage() {
  return (
    <main className="font-sans">
      <Navbar />
      <Hero />
      <ValueProps />
      <Features />
      <HowItWorks />
      <Integrations />
      <SocialProof />
      <CustomerResults />
      <Pricing />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}