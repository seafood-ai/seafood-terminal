import { LoginRequest, SignupRequest, LoginResponse, User } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "An error occurred" }));
    throw new ApiError(response.status, error.error || "An error occurred");
  }
  return response.json();
}

export const api = {
  async signup(data: SignupRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<LoginResponse>(response);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<LoginResponse>(response);
  },

  async getProfile(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse<User>(response);
  },
};
