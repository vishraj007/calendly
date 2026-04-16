"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle2, Calendar, Clock, Video, User, Mail, Globe, ArrowRight, Home, ExternalLink } from "lucide-react";
import Link from "next/link";
import { bookingsApi, eventTypesApi } from "@/lib/api";
import { IntegrationIcon } from "@/components/integrations/IntegrationLogos";
import { LOCATION_TO_INTEGRATION } from "@/lib/constants";
import type { Booking, EventType } from "@/lib/types";

export default function ConfirmedPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, et] = await Promise.all([
          bookingId ? bookingsApi.getMeeting(bookingId) : Promise.resolve(null),
          eventTypesApi.getPublic(slug),
        ]);
        setBooking(b);
        setEventType(et);
      } catch {
        // Fallback if API fails
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006bff]" />
      </div>
    );
  }

  const start = booking ? new Date(booking.startTime) : null;
  const end = booking ? new Date(booking.endTime) : null;
  const location = eventType?.location || booking?.eventType?.location || "Online";
  const locationIntegrationId = LOCATION_TO_INTEGRATION[location] || "";
  const meetingLink = booking?.meetingLink;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Success header */}
        <div className="text-center pt-10 pb-6 px-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            You are scheduled!
          </h1>
          <p className="text-gray-500 text-sm">
            A calendar invitation has been sent to your email address.
          </p>
        </div>

        {/* Meeting details card */}
        <div className="mx-8 mb-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          {/* Colored top bar */}
          <div
            className="h-1.5"
            style={{ backgroundColor: eventType?.color || booking?.eventType?.color || "#006bff" }}
          />

          <div className="p-6 space-y-4">
            {/* Event name */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Event</p>
              <p className="text-base font-bold text-gray-900">
                {eventType?.name || booking?.eventType?.name || "Meeting"}
              </p>
            </div>

            {/* Date & Time */}
            {start && end && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {format(start, "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(start, "h:mm a")} – {format(end, "h:mm a")}
                  </p>
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                {eventType?.duration || booking?.eventType?.duration || 30} minutes
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              {locationIntegrationId ? (
                <IntegrationIcon id={locationIntegrationId} size={18} />
              ) : (
                <Video className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-700">{location}</span>
            </div>

            {/* Meeting Link */}
            {meetingLink && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                  Join Meeting
                </p>
                <a
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#006bff] hover:underline break-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {meetingLink}
                </a>
              </div>
            )}

            {/* Invitee info */}
            {booking && (
              <>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Invitee</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{booking.inviteeName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{booking.inviteeEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{booking.timezone}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{booking.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/book/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#006bff] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#0052cc] transition-all shadow-sm"
          >
            Schedule Another
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Powered by */}
        <div className="border-t border-gray-100 py-4 text-center">
          <p className="text-xs text-gray-400">
            Powered by{" "}
            <Link href="/" className="text-[#006bff] font-semibold hover:underline">
              Calendly
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
