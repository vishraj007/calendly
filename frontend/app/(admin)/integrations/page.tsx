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

// ✅ ONLY THESE ARE SUPPORTED
const SUPPORTED_INTEGRATIONS = ["google-calendar", "google-meet"];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(DEFAULT_INTEGRATIONS);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"discover" | "manage">("discover");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<IntegrationStatus | null>(null);

  // ✅ Fetch only supported integrations status
  useEffect(() => {
    integrationsApi
      .getStatus()
      .then((s) => {
        setStatus(s);

        setIntegrations((prev) =>
          prev.map((item) => {
            // ❌ skip unsupported
            if (!SUPPORTED_INTEGRATIONS.includes(item.id)) {
              return { ...item, connected: false };
            }

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

  // ✅ Connect / Disconnect
  const toggleConnect = async (id: string) => {
    const app = integrations.find((i) => i.id === id);

    // ❌ Block unsupported integrations
    if (!SUPPORTED_INTEGRATIONS.includes(id)) {
      toast(`${app?.name} integration is coming soon!`, { icon: "🔜" });
      return;
    }

    // ✅ Disconnect
    if (app?.connected) {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: false } : i))
      );
      toast.success(`${app.name} disconnected`);
      return;
    }

    // ✅ Connect
    const statusKey = INTEGRATION_STATUS_MAP[id];
    const loadingToast = toast.loading(`Connecting ${app?.name}...`);

    try {
      const freshStatus = await integrationsApi.getStatus();
      setStatus(freshStatus);

      if (freshStatus[statusKey]) {
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
          `Configure ${app?.name} credentials in backend .env`,
          { icon: "ℹ️", id: loadingToast }
        );
      }
    } catch {
      toast.error(`Backend not reachable`, { id: loadingToast });
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
          className={`pb-3 text-sm font-semibold border-b-2 ${
            tab === "discover"
              ? "border-[#006bff] text-[#006bff]"
              : "text-gray-500"
          }`}
        >
          Discover ({integrations.length})
        </button>

        <button
          onClick={() => setTab("manage")}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 ${
            tab === "manage"
              ? "border-[#006bff] text-[#006bff]"
              : "text-gray-500"
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

      {/* Banner */}
      {tab === "discover" && (
        <div className="bg-blue-50 border rounded-xl p-5 mb-6 flex gap-4">
          <Info className="w-6 h-6 text-[#006bff]" />
          <div>
            <p className="font-bold">Calendly works where you work</p>
            <p className="text-sm text-gray-600">
              Connect your tools for better scheduling.
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

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations"
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
              <option key={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((app) => {
          const isSupported = SUPPORTED_INTEGRATIONS.includes(app.id);

          return (
            <div
              key={app.id}
              className="bg-white border rounded-xl p-5 flex flex-col"
            >
              <div className="flex justify-between mb-3">
                <IntegrationIcon id={app.id} size={32} />

                {app.connected && (
                  <span className="text-green-600 text-xs">Connected</span>
                )}

                {!isSupported && (
                  <span className="text-gray-500 text-xs">Coming Soon</span>
                )}
              </div>

              <h3 className="font-semibold text-sm">{app.name}</h3>
              <p className="text-xs text-gray-500 flex-1">
                {app.description}
              </p>

              <button
                onClick={() => toggleConnect(app.id)}
                disabled={!isSupported}
                className={`mt-3 py-2 rounded-full text-xs font-semibold ${
                  !isSupported
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : app.connected
                    ? "bg-gray-100 hover:bg-red-50 text-gray-700"
                    : "bg-[#006bff] text-white hover:bg-[#0052cc]"
                }`}
              >
                {!isSupported
                  ? "Coming Soon"
                  : app.connected
                  ? "Disconnect"
                  : "Connect"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No integrations found
        </div>
      )}
    </div>
  );
}