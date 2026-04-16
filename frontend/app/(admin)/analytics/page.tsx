"use client";

import { useState, useEffect } from "react";
import { analyticsApi } from "@/lib/api";
import type { AnalyticsDashboard } from "@/lib/types";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BarChart3, CalendarDays, Users, TrendingUp, TrendingDown,
  ArrowUpRight, Clock, Minus,
} from "lucide-react";
import { format } from "date-fns";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <PageHeader title="Analytics" />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006bff]" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <PageHeader title="Analytics" />
        <p className="text-gray-500 text-center py-20">Failed to load analytics data.</p>
      </div>
    );
  }

  const maxByET = Math.max(...data.byEventType.map((e) => e.count), 1);
  const maxByDay = Math.max(...data.dayDistribution, 1);

  return (
    <div className="p-8">
      <PageHeader title="Analytics" subtitle="Insights from your scheduling data" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Bookings"
          value={data.totalBookings}
          icon={CalendarDays}
          trend={data.weekGrowth}
          trendLabel="vs last week"
          color="blue"
        />
        <StatCard
          label="Upcoming Meetings"
          value={data.upcomingMeetings}
          icon={Clock}
          color="green"
        />
        <StatCard
          label="Active Event Types"
          value={data.activeEventTypes}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          label="Total Contacts"
          value={data.totalContacts}
          icon={Users}
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings by Event Type */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-5">Bookings by Event Type</h3>
          {data.byEventType.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No booking data yet</p>
          ) : (
            <div className="space-y-4">
              {data.byEventType.map((et) => (
                <div key={et.eventTypeId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{et.name}</span>
                    <span className="font-bold text-gray-900">{et.count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(et.count / maxByET) * 100}%`,
                        backgroundColor: et.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings by Day of Week */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-5">Bookings by Day of Week</h3>
          <div className="flex items-end gap-3 h-40">
            {data.dayDistribution.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-700">{count}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${Math.max((count / maxByDay) * 100, 4)}%`,
                    backgroundColor: count > 0 ? "#006bff" : "#e5e7eb",
                  }}
                />
                <span className="text-xs text-gray-500 mt-1">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* This Week Stats */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">This Week</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{data.thisWeekBookings}</p>
          <p className="text-xs text-gray-500">new bookings</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Week</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{data.lastWeekBookings}</p>
          <p className="text-xs text-gray-500">bookings</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cancellations</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{data.cancelledCount}</p>
          <p className="text-xs text-gray-500">total</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h3>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {data.recentActivity.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-2 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: b.eventType?.color || "#006bff" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {b.inviteeName}
                    <span className="text-gray-400 font-normal"> — {b.eventType?.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(b.startTime), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    b.status === "CONFIRMED"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {b.status.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  label, value, icon: Icon, trend, trendLabel, color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  color: string;
}) {
  const colors: Record<string, { bg: string; icon: string }> = {
    blue:   { bg: "bg-blue-50",   icon: "text-[#006bff]" },
    green:  { bg: "bg-green-50",  icon: "text-green-600" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600" },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              trend > 0
                ? "text-green-600"
                : trend < 0
                  ? "text-red-500"
                  : "text-gray-500"
            }`}
          >
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
