"use client";

import { AlertCircle } from "lucide-react";
import type { OnboardingData } from "../page";
import { cn } from "@/lib/utils";

interface Props {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors?: Record<string, string>;
}

const ROLES = [
  { id: "finance",          emoji: "💰", label: "Finance" },
  { id: "sales",            emoji: "✏️", label: "Sales" },
  { id: "customer-success", emoji: "🎯", label: "Customer success" },
  { id: "recruiting",       emoji: "📋", label: "Recruiting" },
  { id: "marketing",        emoji: "🚀", label: "Marketing" },
  { id: "education",        emoji: "📚", label: "Education" },
  { id: "consulting",       emoji: "💼", label: "Consulting" },
  { id: "other",            emoji: "🎨", label: "Other" },
];

export default function Step2Role({ data, update, errors = {} }: Props) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        What is your role?
      </h1>
      <p className="text-gray-500 mb-8">
        Understanding your role will help us set up your first scheduling link.
      </p>

      <div className={cn(
        "bg-white border rounded-2xl p-5 transition-colors",
        errors.role && !data.role
          ? "border-red-300"
          : "border-gray-200"
      )}>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => update({ role: role.id })}
              className={cn(
                "flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all duration-200",
                data.role === role.id
                  ? "border-[#006bff] bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <span className="text-xl">{role.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{role.label}</span>
            </button>
          ))}
        </div>
      </div>
      {errors.role && (
        <p className="field-error mt-2">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.role}
        </p>
      )}
    </div>
  );
}