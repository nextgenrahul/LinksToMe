import dbService from "backend/src/config/database";

export interface LinkRow {
    id: string;
    user_id: string;
    label: string | null;
    url: string;
    slug: string | null;
    position: number;
    created_at: Date;
}

export interface DailyStatRow {
    date: string;
    clicks: number;
}

export interface MovingAvgRow {
    date: string;
    clicks: number;
    moving_avg: number;
}

export class LinksRepository {

    // ─── Redirect ──────────────────────────────────────────────────

    async findLinkBySlug(slug: string): Promise<LinkRow | null> {
        const result = await dbService.query<LinkRow>(
            `SELECT id, user_id, label, url, slug, position, created_at
         FROM user_links
        WHERE slug = $1`,
            [slug]
        );
        return result.rows[0] ?? null;
    }

    // ─── Spam Prevention ───────────────────────────────────────────

    /**
     * Returns true if the same ip_hash clicked this link
     * within the last `windowSeconds` seconds.
     */
    async isRecentDuplicateClick(
        linkId: string,
        ipHash: string,
        windowSeconds: number = 5
    ): Promise<boolean> {
        const result = await dbService.query<{ count: string }>(
            `SELECT COUNT(*) AS count
         FROM link_clicks
        WHERE link_id  = $1
          AND ip_hash  = $2
          AND clicked_at >= NOW() - ($3 || ' seconds')::INTERVAL`,
            [linkId, ipHash, windowSeconds]
        );
        return parseInt(result.rows[0]?.count ?? '0', 10) > 0;
    }

    // ─── Recording a Click ─────────────────────────────────────────

    async recordClick(
        linkId: string,
        ipHash: string | null,
        userAgent: string | null
    ): Promise<void> {
        await dbService.query(
            `INSERT INTO link_clicks (link_id, ip_hash, user_agent)
       VALUES ($1, $2, $3)`,
            [linkId, ipHash, userAgent]
        );
    }

    /**
     * Atomically increments today's click count.
     * Creates the row if it doesn't exist yet.
     */
    async upsertDailyStat(linkId: string): Promise<void> {
        await dbService.query(
            `INSERT INTO link_daily_stats (link_id, date, clicks)
            VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (link_id, date)
       DO UPDATE SET clicks = link_daily_stats.clicks + 1`,
            [linkId]
        );
    }

    // ─── Analytics Reads ───────────────────────────────────────────

    /** Sum of clicks per day for the last 7 days. */
    async getLast7DaysStats(linkId: string): Promise<DailyStatRow[]> {
        const result = await dbService.query<DailyStatRow>(
            `SELECT date::TEXT, clicks
         FROM link_daily_stats
        WHERE link_id = $1
          AND date >= CURRENT_DATE - INTERVAL '6 days'
        ORDER BY date ASC`,
            [linkId]
        );
        return result.rows;
    }

    /**
     * 7-day rolling average using a window function.
     * Returns one row per day that has data.
     */
    async getMovingAverage(linkId: string): Promise<MovingAvgRow[]> {
        const result = await dbService.query<MovingAvgRow>(
            `SELECT
           date::TEXT,
           clicks,
           ROUND(
               AVG(clicks) OVER (
                   PARTITION BY link_id
                   ORDER BY date
                   ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
               )::NUMERIC,
               2
           )::FLOAT AS moving_avg
         FROM link_daily_stats
        WHERE link_id = $1
        ORDER BY date DESC
        LIMIT 30`,
            [linkId]
        );
        return result.rows;
    }

    /** Today's click count (for trending detection). */
    async getTodayClicks(linkId: string): Promise<number> {
        const result = await dbService.query<{ clicks: number }>(
            `SELECT COALESCE(clicks, 0) AS clicks
         FROM link_daily_stats
        WHERE link_id = $1
          AND date = CURRENT_DATE`,
            [linkId]
        );
        return result.rows[0]?.clicks ?? 0;
    }

    /** Top performing link for a user (last 7 days). */
    async getTopLinkForUser(userId: string): Promise<{ link_id: string; total_clicks: number } | null> {
        const result = await dbService.query<{ link_id: string; total_clicks: number }>(
            `SELECT lds.link_id, SUM(lds.clicks) AS total_clicks
         FROM link_daily_stats lds
         JOIN user_links ul ON ul.id = lds.link_id
        WHERE ul.user_id = $1
          AND lds.date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY lds.link_id
        ORDER BY total_clicks DESC
        LIMIT 1`,
            [userId]
        );
        return result.rows[0] ?? null;
    }

    /** Verify a link belongs to a given user (ownership check). */
    async findLinkByIdAndUser(linkId: string, userId: string): Promise<LinkRow | null> {
        const result = await dbService.query<LinkRow>(
            `SELECT id, user_id, label, url, slug, position, created_at
         FROM user_links
        WHERE id = $1 AND user_id = $2`,
            [linkId, userId]
        );
        return result.rows[0] ?? null;
    }
}