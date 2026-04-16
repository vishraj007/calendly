"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Save, Plus, Trash2, Calendar } from "lucide-react";
import { PageHeader }     from "@/components/layout/PageHeader";
import { Button }         from "@/components/ui/Button";
import { availabilityApi } from "@/lib/api";
import { DAY_NAMES, TIME_OPTIONS, TIMEZONES } from "@/lib/utils";
import type { Availability, AvailabilityOverride } from "@/lib/types";
import toast from "react-hot-toast";

export default function AvailabilityPage() {
  const [schedule,         setSchedule]         = useState<Availability[]>([]);
  const [timezone,         setTimezone]          = useState("Asia/Kolkata");
  const [overrides,        setOverrides]         = useState<AvailabilityOverride[]>([]);
  const [saving,           setSaving]            = useState(false);
  const [loading,          setLoading]           = useState(true);
  const [showOverrideForm, setShowOverrideForm]  = useState(false);
  const [ovDate,           setOvDate]            = useState("");
  const [ovIsOff,          setOvIsOff]           = useState(false);
  const [ovStart,          setOvStart]           = useState("09:00");
  const [ovEnd,            setOvEnd]             = useState("18:00");

  const load = useCallback(async () => {
    try {
      const [avail, ovs] = await Promise.all([
        availabilityApi.get(),
        availabilityApi.getOverrides(),
      ]);
      setSchedule(avail.schedule);
      setTimezone(avail.timezone);
      setOverrides(ovs);
    } catch {
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (
    dayOfWeek: number,
    key: keyof Availability,
    value: unknown
  ) =>
    setSchedule((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek ? { ...d, [key]: value } : d
      )
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      await availabilityApi.save(schedule, timezone);
      toast.success("Availability saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAddOverride = async () => {
    if (!ovDate) { toast.error("Please select a date"); return; }
    try {
      await availabilityApi.createOverride({
        date:      ovDate,
        isOff:     ovIsOff,
        startTime: ovIsOff ? undefined : ovStart,
        endTime:   ovIsOff ? undefined : ovEnd,
      });
      toast.success("Override added");
      setShowOverrideForm(false);
      setOvDate("");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error adding override");
    }
  };

  const handleDeleteOverride = async (id: string) => {
    try {
      await availabilityApi.deleteOverride(id);
      toast.success("Override removed");
      load();
    } catch {
      toast.error("Failed to remove override");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-10 space-y-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        title="Availability"
        subtitle="Set the times you're available for bookings."
        action={
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" /> Save
          </Button>
        }
      />

      {/* Timezone */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Timezone</h2>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="select max-w-xs"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>

      {/* Weekly Hours */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5">Weekly Hours</h2>
        <div className="space-y-3">
          {schedule.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                day.isActive ? "bg-gray-50" : "bg-white"
              }`}
            >
              {/* Toggle switch */}
              <button
                onClick={() => update(day.dayOfWeek, "isActive", !day.isActive)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  day.isActive ? "bg-brand-blue" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    day.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>

              <span
                className={`w-28 text-sm font-semibold shrink-0 ${
                  day.isActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {DAY_NAMES[day.dayOfWeek]}
              </span>

              {day.isActive ? (
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <select
                    value={day.startTime}
                    onChange={(e) =>
                      update(day.dayOfWeek, "startTime", e.target.value)
                    }
                    className="select py-2 text-sm w-36"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <span className="text-gray-400">—</span>
                  <select
                    value={day.endTime}
                    onChange={(e) =>
                      update(day.dayOfWeek, "endTime", e.target.value)
                    }
                    className="select py-2 text-sm w-36"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Date Overrides */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Date Overrides</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Override your schedule for specific dates.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowOverrideForm(!showOverrideForm)}
          >
            <Plus className="w-4 h-4" /> Add Date
          </Button>
        </div>

        {/* Add form */}
        {showOverrideForm && (
          <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={ovDate}
                  onChange={(e) => setOvDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="input"
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOvIsOff(!ovIsOff)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    ovIsOff ? "bg-red-500" : "bg-brand-blue"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      ovIsOff ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">
                  {ovIsOff ? "Mark as day off" : "Custom hours"}
                </span>
              </div>
            </div>

            {!ovIsOff && (
              <div className="flex items-center gap-3">
                <select
                  value={ovStart}
                  onChange={(e) => setOvStart(e.target.value)}
                  className="select text-sm w-36"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <span className="text-gray-400">—</span>
                <select
                  value={ovEnd}
                  onChange={(e) => setOvEnd(e.target.value)}
                  className="select text-sm w-36"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowOverrideForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOverride}>Add Override</Button>
            </div>
          </div>
        )}

        {/* Override list */}
        {overrides.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No date overrides. Add one to customize a specific day.
          </p>
        ) : (
          <div className="space-y-2">
            {overrides.map((ov) => (
              <div
                key={ov.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(ov.date), "EEE, MMM d, yyyy")}
                  </span>
                  {ov.isOff ? (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      Day Off
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {ov.startTime} – {ov.endTime}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteOverride(ov.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}