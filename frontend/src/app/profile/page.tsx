"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { redirect } from "next/navigation";
import { api } from "../../../services/axios";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { SettingsServices } from "../../../services/apiServices/SettingsService";

export default function Page() {
  const { userInfo, isAuthenticated } = useAuth();

  const [imgSrc, setImgSrc] = useState<string | undefined>(userInfo?.imageSrc);
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (
    e: React.ChangeEvent<HTMLInputElement>
  ): FormData | null => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("File", file);
      return formData;
    }
    return null;
  };

  const updateImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = validate(e);
    if (!formData) return;

    setLoading(true);
    try {
      const img = await SettingsServices.updateUserImage(formData);
      setImgSrc(img);
      e.target.value = "";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Fail upload", err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      redirect("/login");
    }
  }, [isAuthenticated, loading]);

  return (
    <div className=" relative px-10 pt-7 pb-20 md:pb-0 w-full h-auto md:h-full flex flex-col gap-3 items-center">
      {loading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner
            styles={{ svg: " h-10 w-10", span: "text-[1.2rem]" }}
            text="Loading..."
          />
        </div>
      )}
      <h1 className=" w-full text-center font-serif text-3xl font-bold border-b-2 border-gray-400 border-dashed pb-2 mb-4 md:mb-14">
        Profile
      </h1>

      <div className="relative w-[60%] xxs:w-[42%] xs:w-[30%] sm:w-[36%] md:w-[28%] lmd:w-[25%] xl:w-[20%]  h-[25vh] sm:h-[33vh] md:h-[37vh] border-2 border-gray-300 rounded-full shadow-lg">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt="User's image"
            width={100}
            height={100}
            className="rounded-full w-full h-full object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font text-gray-500">
            NU
          </div>
        )}

        {/* Placeholder for image upload functionality */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={updateImg}
            className="hidden"
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            className="absolute bottom-4 right-4 flex items-center justify-center cursor-pointer stroke-white"
          >
            <svg
              className=" w-6 md:w-7 mx-auto bg-blue-500 rounded-full p-1"
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
                <path
                  d="M6 12H18M12 6V18"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </label>
        </div>
      </div>

      <div className="flex flex-col items-center pb-[2.2rem] border-b-2 border-gray-400 border-dashed w-full">
        <h2 className="font-bold text-xl">{userInfo?.fullName}</h2>
        <h2 className="font-medium text-[1.15rem]">{userInfo?.email}</h2>
      </div>

      <section className=" flex flex-col gap-4 md:flex-row md:gap-8 w-full justify-between items-center pt-2 pb-4 border-b-2 border-gray-400 border-dashed">
        <div className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border">
          <h2 className="font-extrabold text-[1rem]">All Task</h2>
          <p className="text-sm font-bold  ">1000</p>
        </div>
        <div className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border">
          <h2 className="font-extrabold md:text-[0.85rem] lmd:text-[1rem]">
            Completed Tasks
          </h2>
          <p className="text-sm font-bold ">1000</p>
        </div>
        <div className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border">
          <h2 className="font-extrabold md:text-[0.85rem] lmd:text-[1rem]">
            Pending Tasks
          </h2>
          <p className="text-sm font-bold ">1000</p>
        </div>
        <Link
          href={"/documentation"}
          className=" w-full md:w-[calc(1/4-1rem)] text-white text-center py-4 cursor-pointer bg-black rounded-2xl border"
        >
          <h2 className="font-extrabold text-[1rem]">Documents</h2>
          <p className="text-sm font-bold ">1000</p>
        </Link>
      </section>
    </div>
  );
}
