export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
      doctorId?: string;
      doctor?: any;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}


