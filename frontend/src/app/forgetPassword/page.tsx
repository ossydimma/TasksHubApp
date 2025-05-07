"use client";
import { useState } from "react";
import EnterOTP from "../components/enterOTP";
import { PasswordType, ShowPasswordType } from "../../../Interfaces";
import EyeIcon from "../components/EyeIcon";

export default function page() {
  const [displayEmail, setDisplayEmail] = useState<boolean>(true);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [emailValue, setEmailValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [passwordType, setPasswordType] = useState<PasswordType>({
    newPassword: "password",
    confirmPassword: "password",
  });

  const [passwordValue, setPasswordValue] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<ShowPasswordType>({
    newPassword: true,
    confirmPassword: true,
  });

  //FUNCTIONS
  const handleSendCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplayEmail(false);
    setDisplayModal(true);
    setTimeLeft(60);
  };

  const handleVerifyCode = () => {
    // Handle the verification code logic here
    setDisplayModal(false);
  };

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

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Check if the password and confirm password match
    if (passwordValue.newPassword !== passwordValue.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Perform reset password logic here
    console.log("Reset Password data:", passwordValue);
    setIsLoading(false);
  };

  return (
    <>
      {displayModal && (
        <EnterOTP
          handleVerifyCode={handleVerifyCode}
          handleCancel={() => {
            setDisplayModal(false);
            setDisplayEmail(true);
          }}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          userEmail={emailValue}
        />
      )}

      <div>
        {displayEmail && (
          <div className="w-[60%] sm:w-[50%] md:w-[40%] lg:w-[28%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-300 p-4 rounded-lg shadow-lg">
            <a
              href="/login"
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-300 w-fit p-1 transition-all duration-300 ease-in-out "
              onClick={() => {
                setDisplayModal(false);
              }}
            >
              <svg
                className="w-4"
                viewBox="0 0 512 512"
                version="1.1"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <style type="text/css"> </style> <g id="Layer_1"></g>{" "}
                  <g id="Layer_2">
                    {" "}
                    <g>
                      {" "}
                      <path d="M217,129.88c-6.25-6.25-16.38-6.25-22.63,0L79.61,244.64c-0.39,0.39-0.76,0.8-1.11,1.23 c-0.11,0.13-0.2,0.27-0.31,0.41c-0.21,0.28-0.42,0.55-0.62,0.84c-0.14,0.21-0.26,0.43-0.39,0.64c-0.14,0.23-0.28,0.46-0.41,0.7 c-0.13,0.24-0.24,0.48-0.35,0.73c-0.11,0.23-0.22,0.45-0.32,0.68c-0.11,0.26-0.19,0.52-0.28,0.78c-0.08,0.23-0.17,0.46-0.24,0.69 c-0.09,0.29-0.15,0.58-0.22,0.86c-0.05,0.22-0.11,0.43-0.16,0.65c-0.08,0.38-0.13,0.76-0.17,1.14c-0.02,0.14-0.04,0.27-0.06,0.41 c-0.11,1.07-0.11,2.15,0,3.22c0.01,0.06,0.02,0.12,0.03,0.18c0.05,0.46,0.12,0.92,0.21,1.37c0.03,0.13,0.07,0.26,0.1,0.39 c0.09,0.38,0.18,0.76,0.29,1.13c0.04,0.13,0.09,0.26,0.14,0.4c0.12,0.36,0.25,0.73,0.4,1.09c0.05,0.11,0.1,0.21,0.15,0.32 c0.17,0.37,0.34,0.74,0.53,1.1c0.04,0.07,0.09,0.14,0.13,0.21c0.21,0.38,0.44,0.76,0.68,1.13c0.02,0.03,0.04,0.06,0.06,0.09 c0.55,0.81,1.18,1.58,1.89,2.29l114.81,114.81c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63 l-87.5-87.5h291.62c8.84,0,16-7.16,16-16s-7.16-16-16-16H129.51L217,152.5C223.25,146.26,223.25,136.13,217,129.88z"></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <span>Back</span>
            </a>
            <h2 className=" text-xl mt-4 text-black font-semibold text-center">
              Email Verification
            </h2>
            <form
              action=""
              onSubmit={handleSendCode}
              className="relative flex flex-col  mt-6"
            >
              <div className="flex flex-col gap-2 ">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={emailValue}
                  placeholder="Enter your email"
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="outline-none border py-1 px-3 rounded-lg"
                  required
                />
              </div>
              <p className="text-sm font-bol text-gray-500  mt-3">
                A verification code will be sent you via Email
              </p>
              <button
                type="submit"
                className="bg-black text-white py-2 rounded-lg my-2"
              >
                Send Code
              </button>
            </form>
          </div>
        )}

        {!displayEmail && !displayModal && (
          <div className="w-[60%] sm:w-[50%] md:w-[40%] lg:w-[28%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-300 p-4 rounded-lg shadow-lg">
            <div
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-300 w-fit p-1 transition-all duration-300 ease-in-out "
              onClick={() => setDisplayEmail(true)}
            >
              <svg
                className="w-4"
                viewBox="0 0 512 512"
                version="1.1"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <style type="text/css"> </style> <g id="Layer_1"></g>{" "}
                  <g id="Layer_2">
                    {" "}
                    <g>
                      {" "}
                      <path d="M217,129.88c-6.25-6.25-16.38-6.25-22.63,0L79.61,244.64c-0.39,0.39-0.76,0.8-1.11,1.23 c-0.11,0.13-0.2,0.27-0.31,0.41c-0.21,0.28-0.42,0.55-0.62,0.84c-0.14,0.21-0.26,0.43-0.39,0.64c-0.14,0.23-0.28,0.46-0.41,0.7 c-0.13,0.24-0.24,0.48-0.35,0.73c-0.11,0.23-0.22,0.45-0.32,0.68c-0.11,0.26-0.19,0.52-0.28,0.78c-0.08,0.23-0.17,0.46-0.24,0.69 c-0.09,0.29-0.15,0.58-0.22,0.86c-0.05,0.22-0.11,0.43-0.16,0.65c-0.08,0.38-0.13,0.76-0.17,1.14c-0.02,0.14-0.04,0.27-0.06,0.41 c-0.11,1.07-0.11,2.15,0,3.22c0.01,0.06,0.02,0.12,0.03,0.18c0.05,0.46,0.12,0.92,0.21,1.37c0.03,0.13,0.07,0.26,0.1,0.39 c0.09,0.38,0.18,0.76,0.29,1.13c0.04,0.13,0.09,0.26,0.14,0.4c0.12,0.36,0.25,0.73,0.4,1.09c0.05,0.11,0.1,0.21,0.15,0.32 c0.17,0.37,0.34,0.74,0.53,1.1c0.04,0.07,0.09,0.14,0.13,0.21c0.21,0.38,0.44,0.76,0.68,1.13c0.02,0.03,0.04,0.06,0.06,0.09 c0.55,0.81,1.18,1.58,1.89,2.29l114.81,114.81c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63 l-87.5-87.5h291.62c8.84,0,16-7.16,16-16s-7.16-16-16-16H129.51L217,152.5C223.25,146.26,223.25,136.13,217,129.88z"></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <span>Back</span>
            </div>
            <h2 className=" text-xl mt-2 mb-4 text-black font-semibold text-center">
              Password
            </h2>

            <form
              action=""
              onSubmit={resetPassword}
              className=" flex flex-col gap-4"
            >
              <p className="text-red-500">{errorMessage}</p>
              <div className="flex flex-col">
                <label htmlFor="new-password" className="">
                  New Password:
                </label>
                <div className="border bg-white w-full  pr-5 rounded-lg flex items-center justify-between ">
                  <input
                    type={passwordType.newPassword}
                    name="new-password"
                    id="new-password"
                    // placeholder="Enter your new password"
                    onChange={(e) =>
                      setPasswordValue({
                        ...passwordValue,
                        newPassword: e.target.value,
                      })
                    }
                    value={passwordValue.newPassword}
                    className="outline-none w-[95%] py-1 px-3"
                  />
                  {/* @* ICON *@  */}
                  <EyeIcon
                    showPassword={showPassword.newPassword}
                    handlePasswordType={toggleNewPasword}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="confirm-password" className="">
                  Confirm Password:
                </label>
                <div className="border w-full  pr-5 rounded-lg bg-white flex items-center justify-between">
                  <input
                    type={passwordType.confirmPassword}
                    name="confirm-password"
                    id="confirm-password"
                    onChange={(e) =>
                      setPasswordValue({
                        ...passwordValue,
                        confirmPassword: e.target.value,
                      })
                    }
                    value={passwordValue.confirmPassword}
                    className="outline-none w-[95%] py-1 px-3 "
                  />
                  {/* @* ICON *@  */}
                  <EyeIcon
                    showPassword={showPassword.confirmPassword}
                    handlePasswordType={toggleConfirmPassword}
                  />
                </div>
              </div>

              <button
                className="bg-black text-[1rem] text-white py-2 my-3 w-[100%] rounded-lg"
                type="submit"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-10">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-white border-solid"></div>
                  </div>
                ) : (
                  <span>Reset</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
