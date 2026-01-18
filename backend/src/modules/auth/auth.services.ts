import bcrypt from 'bcryptjs';
import crypto from "crypto";
import authRepository from './auth.repository';
import { SignupPayload } from '@linkstome/shared';

export class AuthService {
  private repo = authRepository;

  public async signup(payload: SignupPayload) {
    const userExists = await this.repo.exists(payload.email, payload.username);
    if (userExists) throw new Error('Identity conflict: Email or Username already taken');

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(payload.password, salt);

    const userId = crypto.randomUUID();

    const newUser = await this.repo.createUser(payload, passwordHash, userId);

    return newUser;
  }
}

export default new AuthService();