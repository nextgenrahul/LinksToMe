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

        const ipHash = rawIp
            ? crypto.createHash("sha256").update(rawIp).digest("hex")
            : null;

    
        const isDuplicate =
            ipHash !== null &&
            (await this.repo.isRecentDuplicateClick(
                link.id,
                ipHash,
                SPAM_WINDOW_SECONDS
            ));

        if (!isDuplicate) {
            await this.repo.recordClick(link.id, ipHash, userAgent ?? null);

            await this.repo.upsertDailyStat(link.id);
        }

        return link.url;
    }

   
    async getLinkAnalytics(linkId: string, requestingUserId: string) {
        
        const link = await this.repo.findLinkByIdAndUser(linkId, requestingUserId);
        if (!link) {
            throw new AppError(
                "Link not found or you do not have permission to view its analytics.",
                403
            );
        }


        const [last7Days, movingAvgRows, todayClicks, topLink] = await Promise.all([
            this.repo.getLast7DaysStats(linkId),
            this.repo.getMovingAverage(linkId),
            this.repo.getTodayClicks(linkId),
            this.repo.getTopLinkForUser(requestingUserId),
        ]);

        
        const currentMovingAvg = movingAvgRows[0]?.moving_avg ?? 0;

      
        const total7DayClicks = last7Days.reduce((sum, r) => sum + r.clicks, 0);

        const isTrending =
            currentMovingAvg > 0 &&
            todayClicks > currentMovingAvg * TRENDING_MULTIPLIER;

      
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
                movingAvgHistory: movingAvgRows.slice(0, 7).reverse(),
            },
        };
    }
}