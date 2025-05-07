import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { UserDetails } from "../../../mock";

export default function ChangeContact({
  setShowChangeContact,
  option,
}: {
  setShowChangeContact: React.Dispatch<React.SetStateAction<boolean>>;
  option: string | undefined;
}) {
  const [newContact, setNewContact] = useState<string>("");
  const [OTP, setOTP] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [disable, setDisable] = useState({
    submitBtn: true,
    getCodeBtn: true,
    getCodeInput: true,
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (timeLeft <= 0) return;

    if (timeLeft === 1) setDisable({ ...disable, getCodeBtn: false });

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // FUNCTIONS

  const handleGetCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDisable({ ...disable, getCodeInput: false, getCodeBtn: true });
    setTimeLeft(60);
  };

  return (
    <div>
      <div className=" pt-6 pb-12 px-10 md:px-6 xl:px-10 mx-2 absolute  left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-xl h-[33.5rem] md:h-auto top-3 md:top-8  w-[90%] md:w-[48%] rounded-2xl ">
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
          <h1 className="text-xl xs:text-2xl md:text-xl xl:text-2xl text-center font-semibold font-serif py-2">
            Change {option === "number" ? "Phone Number" : "Email Address"}
          </h1>
        </section>

        <form
          action=""
          className="flex flex-col gap-4 w-full border-t-2 border-gray-500 border-dashed rounded-md px-4 py-1"
        >
          <p className="text-red-500">{errorMessage}</p>
          <div>
            <p className="text-sm xs:text-xl md:text-lg xl:text-xl font-semibold mb-2">
              Current {option === "number" ? "Phone Number" : "Email Address"}:
            </p>
            <div className=" border-2 border-gray-500 rounded-md px-3 py-2">
              {option === "number"
                ? UserDetails.PhoneNumber
                : UserDetails.email}
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <label
              htmlFor="Contact"
              className="font-semibold text-sm xs:text-xl md:text-lg xl:text-xl"
            >
              New {option === "number" ? "Phone Number" : "Email Address"}:
            </label>
            {option === "number" ? (
              <PhoneInput
                country={"us"}
                value={newContact}
                onChange={(phone) => {
                  setNewContact(phone);
                  if (phone.length > 6) {
                    setDisable({ ...disable, getCodeBtn: false });
                  } else {
                    setDisable({ ...disable, getCodeBtn: true });
                  }
                  console.log(newContact);
                }}
                inputStyle={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "5px",
                  border: "2px solid #7b7878",
                  padding: "10px",
                  paddingLeft: "4rem",
                  fontSize: "16px",
                }}
              />
            ) : (
              <input
                type="email"
                value={newContact}
                placeholder="Enter new email address"
                onChange={(email) => {
                  setNewContact(email.target.value);
                  if (
                    email.target.value.includes("@") &&
                    email.target.value.includes(".com")
                  ) {
                    setDisable({ ...disable, getCodeBtn: false });
                  } else {
                    setDisable({ ...disable, getCodeBtn: true });
                  }
                }}
                className="border-2 border-gray-500 rounded-md px-3 py-2 outline-none"
              />
            )}
          </div>
          <p className="text-[0.9rem] font-bold text-gray-500 -mb-1 mt-1">
            A verification code will be sent you via{" "}
            {option === "number" ? "WhatsApp or SMS" : "Email"}.
          </p>
          <div className=" flex items-center">
            <input
              type="text"
              name="userName"
              id="userName"
              disabled={disable.getCodeInput}
              value={OTP}
              onChange={(e) => {
                setOTP(e.target.value);
                setDisable({
                  ...disable,
                  submitBtn: e.target.value.length < 4,
                });
              }}
              placeholder="Enter Code"
              className="  outline-none w-[80%] rounded-l-md  border-2 border-r-0 border-gray-500 h-[2.8rem] px-3"
            />
            <button
              onClick={handleGetCode}
              disabled={disable.getCodeBtn}
              className={`${
                disable.getCodeBtn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black"
              } text-white w-[20%] h-[2.8rem] rounded-r-md text-sm`}
            >
              Get Code
            </button>
          </div>
          {timeLeft > 0 && (
            <p className="text-gray-500 text-sm">
              Resend code in {timeLeft} seconds
            </p>
          )}
          <div
            className={`${
              disable.submitBtn
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-white hover:text-black border-2 border-black"
            } ml-auto text-white font-semibold text-lg px-8 py-2 rounded-lg mt-2 w-fit`}
          >
            <button
              disabled={disable.submitBtn}
              className={`${
                disable.submitBtn ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
