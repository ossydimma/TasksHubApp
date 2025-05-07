"use client";
import { useState } from "react";
import EyeIcon from "../components/EyeIcon";
import { LoginModelType } from "../../../Interfaces";

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
    remberMe: false,
  });

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
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className=" w-[60%] sm:w-[50%] md:w-[40%] lg:w-[28%] rounded-[0.8rem] px-4 py-8 border border-gray-300 font-serif">
        <h2 className=" text-2xl text-black font-semibold text-center">
          Login
        </h2>
        <form action="" className="relative flex flex-col gap-3 mt-10">
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
                checked={loginModal.remberMe}
                onChange={(e) =>
                  setLoginModal({ ...loginModal, remberMe: e.target.checked })
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
        <div className="border border-gray-300 w-[100%] py-2  rounded-lg flex justify-center items-center gap-7 my-4 cursor-pointer">
          <svg
            className="w-4"
            viewBox="-3 0 262 262"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="xMidYMid"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path
                  d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451"
                  fill="#4285F4"
                >
                  {" "}
                </path>
                <path
                  d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1"
                  fill="#34A853"
                >
                  {" "}
                </path>
                <path
                  d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37"
                  fill="#FBBC05"
                >
                  {" "}
                </path>
                <path
                  d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479"
                  fill="#EB4335"
                >
                  {" "}
                </path>
              </g>
            </g>
          </svg>
          <p className=" text-sm">Continue with google</p>
        </div>

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
