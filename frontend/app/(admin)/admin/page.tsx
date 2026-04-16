"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { User, Mail, Globe, Save, Shield, Download, Key } from "lucide-react";
import toast from "react-hot-toast";

const TIMEZONES = [
  "Asia/Kolkata", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney", "Pacific/Auckland",
];

export default function AdminPage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@schedulr.dev",
    timezone: "Asia/Kolkata",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save (in a real app, this would call PUT /api/user)
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Profile updated successfully");
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <PageHeader title="Admin center" subtitle="Manage your account and preferences" />

      {/* Profile Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" />
          Profile Information
        </h2>

        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#006bff] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="input"
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="label">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
              className="select"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </section>

      {/* Account Settings */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-400" />
          Account Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Password</p>
              <p className="text-xs text-gray-500">Last changed 30 days ago</p>
            </div>
            <Button variant="secondary" className="text-xs">
              <Key className="w-3.5 h-3.5" /> Change password
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Two-factor authentication</p>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <Button variant="secondary" className="text-xs">Enable</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Login sessions</p>
              <p className="text-xs text-gray-500">1 active session</p>
            </div>
            <Button variant="secondary" className="text-xs">Manage</Button>
          </div>
        </div>
      </section>

      {/* Data Export */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Download className="w-5 h-5 text-gray-400" />
          Data & Privacy
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Export my data</p>
              <p className="text-xs text-gray-500">Download all your scheduling data as CSV</p>
            </div>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => toast.success("Export started. You'll receive an email shortly.")}
            >
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-red-600">Delete account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" className="text-xs">Delete account</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
