import type { LinkAnalytics } from "../types/analytics.types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export async function getLinkAnalyticsApi(
    linkId: string,
    token: string
): Promise<LinkAnalytics> {
    const res = await fetch(`${API_BASE}/links/${linkId}/analytics`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Failed to load analytics");
    }

    const json = await res.json();
    return json.data as LinkAnalytics;
}
