"use client";

import { useState } from "react";
import type { OnboardingData } from "../page";
import { cn } from "@/lib/utils";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}

export default function Step3Calendar({ data, update }: Props) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    // Simulate connection (no real OAuth needed for assignment)
    await new Promise((r) => setTimeout(r, 1000));
    update({ calendarConnected: true });
    setConnecting(false);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Set up how your calendar will be used
      </h1>
      <p className="text-gray-500 mb-8">
        Let Schedulr check your calendar for conflicts to avoid double bookings.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            {/* Google Calendar icon */}
            <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <p className="font-semibold text-gray-900">Google Calendar</p>
              <p className="text-sm text-gray-500">vishalrawat2612@gmail.com</p>
            </div>
          </div>

          {data.calendarConnected ? (
            <span className="text-green-600 font-semibold text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Connected
            </span>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="text-[#006bff] font-semibold text-sm hover:underline disabled:opacity-50"
            >
              {connecting ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        You can skip this step and connect your calendar later from settings.
      </p>
    </div>
  );
}