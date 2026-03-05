import { RequestHandler } from "express";

export interface Route {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  preValidation?: RequestHandler;
  preHandler?: RequestHandler;
  handler: RequestHandler;
}

export type UpdateProfileData = {
  name?: string;
  bio?: string;
  website?: string;
  profile_picture_url?: string;
  is_private?: boolean;
};

export type Achievement = {
  id: string;
  username: string;
  name: string;
  bio?: string | null;
  website?: string | null;
  profile_picture_url?: string | null;
  is_private: boolean;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  account_status: "active" | "restricted";
  links: { label: string; url: string }[];
  interests: { interest: string }[];
  badges: { badge_code: string }[];
};
