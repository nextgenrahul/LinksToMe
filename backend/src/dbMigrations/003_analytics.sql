-- ============================================================
-- Migration 003: Link Analytics Engine
-- ============================================================

-- 1. Add slug column to user_links for public redirect URLs
ALTER TABLE user_links ADD COLUMN IF NOT EXISTS slug VARCHAR(20) UNIQUE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_links_slug ON user_links(slug);


-- 2. Raw click log
--    - ip_hash: SHA-256 of client IP (never store raw IP)
--    - user_agent: for future device/browser analysis
CREATE TABLE IF NOT EXISTS link_clicks (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id     UUID        NOT NULL,
    clicked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash     TEXT,
    user_agent  TEXT,

    CONSTRAINT fk_link_clicks_link
        FOREIGN KEY (link_id)
        REFERENCES user_links(id)
        ON DELETE CASCADE
);

-- Indexes for analytics queries and spam-prevention lookup
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id   ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks(clicked_at);
-- Composite for duplicate-click check: (link_id, ip_hash, clicked_at)
CREATE INDEX IF NOT EXISTS idx_link_clicks_dedup
    ON link_clicks(link_id, ip_hash, clicked_at);


-- 3. Daily aggregation table
--    Upserted on every valid click — fast reads, no full-table scans
CREATE TABLE IF NOT EXISTS link_daily_stats (
    link_id UUID    NOT NULL,
    date    DATE    NOT NULL,
    clicks  INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (link_id, date),

    CONSTRAINT fk_link_daily_stats_link
        FOREIGN KEY (link_id)
        REFERENCES user_links(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_link_daily_stats_date ON link_daily_stats(date);
