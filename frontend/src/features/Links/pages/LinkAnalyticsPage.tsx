import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLinkAnalyticsApi } from "../api/analytics.api";
import type { LinkAnalytics } from "../types/analytics.types";
import { BarChart, SparkLine } from "../components/AnalyticsCharts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getToken(): string | null {
  // Pull from localStorage (adjust key if your Redux persist uses a different one)
  try {
    const raw = localStorage.getItem("token") ?? localStorage.getItem("access_token");
    if (raw) return raw;
    // Falls back to Redux persist key
    const persisted = localStorage.getItem("persist:auth");
    if (persisted) {
      const parsed = JSON.parse(persisted);
      return JSON.parse(parsed.token ?? "null");
    }
  } catch {
    // ignore
  }
  return null;
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string; // tailwind bg class for the glow dot
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent = "bg-violet-500" }) => (
  <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col gap-1 overflow-hidden">
    {/* Ambient glow */}
    <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 ${accent}`} />
    <span className="text-xs text-zinc-500 uppercase tracking-widest">{label}</span>
    <span className="text-3xl font-bold text-white">{value}</span>
    {sub && <span className="text-xs text-zinc-500">{sub}</span>}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LinkAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const result = await getLinkAnalyticsApi(id, token);
        setData(result);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // ── States ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-3xl">⚠️</p>
          <p className="text-white font-semibold">{error ?? "No data found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-5 py-2 rounded-full bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const { link, analytics } = data;
  const {
    todayClicks,
    total7DayClicks,
    movingAvg7Day,
    isTrending,
    score,
    isTopLink,
    last7Days,
    movingAvgHistory,
  } = analytics;

  // Fill missing days in last7Days so the chart always shows 7 bars
  const filledDays = (() => {
    const map = Object.fromEntries(last7Days.map((d) => [d.date, d.clicks]));
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, clicks: map[key] ?? 0 });
    }
    return result;
  })();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/60 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition text-zinc-400"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">{link.label ?? link.url}</h1>
          <p className="text-xs text-zinc-500 truncate">{link.url}</p>
        </div>
        {/* Badges */}
        <div className="flex gap-2 shrink-0">
          {isTrending && (
            <span className="text-xs bg-orange-500/20 border border-orange-500/40 text-orange-400 px-2.5 py-1 rounded-full font-medium">
              🔥 Trending
            </span>
          )}
          {isTopLink && (
            <span className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-2.5 py-1 rounded-full font-medium">
              🏆 Top Link
            </span>
          )}
          {link.slug && (
            <span className="hidden sm:inline text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">
              /r/{link.slug}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* ── Stats Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Today"
            value={fmt(todayClicks)}
            sub="clicks so far"
            accent="bg-violet-500"
          />
          <StatCard
            label="Last 7 Days"
            value={fmt(total7DayClicks)}
            sub="total clicks"
            accent="bg-blue-500"
          />
          <StatCard
            label="Avg / Day"
            value={movingAvg7Day.toFixed(1)}
            sub="7-day moving avg"
            accent="bg-emerald-500"
          />
          <StatCard
            label="Score"
            value={score.toFixed(1)}
            sub="ranking score"
            accent="bg-pink-500"
          />
        </div>

        {/* ── Bar Chart — Daily Clicks ─────────────────────────────── */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">Daily Clicks</h2>
              <p className="text-xs text-zinc-500">Last 7 days</p>
            </div>
            <span className="text-xs text-zinc-600">
              Peak: {Math.max(...filledDays.map((d) => d.clicks))}
            </span>
          </div>
          <BarChart data={filledDays} height={100} />
          {/* Day labels */}
          <div className="flex justify-between text-[10px] text-zinc-600 px-0.5">
            {filledDays.map((d) => (
              <span key={d.date}>
                {new Date(d.date + "T00:00:00").toLocaleDateString("en", { weekday: "short" })}
              </span>
            ))}
          </div>
        </div>

        {/* ── Spark Line — Moving Average ──────────────────────────── */}
        {movingAvgHistory.length >= 2 && (
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
            <div>
              <h2 className="font-semibold text-white">7-Day Moving Average</h2>
              <p className="text-xs text-zinc-500">Trend signal — smoothed over rolling window</p>
            </div>
            <SparkLine data={movingAvgHistory} height={70} />
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>{movingAvgHistory[0]?.date}</span>
              <span>{movingAvgHistory[movingAvgHistory.length - 1]?.date}</span>
            </div>
          </div>
        )}

        {/* ── Trending Analysis ────────────────────────────────────── */}
        <div
          className={`rounded-2xl border p-5 ${
            isTrending
              ? "bg-orange-950/20 border-orange-500/30"
              : "bg-zinc-900 border-zinc-800"
          }`}
        >
          <h2 className="font-semibold text-white mb-3">Trend Analysis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Today's clicks</span>
              <span className="font-medium text-white">{todayClicks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">7-day moving avg</span>
              <span className="font-medium text-white">{movingAvg7Day.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Trending threshold (avg × 1.5)</span>
              <span className="font-medium text-white">{(movingAvg7Day * 1.5).toFixed(2)}</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Status</span>
              <span
                className={`font-semibold ${isTrending ? "text-orange-400" : "text-zinc-400"}`}
              >
                {isTrending ? "🔥 Trending" : "Stable"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Ranking Score Explained ──────────────────────────────── */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
          <h2 className="font-semibold text-white mb-3">Ranking Score</h2>
          <p className="text-xs text-zinc-500 mb-4">
            score = (7-day clicks × 0.7) + (moving avg × 0.3)
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-full bg-zinc-800 h-2">
                <div
                  className="h-2 rounded-full bg-violet-500"
                  style={{
                    width: `${Math.min(
                      ((total7DayClicks * 0.7) / Math.max(score, 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-zinc-400 w-24 text-right">
                {(total7DayClicks * 0.7).toFixed(1)} <span className="text-zinc-600">(recent)</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-full bg-zinc-800 h-2">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(
                      ((movingAvg7Day * 0.3) / Math.max(score, 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-zinc-400 w-24 text-right">
                {(movingAvg7Day * 0.3).toFixed(1)} <span className="text-zinc-600">(avg)</span>
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
            <span className="text-zinc-400 text-sm">Final Score</span>
            <span className="text-2xl font-bold text-white">{score.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Raw 7-Day Table ──────────────────────────────────────── */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold text-white">Daily Breakdown</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                <th className="px-5 py-3 text-left tracking-wider">Date</th>
                <th className="px-5 py-3 text-right tracking-wider">Clicks</th>
                <th className="px-5 py-3 text-right tracking-wider hidden sm:table-cell">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {filledDays.map((row, i) => {
                const pct =
                  total7DayClicks > 0
                    ? ((row.clicks / total7DayClicks) * 100).toFixed(1)
                    : "0";
                return (
                  <tr
                    key={row.date}
                    className={`border-b border-zinc-800/60 hover:bg-zinc-800/30 transition ${
                      i === filledDays.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-5 py-3 text-zinc-300">
                      {new Date(row.date + "T00:00:00").toLocaleDateString("en", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-white">
                      {row.clicks}
                    </td>
                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-zinc-800">
                          <div
                            className="h-1.5 rounded-full bg-violet-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Footer note ─────────────────────────────────────────── */}
        <p className="text-center text-xs text-zinc-700 pb-4">
          Data updates in real-time on every redirect hit · Spam clicks filtered (5s window)
        </p>
      </div>
    </div>
  );
}
