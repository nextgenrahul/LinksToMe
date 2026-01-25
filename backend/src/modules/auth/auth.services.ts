import bcrypt from 'bcryptjs';
import crypto from "crypto";
import authRepository from './auth.repository';
import { SigninPayload, SignupPayload } from '@linkstome/shared';

export class AuthService {
  private repo = authRepository;

  public async signup(payload: SignupPayload, meta: {userAgent? : string; ip?: string}) {
    const exists = await this.repo.exists(payload.email, payload.password);
    if(exists)
  }

  public async login(payload: SigninPayload){

  }



}

export default new AuthService();