"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { eventTypesApi, bookingsApi } from "@/lib/api";
import { isMeetingPast } from "@/lib/utils";
import { Link2, CalendarDays, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { EventType, Booking } from "@/lib/types";

// ─── Skeleton helpers ────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="card-hover p-6 flex items-center justify-between pointer-events-none">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-16" />
      </div>
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
  );
}

function BookingLinksSkeleton() {
  return (
    <div className="card">
      {/* header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* rows */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="px-6 py-4 flex items-center justify-between border-b border-gray-50 last:border-0"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-3 h-3 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [meetings, setMeetings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Event Types"
              value={eventTypes.length}
              icon={Link2}
              color="bg-blue-50 text-brand-blue"
              href="/event-types"
            />
            <StatCard
              label="Upcoming Meetings"
              value={upcoming}
              icon={CalendarDays}
              color="bg-green-50 text-green-600"
              href="/meetings"
            />
            <StatCard
              label="Past Meetings"
              value={past}
              icon={Clock}
              color="bg-purple-50 text-purple-600"
              href="/meetings"
            />
          </>
        )}
      </div>

      {/* ── Booking links ── */}
      {loading ? (
        <BookingLinksSkeleton />
      ) : (
        eventTypes.length > 0 && (
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
              <Link
                key={et.id}
                href={`/book/${et.slug}`}
                target="_blank"
                className="px-6 py-3.5 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: et.color }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {et.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {et.duration} min · {et.location}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-brand-blue hover:underline">
                  /book/{et.slug}
                </span>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}