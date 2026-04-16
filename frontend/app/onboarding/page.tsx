"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, AlertCircle } from "lucide-react";
import Step1Usage from "./steps/Step1Usage";
import Step2Role from "./steps/Step2Role";
import Step3Calendar from "./steps/Step3Calendar";
import Step4Availability from "./steps/Step4Availability";
import Step5Location from "./steps/Step5Location";

export type OnboardingData = {
  usageType: "solo" | "team" | "";
  helpGoals: string[];
  role: string;
  calendarConnected: boolean;
  availability: Array<{
    dayOfWeek: number;
    isActive: boolean;
    startTime: string;
    endTime: string;
  }>;
  timezone: string;
  location: string;
};

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [shaking, setShaking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<OnboardingData>({
    usageType: "",
    helpGoals: [],
    role: "",
    calendarConnected: false,
    availability: [
      { dayOfWeek: 0, isActive: false, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 1, isActive: true,  startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, isActive: true,  startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, isActive: true,  startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, isActive: true,  startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, isActive: true,  startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 6, isActive: false, startTime: "09:00", endTime: "17:00" },
    ],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: "Google Meet",
  });

  /** Validation per step */
  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!data.usageType) errs.usageType = "Please select how you plan to use Calendly.";
      if (data.helpGoals.length === 0) errs.helpGoals = "Please select at least one option.";
    }
    if (step === 2) {
      if (!data.role) errs.role = "Please select your role to continue.";
    }
    // Step 3 — calendar connection is optional (skip allowed)
    if (step === 4) {
      if (!data.availability.some((d) => d.isActive))
        errs.availability = "Please enable at least one day of availability.";
    }
    if (step === 5) {
      if (!data.location) errs.location = "Please choose a meeting location.";
    }
    return errs;
  };

  const next = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Shake the button
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setErrors({});
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else router.push("/dashboard");
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const update = (patch: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...patch }));
    // Clear relevant errors on change
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* Top bar */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#006bff] rounded-lg flex items-center justify-center shadow-sm">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Calendly</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-500 tracking-wide">
            STEP {step} OF {TOTAL_STEPS}
          </span>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#006bff] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="w-32" />
      </header>

      {/* Main content — split layout */}
      <div className="flex flex-1">
        {/* Left content area */}
        <div className="flex-1 flex flex-col justify-between px-16 py-12 max-w-3xl">
          {/* Step content */}
          <div className="flex-1">
            {step === 1 && (
              <Step1Usage data={data} update={update} errors={errors} />
            )}
            {step === 2 && (
              <Step2Role data={data} update={update} errors={errors} />
            )}
            {step === 3 && (
              <Step3Calendar data={data} update={update} />
            )}
            {step === 4 && (
              <Step4Availability data={data} update={update} errors={errors} />
            )}
            {step === 5 && (
              <Step5Location data={data} update={update} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button
                onClick={back}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={next}
                className={`bg-[#006bff] text-white px-10 py-3 rounded-full font-semibold text-sm hover:bg-[#0052cc] transition-all shadow-sm hover:shadow-md ${
                  shaking ? "animate-shake" : ""
                }`}
              >
                {step === TOTAL_STEPS ? "Continue" : "Next"}
              </button>
              {Object.keys(errors).length > 0 && (
                <span className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1">
                  <AlertCircle className="w-3 h-3" />
                  Please complete the required fields above
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right decorative panel */}
        <OnboardingRightPanel step={step} />
      </div>
    </div>
  );
}

// Right side decorative panel — matches Calendly's illustrated side
function OnboardingRightPanel({ step }: { step: number }) {
  return (
    <div className="hidden lg:flex w-[420px] bg-[#eef2ff] items-center justify-center relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-8 right-8 w-16 h-32 border-4 border-[#bfdb38] rounded-full opacity-80" />
      <div className="absolute bottom-20 left-8 w-40 h-40 bg-[#7b2ff7] rounded-full opacity-70" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1e3a5f] rounded-tl-full" />

      {/* Preview card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 w-72">
        <PreviewCard step={step} />
      </div>
    </div>
  );
}

function PreviewCard({ step }: { step: number }) {
  if (step === 1 || step === 2) {
    return (
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-3">
          Select a Date &amp; Time
        </p>
        <div className="flex items-center justify-between mb-3">
          <ChevronLeft className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-800">AUGUST</span>
          <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className="font-semibold">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 3;
            if (day <= 0 || day > 31) return <div key={i} />;
            const isSelected = day === 16;
            const isToday = day === 15;
            return (
              <div
                key={i}
                className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto text-xs
                  ${isSelected ? "bg-[#006bff] text-white font-bold" : ""}
                  ${isToday ? "border border-[#006bff] text-[#006bff]" : "text-gray-700"}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6 text-[#006bff]" />
        </div>
        <p className="text-sm font-bold text-gray-800 mb-1">Calendar sync</p>
        <p className="text-xs text-gray-500">No more double bookings</p>
        <div className="mt-4 space-y-2">
          {["Available","Available","Busy"].map((s, i) => (
            <div key={i} className={`h-8 rounded-lg text-xs flex items-center justify-center font-medium
              ${s === "Busy" ? "bg-[#006bff] text-white" : "bg-blue-100 text-[#006bff]"}`}>
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <p className="text-xs font-bold text-gray-800 mb-3">Wednesday, August 16</p>
        {["10:00am", "10:30am", "11:00am", "11:30am"].map((t, i) => (
          <div
            key={t}
            className={`flex items-center gap-2 mb-2 rounded-lg border px-3 py-2 text-sm
              ${i === 2
                ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                : "border-gray-200 text-gray-700"
              }`}
          >
            <span className="flex-1 font-medium">{t}</span>
            {i === 2 && (
              <span className="bg-[#006bff] text-white text-xs px-3 py-1 rounded-full font-semibold">
                Confirm
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-[#006bff] rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-white text-xl">📹</span>
      </div>
      <p className="text-sm font-bold text-gray-800 mb-1">Meeting booked!</p>
      <p className="text-xs text-gray-500 font-semibold">WHEN</p>
      <p className="text-xs text-gray-700">Wednesday, August 16</p>
    </div>
  );
}