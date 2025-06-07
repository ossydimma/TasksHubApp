"use client";
import { useEffect, useState } from "react";
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

export default function page() {
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<ShowPasswordType>({
    newPassword: true,
    confirmPassword: true,
  });

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Check if the password and confirm password match
    if (signupModel.password !== confirmPasswordValue) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Calling the create user API
    try {
      await api.post("/auth/signup", signupModel);
      await api.post(`/sendOTP?email=${encodeURIComponent(signupModel.email)}`);
      setDisplayModal(true);
      setTimeLeft(60);
    } catch (err: any) {
      if (err.response) {
        setErrorMessage(
          err.response.data?.error || err.response.data || "signup failed"
        );
      } else {
        console.log("Network or other error:", err.message);
        setErrorMessage("Network error or server not reachable");
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {displayModal ? (
        <EnterOTP
          aim={`signup`}
          handleCancel={() => setDisplayModal(false)}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          userEmail={signupModel.email}
        />
      ) : (
        <div className="relative w-[60%] sm:w-[50%] md:w-[40%] lg:w-[28%] rounded-[0.8rem] px-4 py-5 border border-gray-300 font-serif">
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
              {isLoading ? (
                <div className="flex justify-center items-center h-10">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-white border-solid"></div>
                </div>
              ) : (
                <span>Sign up</span>
              )}
            </button>
          </form>

          <GoogleLoginBtn text={"Sign up with Google"} />

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
