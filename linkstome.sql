CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "username" varchar(30) UNIQUE NOT NULL,
  "email" citext UNIQUE,
  "phone" varchar(20) UNIQUE,
  "password_hash" text NOT NULL,
  "display_name" varchar(100),
  "bio" text,
  "profile_image_url" text,
  "cover_image_url" text,
  "is_private" boolean DEFAULT false,
  "status" varchar(20) DEFAULT 'active',
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "user_links" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "label" varchar(50),
  "url" text NOT NULL,
  "position" smallint DEFAULT 0,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "user_interests" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "interest" varchar(100) NOT NULL
);

CREATE TABLE "user_badges" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "badge_code" varchar(50),
  "assigned_at" timestamp DEFAULT (now())
);

CREATE TABLE "auth_providers" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "provider" varchar(20),
  "provider_user_id" text NOT NULL,
  "access_token" text,
  "refresh_token" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" bigint NOT NULL,
  "refresh_token" text NOT NULL,
  "device_info" jsonb,
  "ip_address" inet,
  "last_active" timestamp DEFAULT (now()),
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "two_factor_auth" (
  "user_id" bigint PRIMARY KEY,
  "type" varchar(10),
  "secret" text,
  "phone_number" varchar(20),
  "is_enabled" boolean DEFAULT false,
  "last_verified_at" timestamp
);

CREATE TABLE "privacy_settings" (
  "user_id" bigint PRIMARY KEY,
  "allow_message_from" varchar(20) DEFAULT 'followers',
  "show_activity_status" boolean DEFAULT true,
  "searchable" boolean DEFAULT true,
  "taggable" boolean DEFAULT true
);

CREATE TABLE "posts" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "content" text,
  "visibility" varchar(20) DEFAULT 'public',
  "parent_post_id" bigint,
  "quote_post_id" bigint,
  "scheduled_at" timestamp,
  "is_draft" boolean DEFAULT false,
  "ai_caption_suggestion" text,
  "language" varchar(10),
  "hashtags" text[],
  "mentions" bigint[],
  "tsv" tsvector,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "published_at" timestamp,
  "status" varchar(20) DEFAULT 'active'
);

