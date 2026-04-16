"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Check, ArrowRight, Zap, Star } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    subtitle: "For personal use",
    price: "$0",
    period: "forever",
    current: true,
    cta: "Current Plan",
    ctaStyle: "bg-gray-100 text-gray-600 cursor-default",
    features: [
      "1 event type",
      "Unlimited bookings",
      "Calendar integrations",
      "Customizable booking page",
      "Email notifications",
      "Basic availability settings",
    ],
  },
  {
    name: "Standard",
    subtitle: "For professionals & small teams",
    price: "$10",
    period: "/month",
    current: false,
    popular: true,
    cta: "Upgrade to Standard",
    ctaStyle: "bg-[#006bff] text-white hover:bg-[#0052cc]",
    features: [
      "Unlimited event types",
      "Everything in Free",
      "Custom questions & forms",
      "Buffer time between meetings",
      "Multiple schedules",
      "Workflows & automations",
      "Priority support",
      "Branding removal",
    ],
  },
  {
    name: "Teams",
    subtitle: "For growing businesses",
    price: "$16",
    period: "/user/month",
    current: false,
    cta: "Upgrade to Teams",
    ctaStyle: "bg-[#006bff] text-white hover:bg-[#0052cc]",
    features: [
      "Everything in Standard",
      "Team scheduling pages",
      "Round-robin meetings",
      "Collective events",
      "Admin management & roles",
      "Advanced analytics",
      "SSO integration",
      "API access",
      "Dedicated support",
    ],
  },
];

export default function UpgradePage() {
  return (
    <div className="p-8">
      <PageHeader title="Upgrade plan" subtitle="Choose the plan that fits your needs" />

      {/* Current plan badge */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <Zap className="w-5 h-5 text-[#006bff]" />
        </div>
        <div>
          <p className="font-bold text-gray-900">You&apos;re on the Free plan</p>
          <p className="text-sm text-gray-600">
            Upgrade to unlock more event types, workflows, and team features.
          </p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl p-7 flex flex-col relative ${
              plan.popular
                ? "border-2 border-[#006bff] shadow-lg shadow-blue-100"
                : "border border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006bff] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" /> MOST POPULAR
              </div>
            )}

            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-500">{plan.subtitle}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      plan.popular ? "text-[#006bff]" : "text-green-500"
                    }`}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${plan.ctaStyle}`}
              onClick={() => {
                if (!plan.current) {
                  alert(`Upgrade to ${plan.name} — payment integration coming soon!`);
                }
              }}
            >
              {plan.cta}
              {!plan.current && <ArrowRight className="w-4 h-4 inline ml-1" />}
            </button>
          </div>
        ))}
      </div>

      {/* Enterprise */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between max-w-5xl">
        <div>
          <p className="font-bold text-gray-900">Enterprise</p>
          <p className="text-sm text-gray-600">
            Custom solutions for large organizations. Starting at $15k/year.
          </p>
        </div>
        <Link
          href="#"
          className="text-sm font-semibold text-[#006bff] hover:underline flex items-center gap-1"
        >
          Contact sales <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
