"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function logout() {
  const {logout} = useAuth();
  const router = useRouter();


  return (
    <div>
      <div
        className={` w-[90%] md:w-[80%] lmd:w-[48%] h-fit px-6 bg-red-600 border py-10 flex flex-col gap-4 justify-center items-center rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
      >
        <p className=" text-center text-xl text-white font-mono font-semibold">
          Are you sure you want to Logout?
        </p>
        <div className="w-[70%] flex justify-between items-center">
          <button
            className="bg-white text-black py-3 px-8 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
            onClick={async() => {
              logout();
            }}
          >
            Yes
          </button>
          <button
            className="bg-white text-black py-3 px-9 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
            onClick={() => router.back()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
