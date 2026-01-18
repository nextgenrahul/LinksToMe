-- Enable case-insensitive text for emails (Essential for Auth)
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
    -- 1. Identity
    -- Use BIGSERIAL for massive scale (replaces VARCHAR id if you want auto-increment)
    -- If using UUIDs, use the UUID type. For now, keeping your VARCHAR.
    id VARCHAR(255) PRIMARY KEY,
    
    -- 2. Authentication & Identifiers
    email CITEXT NOT NULL UNIQUE, -- CITEXT handles 'User@Email.com' vs 'user@email.com'
    username VARCHAR(30) NOT NULL UNIQUE, -- Standard social length is 30
    phone VARCHAR(20) UNIQUE, -- Added Phone Number
    password TEXT NOT NULL, -- Hashes can be longer than 255
    name VARCHAR(100) NOT NULL,

    -- 3. Birthday (Optimized to SMALLINT to save 50% storage space)
    birth_day SMALLINT NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
    birth_month SMALLINT NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
    birth_year SMALLINT NOT NULL 
        CHECK (birth_year BETWEEN 1900 AND 2100),

    -- 4. Profile Details
    bio VARCHAR(160), -- Matches X (Twitter) standard
    profile_picture_url TEXT,
    website VARCHAR(255),

    -- 5. Status & Privacy
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    account_status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (account_status IN ('active', 'suspended', 'deleted')),

    -- 6. Social Metrics (Use BIGINT if you expect millions of followers)
    posts_count INT NOT NULL DEFAULT 0,
    followers_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,

    -- 7. Verification & Audit
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMPTZ, -- Use TIMESTAMPTZ to handle timezone differences
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Essential Indexes for Billionaire-Grade Speed
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);