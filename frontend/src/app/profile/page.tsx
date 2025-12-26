"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { redirect } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { SettingsServices } from "../../../services/apiServices/SettingsService";
import DataDetailCard from ".././components/DataDetailCard";
import { DataCountsType } from "../../../Interfaces";

export default function Page() {
  const { userInfo, isAuthenticated } = useAuth();

  const [imgSrc, setImgSrc] = useState<string | undefined>(userInfo?.imageSrc);
  const [dataCounts, setDataCounts] = useState<DataCountsType | null>(null);
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

  const getCounts = async () => {
    try {
      const res = await SettingsServices.getUserDataCounts();
      setDataCounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCounts();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      redirect("/login");
    }
  }, [isAuthenticated, loading]);

  return (
    <div className=" relative px-2 sm:px-5 md:px-10 pt-7 pb-16 sm:pb-20 md:pb-0 w-full h-auto md:h-full flex flex-col gap-3 items-center">
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
      <h1 className=" w-full text-center font-serif text-3xl font-bold border-b-2 border-gray-400 border-dashed pb-2 mb-2 sm:mb-4 md:mb-2">
        Profile
      </h1>

      <div className={`relative w-[35vw] max-w-52 min-w-28 aspect-square`}>
        <div
          className={`w-full h-full rounded-full overflow-hidden border-2 border-grey-300`}
        >
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
            className="absolute bottom-4 right-7 flex items-center justify-center cursor-pointer stroke-white"
          >
            <svg
              className=" w-6 mx-auto bg-blue-500 rounded-full p-1"
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
      </div>

      <div className="flex flex-col items-center pb-2 border-b-2 border-gray-400 border-dashed w-full">
        <h2 className="font-bold text-xl">{userInfo?.fullName}</h2>
        <h2 className="font-medium text-[1.15rem]">{userInfo?.email}</h2>
      </div>

      <section className=" w-full py-0 sm:py-4">
        <DataDetailCard counts={dataCounts} />
      </section>
    </div>
  );
}
