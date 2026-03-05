import { AppError } from "backend/src/shared/utils/AppError";
import { AchievementRepository } from "./achievement.repository";

export class AchievementService {
    constructor(
        private readonly repo: AchievementRepository
    ) { }


}