import { pool } from '../config/database';
import { User, UserCreate, UserUpdate, UserResponse, PaginationParams, PaginatedResponse } from '../types';
import bcrypt from 'bcryptjs';

export class UserService {
  static async create(userData: UserCreate): Promise<UserResponse> {
    const { name, email, password, age } = userData;
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, age, is_active, created_at, updated_at
    `;
    
    const values = [name, email, hashedPassword, age];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0] as UserResponse;
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  }

  static async findAll(params: PaginationParams = {}): Promise<PaginatedResponse<UserResponse>> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM users WHERE is_active = true';
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated data
    const query = `
      SELECT id, name, email, age, is_active, created_at, updated_at
      FROM users
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    return {
      data: result.rows as UserResponse[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, name, email, age, is_active, created_at, updated_at
      FROM users
      WHERE id = $1 AND is_active = true
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] as UserResponse || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] as User || null;
  }

  static async update(id: number, userData: UserUpdate): Promise<UserResponse | null> {
    const { name, email, age, is_active } = userData;
    
    // Check if email already exists (if updating email)
    if (email) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('El email ya está registrado');
      }
    }
    
    // Build dynamic query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (age !== undefined) {
      updates.push(`age = $${paramCount}`);
      values.push(age);
      paramCount++;
    }
    
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return this.findById(id);
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, age, is_active, created_at, updated_at
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0] as UserResponse || null;
  }

  static async delete(id: number): Promise<UserResponse | null> {
    const query = `
      UPDATE users
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, age, is_active, created_at, updated_at
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] as UserResponse || null;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }
} 