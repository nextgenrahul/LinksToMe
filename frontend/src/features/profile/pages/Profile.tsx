import apiClient from "@/shared/api/apiClient";
import { useEffect, useState } from "react";
import type { Profile as ProfileType } from "../types";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-zinc-800 animate-pulse ${className ?? ""}`}
    />
  );
}

// ─── Profile Skeleton ─────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="px-6 pb-6">
        <div className="flex justify-between items-end -mt-12 mb-5">
          <Skeleton className="w-28 h-28 rounded-full border-4 border-black" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <div className="flex gap-3">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps {
  profile: ProfileType;
  onClose: () => void;
  onSave: (updated: Partial<ProfileType>) => void;
}

function EditProfileModal({ profile, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.patch("/profile/me", { name, bio, website });
      onSave({ name, bio, website });
      onClose();
    } catch {
      // Keep modal open on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition resize-none"
            />
            <p className="text-xs text-zinc-600 text-right mt-1">{bio.length}/160</p>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">
              Website
            </label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Badge Emoji Map ──────────────────────────────────────────────────────────
const BADGE_EMOJI: Record<string, string> = {
  founder: "🚀",
  verified: "✅",
  og: "👑",
  top_creator: "🌟",
  beta: "🧪",
  contributor: "🤝",
};

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");

  useEffect(() => {
    apiClient
      .get<{ data: ProfileType }>("/profile/me")
      .then((res) => setProfile(res.data.data))
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProfileSkeleton />;

  if (error || !profile)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <p className="text-3xl">⚠️</p>
          <p className="text-zinc-400">{error || "Profile not found"}</p>
        </div>
      </div>
    );

  const tabs = ["Posts", "Replies", "Media", "Likes"];

  return (
    <main className="max-w-2xl mx-auto min-h-screen text-white">

      {/* Edit modal */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={(updated) => setProfile((p) => p ? { ...p, ...updated } : p)}
        />
      )}

      {/* ── Cover Banner ─────────────────────────────────────────── */}
      <div className="h-44 bg-gradient-to-br from-violet-900 via-indigo-900 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.6) 0%, transparent 60%)," +
              "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.5) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* ── Profile Info ──────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pb-0 border-b border-zinc-800">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center overflow-hidden shadow-xl">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl select-none">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {profile.is_verified && (
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="px-5 py-2 rounded-full border border-zinc-600 text-sm font-semibold hover:bg-zinc-800 transition text-white"
          >
            Edit profile
          </button>
        </div>

        {/* Name + handle */}
        <div className="mb-3">
          <h1 className="text-xl font-bold flex items-center gap-1.5">
            {profile.name}
            {profile.is_verified && (
              <span className="text-blue-400 text-base">✓</span>
            )}
          </h1>
          <p className="text-zinc-500 text-sm">@{profile.username}</p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-zinc-200 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
            {profile.bio}
          </p>
        )}

        {/* Website */}
        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-sm mb-3 transition"
          >
            🔗 {profile.website.replace(/^https?:\/\//, "")}
          </a>
        )}

        {/* Interest tags */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.interests.map(({ interest }, i) => (
              <span
                key={i}
                className="text-xs bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-3 py-1 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.badges.map(({ badge_code }, i) => (
              <span
                key={i}
                title={badge_code}
                className="inline-flex items-center gap-1.5 text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full"
              >
                {BADGE_EMOJI[badge_code] ?? "🏅"} {badge_code}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {profile.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {profile.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full hover:border-zinc-500 transition"
              >
                🔗 {link.label || link.url}
              </a>
            ))}
          </div>
        )}

        {/* Followers / Following */}
        <div className="flex gap-5 mb-4 text-sm">
          <span className="text-zinc-400">
            <strong className="text-white font-bold">
              {profile.following_count.toLocaleString()}
            </strong>{" "}
            Following
          </span>
          <span className="text-zinc-400">
            <strong className="text-white font-bold">
              {profile.followers_count.toLocaleString()}
            </strong>{" "}
            Followers
          </span>
        </div>

        {/* Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 text-sm font-medium text-center border-b-2 transition ${
                activeTab === tab
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
        <span className="text-5xl select-none">
          {activeTab === "Posts" ? "✍️" : activeTab === "Media" ? "🖼️" : "💬"}
        </span>
        <p className="text-sm">No {activeTab.toLowerCase()} yet.</p>
      </div>
    </main>
  );
}
