import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthRepository } from "./auth.repository";
import { AppError } from "backend/src/shared/utils/AppError";
import {
	generateAccessToken,
	generateRefreshToken,
	hashToken,
} from "../../shared/utils/auth.tokens";
import { SigninPayload, SignupPayload } from "@linkstome/shared";

export class AuthService {
	constructor(private readonly repo: AuthRepository) { }

	private async issueTokens(
		userId: string,
		meta: { userAgent?: string; ip?: string }
	) {
		const accessToken = generateAccessToken(userId);
		const refreshToken = generateRefreshToken();
		const tokenHash = hashToken(refreshToken);

		const expiryDays = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS);
		if (!expiryDays || Number.isNaN(expiryDays)) {
			throw new Error("REFRESH_TOKEN_EXPIRY_DAYS not configured");
		}

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + expiryDays);

		await this.repo.saveRefreshToken({
			userId,
			tokenHash,
			userAgent: meta.userAgent,
			ip: meta.ip,
			expiresAt,
		});

		return { accessToken, refreshToken };
	}


	// Signup Services 

	public async signup(payload: SignupPayload, meta: { userAgent?: string; ip?: string }) {
		const emailTaken = await this.repo.existsByEmail(payload.email);
		if (emailTaken) throw new AppError("Email already in use", 409);

		const usernameTaken = await this.repo.existsByUsername(payload.username);
		if (usernameTaken) throw new AppError("Username already taken", 409);

		const passwordHash = await bcrypt.hash(payload.password, 12);
		const userId = crypto.randomUUID();

		const user = await this.repo.createUser(payload, passwordHash, userId);

		const tokens = await this.issueTokens(userId, meta);

		return { user, ...tokens };
	}


	public async login(payload: SigninPayload, meta: { userAgent?: string; ip?: string }) {
		const user = await this.repo.findByIdentifier(payload.email);
		if (!user) throw new AppError("Invalid credentials", 401);

		if (user.account_status !== "active") throw new AppError("Account restricted", 403);

		const isMatch = await bcrypt.compare(payload.password, user.password);
		if (!isMatch) throw new AppError("Invalid credentials", 401);


		const tokens = await this.issueTokens(user.id, meta);

		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				name: user.name,
				account_status: user.account_status,
			},
			...tokens,
		};
	}

	public async refresh(oldRefreshToken: string, meta: { userAgent?: string; ip?: string }) {
		const oldHash = hashToken(oldRefreshToken);

		const session = await this.repo.findRefreshToken(oldHash);
		if (!session) throw new AppError("Unauthorized", 401);

		if (new Date(session.expires_at) < new Date()) throw new AppError("Session expired", 401);
		if (session.account_status !== "active") throw new AppError("Account restricted", 403);

		await this.repo.deleteRefreshToken(oldHash);

		return this.issueTokens(session.user_id, meta);
	}

	 public async logout(refreshToken: string) {
    if (!refreshToken) return;
    const hash = hashToken(refreshToken);
    await this.repo.deleteRefreshToken(hash);
  }

  public async getUserById(userId: string) {
    if (!userId) throw new AppError("Unauthorized", 401);

    const user = await this.repo.findUserById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (user.account_status !== "active") throw new AppError("Account restricted", 403);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      account_status: user.account_status,
    };
  }


}
