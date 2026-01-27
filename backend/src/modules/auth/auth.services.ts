import bcrypt from 'bcryptjs';
import crypto from "crypto";
import authRepository from './auth.repository';
import { SigninPayload, SignupPayload } from '@linkstome/shared';
import { AppError } from 'backend/src/shared/utils/AppError';
import { generateAccessToken, generateRefreshToken, hashToken } from '../../shared/utils/auth.tokens';

export class AuthService {
	private repo = authRepository;

	private async issueTokens(
		userId: string,
		meta: { userAgent?: string; ip?: string }
	) {
		const accessToken = generateAccessToken(userId);
		const refreshToken = generateRefreshToken();

		const refreshTokenHash = hashToken(refreshToken);

		const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS);
		if (!expiryDays || Number.isNaN(expiryDays)) {
			throw new Error("REFRESH_TOKEN_EXPIRY_DAYS not configured");
		}

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + expiryDays);

		await this.repo.saveRefreshToken({
			userId,
			tokenHash: refreshTokenHash,
			userAgent: meta.userAgent,
			ip: meta.ip,
			expiresAt,
		});

		return { accessToken, refreshToken };
	}


	public async signup(payload: SignupPayload, meta: { userAgent?: string; ip?: string }) {
		const exists = await this.repo.exists(payload.email);
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


	public async login(
		payload: SigninPayload,
		meta: { userAgent?: string; ip?: string }
	) {
		const { email, password } = payload;

		const user = await this.repo.findByIdentifier(email);

		if (!user) {
			throw new AppError("Invalid credentials", 401);
		}

		if (user.account_status !== "active") {
			throw new AppError("Account not active", 403);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AppError("Invalid credentials", 401);
		}

		const { accessToken, refreshToken } =
			await this.issueTokens(user.id, meta);

		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
			accessToken,
			refreshToken,
		};
	}

	public async refresh(refreshToken: string) {
		const tokenHash = hashToken(refreshToken);

		const session = await this.repo.findRefreshToken(tokenHash);
		if (!session) {
			throw new AppError("Unauthorized", 401);
		}

		if (new Date(session.expires_at) < new Date()) {
			throw new AppError("Unauthorized", 401);
		}

		if (session.account_status !== "active") {
			throw new AppError("Unauthorized", 401);
		}

		const accessToken = generateAccessToken(session.user_id);
		return { accessToken };
	}

	public async logout(refreshToken: string): Promise<void> {
		if (!refreshToken) return;

		const tokenHash = hashToken(refreshToken);
		const deleted = await this.repo.deleteRefreshToken(tokenHash);

		if (!deleted) {
			console.warn("Logout: refresh token not found or already deleted");
		}
	}




}

export default new AuthService();