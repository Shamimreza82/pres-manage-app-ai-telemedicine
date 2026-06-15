export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    doctorId?: string;
  };
  tokens: Tokens;
}
