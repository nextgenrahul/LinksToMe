// I use get Profile Pramas to remove user name error   
import { Request, Response } from "express";
import { ProfileService } from "./profile.services";
import { catchAsync } from "../../shared/utils/catchAsync";
type GetProfileParams = {
    username: string;
};

export class ProfileController {
    constructor(
        private readonly service: ProfileService
    ) { }

    // 🔹 Get public profile
    public getProfile = catchAsync(async (
        req: Request<GetProfileParams>,
        res: Response
    ) => {

        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        const viewerId = req.user?.id;

        const profile = await this.service.getProfileByUsername(
            username,
            viewerId
        );

        return res.status(200).json({
            success: true,
            data: profile,
        });
    });

    // 🔹 Get logged-in user's profile
    public getMyProfile = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const profile = await this.service.getMyProfile(req.user.id);

        return res.status(200).json({
            success: true,
            data: profile,
        });
    });

    // 🔹 Update profile
    public updateProfile = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const updated = await this.service.updateProfile(
            req.user.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updated,
        });
    });

    // 🔹 Check username availability
    public checkUsername = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const usernameParam = req.query.username;

        if (typeof usernameParam !== "string" || usernameParam.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Valid username is required",
            });
        }

        const result = await this.service.checkUsername(usernameParam);

        return res.status(200).json({
            success: true,
            data: result,
        });
    });
}
