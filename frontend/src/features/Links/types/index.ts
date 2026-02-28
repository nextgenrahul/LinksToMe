// ─── Existing types ───────────────────────────────────────────────────────────
export interface LinkCardProps {
  name: string;
  username: string;
  role: string;
  profileImage?: string;
  platformIcon: string;
  link: string;
}

// ─── User Link (from user_links table) ───────────────────────────────────────
export interface UserLink {
  id: string;
  // user_id: string;
  label: string | null;
  url: string;
  slug: string | null;
  // position: number;
  // created_at: string;
}

export interface CreateLinkPayload {
  label?: string;
  url: string;
}


// interface LinkCardProps {
//   link: UserLink;
//   onDelete: (id: string) => void;
//   onViewAnalytics: (id: string) => void;
// }