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


