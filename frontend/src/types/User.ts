export interface LoginCredentials {
  username: string;
  password: string;
}
export interface RegisterUserDetails {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}
export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isEmailConfirmed: boolean;
}
export interface Me {
  id: string;
  role: string;
}
