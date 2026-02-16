import { profileRoute } from "./profile.routes";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.services";
import { ProfileRepository } from "./profile.repository";
import authModule from "../auth"; // import auth module

const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

export default {
  routes: profileRoute(profileController, authModule.middleware),
  controller: profileController,
  service: profileService,
  repository: profileRepository,
};
