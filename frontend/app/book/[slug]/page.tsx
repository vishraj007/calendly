"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock, Video, ArrowLeft, Globe } from "lucide-react";
import { BookingCalendar }  from "@/components/calendar/BookingCalendar";
import { TimeSlotPicker }   from "@/components/calendar/TimeSlotPicker";
import { Input }            from "@/components/ui/Input";
import { Button }           from "@/components/ui/Button";
import { IntegrationIcon } from "@/components/integrations/IntegrationLogos";
import { LOCATION_TO_INTEGRATION } from "@/lib/constants";
import { eventTypesApi, availabilityApi, bookingsApi } from "@/lib/api";
import { TIMEZONES }        from "@/lib/utils";
import type { EventType, TimeSlot, Availability, CustomQuestion } from "@/lib/types";
import toast from "react-hot-toast";
import Link from "next/link";

type Step = "calendar" | "form";

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();

  const [eventType,    setEventType]    = useState<EventType | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots,        setSlots]        = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [step,         setStep]         = useState<Step>("calendar");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [pageLoading,  setPageLoading]  = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Booking form state
  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [notes,         setNotes]         = useState("");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  // Load event type + availability on mount
  useEffect(() => {
    Promise.all([
      eventTypesApi.getPublic(slug),
      availabilityApi.get(),
    ])
      .then(([et, avail]) => {
        setEventType(et);
        setAvailability(avail.schedule);
      })
      .catch((e) => setError(e.message))
      .finally(() => setPageLoading(false));
  }, [slug]);

  // Load slots when date or timezone changes
  useEffect(() => {
    if (!selectedDate || !eventType) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    availabilityApi
      .getSlots(eventType.id, format(selectedDate, "yyyy-MM-dd"), timezone)
      .then(setSlots)
      .catch(() => toast.error("Failed to load slots"))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, timezone, eventType]);

  const availableDays = availability
    .filter((a) => a.isActive)
    .map((a) => a.dayOfWeek);

  const questions = (eventType?.customQuestions || []) as CustomQuestion[];

  const isVirtualLocation = eventType
    ? ["Google Meet", "Zoom", "Microsoft Teams"].includes(eventType.location)
    : false;
  const locationIntegrationId = eventType
    ? LOCATION_TO_INTEGRATION[eventType.location] || ""
    : "";

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !eventType) return;
    setSubmitting(true);
    try {
      const booking = await bookingsApi.create({
        eventTypeId:   eventType.id,
        inviteeName:   name,
        inviteeEmail:  email,
        startTime:     selectedSlot.startTimeUTC,
        endTime:       selectedSlot.endTimeUTC,
        timezone,
        notes:         notes || undefined,
        customAnswers: Object.keys(customAnswers).length
          ? customAnswers
          : undefined,
      });
      router.push(`/book/${slug}/confirmed?id=${booking.id}`);
    } catch (e: unknown) {
      toast.error(
        e instanceof Error ? e.message : "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    );
  }

  if (error || !eventType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-4xl overflow-hidden animate-fade-in">
        <div className="flex flex-col md:flex-row min-h-[580px]">

          {/* Left panel — event info */}
          <div className="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-gray-200 p-8 shrink-0">
            {step === "form" && (
              <button
                onClick={() => setStep("calendar")}
                className="flex items-center gap-2 text-sm text-brand-blue font-medium mb-6 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}

            <p className="text-sm text-gray-500 font-medium mb-1">
              {eventType.user?.name}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {eventType.name}
            </h1>

            {eventType.description && (
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                {eventType.description}
              </p>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {eventType.duration} min
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                {locationIntegrationId ? (
                  <IntegrationIcon id={locationIntegrationId} size={18} />
                ) : (
                  <Video className="w-4 h-4 text-gray-400" />
                )}
                <div>
                  <span>{eventType.location}</span>
                  {isVirtualLocation && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Web conferencing details provided upon confirmation
                    </p>
                  )}
                </div>
              </div>
              {selectedDate && (
                <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {format(selectedDate, "EEE, MMM d")}
                  {selectedSlot && ` · ${selectedSlot.startTime}`}
                </div>
              )}
            </div>

            {/* Timezone picker */}
            <div className="mt-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer w-full"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 p-8 overflow-y-auto">
            {step === "calendar" ? (
              <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar */}
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-900 mb-4">
                    Select a Date &amp; Time
                  </h2>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    availableDays={availableDays}
                  />
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div className="w-full md:w-[190px]">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      {format(selectedDate, "EEE, MMM d")}
                    </h3>
                    <TimeSlotPicker
                      slots={slots}
                      selected={selectedSlot}
                      onSelect={setSelectedSlot}
                      loading={slotsLoading}
                    />
                    {selectedSlot && (
                      <Button
                        onClick={() => setStep("form")}
                        className="w-full mt-4"
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Booking form */
              <div className="max-w-md animate-fade-in">
                <h2 className="text-base font-bold text-gray-900 mb-6">
                  Enter Your Details
                </h2>
                <form onSubmit={handleBook} className="space-y-5">
                  <Input
                    label="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                  {/* Custom questions */}
                  {questions.map((q) => (
                    <div key={q.id}>
                      <label className="label">
                        {q.label}{q.required && " *"}
                      </label>
                      {q.type === "select" ? (
                        <select
                          className="select"
                          required={q.required}
                          value={customAnswers[q.id] || ""}
                          onChange={(e) =>
                            setCustomAnswers((a) => ({
                              ...a,
                              [q.id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select an option...</option>
                          {q.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : q.type === "textarea" ? (
                        <textarea
                          className="input resize-none"
                          rows={3}
                          required={q.required}
                          value={customAnswers[q.id] || ""}
                          onChange={(e) =>
                            setCustomAnswers((a) => ({
                              ...a,
                              [q.id]: e.target.value,
                            }))
                          }
                          placeholder="Your answer..."
                        />
                      ) : (
                        <input
                          className="input"
                          required={q.required}
                          value={customAnswers[q.id] || ""}
                          onChange={(e) =>
                            setCustomAnswers((a) => ({
                              ...a,
                              [q.id]: e.target.value,
                            }))
                          }
                          placeholder="Your answer..."
                        />
                      )}
                    </div>
                  ))}

                  {/* Notes */}
                  <div>
                    <label className="label">Additional Notes</label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything you'd like to share..."
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={submitting}
                    className="w-full py-3"
                  >
                    Schedule Event
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer — Calendly-style */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <Link href="#" className="hover:text-gray-600 transition-colors">
          Cookie settings
        </Link>
        <span>·</span>
        <Link href="#" className="hover:text-gray-600 transition-colors">
          Report abuse
        </Link>
      </div>

      {/* Powered by ribbon */}
      <div className="mt-3 mb-6">
        <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 shadow-sm">
          powered by{" "}
          <Link href="/" className="font-bold text-[#006bff] hover:underline">
            Schedulr
          </Link>
        </span>
      </div>
    </div>
  );
}