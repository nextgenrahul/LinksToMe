export interface Birthday {
  year: number;   
  month: number;  
  day: number;  
}

export interface SignupPayload {
  identifier: string;   
  password: string;
  name: string;
  username: string;     
  birthday: Birthday;   
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  mobile?: string;
  birthday: string; 
  avatarUrl?: string;
  isVerified: boolean;
  followerCount: number; 
  followingCount: number; 
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string; 
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type SignupForm = {
  fullName: string;
  email: string;
  username: string;
  password: string;
  dob: {
    day: string;
    month: string;
    year: string;
  };
};

export type SigninForm = {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    name: string;
    account_status: "active" | "suspended" | "deleted";
  };
  token?: string;
}
