import { linksRoute } from "./links.routes";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.services";
import { LinksRepository } from "./links.repository";
import authModule from "../auth"; // import auth module

const linksRepository = new LinksRepository();
const linksService = new LinksService(linksRepository);
const linksController = new LinksController(linksService);

export default {
  routes: linksRoute(linksController, authModule.middleware),
  controller: linksController,
  service: linksService,
  repository: linksRepository,
};
