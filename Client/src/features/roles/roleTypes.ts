// Responses
export interface RoleResponse {
  id: number;
  name: string;
}

// Requests
export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  id: number;
  name: string;
}