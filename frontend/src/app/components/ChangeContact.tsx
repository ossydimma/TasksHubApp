import { signIn } from "next-auth/react";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/axios";
import { getApiErrorMessage } from "../../../SharedFunctions";

export default function ChangeContact({
  setShowChangeContact
}: {
  setShowChangeContact: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { userInfo, setLoading } = useAuth();


  const [OTP, setOTP] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const [disable, setDisable] = useState({
  //   submitBtn: true,
  //   getCodeBtn: true,
  //   getCodeInput: true,
  // });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isEnterOtp, setIsEnterOtp] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");

  // FUNCTIONS

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (OTP && userInfo?.email && newEmail) {
      const payload = {
        Otp: OTP,
        OldEmail: userInfo.email,
        NewEmail: newEmail,
      };
      console.log(payload);
      setLoading(true);
      try {
        await api.post("/settings/verify-old-email", payload);
        setIsEnterOtp(!isEnterOtp);
        setOTP("");
        setNewEmail("");
        setTimeLeft(60);
      } catch (err: unknown) {
        const errorMsg = getApiErrorMessage(err)
        setErrorMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    // await signOut({redirect: false});
    await signIn("google", {callbackUrl : "/settings?postSwitch=true"});
  };

  // USEeFFECTS

  useEffect(() => {
    if (timeLeft <= 0) return;

    // setDisable((prev) => ({ ...prev, getCodeBtn: false }));

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, setTimeLeft]);

  return (
    <div className="">
      <div className=" pt-6 pb-12 px-2 xxs:px-10 md:px-4 xl:px-10 mx-2 absolute  left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-xl h-[30rem] sm:h-[28rem] xs:h-[31rem]  top-[7rem] md:top-[7rem]  w-[95%] md:w-[68%] lmd:w-[52%] rounded-2xl ">
        <div>
          <section className="">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-300 w-fit p-1 transition-all duration-300 ease-in-out "
              onClick={() => {
                setShowChangeContact(false);
              }}
            >
              <svg
                className="w-6"
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
            <h1 className="text-xl xs:text-2xl md:text-xl xl:text-2xl text-center font-semibold font-serif border-b-2 border-gray-400 border-dashed mt-8 py-2">
              Change Google account
            </h1>
          </section>
          <form
            // action=""
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full rounded-xl  py-4"
          >
            <p className="text-red-500">{errorMessage}</p>
            <div className=' flex gap-4 justify-center items-center'>
              <p className="text-[1rem] font-semibold mb-2">
                Current:
              </p>
              <div className="bg-black text-white py-3 tracking-wider px-2 text-lg text-center font-[500] rounded-bl-none rounded-tr-none rounded-[2rem] border-2 border-gray-500 border-dotted w-[75%] ">
                {userInfo?.email}
              </div>
            </div>
            <div className="w-[80%] py-2 px-4 mx-auto">
              <div
                onClick={handleGoogleSignIn}
                className={`px-3 py-6 hover:bg-black bg-transparent text-black hover:text-white border-2 border-gray-400 w-[100%] rounded-lg flex justify-center items-center gap-2 md:gap-7 my-4 cursor-pointer`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleGoogleSignIn();
                }}
                aria-label="Sign in with Google"
              >
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
                <p className="text-sm lmd:text-[1rem]">Select new Google account</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
