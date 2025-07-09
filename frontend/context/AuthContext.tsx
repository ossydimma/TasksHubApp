"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContextType, User } from "../Interfaces";
import { tokenService } from "../services/tokenService";
import { api } from "../services/axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        setAccessTokenState(null);
        setUserInfo(null);
        // logout();
      } finally {
        console.log("Setting loading to false...");
        setLoading(false);
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
        setUserInfo,
        loading, 
        setLoading
      }}
    >
      {loading ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner styles={ {svg:" h-10 w-10", span: "text-[1.2rem]"}} text="Loading..." />
        </div>
      ) : (
        children

      )}
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
