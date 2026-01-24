import dbService from '../../config/database';
import { SignupPayload } from '@linkstome/shared';

export class AuthRepository {
  
  public async createUser(data: SignupPayload, passwordHash: string, id: string) {
    const query = `
      INSERT INTO users (
        id, email, username, name, password, 
        birth_day, birth_month, birth_year
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, created_at;
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

  public async exists(identifier: string, username: string) {
    const query = `SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1;`;
    const { rows } = await dbService.query(query, [identifier, username]);
    return rows.length > 0;
  }
}

export default new AuthRepository();