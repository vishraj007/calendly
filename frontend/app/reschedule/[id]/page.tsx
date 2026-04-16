"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format }               from "date-fns";
import { ArrowLeft, Clock, Video, RefreshCw } from "lucide-react";
import { BookingCalendar } from "@/components/calendar/BookingCalendar";
import { TimeSlotPicker }  from "@/components/calendar/TimeSlotPicker";
import { Button }          from "@/components/ui/Button";
import { bookingsApi, availabilityApi } from "@/lib/api";
import { TIMEZONES }       from "@/lib/utils";
import type { Booking, TimeSlot, Availability } from "@/lib/types";
import toast from "react-hot-toast";

export default function ReschedulePage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [booking,      setBooking]      = useState<Booking | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots,        setSlots]        = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [pageLoading,  setPageLoading]  = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    Promise.all([
      bookingsApi.getMeeting(id),
      availabilityApi.get(),
    ])
      .then(([b, avail]) => {
        setBooking(b);
        setAvailability(avail.schedule);
        setTimezone(b.timezone);
      })
      .catch(() => toast.error("Booking not found"))
      .finally(() => setPageLoading(false));
  }, [id]);

  // Load slots when date changes
  useEffect(() => {
    if (!selectedDate || !booking?.eventTypeId) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    availabilityApi
      .getSlots(
        booking.eventTypeId,
        format(selectedDate, "yyyy-MM-dd"),
        timezone
      )
      .then(setSlots)
      .catch(() => toast.error("Failed to load slots"))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, timezone, booking]);

  const availableDays = availability
    .filter((a) => a.isActive)
    .map((a) => a.dayOfWeek);

  const handleReschedule = async () => {
    if (!selectedSlot || !booking) return;
    setSubmitting(true);
    try {
      await bookingsApi.reschedule(id, {
        startTime: selectedSlot.startTimeUTC,
        endTime:   selectedSlot.endTimeUTC,
        timezone,
      });
      toast.success("Meeting rescheduled successfully!");
      router.push(
        `/book/${booking.eventType?.slug}/confirmed?id=${id}`
      );
    } catch (e: unknown) {
      toast.error(
        e instanceof Error ? e.message : "Failed to reschedule"
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-4xl overflow-hidden animate-fade-in">

        {/* Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center gap-3">
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            Rescheduling:{" "}
            <strong>{booking.eventType?.name}</strong>{" "}
            with {booking.inviteeName}
          </p>
        </div>

        <div className="flex flex-col md:flex-row min-h-[520px]">
          {/* Left panel */}
          <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-gray-200 p-8 shrink-0">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-brand-blue font-medium mb-6 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <p className="text-sm text-gray-500 mb-1">{booking.host?.name}</p>
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              {booking.eventType?.name}
            </h1>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {booking.eventType?.duration} min
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="w-4 h-4 text-gray-400" />
                {booking.eventType?.location}
              </div>
            </div>

            {/* Current time */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                Currently scheduled
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {format(new Date(booking.startTime), "EEE, MMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(booking.startTime), "h:mm a")} –{" "}
                {format(new Date(booking.endTime), "h:mm a")}
              </p>
            </div>

            {/* Timezone */}
            <div className="mt-4">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="select text-sm"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Select a New Date &amp; Time
                </h2>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d);
                    setSelectedSlot(null);
                  }}
                  availableDays={availableDays}
                />
              </div>

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
                      onClick={handleReschedule}
                      loading={submitting}
                      className="w-full mt-4"
                    >
                      Reschedule
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}