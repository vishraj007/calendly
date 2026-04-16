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

  return (
    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 animate-slide-in">
      {slots.map((slot) => {
        const isSelected = selected?.startTimeUTC === slot.startTimeUTC;
        return (
          <button
            key={slot.startTimeUTC}
            onClick={() => onSelect(slot)}
            className={cn(
              "w-full py-3 px-4 rounded-lg text-sm font-semibold border-2 transition-all duration-200",
              isSelected
                ? "bg-brand-blue text-white border-brand-blue shadow-md"
                : "bg-white text-brand-blue border-brand-blue hover:bg-brand-blue-light"
            )}
          >
            {slot.startTime}
          </button>
        );
      })}
    </div>
  );
}