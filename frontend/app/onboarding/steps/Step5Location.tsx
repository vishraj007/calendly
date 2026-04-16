"use client";

import type { OnboardingData } from "../page";
import { cn } from "@/lib/utils";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}

const LOCATIONS = [
  {
    id: "Zoom",
    label: "Zoom",
    emoji: "📹",
    emojiStyle: "bg-blue-50",
  },
  {
    id: "Google Meet",
    label: "Google Meet",
    emoji: "📊",
    emojiStyle: "bg-green-50",
  },
  {
    id: "Microsoft Teams",
    label: "Microsoft Teams",
    emoji: "💼",
    emojiStyle: "bg-purple-50",
  },
  {
    id: "In Person",
    label: "In-person",
    emoji: "📍",
    emojiStyle: "bg-red-50",
  },
  {
    id: "Phone Call",
    label: "Phone call",
    emoji: "📞",
    emojiStyle: "bg-gray-50",
  },
];

export default function Step5Location({ data, update }: Props) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        How would you like to meet with people?
      </h1>
      <p className="text-gray-500 mb-8">
        Set a meeting location for your first scheduling link. You can always change this later.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="grid grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => update({ location: loc.id })}
              className={cn(
                "flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all duration-200",
                data.location === loc.id
                  ? "border-[#006bff] bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <span className={cn("text-xl w-8 h-8 flex items-center justify-center rounded-lg", loc.emojiStyle)}>
                {loc.emoji}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  data.location === loc.id ? "text-[#006bff]" : "text-gray-700"
                )}
              >
                {loc.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}