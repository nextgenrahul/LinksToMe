export interface Profile {
    id: string;
    username: string;
    name: string;
    bio?: string | null;
    website?: string | null;
    profile_picture_url?: string | null;
    is_verified: boolean;
    followers_count: number;
    following_count: number;
    links: { label: string; url: string }[];
    interests: { interest: string }[];
    badges: { badge_code: string }[];
}
