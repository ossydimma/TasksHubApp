import { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../../../context/AuthContext";

export default function ModifyContact({
  setShowChangeNumber,
  handleCancel,
  option,
}: {
  setShowChangeNumber: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancel: () => void;
  option: string | undefined;
}) {
  const [hasPhone, setHasPhone] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>();
  const [confirm, setConfirm] = useState<boolean>();
  const [timeMessage, setTimeMessage] = useState<string>("");

  const { userInfo } = useAuth();

  useEffect(() => {
    const now = Date.now();

    const value: string | null = localStorage.getItem("changeNext");

    if (value === null) {
      setDisabled(false);
      return;
    }

    const storedTime: number = Number(value);

    if (isNaN(storedTime)) {
      setDisabled(false);
      return;
    }

    const diff = storedTime - now;

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeMessage(`Will be avaible again in ${hours} hour${hours !== 1 ? "s" : ""} : ${minutes} minute${minutes !== 1 ? "s" : ""}.`);
      setDisabled(true);
    } else {
      setTimeMessage("");
      setDisabled(false);
    }
  }, []);
  return (
    <div>
      {hasPhone ? (
        <div className="relative">
          <div>
            <div className=' flex gap-4 justify-center items-center'>
              <p className="text-[1rem] font-semibold mb-2">
                Current:
              </p>
              <div className="bg-black text-white py-2 tracking-wider px-4 text-sm xxs:text-[1rem] md:text-sm lmd:text-[1rem] text-center font-[500] rounded-bl-none rounded-tr-none rounded-[2rem] border-2 border-gray-500 border-dotted w-[75%] ">
                {userInfo?.email}
              </div>
            </div>

            <p className="my-2 text-[1rem]">
              Your <strong>Google account</strong>{" "}
              helps us keep your account secure by adding an additional layer of
              verification.
            </p>
            <p className="text-sm -mb-3 mt-7 text-right text-red-600">{timeMessage}</p>
            <button
              className={`text-white rounded-lg px-4 py-2 mt-4 w-full ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
              disabled={disabled}
              onClick={() => setConfirm(true)}
            >
              Change Google Account
            </button>
          </div>
        </div>
      ) : (
        <div>
          <form action="">
            <div className="flex flex-col gap-4">
              <label htmlFor="userName" className="font-semibold text-xl">
                Phone Number:
              </label>
              <input
                type="text"
                name="userName"
                id="userName"
                defaultValue={"+1 234 567 890"}
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
      {confirm && (
        <div className=" pt-10 pb-12 px-10 md:px-6 xl:px-10  absolute  left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-xl h-[21rem] xxs:h-[19.2rem] xs:h-[19.5rem] md:h-[22rem] lmd:h-[21rem]  top-6 lmd:top-2  w-[95%] md:w-[95%] rounded-2xl ">
          <h2 className="font-serif font-bold text-xl text-center border-b-2 border-dashed pb-2">
            Are you Sure?
          </h2>
          <div className="my-8">
            Switching to another Google account will prevent you from logging in again with this one below
            <div className="ml-auto mt-2 bg-black text-white py-3 tracking-wider px-2 text-sm xxs:text-[1rem] md:text-sm lmd:text-[1rem] text-center font-[500] rounded-bl-none rounded-tr-none rounded-[2rem] border-2 border-gray-500 border-dotted w-[75%] ">
                {userInfo?.email}
              </div>
          </div>
          <div className="flex justify-between mt-4 text-sm xxs:text-[1rem] md:text-sm lmd:text-[1rem]">
            <button
              className={`hover:text-blue-500 hover:underline`}
              onClick={() => setShowChangeNumber(true)}
            >
              Do you want to proceed?
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
