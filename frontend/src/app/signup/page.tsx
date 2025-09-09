"use client";
import { useEffect, useState, useRef } from "react";
import EyeIcon from "../components/EyeIcon";
import EnterOTP from "../components/enterOTP";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import {
  PasswordType,
  ShowPasswordType,
  SignupModelType,
} from "../../../Interfaces";
import { api } from "../../../services/axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthService } from "../../../services/apiServices/AuthService";

export default function page() {
  const { isAuthenticated, setAccessToken } = useAuth();
  const { data: session, status } = useSession();
  const hasExchangedRef = useRef(false);

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<ShowPasswordType>({
    newPassword: true,
    confirmPassword: true,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [passwordType, setPasswordType] = useState<PasswordType>({
    newPassword: "password",
    confirmPassword: "password",
  });

  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");

  const [signupModel, setSignupModel] = useState<SignupModelType>({
    fullName: "",
    email: "",
    password: "",
  });

  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // FUNCTIONS

  const toggleNewPasword = () => {
    // Toggle the password type between "text" and "password"
    if (showPassword.newPassword) {
      setPasswordType({ ...passwordType, newPassword: "text" });
    } else {
      setPasswordType({ ...passwordType, newPassword: "password" });
    }

    // Toggle the showPassword state
    setShowPassword({
      ...showPassword,
      newPassword: !showPassword.newPassword,
    });
  };

  const toggleConfirmPassword = () => {
    // Toggle the password type between "text" and "password"
    if (showPassword.confirmPassword) {
      setPasswordType({ ...passwordType, confirmPassword: "text" });
    } else {
      setPasswordType({ ...passwordType, confirmPassword: "password" });
    }
    // Toggle the showPassword state
    setShowPassword({
      ...showPassword,
      confirmPassword: !showPassword.confirmPassword,
    });
  };

  const validatePassword = (): string | null => {
    // Check if the password and confirm password match
    if (signupModel.password !== confirmPasswordValue) {
      return "Passwords do not match";
    }
    return null;
  };

  const getApiErrorMsg = (err: any): string => {
    if (err.response) {
      return err.response.data?.error || err.response.data || "signup failed";
    } else {
      console.log("Network or other error:", err.message);
      return "Network error or server not reachable";
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const passwordValidationError = validatePassword();
    if (passwordValidationError) {
      setErrorMessage(passwordValidationError);
      setLoading(false);
      return;
    }

    // Calling the create user API
    try {
      await AuthService.completeSignup(signupModel);
      setDisplayModal(true);
      setTimeLeft(60);
    } catch (err: any) {
      const error = getApiErrorMsg(err);
      setErrorMessage(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const exchangeToken = async () => {
      if (status !== "authenticated") return;

      const searchParams = new URLSearchParams(window.location.search);
      const shouldExchange = searchParams.get("postGoogleLogin") === "true";

      if (!shouldExchange) return;
      if (hasExchangedRef.current) return;
      hasExchangedRef.current = true;

      console.log("[GoogleLoginBtn] Detected postGoogleLogin flow.");

      setLoading(true);
      // Login or Signup flow
      try {
        const res = await api.post(
          "/auth/google",
          { credential: session.idToken },
          { withCredentials: true }
        );
        console.log("[GoogleLoginBtn] Google login/signup successful.");

        setAccessToken(res.data.accessToken);

        setLoading(false);

        router.replace("/home");
      } catch (err: any) {
        console.error("[GoogleLoginBtn] Failed to change Google account:", err);
        setLoading(false);
      }
    };
    exchangeToken();
  }, [session, setAccessToken]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      {loading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner
            styles={{ svg: " h-10 w-10", span: "text-[1.2rem]" }}
            text="Loading..."
          />
        </div>
      )}
      {displayModal ? (
        <EnterOTP
          className="w-[80%] sm:w-[50%] md:w-[40%] lg:w-[28%] top-1/2"
          aim={`signup`}
          handleCancel={() => setDisplayModal(false)}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          userEmail={signupModel.email}
          setLoading={setLoading}
        />
      ) : (
        <div className="relative w-[80%] sm:w-[50%] md:w-[40%] lg:w-[28%] rounded-[0.8rem] px-4 py-5 border border-gray-300 font-serif">
          <h2 className=" text-2xl text-black font-semibold text-center">
            Sign up
          </h2>

          <form
            action=""
            onSubmit={handleSignup}
            className="relative flex flex-col gap-2 mt-5"
          >
            <p className="text-red-500">{errorMessage}</p>

            <div className="flex flex-col gap-2">
              <label htmlFor="fullName">Fullname:</label>
              <input
                type="text"
                id="fullName"
                value={signupModel.fullName}
                onChange={(e) =>
                  setSignupModel({ ...signupModel, fullName: e.target.value })
                }
                className="outline-none border py-1 px-3 rounded-lg"
                // placeholder="Enter your username"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={signupModel.email}
                onChange={(e) =>
                  setSignupModel({ ...signupModel, email: e.target.value })
                }
                className="outline-none border py-1 px-3 rounded-lg"
                // placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password:</label>
              <div className="flex items-center justify-between border rounded-lg pr-4 bg-white">
                <input
                  type={passwordType.newPassword}
                  value={signupModel.password}
                  onChange={(e) =>
                    setSignupModel({ ...signupModel, password: e.target.value })
                  }
                  id="password"
                  className="outline-none w-[95%] py-1 px-3 "
                  // placeholder="Enter your password"
                  required
                />
                <EyeIcon
                  showPassword={showPassword.newPassword}
                  handlePasswordType={toggleNewPasword}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="flex items-center justify-between border rounded-lg pr-4 bg-white">
                <input
                  type={passwordType.confirmPassword}
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  id="confirmPassword"
                  className="outline-none w-[95%] py-1 px-3 "
                  // placeholder="Confirm your password"
                  required
                />
                <EyeIcon
                  showPassword={showPassword.confirmPassword}
                  handlePasswordType={toggleConfirmPassword}
                />
              </div>
            </div>

            <button
              className="bg-black text-[1rem] text-white py-2 mt-3 w-[100%] rounded-lg"
              type="submit"
            >
              {loading ? (
                <div className="flex justify-center items-center h-10">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-white border-solid"></div>
                </div>
              ) : (
                <span>Sign up</span>
              )}
            </button>
          </form>

          <GoogleLoginBtn
            styles=" border border-gray-300 py-2"
            text={"Sign up with Google"}
            source="signup"
            setLoading={setLoading}
          />

          <div className=" text-xs text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#5577FF]">
              Log in{" "}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
