import type { UserResponse } from "@/features/users/userTypes";

// Responses
export interface TokenResponse {
  accessToken: string;
  expiration: string;
  refreshToken: string;
  user: UserResponse;
}

// Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string | null;
}