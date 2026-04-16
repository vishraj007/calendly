"use client";

import { useState, useEffect, useCallback } from "react";
import { contactsApi } from "@/lib/api";
import type { Contact, Booking } from "@/lib/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  Search, Plus, X, User, Users, Mail, Phone, Briefcase, Building2,
  Globe, ExternalLink, CalendarDays, Clock, ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await contactsApi.list(search || undefined);
      setContacts(data);
    } catch { toast.error("Failed to load contacts"); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const viewDetail = async (c: Contact) => {
    setDetailLoading(true);
    setSelected(c);
    try {
      const full = await contactsApi.get(c.id);
      setSelected(full);
    } catch { /* use basic data */ }
    finally { setDetailLoading(false); }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    try {
      await contactsApi.delete(id);
      toast.success("Contact deleted");
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Contacts"
        action={
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus className="w-4 h-4" /> Add contact
          </Button>
        }
      />

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
        <h3 className="font-bold text-gray-900 mb-1">
          Stay organized as you build relationships
        </h3>
        <p className="text-sm text-gray-600">
          Contacts are automatically created and updated when a meeting is booked.
          View meeting history, access key details, and schedule your next conversation — all in one place.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006bff]" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-700">No contacts yet</p>
              <p className="text-sm mt-1">
                Contacts will appear here when someone books a meeting.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Job Title</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Company</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Timezone</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => viewDetail(c)}
                      className={`border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors ${
                        selected?.id === c.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#006bff] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{c.email}</td>
                      <td className="px-5 py-3.5 text-gray-600">{c.jobTitle || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-600">{c.company || "—"}</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{c.timezone || "—"}</td>
                      <td className="px-3">
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 bg-white border border-gray-200 rounded-xl p-5 h-fit sticky top-4 animate-slide-in">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#006bff] flex items-center justify-center text-white font-bold text-lg">
                {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{selected.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{selected.email}</p>

            <div className="space-y-2.5 text-sm mb-5">
              {selected.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" /> {selected.phone}
                </div>
              )}
              {selected.jobTitle && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4 text-gray-400" /> {selected.jobTitle}
                </div>
              )}
              {selected.company && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400" /> {selected.company}
                </div>
              )}
              {selected.timezone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4 text-gray-400" /> {selected.timezone}
                </div>
              )}
              {selected.linkedin && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <a href={selected.linkedin} target="_blank" className="text-[#006bff] hover:underline">LinkedIn</a>
                </div>
              )}
            </div>

            {/* Meeting history */}
            {selected.meetings && selected.meetings.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Meeting History ({selected.meetings.length})
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selected.meetings.map((m: Booking) => (
                    <div key={m.id} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 text-xs">
                      <div
                        className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: m.eventType?.color || "#006bff" }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{m.eventType?.name}</p>
                        <p className="text-gray-500">
                          {format(new Date(m.startTime), "MMM d, yyyy · h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1 text-xs" onClick={() => deleteContact(selected.id)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Drawer */}
      {drawerOpen && (
        <AddContactDrawer
          onClose={() => setDrawerOpen(false)}
          onSaved={() => { setDrawerOpen(false); load(); }}
        />
      )}
    </div>
  );
}

/* ─── Add Contact Drawer ─── */
function AddContactDrawer({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", jobTitle: "", company: "", linkedin: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      await contactsApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        jobTitle: form.jobTitle || undefined,
        company: form.company || undefined,
        linkedin: form.linkedin || undefined,
      });
      toast.success("Contact created");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create contact");
    } finally { setSaving(false); }
  };

  const fields = [
    { key: "name",     label: "Full name",            icon: User,      required: true },
    { key: "email",    label: "Email",                 icon: Mail,      required: true },
    { key: "phone",    label: "Phone (Optional)",      icon: Phone },
    { key: "jobTitle", label: "Job title (Optional)",  icon: Briefcase },
    { key: "company",  label: "Company (Optional)",    icon: Building2 },
    { key: "linkedin", label: "LinkedIn (Optional)",   icon: ExternalLink },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[440px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add Contact</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {fields.map(({ key, label, required }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                type={key === "email" ? "email" : "text"}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="input"
                required={required}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>Save contact</Button>
        </div>
      </div>
    </div>
  );
}
