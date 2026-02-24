import crypto from "crypto";
import { AppError } from "backend/src/shared/utils/AppError";
import { LinksRepository } from "./links.repository";

// ─── Constants ──────────────────────────────────────────────────────────────
const SPAM_WINDOW_SECONDS = 5;
const TRENDING_MULTIPLIER = 1.5;
const SCORE_WEIGHT_RECENT = 0.7;
const SCORE_WEIGHT_AVG = 0.3;

export class LinksService {
    constructor(private readonly repo: LinksRepository) { }

    // ─── Redirect + Click Recording ──────────────────────────────────────────

    /**
     * Core analytics flow for every link click:
     * 1. Resolve slug → URL
     * 2. Hash the client IP (SHA-256)
     * 3. Spam check (same ip_hash + link within SPAM_WINDOW_SECONDS)
     * 4. Insert raw click record
     * 5. Upsert daily aggregation stat
     * 6. Return the destination URL for redirect
     */
    async handleRedirect(
        slug: string,
        rawIp: string | undefined,
        userAgent: string | undefined
    ): Promise<string> {
        // 1. Resolve link
        const link = await this.repo.findLinkBySlug(slug);
        if (!link) {
            throw new AppError("Link not found.", 404);
        }

        // 2. Hash IP (never store raw IP — privacy first)
        const ipHash = rawIp
            ? crypto.createHash("sha256").update(rawIp).digest("hex")
            : null;

        // 3. Spam / duplicate-click prevention
        const isDuplicate =
            ipHash !== null &&
            (await this.repo.isRecentDuplicateClick(
                link.id,
                ipHash,
                SPAM_WINDOW_SECONDS
            ));

        if (!isDuplicate) {
            // 4. Record raw click
            await this.repo.recordClick(link.id, ipHash, userAgent ?? null);

            // 5. Upsert daily stat (atomic +1 for today)
            await this.repo.upsertDailyStat(link.id);
        }

        return link.url;
    }

    // ─── Analytics Query ─────────────────────────────────────────────────────

    /**
     * Returns full analytics for a single link.
     * Verifies ownership before returning data (403 if not owner).
     */
    async getLinkAnalytics(linkId: string, requestingUserId: string) {
        // Ownership check
        const link = await this.repo.findLinkByIdAndUser(linkId, requestingUserId);
        if (!link) {
            throw new AppError(
                "Link not found or you do not have permission to view its analytics.",
                403
            );
        }

        // Fetch all data in parallel
        const [last7Days, movingAvgRows, todayClicks, topLink] = await Promise.all([
            this.repo.getLast7DaysStats(linkId),
            this.repo.getMovingAverage(linkId),
            this.repo.getTodayClicks(linkId),
            this.repo.getTopLinkForUser(requestingUserId),
        ]);

        // Current 7-day moving average (most recent row)
        const currentMovingAvg = movingAvgRows[0]?.moving_avg ?? 0;

        // Total clicks in last 7 days
        const total7DayClicks = last7Days.reduce((sum, r) => sum + r.clicks, 0);

        // 🔥 Trending detection: today > moving_avg * 1.5
        const isTrending =
            currentMovingAvg > 0 &&
            todayClicks > currentMovingAvg * TRENDING_MULTIPLIER;

        // 📊 Ranking score
        const score =
            total7DayClicks * SCORE_WEIGHT_RECENT +
            currentMovingAvg * SCORE_WEIGHT_AVG;

        const isTopLink = topLink?.link_id === linkId;

        return {
            link: {
                id: link.id,
                label: link.label,
                url: link.url,
                slug: link.slug,
            },
            analytics: {
                todayClicks,
                total7DayClicks,
                movingAvg7Day: currentMovingAvg,
                isTrending,
                score: Math.round(score * 100) / 100,
                isTopLink,
                last7Days,
                movingAvgHistory: movingAvgRows.slice(0, 7).reverse(), // last 7 days, oldest → newest
            },
        };
    }
}