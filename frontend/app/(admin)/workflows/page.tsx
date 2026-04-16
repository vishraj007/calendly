"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Mail, MessageSquare, Bell, CheckCircle2, XCircle,
  ChevronRight, Plus, Zap, Clock, Send,
} from "lucide-react";
import toast from "react-hot-toast";

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  icon: React.ElementType;
  iconColor: string;
  badgeColor: string;
  enabled: boolean;
}

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: "confirm-email",
    name: "Booking confirmation email",
    description: "Send a confirmation email to the invitee when a meeting is booked.",
    trigger: "When a meeting is booked",
    action: "Send confirmation email to invitee",
    icon: Mail,
    iconColor: "text-green-600",
    badgeColor: "bg-green-50 text-green-600 border-green-200",
    enabled: true,
  },
  {
    id: "cancel-email",
    name: "Cancellation notification",
    description: "Notify the invitee when a meeting is cancelled by the host.",
    trigger: "When a meeting is cancelled",
    action: "Send cancellation email to invitee",
    icon: XCircle,
    iconColor: "text-red-500",
    badgeColor: "bg-red-50 text-red-500 border-red-200",
    enabled: true,
  },
  {
    id: "reminder-email",
    name: "Email reminder to invitee",
    description: "Reduce no-shows — send automated email reminders before meetings.",
    trigger: "24 hours before meeting",
    action: "Send reminder email to invitee",
    icon: Bell,
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
    enabled: false,
  },
  {
    id: "followup-email",
    name: "Send thank you email",
    description: "Build relationships with a quick thank you after meetings.",
    trigger: "After meeting ends",
    action: "Send follow-up email to invitee",
    icon: Send,
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
    enabled: false,
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);

  const toggle = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, enabled: !w.enabled } : w
      )
    );
    const wf = workflows.find((w) => w.id === id);
    toast.success(`${wf?.name} ${wf?.enabled ? "disabled" : "enabled"}`);
  };

  const activeCount = workflows.filter((w) => w.enabled).length;

  return (
    <div className="p-8">
      <PageHeader
        title="Workflows"
        subtitle={`${activeCount} active workflow${activeCount !== 1 ? "s" : ""}`}
      />

      {/* Info section */}
      <div className="text-center mb-10 py-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-[#006bff]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Automate your meeting communications
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Workflows help you reduce no-shows and have more productive meetings. 
          Plus, automated emails save you time before and after events.
        </p>
      </div>

      {/* Active workflows */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Your Workflows
        </h3>
        <div className="space-y-3">
          {workflows.filter((w) => w.enabled).map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} onToggle={toggle} />
          ))}
          {workflows.filter((w) => w.enabled).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No active workflows. Enable a template below to get started.
            </p>
          )}
        </div>
      </div>

      {/* Templates */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Start with a workflow template
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Enable these pre-built workflows to automate your scheduling communications.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {workflows.filter((w) => !w.enabled).map((wf) => (
            <div
              key={wf.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wf.badgeColor} border`}>
                  <wf.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{wf.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{wf.description}</p>
                </div>
              </div>
              <Button
                variant="primary"
                className="w-full text-xs"
                onClick={() => toggle(wf.id)}
              >
                <Plus className="w-3.5 h-3.5" /> Add workflow
              </Button>
            </div>
          ))}
          {workflows.filter((w) => !w.enabled).length === 0 && (
            <p className="text-sm text-gray-400 col-span-2 text-center py-4">
              All workflow templates are active! 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ workflow, onToggle }: { workflow: Workflow; onToggle: (id: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition-all">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${workflow.badgeColor} border shrink-0`}>
        <workflow.icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">{workflow.name}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{workflow.trigger}</span>
          <ChevronRight className="w-3 h-3" />
          <span>{workflow.action}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
          <CheckCircle2 className="w-3 h-3" /> Active
        </span>
        <button
          onClick={() => onToggle(workflow.id)}
          className="relative w-10 h-6 bg-[#006bff] rounded-full transition-colors"
        >
          <div className="absolute top-0.5 left-[18px] w-5 h-5 bg-white rounded-full shadow-sm transition-all" />
        </button>
      </div>
    </div>
  );
}
