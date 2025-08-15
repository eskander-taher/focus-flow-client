import { api, setAuthToken, getAuthToken } from "./api";

export interface AuthUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export async function login(username: string, password: string): Promise<AuthState> {
  const { data } = await api.post("/api/users/login", { username, password });
  const token = data.token as string;
  setAuthToken(token);
  return { user: data.user as AuthUser, token };
}

export async function register(username: string, password: string): Promise<AuthState> {
  await api.post("/api/users/register", { username, password });
  return login(username, password);
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const { data } = await api.get("/api/users/me");
    return data.user as AuthUser;
  } catch {
    setAuthToken(undefined);
    return null;
  }
}

export function logout() {
  setAuthToken(undefined);
}


