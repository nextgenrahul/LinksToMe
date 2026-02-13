import { catchAsync } from "backend/src/shared/utils/catchAsync";
import { ProfileService } from "./profile.services";
import { NextFunction, Request, Response } from 'express';


export class ProfileController {
    constructor(
        private readonly service: ProfileService
    ) { }

    public check = catchAsync(async (req: Request, res: Response) => {
        console.log("firstkkkkkkkkkkkkkkkkkkkkkkkk")
        // return res.status(200).json({
        //     message: "Hello"
        // });
    });
}