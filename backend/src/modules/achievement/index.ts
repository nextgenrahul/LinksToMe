import { achievementRoute } from "./achievement.routes";
import { AchievementController } from "./achievement.controller";
import { AchievementService } from "./achievement.services";
import { AchievementRepository } from "./achievement.repository";
import authModule from "../auth";

const achievementRepository = new AchievementRepository();
const achievementService = new AchievementService(achievementRepository);
const achievementController = new AchievementController(achievementService);

export default {
  routes : achievementRoute(achievementController, authModule.middleware),
  controller : achievementController,
  service : achievementService,
  repository : achievementRepository,
}

