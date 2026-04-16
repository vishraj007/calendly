"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  COLOR_OPTIONS,
  DURATION_OPTIONS,
  LOCATION_OPTIONS,
  BUFFER_OPTIONS,
  generateSlug,
} from "@/lib/utils";
import { LOCATION_TO_INTEGRATION } from "@/lib/constants";
import { IntegrationIcon } from "@/components/integrations/IntegrationLogos";
import type { EventType, CustomQuestion } from "@/lib/types";

interface EventTypeFormProps {
  initial?:  Partial<EventType>;
  onSubmit:  (data: Partial<EventType>) => Promise<void>;
  onCancel:  () => void;
  loading:   boolean;
}

export function EventTypeForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: EventTypeFormProps) {
  const [form, setForm] = useState({
    name:            initial?.name            || "",
    slug:            initial?.slug            || "",
    duration:        initial?.duration        || 30,
    description:     initial?.description     || "",
    location:        initial?.location        || "Google Meet",
    color:           initial?.color           || "#0069ff",
    bufferBefore:    initial?.bufferBefore    || 0,
    bufferAfter:     initial?.bufferAfter     || 0,
    customQuestions: (initial?.customQuestions || []) as CustomQuestion[],
  });

  const isCreating = !initial?.id;

  useEffect(() => {
    if (isCreating && form.name) {
      setForm((f) => ({ ...f, slug: generateSlug(f.name) }));
    }
  }, [form.name, isCreating]);

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const addQuestion = () =>
    setForm((f) => ({
      ...f,
      customQuestions: [
        ...f.customQuestions,
        {
          id: Date.now().toString(),
          label: "",
          type: "text" as const,
          required: false,
        },
      ],
    }));

  const updateQuestion = (idx: number, patch: Partial<CustomQuestion>) =>
    setForm((f) => ({
      ...f,
      customQuestions: f.customQuestions.map((q, i) =>
        i === idx ? { ...q, ...patch } : q
      ),
    }));

  const removeQuestion = (idx: number) =>
    setForm((f) => ({
      ...f,
      customQuestions: f.customQuestions.filter((_, i) => i !== idx),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      duration:     Number(form.duration),
      bufferBefore: Number(form.bufferBefore),
      bufferAfter:  Number(form.bufferAfter),
    });
  };

  const isVirtualLocation = ["Google Meet", "Zoom", "Microsoft Teams"].includes(form.location);
  const locationIntegrationId = LOCATION_TO_INTEGRATION[form.location] || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Event name *"
        value={form.name}
        onChange={set("name")}
        placeholder="e.g., 30 Minute Meeting"
        required
      />

      {/* Slug */}
      <div>
        <label className="label">URL slug *</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 shrink-0">/book/</span>
          <input
            className="input flex-1"
            value={form.slug}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, ""),
              }))
            }
            placeholder="30-min-meeting"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          className="input resize-none"
          rows={3}
          value={form.description}
          onChange={set("description")}
          placeholder="Brief description..."
        />
      </div>

      {/* Duration + Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Duration *</label>
          <select className="select" value={form.duration} onChange={set("duration")}>
            {DURATION_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Location</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <IntegrationIcon id={locationIntegrationId} size={20} />
            </div>
            <select
              className="select pl-10"
              value={form.location}
              onChange={set("location")}
            >
              {LOCATION_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          {isVirtualLocation && (
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
              Web conferencing details provided upon confirmation
            </p>
          )}
        </div>
      </div>

      {/* Buffer Time */}
      <div>
        <label className="label">Buffer Time</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Before event</p>
            <select
              className="select"
              value={form.bufferBefore}
              onChange={set("bufferBefore")}
            >
              {BUFFER_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">After event</p>
            <select
              className="select"
              value={form.bufferAfter}
              onChange={set("bufferAfter")}
            >
              {BUFFER_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="label">Color</label>
        <div className="flex gap-3 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                form.color === c
                  ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Custom Questions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Custom Questions</label>
          <button
            type="button"
            onClick={addQuestion}
            className="text-sm text-brand-blue font-medium hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add question
          </button>
        </div>

        {form.customQuestions.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No custom questions. Invitees will only provide name and email.
          </p>
        )}

        <div className="space-y-3">
          {form.customQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3"
            >
              <div className="flex gap-3">
                <input
                  className="input flex-1"
                  value={q.label}
                  onChange={(e) =>
                    updateQuestion(idx, { label: e.target.value })
                  }
                  placeholder="Question text"
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <select
                  className="select flex-1"
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(idx, {
                      type: e.target.value as CustomQuestion["type"],
                    })
                  }
                >
                  <option value="text">Short text</option>
                  <option value="textarea">Long text</option>
                  <option value="select">Dropdown</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) =>
                      updateQuestion(idx, { required: e.target.checked })
                    }
                    className="rounded"
                  />
                  Required
                </label>
              </div>

              {q.type === "select" && (
                <input
                  className="input"
                  value={(q.options || []).join(", ")}
                  onChange={(e) =>
                    updateQuestion(idx, {
                      options: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Option 1, Option 2, Option 3"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {initial?.id ? "Save Changes" : "Create Event Type"}
        </Button>
      </div>
    </form>
  );
}