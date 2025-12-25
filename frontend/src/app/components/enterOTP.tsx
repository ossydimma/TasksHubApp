import { useEffect, useState } from "react";
import { api } from "../../../services/axios";
import {  useRouter } from "next/navigation";
import { AuthService } from "../../../services/apiServices/AuthService";
import { getApiErrorMessage } from "../../../SharedFunctions";

export default function EnterOTP({
  className,
  handleCancel,
  resetPassword,
  userEmail,
  newEmail,
  aim,
  timeLeft,
  setTimeLeft,
  setLoading,
}: {
  className: string;
  userEmail: string;
  newEmail?: string;
  aim: string;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
  resetPassword?: () => void;
}) {
  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const router = useRouter();

  // const getApiErrorMsg = (err: unknown): string => {
  //   if (err.response) {
  //     return (
  //       err.response.data?.error || err.response.data || "Verification failed"
  //     );
  //   } else {
  //     console.log("Network or other error:", err.message);
  //     return "Network error or server not reachable";
  //   }
  // };

  const validateChangeEmailForm = (): string | null => {
    if (userEmail !== "" && otp !== "" && newEmail !== "") {
      return null;
    }
    return "Fill in the fields";
  };

  const validateVerifyForm = (): string | null => {
    if (userEmail !== "" && otp !== "") {
      return null;
    }
    return "Fill in the fields";
  };

  const mapPayload = (change?: string) => {
    let payload;
    if (change) {
      payload = { OldEmail: userEmail, NewEmail: newEmail, Otp: otp };
    } else {
      payload = { email: userEmail, submittedOtp: otp, Aim: aim };
    }
    return payload;
  };

  const verifyChangeEmailCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formError = validateChangeEmailForm();
    if (formError) {
      setErrorMessage(formError);
      return;
    }
    const payload = mapPayload("email");

    setLoading(true);

    try {
      await AuthService.verifyNewEmail(payload);
      setIsVerified(true);
    } catch (err: unknown) {
      const error = getApiErrorMessage(err);
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formError = validateVerifyForm();
    if (formError) {
      setErrorMessage(formError);
      return;
    }
    const payload = mapPayload();
    // const payload = { email: userEmail, submittedOtp: OTP, Aim: aim };
    setLoading(true);
    try {
      await AuthService.verifyOtp(payload);
      if (aim === "reset password" && resetPassword) {
        resetPassword();
      } else {
        setIsVerified(true);
      }
    } catch (err: unknown) {
      const error = getApiErrorMessage(err);
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft,  setTimeLeft]);
  return (
    <div
      className={` ${className}  absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-300 p-4 rounded-lg shadow-lg`}
    >
      {!isVerified && (
        <>
          <div
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-300 w-fit p-1 transition-all duration-300 ease-in-out "
            onClick={handleCancel}
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
          <h3 className="text-lg font-semibold text-center">Enter Code</h3>
          <p className="text-red-500 text-sm">{errorMessage}</p>
          <form
            action=""
            onSubmit={
              aim === "change email"
                ? verifyChangeEmailCode
                : verifyCode
            }
            className="flex flex-col gap-2 mt-4"
          >
            <label htmlFor="otp" className="text-[0.9rem] sm:text-sm">
              {" "}
              Enter the verification code that was sent to your email.{" "}
              <strong>
                {aim === "signup"
                  ? userEmail
                  : aim === "login"
                  ? userEmail
                  : newEmail}
              </strong>{" "}
              <p>Check your spam mail</p>{" "}
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 outline-none mt-1 py-1 px-2 rounded-lg "
              required
            />
            <button
              className={`mt-4 bg-black text-white py-2 rounded-lg ${
                otp.length < 4 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={otp.length < 4}
              type="submit"
            >
              Verify
            </button>
          </form>
          <div className="text-center text-gray-500 text-sm mt-4">
            {timeLeft > 0 ? (
              <p className="">
                Resend code in <span className="text-black">{timeLeft}</span>{" "}
                seconds
              </p>
            ) : (
              <p
                onClick={async () => {
                  setTimeLeft(60);
                  setOtp("");

                  const payload =
                    aim === "signup"
                      ? userEmail
                      : aim === "login"
                      ? userEmail
                      : newEmail;
                  if (!payload) {
                    setErrorMessage("Email is required");
                    return;
                  }
                  try {
                    await api.post(
                      `/sendOTP?email=${encodeURIComponent(payload)}`
                    );
                  } catch (err: unknown) {
                    const errorMsg = getApiErrorMessage(err);
                    setErrorMessage(errorMsg);
                  }
                }}
              >
                Didn&apos;t receive code?{" "}
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Resend code
                </span>
              </p>
            )}
          </div>
        </>
      )}
      {isVerified && (
        <div className="py-6">
          <h3 className="text-lg font-semibold text-center">
            {aim === "signup"
              ? "Verification successful"
              : aim === "login"
              ? "Email verified\n You can now login "
              : "Email changed successfully.\n You are now set to log in using your new email. "}
          </h3>
          <div className="flex justify-center items-center">
            {aim === "signup" ? (
              <button
                className="mt-4 bg-black text-white py-2 px-4 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
              >
                Login
              </button>
            ) : (
              <button
                className="mt-4 bg-black text-white py-2 px-4 rounded-lg"
                onClick={handleCancel}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
