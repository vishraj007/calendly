"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, Link2, Search, ExternalLink, Copy, X,
  Clock, ChevronDown, ChevronUp, Eye, MoreVertical, Trash2, Edit3,
} from "lucide-react";
import { PageHeader }     from "@/components/layout/PageHeader";
import { Button }         from "@/components/ui/Button";
import { EmptyState }     from "@/components/ui/EmptyState";
import { CreateDropdown } from "@/components/layout/Sidebar";
import { IntegrationIcon } from "@/components/integrations/IntegrationLogos";
import { LOCATION_TO_INTEGRATION } from "@/lib/constants";
import { eventTypesApi }  from "@/lib/api";
import { LOCATION_OPTIONS, generateSlug } from "@/lib/utils";
import type { EventType } from "@/lib/types";
import toast from "react-hot-toast";

type Tab = "event-types" | "single-use" | "polls";
type PanelMode = "create" | "edit" | "preview" | null;

export default function EventTypesPage() {
  return (
    <Suspense fallback={<div className="p-8"><div className="animate-spin mx-auto rounded-full h-8 w-8 border-b-2 border-[#006bff]" /></div>}>
      <EventTypesPageInner />
    </Suspense>
  );
}

function EventTypesPageInner() {
  const searchParams = useSearchParams();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<Tab>("event-types");
  const [searchQuery, setSearchQuery] = useState("");

  // Slide-out panel state
  const [panelMode,  setPanelMode]  = useState<PanelMode>(null);
  const [panelEvent, setPanelEvent] = useState<EventType | null>(null);
  // Context menu
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  // Create dropdown (right side)
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const createDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (createDropdownRef.current && !createDropdownRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setEventTypes(await eventTypesApi.list());
    } catch {
      toast.error("Failed to load event types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-open create panel if ?create=true
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      openCreate();
    }
  }, [searchParams]);

  const openCreate = () => {
    setPanelEvent(null);
    setPanelMode("create");
  };

  const openEdit = (et: EventType) => {
    setPanelEvent(et);
    setPanelMode("edit");
    setMenuOpenId(null);
  };

  const openPreview = (et: EventType) => {
    setPanelEvent(et);
    setPanelMode("preview");
    setMenuOpenId(null);
  };

  const closePanel = () => {
    setPanelMode(null);
    setPanelEvent(null);
  };

  const handleCreate = async (data: {
    name: string; duration: number; location: string; color: string;
  }) => {
    setSubmitting(true);
    try {
      const slug = generateSlug(data.name);
      const created = await eventTypesApi.create({ ...data, slug });
      toast.success("Event type created!");
      await load();
      // After creating → open preview mode
      setPanelEvent(created);
      setPanelMode("preview");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error creating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: {
    name: string; duration: number; location: string; color: string;
  }) => {
    if (!panelEvent) return;
    setSubmitting(true);
    try {
      await eventTypesApi.update(panelEvent.id, data);
      toast.success("Event type updated!");
      await load();
      closePanel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error saving");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event type?")) return;
    setMenuOpenId(null);
    try {
      await eventTypesApi.delete(id);
      toast.success("Deleted");
      if (panelEvent?.id === id) closePanel();
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await eventTypesApi.toggle(id);
      load();
    } catch {
      toast.error("Failed to toggle");
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const filtered = eventTypes.filter(
    (et) =>
      !searchQuery ||
      et.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      et.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const panelOpen = panelMode !== null;

  return (
    <div className="p-8">
      <PageHeader
        title="Scheduling"
        action={
          <div className="relative" ref={createDropdownRef}>
            <Button onClick={() => setCreateDropdownOpen(!createDropdownOpen)}>
              <Plus className="w-4 h-4" /> Create
              {createDropdownOpen
                ? <ChevronUp className="w-3.5 h-3.5 ml-1" />
                : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
            </Button>
            <CreateDropdown
              open={createDropdownOpen}
              onClose={() => setCreateDropdownOpen(false)}
              className="absolute right-0 top-full mt-2"
            />
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {([
          { key: "event-types", label: "Event types" },
          { key: "single-use", label: "Single-use links" },
          { key: "polls", label: "Meeting polls" },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === key
                ? "border-[#006bff] text-[#006bff]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "event-types" && (
        <>
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search event types"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* User label + view landing page */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                V
              </div>
              <span className="text-sm font-semibold text-gray-900">Vishal Rawat</span>
            </div>
            {eventTypes[0] && (
              <a
                href={`/book/${eventTypes[0].slug}`}
                target="_blank"
                className="text-sm text-[#006bff] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View landing page
              </a>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse space-y-3">
                  <div className="h-1.5 bg-gray-200 rounded" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Link2}
              title="No event types yet"
              description="Create your first event type to start accepting bookings."
              action={{ label: "+ New Event Type", onClick: openCreate }}
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((et) => (
                <div
                  key={et.id}
                  className={`bg-white border rounded-xl overflow-hidden hover:shadow-sm transition-all ${
                    panelEvent?.id === et.id ? "border-[#006bff] ring-1 ring-[#006bff]/20" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Color bar */}
                    <div className="w-1.5 self-stretch" style={{ backgroundColor: et.color }} />

                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div
                        className="cursor-pointer"
                        onClick={() => openPreview(et)}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={et.isActive}
                            onChange={(e) => { e.stopPropagation(); handleToggle(et.id); }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-gray-300 text-[#006bff] focus:ring-[#006bff]"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{et.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {et.duration} min · {et.location} · One-on-One
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLink(et.slug)}
                          className="text-xs font-semibold text-[#006bff] border border-[#006bff] px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                        >
                          <Copy className="w-3 h-3" /> Copy link
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpenId(menuOpenId === et.id ? null : et.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {menuOpenId === et.id && (
                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 w-40 animate-scale-in">
                              <button
                                onClick={() => openEdit(et)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => openPreview(et)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-3.5 h-3.5" /> Preview
                              </button>
                              <button
                                onClick={() => copyLink(et.slug)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Copy className="w-3.5 h-3.5" /> Copy link
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => handleDelete(et.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "single-use" && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link2 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700 mb-1">Single-use links</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Create one-time scheduling links for specific meetings. Each link can only be used once.
          </p>
          <Button className="mt-4" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Create single-use link
          </Button>
        </div>
      )}

      {tab === "polls" && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗳️</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Find the best time for everyone</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Gather everyone&apos;s availability to pick the best time for the group.
          </p>
          <Button className="mt-4">
            <Plus className="w-4 h-4" /> Create meeting poll
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Slide-out panel: Create / Edit / Preview
          ═══════════════════════════════════════════ */}
      {panelOpen && (
        <SlideOutPanel
          mode={panelMode!}
          eventType={panelEvent}
          onClose={closePanel}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          saving={submitting}
          onSwitchToEdit={(et) => { setPanelEvent(et); setPanelMode("edit"); }}
          onCopyLink={copyLink}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SlideOutPanel — Calendly-style
   Modes:
   - "create"  → name input + sections → Create button
   - "edit"    → same sections → Save changes button
   - "preview" → booking page iframe on left + panel on right
   ═══════════════════════════════════════════════════════ */
function SlideOutPanel({
  mode,
  eventType,
  onClose,
  onCreate,
  onUpdate,
  saving,
  onSwitchToEdit,
  onCopyLink,
}: {
  mode: "create" | "edit" | "preview";
  eventType: EventType | null;
  onClose: () => void;
  onCreate: (data: { name: string; duration: number; location: string; color: string }) => Promise<void>;
  onUpdate: (data: { name: string; duration: number; location: string; color: string }) => Promise<void>;
  saving: boolean;
  onSwitchToEdit: (et: EventType) => void;
  onCopyLink: (slug: string) => void;
}) {
  const [name, setName] = useState(eventType?.name || "");
  const [duration, setDuration] = useState(eventType?.duration || 30);
  const [location, setLocation] = useState(eventType?.location || "Google Meet");
  const [color, setColor] = useState(eventType?.color || "#7b2ff7");

  // Collapsible sections
  const [durationOpen, setDurationOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);

  const locationIntegrationId = LOCATION_TO_INTEGRATION[location] || "";
  const isPreview = mode === "preview";
  const isCreate = mode === "create";

  const COLORS = ["#0069ff","#ff4f00","#7b2ff7","#00a854","#e11d48","#f59e0b","#06b6d4","#ec4899"];

  const handleSave = () => {
    if (isCreate) {
      onCreate({ name, duration, location, color });
    } else {
      onUpdate({ name, duration, location, color });
    }
  };

  // Preview mode — full-width overlay with iframe + panel
  if (isPreview && eventType) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-gray-900/60" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          {/* Left — Preview area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Preview top bar */}
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: eventType.color }} />
                <span className="text-sm font-bold text-white">
                  Preview of {eventType.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onCopyLink(eventType.slug)}
                  className="text-xs font-semibold text-white border border-white/30 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" /> Copy link
                </button>
              </div>
            </div>

            {/* Preview content — actual booking page in iframe */}
            <div className="flex-1 bg-gray-100 overflow-hidden">
              {/* Info banner */}
              <div className="bg-gray-800 text-white text-xs text-center py-2.5 flex items-center justify-center gap-2">
                <span className="font-semibold">This is a preview.</span>
                <span>To book an event, share the link with your invitees.</span>
                <a
                  href={`/book/${eventType.slug}`}
                  target="_blank"
                  className="ml-1 underline flex items-center gap-1 hover:text-blue-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <iframe
                src={`/book/${eventType.slug}`}
                className="w-full h-full border-0"
                title="Booking preview"
              />
            </div>
          </div>

          {/* Right — Edit panel */}
          <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col shrink-0">
            {/* Close button */}
            <div className="flex items-center justify-end px-4 py-3 border-b border-gray-100">
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Event type header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-xs font-semibold text-[#006bff] mb-1.5">Event type</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: eventType.color }} />
                  <p className="text-base font-bold text-gray-900">{eventType.name}</p>
                  <button className="ml-auto">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">One-on-One</p>
              </div>

              {/* Duration */}
              <SectionRow label="Duration" defaultOpen={false}>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {eventType.duration} min
                </div>
              </SectionRow>

              {/* Location */}
              <SectionRow label="Location" defaultOpen={true}>
                <div className="flex gap-3 flex-wrap">
                  {LOCATION_OPTIONS.slice(0, 3).map((loc) => {
                    const locId = LOCATION_TO_INTEGRATION[loc] || "";
                    return (
                      <div
                        key={loc}
                        className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-medium ${
                          eventType.location === loc
                            ? "border-[#006bff] bg-blue-50 text-[#006bff]"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        <IntegrationIcon id={locId} size={20} />
                        <span>{loc}</span>
                      </div>
                    );
                  })}
                  <div className="flex flex-col items-center gap-1.5 px-3 py-2.5 text-xs text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                    <span>All options</span>
                  </div>
                </div>
              </SectionRow>

              {/* Availability */}
              <SectionRow label="Availability" defaultOpen={false}>
                <p className="text-sm text-gray-600">Weekdays, 9 am - 5 pm</p>
              </SectionRow>

              {/* Host */}
              <SectionRow label="Host" defaultOpen={false}>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">V</div>
                  Vishal Rawat (you)
                </div>
              </SectionRow>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-white">
              <button
                onClick={() => onSwitchToEdit(eventType)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSwitchToEdit(eventType)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  More options
                </button>
                <button
                  onClick={() => onSwitchToEdit(eventType)}
                  className="bg-[#006bff] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#0052cc] transition-all shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Create / Edit mode — right slide-out panel only
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Close */}
        <div className="flex items-center justify-end px-4 py-3 border-b border-gray-100">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Event type name + color */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-[#006bff] mb-2">Event type</p>
            <div className="flex items-center gap-3">
              {/* Color picker dropdown */}
              <div className="relative group">
                <button
                  className="w-7 h-7 rounded-full ring-2 ring-offset-1 ring-gray-200 shrink-0 transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:flex gap-1.5 z-10">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-125 ${color === c ? "ring-2 ring-[#006bff] ring-offset-1" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-[#006bff] outline-none pb-1 w-full transition-colors bg-transparent"
                placeholder="New Meeting"
                autoFocus={isCreate}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">One-on-One</p>
          </div>

          {/* Duration */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setDurationOpen(!durationOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-gray-900 text-sm">Duration</span>
              {durationOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {!durationOpen && (
              <div className="px-6 pb-4 -mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {duration} min
              </div>
            )}
            {durationOpen && (
              <div className="px-6 pb-4 animate-fade-in">
                <div className="flex gap-2 flex-wrap">
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDuration(d); setDurationOpen(false); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        duration === d
                          ? "bg-[#006bff] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {d >= 60 ? `${d / 60}h` : `${d} min`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-gray-900 text-sm">Location</span>
              {locationOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {locationOpen && (
              <div className="px-6 pb-4 animate-fade-in">
                <div className="flex gap-3 flex-wrap">
                  {LOCATION_OPTIONS.map((loc) => {
                    const locId = LOCATION_TO_INTEGRATION[loc] || "";
                    const isSelected = location === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 text-xs font-medium transition-all min-w-[76px] ${
                          isSelected
                            ? "border-[#006bff] bg-blue-50 text-[#006bff]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <IntegrationIcon id={locId} size={22} />
                        <span className="whitespace-nowrap">{loc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {!locationOpen && (
              <div className="px-6 pb-4 -mt-1 flex items-center gap-2 text-sm text-gray-600">
                <IntegrationIcon id={locationIntegrationId} size={18} />
                {location}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setAvailabilityOpen(!availabilityOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-gray-900 text-sm">Availability</span>
              {availabilityOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            <div className="px-6 pb-4 -mt-1 text-sm text-gray-600">
              Weekdays, 9 am - 5 pm
            </div>
          </div>

          {/* Host */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setHostOpen(!hostOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-gray-900 text-sm">Host</span>
              {hostOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            <div className="px-6 pb-4 -mt-1 flex items-center gap-2 text-sm text-gray-600">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">V</div>
              Vishal Rawat (you)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-white">
          {!isCreate && eventType && (
            <a
              href={`/book/${eventType.slug}`}
              target="_blank"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors mr-auto"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          )}
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isCreate ? "Cancel" : "More options"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-[#006bff] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#0052cc] transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? "Saving..." : isCreate ? "Create" : "Save changes"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Shared collapsible section for preview panel ── */
function SectionRow({
  label,
  defaultOpen,
  children,
}: {
  label: string;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 text-sm">{label}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <div className={`px-6 pb-3 ${open ? "animate-fade-in" : ""}`}>
        {children}
      </div>
    </div>
  );
}