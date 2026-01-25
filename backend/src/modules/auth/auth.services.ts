import bcrypt from 'bcryptjs';
import crypto from "crypto";
import authRepository from './auth.repository';
import { SigninPayload, SignupPayload } from '@linkstome/shared';
import { AppError } from 'backend/src/shared/utils/AppError';
import { generateAccessToken, generateRefreshToken, hashToken } from './auth.tokens';

export class AuthService {
	private repo = authRepository;

	public async signup(payload: SignupPayload, meta: { userAgent?: string; ip?: string }) {
		const exists = await this.repo.exists(payload.email, payload.password);
		if (exists) {
			throw new AppError("Email or username already exists", 409);
		}

		// Hash Password
		const passwordHash = await bcrypt.hash(payload.password, 12);

		// Create User
		const userId = crypto.randomUUID();
		const user = await this.repo.createUser(payload, passwordHash, userId);


		// Generate tokens
		const accessToken = generateAccessToken(userId);
		const refreshToken = generateRefreshToken();

		// Hash Refresh Token before storing
		const refreshTokenHash = hashToken(refreshToken);

		// Calculate refresh token expiry safely
		const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS);
		if (!expiryDays || Number.isNaN(expiryDays)) {
			throw new Error("REFRESH_TOKEN_EXPIRY_DAYS is not configured correctly");
		}

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + expiryDays);

		// Persist refresh token metadata
		await this.repo.saveRefreshToken({
			userId,
			tokenHash: refreshTokenHash,
			userAgent: meta.userAgent,
			ip: meta.ip,
			expiresAt,
		});

		return {
			user,
			accessToken,
			refreshToken
		}
	}


	public async login(payload: SigninPayload) {

	}



}

export default new AuthService();