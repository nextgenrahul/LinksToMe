import { AppError } from "backend/src/shared/utils/AppError";
import { ProfileRepository } from "./profile.repository";
import { Profile } from "./profile.types";

export class ProfileService {
    constructor(
        private readonly repo: ProfileRepository
    ) { }

    private buildPrivateProfileResponse(profile: Profile) {
        return {
            id: profile.id,
            username: profile.username,
            name: profile.name,
            is_private: true,
            is_verified: profile.is_verified,
            followers_count: profile.followers_count,
            following_count: profile.following_count,
            posts_count: profile.posts_count,
            message: "This account is private",
        };
    }


    // Get profile by username (public or viewer-based)
    async getProfileByUsername(
        username: string,
        viewerId?: string
    ) {
        const profile = await this.repo.findByUsername(username);

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        // If profile is private
        if (profile.is_private) {
            // If no viewer logged in
            if (!viewerId) {
                return this.buildPrivateProfileResponse(profile);
            }

            // If viewer is owner
            if (viewerId === profile.id) {
                return profile;
            }

            // Later you can check follower relationship here
            // For now assume not allowed
            return this.buildPrivateProfileResponse(profile);
        }

        return profile;
    }

    // Get own profile (full access)
    async getMyProfile(userId: string) {
        const profile = await this.repo.findById(userId);

        if (!profile) {
            throw new AppError("User not found", 404);
        }

        if (profile.account_status !== "active") {
            throw new AppError("Account restricted", 403);
        }

        return profile;
    }

    // Update profile
    async updateProfile(
        userId: string,
        data: {
            name?: string;
            bio?: string;
            website?: string;
            profile_picture_url?: string;
            is_private?: boolean;
        }
    ) {
        const updated = await this.repo.updateProfile(userId, data);

        if (!updated) {
            throw new AppError("Profile update failed", 400);
        }

        return updated;
    }

    // Check username availability
    async checkUsername(username: string) {
        const exists = await this.repo.usernameExists(username);

        return {
            available: !exists,
        };
    }




}