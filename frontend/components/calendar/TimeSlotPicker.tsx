"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/lib/types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
  loading: boolean;
}

export function TimeSlotPicker({
  slots,
  selected,
  onSelect,
  loading,
}: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
        <p className="text-sm text-gray-500">Loading times...</p>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">No available times</p>
      </div>
    );
  }

  // Check if ALL slots are unavailable (all past or all booked)
  const allUnavailable = slots.every((s) => s.available === false);

  return (
    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 animate-slide-in">
      {allUnavailable && (
        <p className="text-xs text-gray-400 text-center pb-1">
          All times are booked or past
        </p>
      )}
      {slots.map((slot) => {
        const isSelected = selected?.startTimeUTC === slot.startTimeUTC;
        const isUnavailable = slot.available === false;

        return (
          <button
            key={slot.startTimeUTC}
            onClick={() => !isUnavailable && onSelect(slot)}
            disabled={isUnavailable}
            className={cn(
              "w-full py-3 px-4 rounded-lg text-sm font-semibold border-2 transition-all duration-200",
              isUnavailable
                ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                : isSelected
                ? "bg-brand-blue text-white border-brand-blue shadow-md"
                : "bg-white text-brand-blue border-brand-blue hover:bg-brand-blue-light"
            )}
          >
            {slot.startTime}
            {isUnavailable && (
              <span className="ml-1.5 text-[10px] font-medium no-underline inline-block text-gray-400">
                Booked
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}