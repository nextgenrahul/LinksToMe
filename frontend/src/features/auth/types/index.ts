// // Standardized for all API communication
// export interface Birthday {
//   year: number;   
//   month: number;  
//   day: number;  
// }

// export interface SignupPayload {
//   identifier: string;   
//   password: string;
//   name: string;
//   username: string;     
//   birthday: Birthday;   
// }

// // Optimized AuthUser for Social Media Features
// export interface AuthUser {
//   id: string;
//   username: string;
//   name: string;
//   email?: string;
//   mobile?: string;
//   birthday: string; // Keep as ISO String for easy date-fns/moment.js use
//   avatarUrl?: string;
//   isVerified: boolean;
//   followerCount: number; // Added for social logic
//   followingCount: number; // Added for social logic
//   createdAt: string;
// }

// export interface AuthResponse {
//   user: AuthUser;
//   accessToken: string;
//   refreshToken: string; // Required for silent refresh (Billionaire UX)
// }

// export interface AuthState {
//   user: AuthUser | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }













// src/features/auth/types/index.ts

// 1️⃣ Request type (what frontend sends)
export type LoginRequest = {
  email: string;
  password: string;
};

// 2️⃣ User object (stored in Redux)
export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

// 3️⃣ Response type (what backend returns)
export type LoginResponse = {
  token: string;
  user: AuthUser;
};

// 4️⃣ Redux state type (auth slice)
export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
