"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { eventTypesApi, bookingsApi } from "@/lib/api";
import { isMeetingPast } from "@/lib/utils";
import { Link2, CalendarDays, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { EventType, Booking } from "@/lib/types";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card-hover p-6 flex items-center justify-between group"
    >
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [meetings,   setMeetings]   = useState<Booking[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([eventTypesApi.list(), bookingsApi.getMeetings()])
      .then(([et, m]) => {
        setEventTypes(et);
        setMeetings(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = meetings.filter(
    (m) => m.status === "CONFIRMED" && !isMeetingPast(m.startTime)
  ).length;

  const past = meetings.filter(
    (m) => isMeetingPast(m.startTime) && m.status === "CONFIRMED"
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <PageHeader
        title="Welcome back, Vishal 👋"
        subtitle="Here's what's happening with your schedule."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Event Types"
          value={loading ? "—" : eventTypes.length}
          icon={Link2}
          color="bg-blue-50 text-brand-blue"
          href="/event-types"
        />
        <StatCard
          label="Upcoming Meetings"
          value={loading ? "—" : upcoming}
          icon={CalendarDays}
          color="bg-green-50 text-green-600"
          href="/meetings"
        />
        <StatCard
          label="Past Meetings"
          value={loading ? "—" : past}
          icon={Clock}
          color="bg-purple-50 text-purple-600"
          href="/meetings"
        />
      </div>

      {/* Booking links */}
      {eventTypes.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Your Booking Links</h2>
            <Link
              href="/event-types"
              className="text-sm text-brand-blue hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {eventTypes.map((et) => (
            <div
              key={et.id}
              className="px-6 py-3.5 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: et.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{et.name}</p>
                  <p className="text-xs text-gray-500">
                    {et.duration} min · {et.location}
                  </p>
                </div>
              </div>
              <a
                href={`/book/${et.slug}`}
                target="_blank"
                className="text-sm text-brand-blue hover:underline"
              >
                /book/{et.slug}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}