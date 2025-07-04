export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  age?: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  age?: number;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  age?: number;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  age?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
  token: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ValidationError[];
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
} 