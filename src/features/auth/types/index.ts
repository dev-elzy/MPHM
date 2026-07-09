export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    institutionId?: string | null;
  };
}
