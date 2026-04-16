CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    -- Authentication
    email CITEXT NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,


    -- Birthday
    birth_day SMALLINT NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
    birth_month SMALLINT NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
    birth_year SMALLINT NOT NULL CHECK (birth_year BETWEEN 1900 AND 2100),

    -- Profile
    bio VARCHAR(160),
    profile_picture_url TEXT,
    website VARCHAR(255),

    -- Status & Privacy
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    account_status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (account_status IN ('active', 'suspended', 'deleted')),

    deleted_at TIMESTAMPTZ,

    -- Metrics
    posts_count INT NOT NULL DEFAULT 0,
    followers_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,

    -- Audit
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Refresh Tokens

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_refresh_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_refresh_tokens_user_id
ON refresh_tokens(user_id);

CREATE UNIQUE INDEX idx_refresh_tokens_token_hash
ON refresh_tokens(token_hash);



-- User Interests
CREATE TABLE user_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_interests_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_interests_unique
ON user_interests(user_id, interest);


-- User Links
CREATE TABLE user_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    label VARCHAR(50),
    url TEXT NOT NULL,
    position SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user_links_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_links_user_id ON user_links(user_id);


-- User Badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    badge_code VARCHAR(50),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user_badges_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_badges_unique
ON user_badges(user_id, badge_code);

-- Add slug to links
ALTER TABLE user_links
ADD COLUMN IF NOT EXISTS slug VARCHAR(20) UNIQUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_links_slug
ON user_links(slug);

-- Raw Click Log
CREATE TABLE IF NOT EXISTS link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID NOT NULL,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash TEXT,
    user_agent TEXT,

    CONSTRAINT fk_link_clicks_link
        FOREIGN KEY (link_id)
        REFERENCES user_links(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id
ON link_clicks(link_id);

CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at
ON link_clicks(clicked_at);

CREATE INDEX IF NOT EXISTS idx_link_clicks_dedup
ON link_clicks(link_id, ip_hash, clicked_at);

-- Daily Aggregation
CREATE TABLE IF NOT EXISTS link_daily_stats (
    link_id UUID NOT NULL,
    date DATE NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (link_id, date),

    CONSTRAINT fk_link_daily_stats_link
        FOREIGN KEY (link_id)
        REFERENCES user_links(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_link_daily_stats_date
ON link_daily_stats(date);


-- Users Achievement

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    proof_url TEXT,
    category VARCHAR(50),
    visibility VARCHAR(10) DEFAULT 'public'
        CHECK (visibility IN ('public', 'private')),
    achieved_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
