// login.dto.ts
export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
}
