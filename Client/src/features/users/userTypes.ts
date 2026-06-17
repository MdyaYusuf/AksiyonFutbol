// Responses
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string | null;
  isActive: boolean;
  createdDate: string;
  roleId: number;
  roleName: string;
}

export interface UserPreview {
  id: string;
  username: string;
  profileImageUrl?: string | null;
  roleName: string;
}

export interface CreatedUserResponse {
  id: string;
  username: string;
}

// Requests
export interface UpdateUserRequest {
  username: string;
  email: string;
  imageFile?: File | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}