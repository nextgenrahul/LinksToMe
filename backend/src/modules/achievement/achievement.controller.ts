// I use get Profile Pramas to remove user name error   
import { Request, Response } from "express";
import { AchievementService } from "./achievement.services";
import { catchAsync } from "../../shared/utils/catchAsync";

export class AchievementController {
    constructor(
        private readonly service: AchievementService
    ) { }

    check = (req : Request, res : Response) => {
        return res.json({message : "Working Bro"});
    }
}
