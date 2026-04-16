"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  Link2,
  CalendarDays,
  Users,
  Zap,
  Grid3X3,
  ChevronLeft,
  Plus,
  BarChart3,
  Settings,
  HelpCircle,
  ArrowUpCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPE_CATEGORIES } from "@/lib/constants";

/* ────── Nav items ────── */
const MAIN_NAV = [
  { href: "/event-types", label: "Scheduling",       icon: Link2 },
  { href: "/meetings",    label: "Meetings",          icon: CalendarDays },
  { href: "/availability",label: "Availability",      icon: Clock },
  { href: "/contacts",    label: "Contacts",          icon: Users },
  { href: "/workflows",   label: "Workflows",         icon: Zap },
  { href: "/integrations",label: "Integrations & apps",icon: Grid3X3 },
];

const BOTTOM_NAV = [
  { href: "/upgrade",  label: "Upgrade plan",  icon: ArrowUpCircle },
  { href: "/analytics",label: "Analytics",      icon: BarChart3 },
  { href: "/admin",    label: "Admin center",   icon: Settings },
];

/* ════════════════════════════════════════════════
   Calendly-style Create dropdown — DRY, uses
   shared EVENT_TYPE_CATEGORIES from constants.ts
   ════════════════════════════════════════════════ */

export function CreateDropdown({
  open,
  onClose,
  className,
}: {
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 animate-scale-in w-[340px]",
        className
      )}
    >
      {EVENT_TYPE_CATEGORIES.map((section, sIdx) => (
        <div key={section.section}>
          {sIdx > 0 && <div className="border-t border-gray-100 my-1" />}
          <p className="px-5 pt-3 pb-1 text-xs font-bold text-gray-800 tracking-wide">
            {section.section}
          </p>
          {section.items.map((item) => (
            <Link
              key={item.title}
              href="/event-types?create=true"
              onClick={onClose}
              className="block px-5 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <p className="text-sm font-bold text-[#006bff]">
                {item.title}
              </p>
              {item.sub && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {item.sub}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════ */

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 flex flex-col transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Header — Logo + Collapse */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-[#006bff] rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-gray-900 truncate">
              Schedulr
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* + Create Button — Calendly blue style */}
      <div className="px-3 py-3 relative" ref={dropdownRef}>
        <button
          onClick={() => setCreateOpen(!createOpen)}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-sm font-semibold transition-all",
            createOpen
              ? "bg-[#006bff] text-white shadow-md"
              : "bg-[#006bff] text-white hover:bg-[#0052cc] shadow-sm",
            collapsed ? "px-2" : "px-4"
          )}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && "Create"}
          {!collapsed && (
            createOpen
              ? <ChevronUp className="w-3.5 h-3.5 ml-auto" />
              : <ChevronDown className="w-3.5 h-3.5 ml-auto" />
          )}
        </button>

        {/* Dropdown — reuse shared component */}
        {!collapsed && (
          <CreateDropdown
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            className="absolute left-3 top-full mt-1"
          />
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {MAIN_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-blue-50 text-[#006bff] border-l-[3px] border-[#006bff] ml-0 pl-[9px]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-3 py-2 space-y-0.5">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-blue-50 text-[#006bff]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && label}
          </Link>
        ))}

        {/* Help */}
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left"
          )}
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!collapsed && "Help"}
        </button>
      </div>
    </aside>
  );
}