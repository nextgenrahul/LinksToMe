import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyLinksApi, createLinkApi, deleteLinkApi } from "../api/links.api";
import type { AddLinkModalProps, LinkCardProp, UserLink } from "../types";
import { PATHS } from "@/constants/paths";
import { Trash2 } from "lucide-react";

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



export function AddLinkModal({ onClose, onAdded }: AddLinkModalProps) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [imageMode, setImageMode] = useState<"auto" | "custom">("auto");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    if (!url.trim()) {
      setErr("Destination URL is required");
      return;
    }
    setSaving(true);
    setErr("");

    try {
      // Form Data preparation to handle text streams alongside physical binary images
      const formData = new FormData();
      formData.append("title", label.trim() || "Untitled Link");
      formData.append("url", url.trim());
      formData.append("imageMode", imageMode);
      
      if (imageMode === "custom" && imageFile) {
        formData.append("icon", imageFile);
      }

      // Replace with your active custom thunk call or direct Axios client connection
      // const res = await apiClient.post("/links", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      // Simulating action behavior for demonstration
      // onAdded(res.data.data);
      
      onClose();
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to preserve digital asset. Ensure URL validity.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 transition-all duration-300">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg p-6 shadow-2xl space-y-6">
        
        {/* Header section */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-md font-bold text-zinc-100 tracking-wide">Add Asset Node</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Publish a routing link to your micro-index.</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Form Body Inputs */}
        <div className="space-y-4">
          
          {/* Component: Icon Detection Mode */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
              Icon Strategy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImageMode("auto")}
                className={`py-2.5 px-4 rounded-md border text-xs font-medium transition-all ${
                  imageMode === "auto"
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100 shadow-sm"
                    : "bg-transparent border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-400"
                }`}
              >
                Auto-Fetch Favicon
              </button>

              <button
                type="button"
                onClick={() => setImageMode("custom")}
                className={`py-2.5 px-4 rounded-md border text-xs font-medium transition-all ${
                  imageMode === "custom"
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100 shadow-sm"
                    : "bg-transparent border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-400"
                }`}
              >
                Custom Asset upload
              </button>
            </div>
          </div>

          {/* Conditional Custom Upload Field */}
          {imageMode === "custom" && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 rounded-md p-4 text-center cursor-pointer transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors block">
                {imageFile ? `✓ Selected: ${imageFile.name}` : "Upload custom vector/image file"}
              </span>
              <span className="text-[10px] text-zinc-600 block mt-1">PNG, JPG up to 2MB</span>
            </div>
          )}

          {/* Label input field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
              Display Label (Optional)
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Enterprise Portfolio"
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-md px-3.5 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition duration-200"
            />
          </div>

          {/* Target URL destination field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
              Destination Link URL *
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/identity"
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-md px-3.5 py-2 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 transition duration-200"
            />
          </div>

          {/* Error warning string boundary */}
          {err && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-md px-3 py-2">
              <p className="text-red-400 text-xs font-medium">{err}</p>
            </div>
          )}
        </div>

        {/* Action Panel Buttons */}
        <div className="flex gap-3 pt-2 border-t border-zinc-900">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md border border-zinc-800 text-zinc-400 text-xs font-medium hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex-1 py-2 rounded-md bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition disabled:opacity-40"
          >
            {saving ? "Processing Engine…" : "Deploy Live Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── Link Card ────────────────────────────────────────────────────────────────

function LinkCard({ link, onDelete, onViewAnalytics }: LinkCardProp) {
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
    <div className="relative group rounded-sm bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 overflow-hidden">
      {/* Ambient glow on hover */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-zinc-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

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
          <span className="inline-block mt-2 text-xs bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 px-2 py-0.5 rounded-sm">
            /r/{link.slug}
          </span>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-4">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
          >
            Visit
          </a>
          <button
            onClick={() => onViewAnalytics(link.id)}
            className="flex-1 text-center text-sm py-2 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
          >
            Analytics
          </button>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-9 h-9 flex items-center justify-center rounded-sm hover:bg-zinc-700 text-zinc-300 transition text-lg"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 rounded-sm bg-zinc-600 text-white text-xs font-semibold hover:bg-zinc-700 transition disabled:opacity-50"
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
        className="px-6 py-2.5 rounded-full bg-zinc-600 text-white text-sm font-semibold hover:bg-zinc-700 transition"
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
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
  },
  {
    id: "3",
    label: "Portfolio",
    url: "https://example.com",
    slug: "portfolio",
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

  useEffect(() => {
    getMyLinksApi()
      .then(setLinks)
      .catch(() => setError("Failed to load links"))
      .finally(() => setLoading(false));
  }, []);
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
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-sm
            bg-zinc-800
            text-white
            text-sm
            font-semibold
            hover:bg-zinc-700
            transition
          "
        >
          <span className="text-lg leading-none">+</span>
          Add Link
        </button>
      </div>

      <div className="mx-auto px-4 sm:px-6 py-6">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>

            <button
              onClick={() => setError("")}
              className="ml-4 flex h-7 w-7 items-center justify-center rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
            >
              ✕
            </button>
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
              <div className="mb-5 p-4 rounded-2xl bg-zinc-950/30 border border-zinc-800/30 flex items-start gap-3">
                <span className="text-zinc-400 text-lg mt-0.5">💡</span>
                <p className="text-sm text-zinc-300">
                  Set a <strong>slug</strong> on each link in DB to activate the
                  public{" "}
                  <code className="text-zinc-400 bg-zinc-950/50 px-1 rounded">
                    /r/:slug
                  </code>{" "}
                  zincirect and start tracking clicks.
                </p>
              </div>
            )}

            <div
              className="
				grid
				grid-cols-1
				sm:grid-cols-1
				md:grid-cols-2
				lg:grid-cols-2
				xl:grid-cols-3
				2xl:grid-cols-4
				gap-4
				"
            >
              {" "}
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onViewAnalytics={handleAnalytics}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
