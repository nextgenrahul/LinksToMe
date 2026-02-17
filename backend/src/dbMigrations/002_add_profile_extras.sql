
-- User Links Table
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

-- User Badges Table
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

CREATE UNIQUE INDEX idx_user_badges_unique ON user_badges(user_id, badge_code);
