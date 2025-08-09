"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function logout() {
    const [validate, setValidate] = useState<boolean>();
    const router = useRouter();
  return (
    <div>
      <div
        className={`px-6 bg-black border w-[80%] h-fit py-10 flex flex-col gap-4 justify-center items-center rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
      >
        <p className=" text-center text-xl text-white font-mono font-semibold">
          Are you sure you want to Logout?
        </p>
        <div className="w-[80%] flex justify-between items-center">
          <button
            className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
            onClick={() => {
              setValidate(!validate);
            //   deleteDocument(docId);
            }}
          >
            Yes
          </button>
          <button
            className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
            onClick={() => router.back()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
