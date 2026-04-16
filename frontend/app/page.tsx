"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#006bff] rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Schedulr</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </a>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/onboarding"
            className="text-sm font-semibold text-white bg-[#006bff] hover:bg-[#0052cc] px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 animate-fade-in">
          <a href="#features" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#pricing" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Pricing</a>
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link href="/onboarding" className="block text-center text-sm font-semibold text-white bg-[#006bff] py-2.5 rounded-full">Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────── Hero ─────────────── */
function Hero() {
  return (
    <section className="hero-gradient pt-32 pb-20 lg:pt-40 lg:pb-28 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100 rounded-full opacity-40 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#006bff] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-100">
              <Zap className="w-3.5 h-3.5" />
              FREE SCHEDULING FOR EVERYONE
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Easy scheduling{" "}
              <span className="text-[#006bff] relative">
                ahead
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8c40-6 80-6 120-2s60 4 76-2" stroke="#006bff" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                </svg>
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Schedulr is the modern scheduling platform that makes
              &quot;finding time&quot; a breeze. When connecting is easy, your
              teams can get more done.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-[#006bff] text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-[#0052cc] shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Free forever</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Setup in 2 min</span>
            </div>
          </div>

          {/* Right — Preview Card */}
          <div className="hidden lg:flex justify-center animate-slide-up delay-200">
            <HeroPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Live-looking preview card in hero */
function HeroPreviewCard() {
  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-20 scale-105" />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-[400px] animate-float">
        {/* Top bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#006bff] rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">Schedulr</span>
          </div>
          <span className="text-xs text-gray-400">Select a Date & Time</span>
        </div>

        {/* Calendar grid */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-800">April 2026</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">‹</div>
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">›</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2 font-semibold">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2;
              if (day <= 0 || day > 30) return <div key={i} />;
              const isSelected = day === 15;
              const isToday = day === 14;
              const isAvailable = [1,2,3,4,5].includes((i) % 7);
              return (
                <div
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto text-xs transition-all
                    ${isSelected ? "bg-[#006bff] text-white font-bold shadow-md shadow-blue-200" : ""}
                    ${isToday && !isSelected ? "border-2 border-[#006bff] text-[#006bff] font-bold" : ""}
                    ${!isSelected && !isToday && isAvailable ? "text-gray-800 hover:bg-blue-50 cursor-pointer" : ""}
                    ${!isSelected && !isToday && !isAvailable ? "text-gray-300" : ""}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Time slots preview */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-700 mb-3">Available Times — Tue, Apr 15</p>
            <div className="grid grid-cols-3 gap-2">
              {["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs font-semibold py-2 rounded-lg border transition-all ${
                    i === 2
                      ? "bg-[#006bff] text-white border-[#006bff] shadow-sm"
                      : "border-[#006bff] text-[#006bff] hover:bg-blue-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Features ─────────────── */
const FEATURES = [
  {
    icon: CalendarDays,
    title: "Event Types",
    description: "Create custom event types with different durations, locations, and custom questions for every need.",
    color: "bg-blue-50 text-[#006bff]",
  },
  {
    icon: Clock,
    title: "Smart Availability",
    description: "Set weekly hours, date-specific overrides, and buffer times. Only get booked when you're actually free.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: LinkIcon,
    title: "Shareable Links",
    description: "Each event type gets a unique booking link. Share it via email, embed on your site, or send directly.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Shield,
    title: "No Double Bookings",
    description: "Real-time conflict detection ensures no two meetings ever overlap. Your calendar stays clean.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Video,
    title: "Meeting Locations",
    description: "Google Meet, Zoom, Microsoft Teams, phone calls, or in-person — meet your way.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Globe,
    title: "Timezone Smart",
    description: "Automatically detect and convert timezones so everyone sees the right time, everywhere.",
    color: "bg-teal-50 text-teal-600",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#006bff] text-sm font-semibold tracking-wide uppercase">Features</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Everything you need to schedule smarter
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Powerful features that simplify booking, eliminate back-and-forth, and let you focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card-gradient border border-gray-200 rounded-2xl p-7 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
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
  {
    step: "01",
    title: "Create your event types",
    description: "Set up different meeting types with custom durations — from 15-minute quick chats to hour-long deep dives.",
    icon: CalendarDays,
    color: "#006bff",
  },
  {
    step: "02",
    title: "Set your availability",
    description: "Define your weekly hours, add buffer times, and override specific dates. You stay in control.",
    icon: Clock,
    color: "#7b2ff7",
  },
  {
    step: "03",
    title: "Share your link",
    description: "Send your unique booking link to anyone. They pick a time that works, you get notified instantly.",
    icon: LinkIcon,
    color: "#00a854",
  },
  {
    step: "04",
    title: "Meet & grow",
    description: "View upcoming meetings, reschedule when needed, and never miss a beat. It's that simple.",
    icon: Users,
    color: "#ff4f00",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#006bff] text-sm font-semibold tracking-wide uppercase">How It Works</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Get started in minutes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Four simple steps from signup to your first booked meeting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="text-center group">
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${s.color}12`, color: s.color }}
                >
                  <s.icon className="w-7 h-7" />
                </div>
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
                  style={{ backgroundColor: s.color }}
                >
                  {s.step.replace("0", "")}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Integrations ─────────────── */
const INTEGRATIONS = [
  { name: "Google Calendar", emoji: "📅" },
  { name: "Zoom", emoji: "📹" },
  { name: "Google Meet", emoji: "🎥" },
  { name: "Microsoft Teams", emoji: "💼" },
  { name: "Outlook", emoji: "📧" },
  { name: "Slack", emoji: "💬" },
];

function Integrations() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#006bff] text-sm font-semibold tracking-wide uppercase">Integrations</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Connect tools you already use
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Boost productivity with seamless integrations.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {INTEGRATIONS.map((i) => (
            <div
              key={i.name}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{i.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 text-center">{i.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Social Proof ─────────────── */
function SocialProof() {
  return (
    <section className="py-16 bg-[#006bff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "250K+", label: "Meetings Booked" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9/5", label: "User Rating", icon: <Star className="w-4 h-4 inline text-yellow-300" /> },
          ].map(({ value, label, icon }) => (
            <div key={label}>
              <p className="text-3xl lg:text-4xl font-extrabold mb-1">
                {value} {icon}
              </p>
              <p className="text-sm text-blue-200 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Pricing ─────────────── */
function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#006bff] text-sm font-semibold tracking-wide uppercase">Pricing</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Pick the perfect plan
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Start for free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
            <p className="text-sm font-semibold text-gray-500 mb-1">Free</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-1">$0</p>
            <p className="text-sm text-gray-500 mb-6">forever</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              {["1 event type", "Unlimited bookings", "Calendar integrations", "Customizable booking page", "Email notifications"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/onboarding"
              className="block text-center text-sm font-semibold text-[#006bff] border-2 border-[#006bff] px-6 py-3 rounded-full hover:bg-blue-50 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Standard — highlighted */}
          <div className="bg-white border-2 border-[#006bff] rounded-2xl p-8 shadow-lg shadow-blue-100 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#006bff] text-white text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <p className="text-sm font-semibold text-[#006bff] mb-1">Standard</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-1">$10</p>
            <p className="text-sm text-gray-500 mb-6">/month</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              {["Unlimited event types", "Everything in Free", "Custom questions", "Buffer time between meetings", "Multiple schedules", "Priority support"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006bff] shrink-0" /> {f}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/onboarding"
              className="block text-center text-sm font-semibold text-white bg-[#006bff] px-6 py-3 rounded-full hover:bg-[#0052cc] shadow-md transition-all"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Teams */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
            <p className="text-sm font-semibold text-gray-500 mb-1">Teams</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-1">$16</p>
            <p className="text-sm text-gray-500 mb-6">/user/month</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              {["Everything in Standard", "Team scheduling", "Round-robin meetings", "Admin management", "Analytics & reporting", "SSO integration"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                  </li>
                )
              )}
            </ul>
            <Link
              href="/onboarding"
              className="block text-center text-sm font-semibold text-[#006bff] border-2 border-[#006bff] px-6 py-3 rounded-full hover:bg-blue-50 transition-all"
            >
              Try for Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CTA ─────────────── */
function CTA() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
          Get started in seconds — for free
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of professionals who use Schedulr to simplify their scheduling.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-[#006bff] text-white text-base font-semibold px-8 py-3.5 rounded-full hover:bg-[#0052cc] shadow-lg shadow-blue-200 transition-all"
          >
            Start for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 text-base font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-all"
          >
            View Demo
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
    <footer className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#006bff] rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Schedulr</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The modern scheduling platform that makes &quot;finding time&quot; a breeze.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Integrations", href: "#" },
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
              <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Schedulr. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Integrations />
      <SocialProof />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}