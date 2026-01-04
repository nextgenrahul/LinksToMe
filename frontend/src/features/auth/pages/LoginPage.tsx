export interface Birthday {
  year: number;   
  month: number;  
  day: number;  
}

// Signup 

export interface SignupPayload {
  identifier: string;   // mobile number OR email
  password: string;
  name: string;
  username: string;     // unique
  birthday: Birthday;   // year, month, day
}


// Signup API Payload(For backend)

export interface SignupApiPayload {
  identifier: string;
  password: string;
  name: string;
  username: string;
  birthday: string;     
}


// Login

export interface LoginPayload {
  identifier: string;  
  password: string;
}


// Auth User (After login/signup)


export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  mobile?: string;
  birthday?: string;    
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}


// Auth Response

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}
