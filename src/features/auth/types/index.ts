export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  username: string;
  is_superadmin: boolean;
}

export interface AuthUser {
  username: string;
  is_superadmin: boolean;
}
