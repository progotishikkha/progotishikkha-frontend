import { apiClient } from "@/lib/apiClient";
import { setAccessToken, clearAccessToken } from "@/lib/tokenStore";
import { StudentProfileData, TutorProfileData, UserRole } from "@/types";

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Extract<UserRole, "student" | "tutor">;
}

// Matches the object returned by GET /auth/me and by login/verify-otp — the
// account fields plus whichever role-specific profile document belongs to
// this user (null for admins, or before the profile doc exists).
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  profile: StudentProfileData | TutorProfileData | null;
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post("/auth/register", payload);
    // { otpEmailSent: boolean } — lets the UI tell the person plainly when
    // the account was created but the OTP email itself could not be
    // delivered, instead of silently implying everything worked.
    return data.data as { otpEmailSent: boolean };
  },

  verifyOtp: async (email: string, code: string) => {
    const { data } = await apiClient.post("/auth/verify-otp", { email, code });
    setAccessToken(data.data.accessToken);
    return data.data.user as AuthUser;
  },

  resendOtp: async (email: string) => {
    const { data } = await apiClient.post("/auth/resend-otp", { email });
    return data.data as { otpEmailSent: boolean };
  },

  login: async (email: string, password: string) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    setAccessToken(data.data.accessToken);
    return data.data.user as AuthUser;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    clearAccessToken();
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (payload: {
    email: string;
    code: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const { data } = await apiClient.post("/auth/reset-password", payload);
    return data;
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const { data } = await apiClient.patch("/auth/change-password", payload);
    return data;
  },

  me: async () => {
    const { data } = await apiClient.get("/auth/me");
    return data.data as AuthUser;
  },
};
