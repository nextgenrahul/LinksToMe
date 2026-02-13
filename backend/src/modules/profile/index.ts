import { profileRoute } from "./profile.routes";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.services";
import { ProfileRepository } from "./profile.repository";
import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";


const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);


export default {
    routes: profileRoute(profileController),
    controller: profileController,
    service: profileService,
    repository: profileRepository,
};
