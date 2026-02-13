import { ProfileRepository } from "./profile.repository";

export class ProfileService {
    constructor(
            private readonly repo: ProfileRepository
        ) { }
}