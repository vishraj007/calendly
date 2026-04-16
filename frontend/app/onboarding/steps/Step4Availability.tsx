"use client";

import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import type { OnboardingData } from "../page";
import { TIMEZONES } from "@/lib/utils";
import { Globe, Plus, X, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors?: Record<string, string>;
}

// Day letter badges — dark navy circles exactly like Calendly
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_COLORS = [
  "bg-gray-400", // Sun — inactive gray
  "bg-[#1e3a5f]", // Mon
  "bg-[#1e3a5f]", // Tue
  "bg-[#1e3a5f]", // Wed
  "bg-[#1e3a5f]", // Thu
  "bg-[#1e3a5f]", // Fri
  "bg-gray-400", // Sat — inactive gray
];

// Generate time options
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const label = format(new Date(2024, 0, 1, h, m), "h:mma");
  return { value, label };
});

export default function Step4Availability({ data, update, errors = {} }: Props) {
  const updateDay = (
    dayOfWeek: number,
    field: "isActive" | "startTime" | "endTime",
    value: boolean | string
  ) => {
    const updated = data.availability.map((d) =>
      d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d
    );
    update({ availability: updated });
  };

  const hasActiveDay = data.availability.some((d) => d.isActive);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        When are you available to meet with people?
      </h1>
      <p className="text-gray-500 mb-8">
        You&apos;ll only be booked during these times (you can change this later)
      </p>

      <div className={cn(
        "bg-white border rounded-2xl p-6 transition-colors",
        errors.availability && !hasActiveDay
          ? "border-red-300"
          : "border-gray-200"
      )}>
        {/* Weekly hours header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-gray-600">⟳</span>
          <span className="font-bold text-gray-900">Weekly hours</span>
        </div>
        <p className="text-[#006bff] text-sm mb-6">
          Set when you are typically available for meetings
        </p>

        {/* Day rows */}
        <div className="space-y-3">
          {data.availability.map((day) => (
            <div key={day.dayOfWeek} className="flex items-center gap-4">
              {/* Day circle badge */}
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 cursor-pointer transition-colors",
                  day.isActive
                    ? DAY_COLORS[day.dayOfWeek]
                    : "bg-gray-300"
                )}
                onClick={() => updateDay(day.dayOfWeek, "isActive", !day.isActive)}
              >
                {DAY_LETTERS[day.dayOfWeek]}
              </div>

              {day.isActive ? (
                <>
                  {/* Time range */}
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={day.startTime}
                      onChange={(e) =>
                        updateDay(day.dayOfWeek, "startTime", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#006bff]"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <span className="text-gray-400 text-sm">—</span>
                    <select
                      value={day.endTime}
                      onChange={(e) =>
                        updateDay(day.dayOfWeek, "endTime", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#006bff]"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Action icons — X, +, copy */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDay(day.dayOfWeek, "isActive", false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-400 flex-1">Unavailable</span>
                  <button
                    onClick={() => updateDay(day.dayOfWeek, "isActive", true)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Timezone */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">Time zone</p>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <select
              value={data.timezone}
              onChange={(e) => update({ timezone: e.target.value })}
              className="text-sm text-[#006bff] font-medium bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <span className="text-gray-400">▾</span>
          </div>
        </div>
      </div>
      {errors.availability && (
        <p className="field-error mt-2">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.availability}
        </p>
      )}
    </div>
  );
}