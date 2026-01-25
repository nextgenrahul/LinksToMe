-- Enable case-insensitive text for emails (Essential for Auth)
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
    -- Identity
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


-- 8. Essential Indexes for Billionaire-Grade Speed
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_status ON users(account_status);




CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- this function is linked to pgcrypto extension
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
