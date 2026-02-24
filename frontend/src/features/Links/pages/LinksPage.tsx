import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyLinksApi, createLinkApi, deleteLinkApi } from "../api/links.api";
import type { UserLink } from "../types";
import { PATHS } from "@/constants/paths";

// ─── Platform icon guesser ────────────────────────────────────────────────────
function getPlatformIcon(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("github"))
    return "https://cdn.simpleicons.org/github/white";
  if (lower.includes("instagram"))
    return "https://cdn.simpleicons.org/instagram/white";
  if (lower.includes("linkedin"))
    return "https://cdn.simpleicons.org/linkedin/white";
  if (lower.includes("twitter") || lower.includes("x.com"))
    return "https://cdn.simpleicons.org/x/white";
  if (lower.includes("youtube"))
    return "https://cdn.simpleicons.org/youtube/white";
  if (lower.includes("facebook"))
    return "https://cdn.simpleicons.org/facebook/white";
  if (lower.includes("tiktok"))
    return "https://cdn.simpleicons.org/tiktok/white";
  if (lower.includes("discord"))
    return "https://cdn.simpleicons.org/discord/white";
  if (lower.includes("twitch"))
    return "https://cdn.simpleicons.org/twitch/white";
  return "https://cdn.simpleicons.org/link/white";
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-zinc-800 animate-pulse ${className ?? ""}`}
    />
  );
}

// ─── Add Link Modal ───────────────────────────────────────────────────────────
interface AddLinkModalProps {
  onClose: () => void;
  onAdded: (link: UserLink) => void;
}

function AddLinkModal({ onClose, onAdded }: AddLinkModalProps) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleAdd = async () => {
    if (!url.trim()) {
      setErr("URL is required");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const link = await createLinkApi({
        label: label || undefined,
        url: url.trim(),
      });
      onAdded(link);
      onClose();
    } catch {
      setErr("Failed to create link. Make sure the URL is valid.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Add New Link</h2>
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
              Label (optional)
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. GitHub, Portfolio"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">
              URL *
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/yourname"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
          {err && <p className="text-red-400 text-xs">{err}</p>}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex-1 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition disabled:opacity-50"
          >
            {saving ? "Adding…" : "Add Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Link Card ────────────────────────────────────────────────────────────────
interface LinkCardProps {
  link: UserLink;
  onDelete: (id: string) => void;
  onViewAnalytics: (id: string) => void;
}

function LinkCard({ link, onDelete, onViewAnalytics }: LinkCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const icon = getPlatformIcon(link.url);
  const displayLabel = link.label || link.url;
  const hostname = (() => {
    try {
      return new URL(link.url).hostname.replace("www.", "");
    } catch {
      return link.url;
    }
  })();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLinkApi(link.id);
      onDelete(link.id);
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 overflow-hidden">
      {/* Ambient glow on hover */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-violet-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* Platform icon bubble */}
      <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
        <img
          src={icon}
          alt=""
          className="w-4 h-4 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="p-5 pr-14">
        {/* Title */}
        <h3 className="font-semibold text-white text-base truncate pr-2">
          {displayLabel}
        </h3>
        <p className="text-zinc-500 text-xs mt-0.5 truncate">{hostname}</p>

        {link.slug && (
          <span className="inline-block mt-2 text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
            /r/{link.slug}
          </span>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-4">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
          >
            Visit ↗
          </a>
          <button
            onClick={() => onViewAnalytics(link.id)}
            className="flex-1 text-center text-sm py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-600/30 text-violet-400 transition"
          >
            📊 Analytics
          </button>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition text-lg"
              title="Delete"
            >
              🗑
            </button>
          ) : (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? "…" : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-5">
      <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl">
        🔗
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">No links yet</h3>
        <p className="text-zinc-500 text-sm mt-1">
          Add your first link and start tracking clicks
        </p>
      </div>
      <button
        onClick={onAdd}
        className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition"
      >
        + Add your first link
      </button>
    </div>
  );
}

const DEFAULT_LINKS: UserLink[] = [
  {
    id: "1",
    label: "GitHub",
    url: "https://github.com",
    slug: "github",
  },
  {
    id: "2",
    label: "LinkedIn",
    url: "https://linkedin.com",
    slug: "linkedin",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
];
// ─── Main Links Page ──────────────────────────────────────────────────────────
export default function LinksPage() {
  const [links, setLinks] = useState<UserLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   getMyLinksApi()
  //     .then(setLinks)
  //     .catch(() => setError("Failed to load links"))
  //     .finally(() => setLoading(false));
  // }, []);
  useEffect(() => {
    getMyLinksApi()
      .then((data) => {
        if (!data || data.length === 0) {
          setLinks(DEFAULT_LINKS); // fallback if empty
        } else {
          setLinks(data);
        }
      })
      .catch(() => {
        setLinks(DEFAULT_LINKS); // fallback if API fails
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));
  const handleAdded = (link: UserLink) => setLinks((prev) => [link, ...prev]);
  const handleAnalytics = (id: string) =>
    navigate(`${PATHS.LINKS}/${id}/analytics`);

  return (
    <div className="min-h-screen bg-black text-white">
      {addOpen && (
        <AddLinkModal onClose={() => setAddOpen(false)} onAdded={handleAdded} />
      )}

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/70 border-b border-zinc-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">My Links</h1>
          {!loading && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {links.length} {links.length === 1 ? "link" : "links"}
            </p>
          )}
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition shadow-lg shadow-violet-500/20"
        >
          <span className="text-lg leading-none">+</span> Add Link
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-3"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && links.length === 0 && (
          <EmptyState onAdd={() => setAddOpen(true)} />
        )}

        {/* Links grid */}
        {!loading && links.length > 0 && (
          <>
            {/* Analytics hint banner — shown when user has links but no slugs */}
            {links.every((l) => !l.slug) && (
              <div className="mb-5 p-4 rounded-2xl bg-violet-950/30 border border-violet-800/30 flex items-start gap-3">
                <span className="text-violet-400 text-lg mt-0.5">💡</span>
                <p className="text-sm text-violet-300">
                  Set a <strong>slug</strong> on each link in DB to activate the
                  public{" "}
                  <code className="text-violet-400 bg-violet-950/50 px-1 rounded">
                    /r/:slug
                  </code>{" "}
                  redirect and start tracking clicks.
                </p>
              </div>
            )}

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onViewAnalytics={handleAnalytics}
                />
              ))}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
