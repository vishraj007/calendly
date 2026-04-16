"use client";

import { useState } from "react";
import {
  Clock, Copy, ExternalLink, MoreVertical,
  Pencil, Trash2, Power,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { EventType } from "@/lib/types";
import toast from "react-hot-toast";

interface EventTypeCardProps {
  eventType: EventType;
  onEdit:   (et: EventType) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export function EventTypeCard({
  eventType,
  onEdit,
  onDelete,
  onToggle,
}: EventTypeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const bookingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/book/${eventType.slug}`
      : `/book/${eventType.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast.success("Link copied!");
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <div
      className={`card overflow-hidden ${!eventType.isActive ? "opacity-60" : ""}`}
    >
      {/* Calendly-style colored top border */}
      <div className="h-1.5" style={{ backgroundColor: eventType.color }} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {eventType.name}
              </h3>
              {!eventType.isActive && (
                <Badge variant="gray">Inactive</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {eventType.duration} min
              </span>
              <span>{eventType.location}</span>
            </div>
            {eventType.description && (
              <p className="text-sm text-gray-400 line-clamp-2">
                {eventType.description}
              </p>
            )}
          </div>

          {/* Three-dot menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={close} />
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 animate-scale-in">
                  <MenuItem
                    icon={Pencil}
                    label="Edit"
                    onClick={() => { onEdit(eventType); close(); }}
                  />
                  <MenuItem icon={Copy} label="Copy link" onClick={copyLink} />
                  <MenuItem
                    icon={ExternalLink}
                    label="Preview"
                    onClick={() => {
                      window.open(`/book/${eventType.slug}`, "_blank");
                      close();
                    }}
                  />
                  <MenuItem
                    icon={Power}
                    label={eventType.isActive ? "Deactivate" : "Activate"}
                    onClick={() => { onToggle(eventType.id); close(); }}
                  />
                  <div className="my-1 border-t border-gray-100" />
                  <MenuItem
                    icon={Trash2}
                    label="Delete"
                    onClick={() => { onDelete(eventType.id); close(); }}
                    danger
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <a
            href={`/book/${eventType.slug}`}
            target="_blank"
            className="text-sm text-brand-blue font-medium hover:underline flex items-center gap-1"
          >
            View booking page <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={copyLink}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copy link
          </button>
        </div>
      </div>
    </div>
  );
}