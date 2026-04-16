"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, XCircle } from "lucide-react";
import { PageHeader }   from "@/components/layout/PageHeader";
import { Tabs }         from "@/components/ui/Tabs";
import { EmptyState }   from "@/components/ui/EmptyState";
import { MeetingCard }  from "@/components/meetings/MeetingCard";
import { bookingsApi }  from "@/lib/api";
import type { Booking } from "@/lib/types";
import toast from "react-hot-toast";

const TABS = [
  { id: "upcoming",  label: "Upcoming",  icon: <CalendarDays className="w-4 h-4" /> },
  { id: "past",      label: "Past",      icon: <Clock className="w-4 h-4" /> },
  { id: "cancelled", label: "Cancelled", icon: <XCircle className="w-4 h-4" /> },
];

const TAB_PARAMS: Record<string, { period?: string; status?: string }> = {
  upcoming:  { period: "upcoming" },
  past:      { period: "past" },
  cancelled: { status: "CANCELLED" },
};

const EMPTY: Record<string, { title: string; description: string }> = {
  upcoming:  { title: "No upcoming meetings",  description: "When someone books a time, it'll appear here." },
  past:      { title: "No past meetings",      description: "Your completed meetings will show here." },
  cancelled: { title: "No cancelled meetings", description: "Cancelled meetings will appear here." },
};

export default function MeetingsPage() {
  const router = useRouter();
  const [tab,      setTab]      = useState("upcoming");
  const [meetings, setMeetings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMeetings(await bookingsApi.getMeetings(TAB_PARAMS[tab]));
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (id: string, reason?: string) => {
    try {
      await bookingsApi.cancel(id, reason);
      toast.success("Meeting cancelled");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    }
  };

  const handleReschedule = (meeting: Booking) => {
    router.push(`/reschedule/${meeting.id}`);
  };

  const empty = EMPTY[tab];

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <PageHeader
        title="Meetings"
        subtitle="View and manage all your scheduled meetings."
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={empty.title}
            description={empty.description}
          />
        ) : (
          <div className="space-y-4">
            {meetings.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                onCancel={tab === "upcoming" ? handleCancel : undefined}
                onReschedule={tab === "upcoming" ? handleReschedule : undefined}
                readonly={tab !== "upcoming"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}