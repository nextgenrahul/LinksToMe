import dbService from '../../config/database';
import { SignupPayload } from '@linkstome/shared';
import { RefreshTokenPayload } from './auth.types';

export class AuthRepository {

  // refresh token insert
  public async saveRefreshToken(params: RefreshTokenPayload) {
    const query = `INSERT INTO refresh_tokens (
    user_id, token_hash, user_agent, ip_address, expires_at
    ) VALUES ($1, $2, $3, $4, $5)`;
    const values = [
      params.userId,
      params.tokenHash,
      params.userAgent ?? null,
      params.ip ?? null,
      params.expiresAt
    ];

    await dbService.query(query, values);
  }



  public async createUser(data: SignupPayload, passwordHash: string, id: string) {
    const query = `
      INSERT INTO users (
        id, email, username, name, password, 
        birth_day, birth_month, birth_year
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, account_status, created_at;
    `;

    const values = [
      id,
      data.email,
      data.username,
      data.name,
      passwordHash,
      data.birthday.day,
      data.birthday.month,
      data.birthday.year
    ];

    const { rows } = await dbService.query(query, values);
    return rows[0];
  }

  public async exists(email: string) {
    const query = `SELECT id
    FROM users
    WHERE (email = $1)
      AND account_status = 'active'
    LIMIT 1;`;
    const { rows } = await dbService.query(query, [email]);
    return rows.length > 0;
  }

  public async findByIdentifier(identifier: string) {
    const query = `
      SELECT
        id,
        email,
        username,
        password,
        account_status
      FROM users
      WHERE (email = $1 OR username = $1)
      LIMIT 1;
    `;

    const { rows } = await dbService.query(query, [identifier]);
    return rows[0] ?? null;
  }

  public async deleteRefreshToken(tokenHash: string): Promise<boolean> {
    const query = `
      DELETE FROM refresh_tokens WHERE token_hash = $1;
    `;

    const result = await dbService.query(query, [tokenHash]);

    return (result.rowCount ?? 0) > 0;
  }



  public async findRefreshToken(tokenHash: string) {
    const query = `
      SELECT
      rt.user_id,
      rt.expires_at,
      u.id,
      u.username,
      u.email,
      u.account_status,
      u.created_at
    FROM refresh_tokens rt
    JOIN users u ON u.id = rt.user_id
    WHERE rt.token_hash = $1
    LIMIT 1;

    `;

    const { rows } = await dbService.query(query, [tokenHash]);
    return rows[0] ?? null;
  }
  public async findById(id: string) {
    const query = `
    SELECT id, email, username, name, account_status 
    FROM users 
    WHERE id = $1 
    LIMIT 1;
  `;
    const { rows } = await dbService.query(query, [id]);
    return rows[0];
  }


}

export default new AuthRepository();