CREATE TABLE "post_media" (
  "id" bigserial PRIMARY KEY,
  "post_id" bigint NOT NULL,
  "type" varchar(10),
  "media_url" text NOT NULL,
  "thumbnail_url" text,
  "width" int,
  "height" int,
  "duration_seconds" int,
  "position" smallint DEFAULT 0,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "post_polls" (
  "id" bigserial PRIMARY KEY,
  "post_id" bigint UNIQUE NOT NULL,
  "question" text NOT NULL,
  "expires_at" timestamp,
  "allow_multiple" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "post_poll_options" (
  "id" bigserial PRIMARY KEY,
  "poll_id" bigint NOT NULL,
  "option_text" text NOT NULL,
  "vote_count" int DEFAULT 0
);

CREATE TABLE "post_poll_votes" (
  "poll_id" bigint NOT NULL,
  "option_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "voted_at" timestamp DEFAULT (now())
);

CREATE TABLE "post_visibility_custom" (
  "post_id" bigint NOT NULL,
  "allowed_user_id" bigint NOT NULL
);

CREATE TABLE "post_reactions" (
  "post_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "emoji" varchar(30) NOT NULL,
  "reacted_at" timestamp DEFAULT (now())
);

CREATE TABLE "user_timelines" (
  "user_id" bigint NOT NULL,
  "post_id" bigint NOT NULL,
  "origin_user_id" bigint,
  "created_at" timestamp NOT NULL,
  "inserted_at" timestamp DEFAULT (now()),
  "visibility" varchar(20),
  "score" double,
  PRIMARY KEY ("user_id", "post_id")
);

CREATE TABLE "feed_candidates" (
  "user_id" bigint NOT NULL,
  "post_id" bigint NOT NULL,
  "candidate_reason" varchar(50),
  "created_at" timestamp DEFAULT (now()),
  "feature_vector" jsonb,
  PRIMARY KEY ("user_id", "post_id")
);

CREATE TABLE "engagement_events" (
  "id" bigserial PRIMARY KEY,
  "user_id" bigint,
  "post_id" bigint,
  "event_type" varchar(30),
  "event_value" jsonb,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "user_signals" (
  "user_id" bigint PRIMARY KEY,
  "last_active" timestamp,
  "interests" jsonb,
  "following_count" int,
  "follower_count" int,
  "signal_version" int,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "post_features" (
  "post_id" bigint PRIMARY KEY,
  "author_id" bigint,
  "created_at" timestamp,
  "engagement_1h" bigint DEFAULT 0,
  "engagement_24h" bigint DEFAULT 0,
  "language" varchar(10),
  "topics" jsonb,
  "popularity_score" double DEFAULT 0,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "trending_topics" (
  "topic" text PRIMARY KEY,
  "score" double,
  "window_start" timestamp,
  "window_end" timestamp,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "notification_types" (
  "code" varchar(50) PRIMARY KEY,
  "category" varchar(50),
  "aggregate_window" interval,
  "description" text
);

CREATE TABLE "notifications" (
  "id" bigserial PRIMARY KEY,
  "recipient_id" bigint NOT NULL,
  "actor_id" bigint,
  "type_code" varchar(50) NOT NULL,
  "object_type" varchar(50),
  "object_id" bigint,
  "payload" jsonb DEFAULT ('{}'),
  "is_grouped" boolean DEFAULT false,
  "group_key" text,
  "created_at" timestamp DEFAULT (now()),
  "delivered_at" timestamp,
  "read_at" timestamp,
  "status" varchar(20) DEFAULT 'active'
);

CREATE TABLE "notification_preferences" (
  "user_id" bigint PRIMARY KEY,
  "mute_all" boolean DEFAULT false,
  "mute_push" boolean DEFAULT false,
  "mute_email" boolean DEFAULT true,
  "channels" jsonb DEFAULT ('{}'),
  "quiet_hours" jsonb,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "notification_dedup" (
  "key" text PRIMARY KEY,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "follows" (
  "follower_id" bigint NOT NULL,
  "followee_id" bigint NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "status" smallint DEFAULT 1,
  "source" varchar(50),
  PRIMARY KEY ("follower_id", "followee_id")
);

CREATE TABLE "user_blocks" (
  "blocker_id" bigint NOT NULL,
  "blocked_id" bigint NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "reason" text,
  PRIMARY KEY ("blocker_id", "blocked_id")
);

CREATE TABLE "user_mutes" (
  "user_id" bigint NOT NULL,
  "target_user_id" bigint NOT NULL,
  "mute_type" varchar(20) NOT NULL,
  "expires_at" timestamp,
  "created_at" timestamp DEFAULT (now()),
  PRIMARY KEY ("user_id", "target_user_id", "mute_type")
);

CREATE TABLE "user_follow_counters" (
  "user_id" bigint PRIMARY KEY,
  "follower_count" bigint DEFAULT 0,
  "following_count" bigint DEFAULT 0,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "follow_suggestions" (
  "user_id" bigint NOT NULL,
  "suggested_user_id" bigint NOT NULL,
  "score" double NOT NULL,
  "reason" jsonb,
  "computed_at" timestamp DEFAULT (now()),
  PRIMARY KEY ("user_id", "suggested_user_id")
);

CREATE TABLE "conversations" (
  "id" bigserial PRIMARY KEY,
  "type" varchar(10) NOT NULL,
  "title" text,
  "created_by" bigint,
  "is_encrypted" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "conversation_members" (
  "conversation_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "role" varchar(20) DEFAULT 'member',
  "joined_at" timestamp DEFAULT (now()),
  "muted_until" timestamp,
  "unread_count" bigint DEFAULT 0,
  PRIMARY KEY ("conversation_id", "user_id")
);

CREATE TABLE "messages" (
  "id" bigserial PRIMARY KEY,
  "conversation_id" bigint NOT NULL,
  "sender_id" bigint,
  "content" text,
  "content_type" varchar(20) DEFAULT 'text',
  "attachments" jsonb,
  "reply_to" bigint,
  "created_at" timestamp DEFAULT (now()),
  "edited_at" timestamp,
  "status" varchar(20) DEFAULT 'sent'
);

CREATE TABLE "message_reads" (
  "message_id" bigint NOT NULL,
  "conversation_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "read_at" timestamp DEFAULT (now()),
  PRIMARY KEY ("message_id", "user_id")
);

CREATE TABLE "message_reactions" (
  "message_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "emoji" varchar(30) NOT NULL,
  "reacted_at" timestamp DEFAULT (now()),
  PRIMARY KEY ("message_id", "user_id", "emoji")
);

CREATE TABLE "message_attachments" (
  "id" bigserial PRIMARY KEY,
  "message_id" bigint,
  "uploader_id" bigint,
  "mime_type" varchar(100),
  "s3_url" text,
  "thumbnail_url" text,
  "size_bytes" bigint,
  "width" int,
  "height" int,
  "duration_seconds" int,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "post_daily_metrics" (
  "post_id" BIGINT NOT NULL,
  "day" DATE NOT NULL,
  "views" BIGINT DEFAULT 0,
  "impressions" BIGINT DEFAULT 0,
  "likes" BIGINT DEFAULT 0,
  "saves" BIGINT DEFAULT 0,
  "shares" BIGINT DEFAULT 0,
  "comments" BIGINT DEFAULT 0,
  "primary" key(post_id,day)
);

CREATE TABLE "user_daily_metrics" (
  "user_id" BIGINT NOT NULL,
  "day" DATE NOT NULL,
  "followers_gained" INT DEFAULT 0,
  "followers_lost" INT DEFAULT 0,
  "posts_count" INT DEFAULT 0,
  "primary" key(user_id,day)
);

CREATE TABLE "user_rolling_insights" (
  "user_id" BIGINT PRIMARY KEY,
  "last_7d_engagement_rate" "DOUBLE",
  "last_30d_engagement_rate" "DOUBLE",
  "avg_daily_posts_7d" "DOUBLE",
  "updated_at" TIMESTAMP DEFAULT (now())
);

CREATE UNIQUE INDEX ON "user_interests" ("user_id", "interest");

CREATE UNIQUE INDEX ON "user_badges" ("user_id", "badge_code");

CREATE UNIQUE INDEX ON "auth_providers" ("provider", "provider_user_id");

CREATE UNIQUE INDEX ON "post_poll_votes" ("poll_id", "user_id");

CREATE UNIQUE INDEX ON "post_visibility_custom" ("post_id", "allowed_user_id");

CREATE UNIQUE INDEX ON "post_reactions" ("post_id", "user_id", "emoji");

CREATE INDEX ON "user_timelines" ("user_id", "inserted_at");

CREATE INDEX ON "feed_candidates" ("user_id", "created_at");

CREATE INDEX ON "engagement_events" ("post_id", "created_at");

CREATE INDEX ON "engagement_events" ("user_id", "created_at");

CREATE INDEX ON "post_features" ("popularity_score");

CREATE INDEX ON "notifications" ("recipient_id", "created_at");

CREATE INDEX ON "notifications" ("recipient_id", "read_at");

CREATE INDEX ON "follows" ("followee_id");

CREATE INDEX ON "follows" ("follower_id");

CREATE INDEX ON "user_blocks" ("blocker_id");

CREATE INDEX ON "follow_suggestions" ("user_id", "score");

CREATE INDEX ON "conversation_members" ("user_id");

CREATE INDEX ON "messages" ("conversation_id", "created_at");

CREATE INDEX ON "message_reads" ("user_id", "conversation_id", "read_at");

CREATE INDEX ON "message_attachments" ("message_id");

COMMENT ON COLUMN "users"."username" IS 'Alphanumeric + underscores only';

COMMENT ON COLUMN "users"."email" IS 'Case-insensitive email';

COMMENT ON COLUMN "users"."phone" IS 'User phone number';

COMMENT ON COLUMN "users"."password_hash" IS 'Hashed password';

COMMENT ON COLUMN "users"."status" IS 'active | suspended | deleted';

COMMENT ON COLUMN "user_links"."user_id" IS 'Foreign key to users';

COMMENT ON COLUMN "user_links"."label" IS 'Label, e.g. GitHub, LinkedIn';

COMMENT ON COLUMN "user_links"."position" IS 'Order of links on profile';

COMMENT ON COLUMN "auth_providers"."provider" IS 'google | github | apple';

COMMENT ON COLUMN "sessions"."device_info" IS 'Device metadata';

COMMENT ON COLUMN "sessions"."ip_address" IS 'User IP address';

COMMENT ON COLUMN "two_factor_auth"."type" IS 'totp | sms';

COMMENT ON COLUMN "privacy_settings"."allow_message_from" IS 'everyone | followers | none';

COMMENT ON COLUMN "posts"."user_id" IS 'Post creator';

COMMENT ON COLUMN "posts"."content" IS 'Main text content of the post';

COMMENT ON COLUMN "posts"."visibility" IS 'public | followers | close_friends | custom';

COMMENT ON COLUMN "posts"."parent_post_id" IS 'Reply/Thread reference';

COMMENT ON COLUMN "posts"."quote_post_id" IS 'Quoted post reference';

COMMENT ON COLUMN "posts"."scheduled_at" IS 'For scheduled publishing';

COMMENT ON COLUMN "posts"."ai_caption_suggestion" IS 'AI-generated caption';

COMMENT ON COLUMN "posts"."hashtags" IS 'Extracted hashtags array';

COMMENT ON COLUMN "posts"."mentions" IS 'Array of mentioned user ids';

COMMENT ON COLUMN "posts"."tsv" IS 'Full-text search vector';

COMMENT ON COLUMN "posts"."status" IS 'active | deleted | archived';

COMMENT ON COLUMN "post_media"."post_id" IS 'Linked post';

COMMENT ON COLUMN "post_media"."type" IS 'image | video | gif';

COMMENT ON COLUMN "post_media"."position" IS 'Order of media in post';

COMMENT ON COLUMN "post_polls"."post_id" IS 'Poll attached to post';

COMMENT ON COLUMN "post_reactions"."emoji" IS 'Reaction emoji';

COMMENT ON COLUMN "notification_types"."code" IS 'e.g. like comment follow mention repost';

COMMENT ON COLUMN "notification_types"."category" IS 'social system security';

COMMENT ON COLUMN "notification_types"."aggregate_window" IS 'e.g. 1 hour for grouping NULL = no grouping';

COMMENT ON COLUMN "notifications"."recipient_id" IS 'who receives the notification';

COMMENT ON COLUMN "notifications"."actor_id" IS 'who triggered it (nullable for system)';

COMMENT ON COLUMN "notifications"."object_type" IS 'post comment user poll etc';

COMMENT ON COLUMN "notifications"."payload" IS 'metadata for UI / deeplink';

COMMENT ON COLUMN "notifications"."is_grouped" IS 'true if aggregated group summary';

COMMENT ON COLUMN "notifications"."group_key" IS 'grouping key e.g. post:123|like';

COMMENT ON COLUMN "notifications"."delivered_at" IS 'when pushed to device (optional)';

COMMENT ON COLUMN "notifications"."status" IS 'active dismissed deleted';

COMMENT ON COLUMN "notification_preferences"."user_id" IS 'user whose preferences are set';

COMMENT ON COLUMN "notification_preferences"."channels" IS 'per-type overrides e.g. {"like":"push email"}';

COMMENT ON COLUMN "notification_preferences"."quiet_hours" IS '{"from":"22:00","to":"07:00","tz":"Asia/Kolkata"}';

COMMENT ON COLUMN "notification_dedup"."key" IS 'unique deduplication key';

COMMENT ON COLUMN "follows"."follower_id" IS 'User who follows another';

COMMENT ON COLUMN "follows"."followee_id" IS 'User being followed';

COMMENT ON COLUMN "follows"."status" IS '1=active 2=requested 3=restricted 4=muted';

COMMENT ON COLUMN "follows"."source" IS 'ui import suggestion';

COMMENT ON COLUMN "user_mutes"."mute_type" IS 'timeline notifications both';

COMMENT ON COLUMN "conversations"."type" IS 'direct | group';

COMMENT ON COLUMN "conversations"."title" IS 'Group title (for group chats only)';

COMMENT ON COLUMN "conversations"."is_encrypted" IS 'E2E encryption flag';

COMMENT ON COLUMN "conversation_members"."conversation_id" IS 'Chat room ID';

COMMENT ON COLUMN "conversation_members"."role" IS 'member | admin | owner';

COMMENT ON COLUMN "messages"."content" IS 'Plain or encrypted content';

COMMENT ON COLUMN "messages"."content_type" IS 'text | image | video | voice | reaction | system';

COMMENT ON COLUMN "messages"."attachments" IS 'Array of attachment metadata {id,url,mime,size}';

COMMENT ON COLUMN "messages"."reply_to" IS 'Threaded reply reference';

COMMENT ON COLUMN "messages"."status" IS 'sent | deleted | recalled';

COMMENT ON COLUMN "message_reads"."message_id" IS 'Message being read';

COMMENT ON COLUMN "message_reactions"."emoji" IS 'Reaction emoji';

COMMENT ON COLUMN "user_rolling_insights"."last_7d_engagement_rate" IS 'Engagement rate over past 7 days';

COMMENT ON COLUMN "user_rolling_insights"."last_30d_engagement_rate" IS 'Engagement rate over past 30 days';

COMMENT ON COLUMN "user_rolling_insights"."avg_daily_posts_7d" IS 'Average daily posts in 7 days';

ALTER TABLE "user_links" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_interests" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_badges" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "auth_providers" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "sessions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "two_factor_auth" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "privacy_settings" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("parent_post_id") REFERENCES "posts" ("id");

ALTER TABLE "posts" ADD FOREIGN KEY ("quote_post_id") REFERENCES "posts" ("id");

ALTER TABLE "post_media" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "post_polls" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "post_poll_options" ADD FOREIGN KEY ("poll_id") REFERENCES "post_polls" ("id");

ALTER TABLE "post_poll_votes" ADD FOREIGN KEY ("poll_id") REFERENCES "post_polls" ("id");

ALTER TABLE "post_poll_votes" ADD FOREIGN KEY ("option_id") REFERENCES "post_poll_options" ("id");

ALTER TABLE "post_poll_votes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "post_visibility_custom" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "post_visibility_custom" ADD FOREIGN KEY ("allowed_user_id") REFERENCES "users" ("id");

ALTER TABLE "post_reactions" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "post_reactions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_timelines" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_timelines" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "user_timelines" ADD FOREIGN KEY ("origin_user_id") REFERENCES "users" ("id");

ALTER TABLE "feed_candidates" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "feed_candidates" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "engagement_events" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "engagement_events" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "user_signals" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "post_features" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "post_features" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("recipient_id") REFERENCES "users" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("actor_id") REFERENCES "users" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("type_code") REFERENCES "notification_types" ("code");

ALTER TABLE "notification_preferences" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "follows" ADD FOREIGN KEY ("follower_id") REFERENCES "users" ("id");

ALTER TABLE "follows" ADD FOREIGN KEY ("followee_id") REFERENCES "users" ("id");

ALTER TABLE "user_blocks" ADD FOREIGN KEY ("blocker_id") REFERENCES "users" ("id");

ALTER TABLE "user_blocks" ADD FOREIGN KEY ("blocked_id") REFERENCES "users" ("id");

ALTER TABLE "user_mutes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_mutes" ADD FOREIGN KEY ("target_user_id") REFERENCES "users" ("id");

ALTER TABLE "user_follow_counters" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "follow_suggestions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "follow_suggestions" ADD FOREIGN KEY ("suggested_user_id") REFERENCES "users" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "conversation_members" ADD FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id");

ALTER TABLE "conversation_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("sender_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("reply_to") REFERENCES "messages" ("id");

ALTER TABLE "message_reads" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");

ALTER TABLE "message_reads" ADD FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id");

ALTER TABLE "message_reads" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "message_reactions" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");

ALTER TABLE "message_reactions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "message_attachments" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");

ALTER TABLE "message_attachments" ADD FOREIGN KEY ("uploader_id") REFERENCES "users" ("id");

ALTER TABLE "post_daily_metrics" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "user_daily_metrics" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_rolling_insights" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
