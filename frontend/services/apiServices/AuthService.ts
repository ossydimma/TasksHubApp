import { api } from "../axios";

interface AuthServiceType {
    logout(): Promise<any>;
}

export const AuthService : AuthServiceType = {
    logout: async() => {
        await api.post("auth/logout", {}, { withCredentials: true });
    }
}