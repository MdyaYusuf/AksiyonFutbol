import { apiClient, handleLogout } from "@/core/api/apiClient";
import type { LoginRequest, RegisterUserRequest } from "@/features/auth/authTypes";
import type { UserResponse, CreatedUserResponse } from "@/features/users/userTypes";

export const authService = {
  login: async (credentials: LoginRequest) => {
    return await apiClient<UserResponse>("/Authentication/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterUserRequest) => {
    return await apiClient<CreatedUserResponse>("/Authentication/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  checkAuth: async () => {
    return await apiClient<UserResponse>("/users/me", {
      method: "GET",
      headers: {
        "X-Silent-Check": "true"
      }
    });
  },

  logout: () => {
    handleLogout();
  },
};