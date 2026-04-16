"use client";

import { AlertCircle } from "lucide-react";
import type { OnboardingData } from "../page";
import { cn } from "@/lib/utils";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors?: Record<string, string>;
}

const HELP_OPTIONS = [
  { id: "attendees", emoji: "👥", label: "Meet with multiple attendees" },
  { id: "payment",   emoji: "💰", label: "Collect payment" },
  { id: "emails",    emoji: "🎯", label: "Automate pre/post meeting emails" },
  { id: "contacts",  emoji: "📋", label: "Manage contact records" },
  { id: "record",    emoji: "🎥", label: "Record and transcribe meetings" },
  { id: "schedule",  emoji: "📅", label: "Schedule meetings" },
];

export default function Step1Usage({ data, update, errors = {} }: Props) {
  const toggleGoal = (id: string) => {
    const current = data.helpGoals;
    const updated = current.includes(id)
      ? current.filter((g) => g !== id)
      : [...current, id];
    update({ helpGoals: updated });
  };

  return (
    <div className="animate-fade-in">
      <p className="text-[#006bff] font-semibold text-sm mb-2">
        Welcome to Schedulr!
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        How do you plan on using Schedulr?
      </h1>
      <p className="text-gray-500 mb-8">
        Your responses will help us tailor your experience to your needs.
      </p>

      {/* Usage type */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        {[
          { value: "solo", emoji: "☝️", label: "On my own" },
          { value: "team", emoji: "🤝", label: "With my team" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ usageType: opt.value as "solo" | "team" })}
            className={cn(
              "flex items-center gap-3 px-6 py-5 rounded-xl border-2 text-left transition-all duration-200",
              data.usageType === opt.value
                ? "border-[#006bff] bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300",
              errors.usageType && !data.usageType
                ? "border-red-300 bg-red-50/30"
                : ""
            )}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="font-semibold text-gray-800">{opt.label}</span>
          </button>
        ))}
      </div>
      {errors.usageType && (
        <p className="field-error">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.usageType}
        </p>
      )}

      {/* Help goals */}
      <h2 className="text-xl font-bold text-gray-900 mb-1 mt-8">
        How can Schedulr help you?
      </h2>
      <p className="text-gray-500 text-sm mb-5">Select all that apply:</p>

      <div className={cn(
        "bg-white border rounded-2xl p-5 transition-colors",
        errors.helpGoals && data.helpGoals.length === 0
          ? "border-red-300"
          : "border-gray-200"
      )}>
        <div className="grid grid-cols-2 gap-3">
          {HELP_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleGoal(opt.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200",
                data.helpGoals.includes(opt.id)
                  ? "border-[#006bff] bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      {errors.helpGoals && (
        <p className="field-error">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.helpGoals}
        </p>
      )}
    </div>
  );
}