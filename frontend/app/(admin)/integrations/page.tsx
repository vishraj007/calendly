"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Search, Check, Info, Loader2 } from "lucide-react";
import { IntegrationIcon } from "@/components/integrations/IntegrationLogos";
import { integrationsApi } from "@/lib/api";
import {
  DEFAULT_INTEGRATIONS,
  INTEGRATION_CATEGORIES,
  INTEGRATION_STATUS_MAP,
  type IntegrationStatus,
  type IntegrationConfig,
} from "@/lib/constants";
import toast from "react-hot-toast";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(DEFAULT_INTEGRATIONS);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"discover" | "manage">("discover");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<IntegrationStatus | null>(null);

  // Fetch real connection status from API
  useEffect(() => {
    integrationsApi
      .getStatus()
      .then((s) => {
        setStatus(s);
        // Update integrations with actual connected status
        setIntegrations((prev) =>
          prev.map((item) => {
            const statusKey = INTEGRATION_STATUS_MAP[item.id];
            if (statusKey && s[statusKey]) {
              return { ...item, connected: true };
            }
            return { ...item, connected: false };
          })
        );
      })
      .catch(() => {
        console.log("[Integrations] Could not fetch status");
      })
      .finally(() => setStatusLoading(false));
  }, []);

  const toggleConnect = async (id: string) => {
    const app = integrations.find((i) => i.id === id);
    if (app?.connected) {
      // Can disconnect
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: false } : i))
      );
      toast.success(`${app.name} disconnected`);
    } else {
      // Re-check status from API before showing error
      const statusKey = INTEGRATION_STATUS_MAP[id];
      if (statusKey) {
        const loadingToast = toast.loading(`Connecting ${app?.name}...`);
        try {
          const freshStatus = await integrationsApi.getStatus();
          setStatus(freshStatus);
          if (freshStatus[statusKey]) {
            // API confirms it's connected — update all integrations
            setIntegrations((prev) =>
              prev.map((item) => {
                const key = INTEGRATION_STATUS_MAP[item.id];
                if (key && freshStatus[key]) {
                  return { ...item, connected: true };
                }
                return item;
              })
            );
            toast.success(`${app?.name} connected successfully!`, {
              id: loadingToast,
            });
          } else {
            toast(
              `Configure ${app?.name} credentials in your backend .env file to connect.`,
              { icon: "ℹ️", id: loadingToast }
            );
          }
        } catch {
          toast.error(`Could not reach the server. Is the backend running?`, {
            id: loadingToast,
          });
        }
      } else {
        toast(`${app?.name} integration is coming soon!`, { icon: "🔜" });
      }
    }
  };

  const connected = integrations.filter((i) => i.connected);
  const filtered = integrations.filter((i) => {
    const matchSearch =
      !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || i.category === categoryFilter;
    if (tab === "manage") return i.connected && matchSearch;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-8">
      <PageHeader title="Integrations & apps" />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("discover")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "discover"
              ? "border-[#006bff] text-[#006bff]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Discover ({integrations.length})
        </button>
        <button
          onClick={() => setTab("manage")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            tab === "manage"
              ? "border-[#006bff] text-[#006bff]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Manage ({connected.length})
          {connected.length > 0 && (
            <span className="w-5 h-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
              <Check className="w-3 h-3" />
            </span>
          )}
        </button>
      </div>

      {/* Getting Started Banner (discover tab) */}
      {tab === "discover" && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6 flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Info className="w-6 h-6 text-[#006bff]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              Getting Started
            </p>
            <p className="font-bold text-gray-900 mb-1">
              Calendly works where you work
            </p>
            <p className="text-sm text-gray-600">
              Connect Calendly to your favorite calendars, tools, and apps to
              enhance your scheduling automations.
            </p>
            {statusLoading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-[#006bff]">
                <Loader2 className="w-3 h-3 animate-spin" />
                Checking integration status...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Find integrations, apps and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        {tab === "discover" && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select max-w-[200px]"
          >
            {INTEGRATION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                <IntegrationIcon id={app.id} size={32} />
              </div>
              {app.connected && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              )}
              {app.badge && !app.connected && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {app.badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {app.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">
              {app.description}
            </p>
            <button
              onClick={() => toggleConnect(app.id)}
              className={`w-full py-2 rounded-full text-xs font-semibold transition-all ${
                app.connected
                  ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                  : "bg-[#006bff] text-white hover:bg-[#0052cc]"
              }`}
            >
              {app.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="font-semibold">No integrations found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
