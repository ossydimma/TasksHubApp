"use client";
import { useState, useEffect } from "react";
import EyeIcon from "../components/EyeIcon";
import { LoginModelType } from "../../../Interfaces";
import { api } from "../../../services/axios";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import LoadingSpinner from "../components/LoadingSpinner";

export default function page() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [loginModal, setLoginModal] = useState<LoginModelType>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { isAuthenticated, setAccessToken } = useAuth();

  const router = useRouter();

  // FUNCTIONS
  const togglePasword = () => {
    // Toggle the password type between "text" and "password"
    if (showPassword) {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }

    // Toggle the showPassword state
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!loginModal.email || !loginModal.password) {
      setErrorMessage("Please fill all the fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", loginModal, {
        withCredentials: true,
      });
      const token = res.data.accessToken;

      setAccessToken(token);

      router.push("/home");
    } catch (err: any) {
      console.error(err.response.data);
      // Try to extract the first error message if available
      const errorData = err.response?.data;
      let errorMsg = "An error occurred";
      if (errorData?.errors) {
        // Get the first error message from the errors object
        const firstKey = Object.keys(errorData.errors)[0];
        errorMsg = errorData.errors[firstKey][0];
      } else if (typeof errorData === "string") {
        errorMsg = errorData;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push("/home");
  //   }
  // }, [isAuthenticated]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {isLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner />
        </div>
      )}
      <div className=" w-[60%] sm:w-[50%] md:w-[40%] lg:w-[28%] rounded-[0.8rem] px-4 py-8 border border-gray-300 font-serif">
        <h2 className=" text-2xl text-black font-semibold text-center">
          Login
        </h2>
        <form
          action=""
          onSubmit={handleLogin}
          className="relative flex flex-col gap-3 mt-10"
        >
          <p className="text-red-500">{errorMessage}</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={loginModal.email}
              onChange={(e) =>
                setLoginModal({ ...loginModal, email: e.target.value })
              }
              className="outline-none border py-1 px-3 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password:</label>
            <div className="border w-full  pl-3 pr-5 rounded-lg bg-white flex items-center justify-between">
              <input
                type={passwordType}
                value={loginModal.password}
                onChange={(e) =>
                  setLoginModal({ ...loginModal, password: e.target.value })
                }
                id="password"
                className="outline-none w-[95%] py-1 px-3 "
              />
              <EyeIcon
                showPassword={showPassword}
                handlePasswordType={togglePasword}
              />
            </div>
          </div>
          <div className="text-sm mb-1 flex items-center justify-between">
            <div className="flex gap-1.5">
              <input
                type="checkbox"
                id="rememberMe"
                checked={loginModal.rememberMe}
                onChange={(e) =>
                  setLoginModal({ ...loginModal, rememberMe: e.target.checked })
                }
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <div>
              <a href="/forgetPassword" className="text-[rgb(85,119,255)]">
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-[1rem] text-white py-2 w-[100%] rounded-lg"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-10">
                <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-white border-solid"></div>
              </div>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* external-auth */}
        <GoogleLoginBtn
          text="Continue with google"
          source="login"
          setLoading={setIsLoading}
        />

        <div className=" text-xs text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#5577FF]">
            Sign Up{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
