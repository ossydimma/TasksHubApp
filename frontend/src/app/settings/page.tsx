"use client";
import { useState, useEffect } from "react";
import EyeIcon from "../components/EyeIcon";
import { UserDetails } from "../../../mock";
import {
  PasswordType,
  PasswordValueType,
  ShowPasswordType,
} from "../../../Interfaces";
import ChangeContact from "../components/ChangeContact";
import ModifyContact from "../components/ModifyContact";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "../../../services/axios";
import LoadingSpinner from "../components/LoadingSpinner";

export default function page() {
  const { userInfo, isAuthenticated, setUserInfo } = useAuth();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disablePage, setDisablePage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [showChangeContact, setShowChangeContact] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<ShowPasswordType>({
    newPassword: true,
    confirmPassword: true,
  });

  const [edit, setEdit] = useState({
    userName: userInfo?.userName,
    email: userInfo?.email,
  });

  const [passwordType, setPasswordType] = useState<PasswordType>({
    newPassword: "password",
    confirmPassword: "password",
  });

  const [passwordValue, setPasswordValue] = useState<PasswordValueType>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedOption, setSelectedOption] = useState<
    "userName" | "email" | "password" | "number" | undefined
  >(undefined);

  // functions
  const EditUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (edit.userName === "" || edit.email === "") return;

    if (edit.userName === userInfo?.userName) {
      setMessage("No changes was made");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/update-username", edit);
      setIsSuccess(true);

      if (res.data.newUserName) {
        setUserInfo((prev) =>
          prev ? { ...prev, userName: res.data.newUserName } : prev
        );
      }

      setMessage("username updated successfully.");
      setTimeout(()=> {
        setDisablePage(false);
        setSelectedOption(undefined);
        setMessage('');
      }, 3000)

      

    } catch (err: any) {
      console.error(err);
      setMessage(err.data);
    } finally {
      setIsLoading(false);
    }
  };
  const ChangeEmail = () => {};
  const ChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (passwordValue.oldPassword === "") {
      setMessage("Old password cannot be empty");
      return;
    } else if (passwordValue.newPassword === "") {
      setMessage("New password cannot be empty");
      return;
    } else if (passwordValue.confirmPassword === "") {
      setMessage("Confirm password cannot be empty");
      return;
    } else {
      console.log("old password", passwordValue.oldPassword);
      console.log("new password", passwordValue.newPassword);
      console.log("confirm password", passwordValue.confirmPassword);
      if (passwordValue.newPassword !== passwordValue.confirmPassword) {
        setMessage("New password and confirm password do not match");
      } else {
        // Call the API to change the password
        alert("Password changed successfully");
      }
    }
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return (
    <div className="px-10 pt-7 pb-20 md:pb-0 w-full h-auto md:h-full font-serif relative">
      {isLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner />
        </div>
      )}
      <h1 className=" w-full text-center font-serif text-3xl font-bold border-b-2 border-gray-400 border-dashed pb-2 mb-4 md:mb-8">
        Settings
      </h1>
      <div className={`${disablePage ? `hidden` : `block`} px-8 pt-20`}>
        <ul className="flex flex-col gap-6">
          {/* ------------------------USERNAME------------------ */}
          <li
            className={`flex justify-between border-b-2 border-gray-600 pb-4  ${
              disablePage ? `cursor-none` : `cursor-pointer hover:border-b-4`
            }`}
            onClick={() => {
              setDisablePage(true);
              setMessage("");
              setSelectedOption("userName");
            }}
          >
            <span className="font-semibold text-xl">Username</span>
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 7L15 12L10 17"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </li>

          {/* ------------------------EMAIL------------------ */}

          <li
            className={`flex justify-between border-b-2 border-gray-600 pb-4  ${
              disablePage ? `cursor-none` : `cursor-pointer hover:border-b-4`
            }`}
            onClick={() => {
              setDisablePage(true);
              setMessage("");
              setSelectedOption("email");
            }}
          >
            <span className="font-semibold text-xl">Email address</span>
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 7L15 12L10 17"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </li>

          {/* ------------------------PHONE NUMBER------------------ */}
          {/* <li
            className={`flex justify-between border-b-2 border-gray-600 pb-4  ${
              disablePage ? `cursor-none` : `cursor-pointer hover:border-b-4`
            }`}
            onClick={() => {
              setDisablePage(true);
              setMessage("");
              setSelectedOption("number");
            }}
          >
            <span className="font-semibold text-xl">Phone number</span>
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 7L15 12L10 17"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </li> */}

          {/* ------------------------PASSWORD------------------ */}

          <li
            className={`flex justify-between border-b-2 border-gray-600 pb-4  ${
              disablePage ? `cursor-none` : `cursor-pointer hover:border-b-4`
            }`}
            onClick={() => {
              setDisablePage(true);
              setMessage("");
              setSelectedOption("password");
            }}
          >
            <span className="font-semibold text-xl">Change password</span>
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10 7L15 12L10 17"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </li>
        </ul>
      </div>

      {/* ------------------------Edit options------------------*/}

      {disablePage && (
        <div className=" pt-8 pb-12 px-10 md:px-6 xl:px-10 mx-2 absolute  left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-xl h-[33.5rem] md:h-auto top-3 md:top-8  w-[90%] md:w-[45%] rounded-2xl ">
          <div
            className="cursor-pointer"
            onClick={() => {
              setDisablePage(false);
              setSelectedOption(undefined);
            }}
          >
            <svg
              className="w-8 md:w-10 ml-auto"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g id="cancel">
                  <g id="cancel_2">
                    <path
                      id="Combined Shape"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z"
                      fill="#000"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          <h1 className="font-serif text-2xl md:text-xl xl:text-2xl text-center font-semibold  border-b-2 border-gray-500 border-dashed pb-4 mb-4 md:mb-4">
            {selectedOption === "userName"
              ? "Edit Username"
              : selectedOption === "email"
              ? "Email Address"
              : selectedOption === "number"
              ? "Phone Number"
              : "Change Password"}
          </h1>
          <p className={`${isSuccess ? "text-green-600" : "text-red-500"}  mb-2`}>{message}</p>
          {selectedOption === "userName" && (
            <div>
              <form action="" onSubmit={EditUsername}>
                <div className="flex flex-col gap-4">
                  <label htmlFor="userName" className="font-semibold text-xl">
                    Username:
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    defaultValue={edit.userName}
                    onChange={(e) =>
                      setEdit({ ...edit, userName: e.target.value })
                    }
                    className="border-2 border-gray-500 rounded-md px-3 py-2 outline-none focus:border-black"
                  />
                </div>
                <div className="ml-auto bg-black hover:bg-white border-2 border-black text-white hover:text-black font-semibold text-lg px-4 py-2  rounded-lg mt-6 w-fit ">
                  <button className="" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
          )}

          {selectedOption === "number" && (
            <ModifyContact
              setShowChangeNumber={setShowChangeContact}
              option={selectedOption}
            />
          )}

          {/* {selectedOption === "email" && ()} */}

          {selectedOption === "email" && (
            <ModifyContact
              setShowChangeNumber={setShowChangeContact}
              option={selectedOption}
            />
          )}

          {/* ------------------------PASSWORD------------------ */}
          {selectedOption === "password" && (
            <div>
              <form
                action=""
                onSubmit={ChangePassword}
                className="flex flex-col gap-4 font-serif"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="old-password"
                    className="font-semibold text-xl"
                  >
                    Old Password:
                  </label>
                  <input
                    type={`text`}
                    id="old-password"
                    name="old-password"
                    onChange={(e) =>
                      setPasswordValue({
                        ...passwordValue,
                        oldPassword: e.target.value,
                      })
                    }
                    value={passwordValue.oldPassword}
                    placeholder="Enter your old password"
                    className="border-2 border-gray-500 rounded-md px-3 py-2 outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="new-password"
                    className="font-semibold text-xl"
                  >
                    New Password:
                  </label>
                  <div className="border-2 border-gray-500 w-full  pr-5 rounded-lg bg-white flex items-center justify-between focus:border-black">
                    <input
                      type={passwordType.newPassword}
                      name="new-password"
                      id="new-password"
                      placeholder="Enter your new password"
                      onChange={(e) =>
                        setPasswordValue({
                          ...passwordValue,
                          newPassword: e.target.value,
                        })
                      }
                      value={passwordValue.newPassword}
                      className="w-[95%]  rounded-md px-3 py-2 outline-none "
                    />
                    {/* @* ICON *@  */}
                    <EyeIcon
                      showPassword={showPassword.newPassword}
                      handlePasswordType={toggleNewPasword}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirm-password"
                    className="font-semibold text-xl"
                  >
                    Confirm Password:
                  </label>
                  <div className="border-2 border-gray-500 w-full  pr-5 rounded-lg bg-white flex items-center justify-between focus:border-black">
                    <input
                      type={passwordType.confirmPassword}
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="Confirm your new password"
                      onChange={(e) =>
                        setPasswordValue({
                          ...passwordValue,
                          confirmPassword: e.target.value,
                        })
                      }
                      value={passwordValue.confirmPassword}
                      className="w-[95%]  rounded-md px-3 py-2 outline-none "
                    />
                    {/* @* ICON *@  */}
                    <EyeIcon
                      showPassword={showPassword.confirmPassword}
                      handlePasswordType={toggleConfirmPassword}
                    />
                  </div>
                </div>

                <div className="ml-auto bg-black hover:bg-white border-2 border-black text-white hover:text-black font-semibold text-lg px-4 py-2  rounded-lg mt- w-fit ">
                  <button className="" type="submit">
                    Change
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {showChangeContact && (
        <ChangeContact
          setShowChangeContact={setShowChangeContact}
          option={selectedOption}
        />
      )}
    </div>
  );
}
