import { type LoginRequest, type LoginResponse } from "../types";

export async function loginApi(
  payload: LoginRequest
): Promise<LoginResponse> {
  await new Promise((res) => setTimeout(res, 1000));

  if (payload.email !== "test@test.com" || payload.password !== "123456") {
    throw new Error("Invalid email or password");
  }

  return {
    token: "mock-access-token-123",
    user: {
      id: "1",
      email: payload.email,
      name: "Test User",
    },
  };
}
