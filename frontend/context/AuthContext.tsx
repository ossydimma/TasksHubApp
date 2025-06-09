"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContextType, User } from "../Interfaces";
import { tokenService } from "../services/tokenService";
import { api } from "../services/axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const router = useRouter();

  const setAccessToken = (token: string) => {
    tokenService.set(token);
    setAccessTokenState(token);

    try {
      const decoded: User = jwtDecode(token);
      setUserInfo(decoded);
    } catch (err) {
      setUserInfo(null);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", { withCredentials: true });
    } catch (err) {
      console.error("Failed to logout from server:", err);
    }

    tokenService.clear();
    setAccessTokenState(null);
    setUserInfo(null);
    router.push("/login");
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.get("/auth/refresh-token", {
          withCredentials: true,
        });
        const token = res.data.accessToken;
        setAccessToken(token);
      } catch (err: any) {
        console.log(err.message);
        logout();
      }
    };

    tryRefresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        setAccessToken,
        logout,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
