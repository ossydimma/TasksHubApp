import { LoginModelType, SignupModelType } from "../../Interfaces";
import { api } from "../axios";

interface AuthServiceType {
  completeSignup(payload: SignupModelType): Promise<any>;
  signup(payload: SignupModelType): Promise<any>;
  googleLogin(credential: string): Promise<any>;
  googleSignup(credential: string): Promise<any>;
  login(payload: LoginModelType): Promise<any>;
  logout(): Promise<any>;
  sendOtp(email: string): Promise<any>;
  verifyOtp(payload: any): Promise<any>;
  verifyNewEmail(payload: any): Promise<any>;
  resetPassword(payload: any): Promise<any>;
}

export const AuthService: AuthServiceType = {
  completeSignup: async (payload: SignupModelType) => {
    await api.post("/auth/signup", payload);
    await api.post(`/sendOTP?email=${encodeURIComponent(payload.email)}`);
  },

  signup: async (payload: SignupModelType) => {
    await api.post("/auth/signup", payload);
  },

  googleLogin: async (credential: string) => {
    const res = await api.post(
      "/auth/google/login",
      { credential: credential },
      { withCredentials: true }
    );

    const token = res.data.accessToken;
    return token;
  },

  googleSignup: async (credential: string) => {
    const res = await api.post(
      "/auth/google/signup",
      { credential: credential },
      { withCredentials: true }
    );

    const token = res.data.accessToken;
    return token;
  },

  login: async (payload: LoginModelType) => {
    const res = await api.post("/auth/login", payload, {
      withCredentials: true,
    });
    const token = res.data.accessToken;
    return token;
  },

  logout: async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
  },

  sendOtp: async (email: string) => {
    await api.post(`/sendOTP?email=${encodeURIComponent(email)}`);
  },

  verifyOtp: async (payload: any) => {
    await api.post(`/verifyOtp`, payload);
  },

  verifyNewEmail: async (payload: any) => {
    await api.post("/settings/verify-new-email", payload);
  },

  resetPassword: async (payload: any) => {
    await api.post("/auth/reset-password", payload);
  },
};
