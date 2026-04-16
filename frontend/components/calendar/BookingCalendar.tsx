"use client";

import { useState, useMemo } from "react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay,
  isBefore, startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  availableDays: number[];
}

export function BookingCalendar({
  selectedDate,
  onSelect,
  availableDays,
}: BookingCalendarProps) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const today = startOfDay(new Date());

  const days = useMemo(() => {
    // Start week on Monday (weekStartsOn: 1)
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end   = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const grid: Date[] = [];
    let cur = start;
    while (cur <= end) { grid.push(cur); cur = addDays(cur, 1); }
    return grid;
  }, [month]);

  const isSelectable = (d: Date) =>
    isSameMonth(d, month) &&
    !isBefore(d, today) &&
    availableDays.includes(d.getDay());

  return (
    <div className="w-full select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setMonth(subMonths(month, 1))}
            disabled={isBefore(startOfMonth(subMonths(month, 1)), startOfMonth(today))}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setMonth(addMonths(month, 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Weekday labels — Monday first */}
      <div className="grid grid-cols-7 mb-2">
        {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, i) => {
          const selectable = isSelectable(day);
          const selected   = selectedDate && isSameDay(day, selectedDate);
          const isToday    = isSameDay(day, today);
          const inMonth    = isSameMonth(day, month);

          return (
            <button
              key={i}
              onClick={() => selectable && onSelect(day)}
              disabled={!selectable}
              className={cn(
                "relative aspect-square flex items-center justify-center rounded-full",
                "text-sm font-medium transition-all duration-150 mx-auto w-10 h-10",
                !inMonth && "opacity-0 pointer-events-none",
                selectable && !selected &&
                  "text-[#006bff] font-semibold hover:bg-brand-blue hover:text-white cursor-pointer",
                !selectable && inMonth && "text-gray-300 cursor-not-allowed",
                selected && "bg-brand-blue text-white shadow-md",
                isToday && !selected && "font-extrabold"
              )}
            >
              {format(day, "d")}
              {isToday && (
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                    selected ? "bg-white" : "bg-brand-blue"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}