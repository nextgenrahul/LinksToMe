import { AppError } from "backend/src/shared/utils/AppError";
import { LinksRepository } from "./links.repository";

export class LinksService {
    constructor(
        private readonly repo: LinksRepository
    ) { }

 


}