export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string; // optional kalau BE mendukung
}

export interface AuthError {
  path: string;
  message: string;
}

export interface AuthResponseData {
  token: string;
  user: {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data?: AuthResponseData;
  errors?: AuthError[];
}
