"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar, Clock, MapPin, User, Mail,
  X, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Booking } from "@/lib/types";

interface MeetingCardProps {
  meeting:       Booking;
  onCancel?:     (id: string, reason?: string) => void;
  onReschedule?: (meeting: Booking) => void;
  readonly?:     boolean;
}

export function MeetingCard({
  meeting,
  onCancel,
  onReschedule,
  readonly,
}: MeetingCardProps) {
  const [expanded,    setExpanded]    = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [reason,      setReason]      = useState("");

  const start      = new Date(meeting.startTime);
  const end        = new Date(meeting.endTime);
  const isPast     = start < new Date();
  const isCancelled = meeting.status === "CANCELLED";

  return (
    <>
      <div
        className={cn(
          "card overflow-hidden flex",
          isCancelled && "opacity-60"
        )}
      >
        <div
          className="w-1.5 shrink-0"
          style={{ backgroundColor: meeting.eventType?.color || "#0069ff" }}
        />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-gray-900">
                  {meeting.eventType?.name}
                </h3>
                <Badge
                  variant={
                    isCancelled ? "red" : isPast ? "gray" : "green"
                  }
                >
                  {isCancelled
                    ? "Cancelled"
                    : isPast
                    ? "Completed"
                    : "Upcoming"}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(start, "EEE, MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {format(start, "h:mm a")} – {format(end, "h:mm a")}
                </span>
                {meeting.eventType?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {meeting.eventType.location}
                  </span>
                )}
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {meeting.inviteeName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {meeting.inviteeEmail}
                </span>
              </div>
            </div>

            {/* Actions */}
            {!readonly && !isCancelled && !isPast && (
              <div className="flex gap-2 shrink-0">
                {onReschedule && (
                  <button
                    onClick={() => onReschedule(meeting)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-brand-blue transition-colors"
                    title="Reschedule"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                {onCancel && (
                  <button
                    onClick={() => setCancelModal(true)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Expand toggle */}
          {(meeting.notes || meeting.cancelReason) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-sm text-brand-blue flex items-center gap-1 hover:underline"
            >
              {expanded ? (
                <><ChevronUp className="w-3.5 h-3.5" /> Hide details</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> Show details</>
              )}
            </button>
          )}

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 animate-fade-in">
              {meeting.notes && (
                <p className="text-sm text-gray-600">📝 {meeting.notes}</p>
              )}
              {meeting.cancelReason && (
                <p className="text-sm text-red-500">
                  ❌ {meeting.cancelReason}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCancelModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 animate-scale-in shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Cancel Meeting
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Cancel meeting with{" "}
              <strong>{meeting.inviteeName}</strong>?
            </p>
            <textarea
              className="input resize-none mb-4"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional)"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setCancelModal(false)}
              >
                Keep Meeting
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  onCancel?.(meeting.id, reason);
                  setCancelModal(false);
                }}
              >
                Cancel Meeting
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}