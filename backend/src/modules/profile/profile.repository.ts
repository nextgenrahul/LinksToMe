// {
//   "username",
//   "name",
//   "bio",
//   "profile_picture_url",
//   "website",
//   "is_verified",
//   "followers_count": 0,
//   "following_count": 0,
//   "links": [],
//   "interests": [],
//   "badges": []
// }

import dbService from "backend/src/config/database";
import { Profile, UpdateProfileData } from "./profile.types";
import { xContentTypeOptions } from "helmet";
export class ProfileRepository {

    // This fn is for public 
    async findByUsername(username: string): Promise<Profile | null> {
        const query = `
           SELECT id, username, name, bio, profile_picture_url, website, is_private, followers_count, following_count, posts_count, created_at 
           FROM users 
           WHERE username = $1
           AND account_status = 'active'
           LIMIT 1;
        `;

        const { rows } = await dbService.query<Profile>(query, [username]);
        return rows[0] ?? null;

    }

    // This fn for find by id

    async findById(userId: string) {
        const query = `
      SELECT 
        u.id, u.email, u.username, u.name, u.bio, u.profile_picture_url, u.website, u.is_private, u.is_verified, u.account_status, u.created_at,
        COALESCE(
          (SELECT json_agg(json_build_object('label', ul.label, 'url', ul.url) ORDER BY ul.position) 
           FROM user_links ul WHERE ul.user_id = u.id), '[]'
        ) AS links,
        COALESCE(
          (SELECT json_agg(json_build_object('interest', ui.interest)) 
           FROM user_interests ui WHERE ui.user_id = u.id), '[]'
        ) AS interests,
        COALESCE(
          (SELECT json_agg(json_build_object('badge_code', ub.badge_code)) 
           FROM user_badges ub WHERE ub.user_id = u.id), '[]'
        ) AS badges
      FROM users u
      WHERE u.id = $1
      LIMIT 1;
    `;

        const { rows } = await dbService.query(query, [userId]);
        return rows[0] ?? null;
    }

    // For updating profile for logged in user

    async updateProfile(userId: string, data: UpdateProfileData) {
        const query = `
        UPDATE users
        SET 
        name = COALESCE($2, name),
        bio = COALESCE($3, bio),
        website = COALESCE($4, website),
        profile_picture_url = COALESCE($5, profile_picture_url),
        is_private = COALESCE($6, is_private),
        updated_at = NOW()
        WHERE id = $1
        RETURNING id, username, name, bio, website, profile_picture_url, is_private;
        `;

        const values = [
            userId,
            data.name ?? null,
            data.bio ?? null,
            data.website ?? null,
            data.profile_picture_url ?? null,
            data.is_private ?? null,
        ];

        const { rows } = await dbService.query(query, values);
        return rows[0] ?? null;
    }


    // this fn is for username exists or not
    async usernameExists(username: string) {
        const query = `
        SELECT id 
        FROM users 
        WHERE username = $1 
        AND account_status = 'active'
        LIMIT 1;
        `;

        const { rows } = await dbService.query(query, [username]);
        return rows.length > 0;
    }



}