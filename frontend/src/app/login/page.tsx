"use client";
import { useState, useEffect, useRef } from "react";
import EyeIcon from "../components/EyeIcon";
import { LoginModelType } from "../../../Interfaces";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../components/LoadingSpinner";
import EnterOTP from "../components/enterOTP";
import { AuthService } from "../../../services/apiServices/AuthService";
import { getApiErrorMessage } from "../../../SharedFunctions";

export default function Page() {
  const { data: session, status } = useSession();
  const hasExchangedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [loginModal, setLoginModal] = useState<LoginModelType>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { setAccessToken } = useAuth();

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

  const validateForm = (): string | null => {
    if (!loginModal.email || !loginModal.password) {
      return "Please fill all the fields";
    }
    return null;
  };

  const apiErrorMsg = async (error: unknown): Promise<string> => {
    console.error(error);

    const errorMsg = getApiErrorMessage(error);

    if (errorMsg.includes("Email not verified")) {
      await AuthService.sendOtp(loginModal.email);
      setDisplayModal(true);
      setTimeLeft(60);
      return "";
    } else {
      return errorMsg;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formError = validateForm();
    if (formError) {
      setErrorMessage(formError);
      return;
    }

    setLoading(true);

    try {
      const token = await AuthService.login(loginModal);

      setAccessToken(token);
      router.push("/home");
    } catch (err: unknown) {
      const error = await apiErrorMsg(err);
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateReqirements = (): boolean => {
      const searchParams = new URLSearchParams(window.location.search);
      const shouldExchange = searchParams.get("postGoogleLogin") === "true";

      if (status !== "authenticated") return false;
      if (!shouldExchange) return false;

      if (hasExchangedRef.current) return false;
      hasExchangedRef.current = true;
      return true;
    };

    const exchangeToken = async () => {
      if (!validateReqirements()) {
        return;
      }
      const handleGoogleAuth = async () => {
        if (!session?.idToken) return;
        setLoading(true);
        try {
          const token = await AuthService.googleAuth(session.idToken);
          setAccessToken(token);
          setLoading(false);
          router.replace("/home");
        } catch (err) {
          console.error(
            "[GoogleLoginBtn] Failed to change Google account:",
            err
          );
          setLoading(false);
        }
      };

      await handleGoogleAuth();
    };
    exchangeToken();
  }, [session, setAccessToken, router, status]);

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
          aim={`login`}
          userEmail={loginModal.email}
          handleCancel={() => setDisplayModal(false)}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          setLoading={setLoading}
        />
      ) : (
        <div className=" w-[80%] sm:w-[50%] md:w-[40%] lg:w-[28%] rounded-[0.8rem] px-4 py-8 border border-gray-300 font-serif">
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
                    setLoginModal({
                      ...loginModal,
                      rememberMe: e.target.checked,
                    })
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
              {loading ? (
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
            styles=" border border-gray-300 py-2"
            text="Continue with google"
            source="login"
            setLoading={setLoading}
          />

          <div className=" text-xs text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#5577FF]">
              Sign Up{" "}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
