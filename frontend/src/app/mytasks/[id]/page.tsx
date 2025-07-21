"use client";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../../services/axios";
import { UserTaskType } from "../../../../Interfaces";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [task, setTask] = useState<UserTaskType | undefined>(undefined);

  async function getTask() {
    setIsLoading(true);

    try {
      const res = await api.get(`task/${taskId}`);
      setTask(res.data);
      console.log(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTask();
  }, [taskId]);

  return (
    <main className="pb-[3.6rem] sm:pb-0 relative w-full h-full">
      {isLoading && (
        <div className="h-full w-full flex justify-center items-center">
          <LoadingSpinner
            styles={{
              svg: "h-6 w-6 sm:h-9 sm:w-9  lmd:h-6 lmd:w-6",
              span: "text-sm sm:text-[1.1rem] lmd:text-sm",
            }}
            text="Searching..."
          />
        </div>
      )}

      <div className="py-4 sm:py-8 pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl   w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl">
        <div className=" w-[80%] lmd:w-[70%] mx-auto  px-4 py-2 border-b-2 border-dashed border-gray-500 ">
          <h1 className="font-bold font-serif text-2xl sm:text-3xl text-center italic">
            Task Details
          </h1>
        </div>
        <div className="h-[85%] overflow-hidden overflow-x-hidden pb-6 px-4">
          <dl
            className={`flex flex-col gap-2  mt-[2rem] text-sm sm:text-lg italic`}
          >
            <div className="flex items-center justify-between border border-gray-300 p-3">
              <dt className="font-bold">Task Name:</dt>
              <dd className="">{task?.title}</dd>
            </div>

            <div className="flex items-center  justify-between border border-gray-300  p-3  ">
              <dt className="font-bold ">Category:</dt>
              <dd className=" ">{task?.category}</dd>
            </div>

            <div className="flex items-center  justify-between border border-gray-300  p-3">
              <dt className="font-bold ">Deadline:</dt>
              <dd className="">{task?.deadline}</dd>
            </div>

            <div className="flex items-center  justify-between border border-gray-300  p-3">
              <dt className="font-bold ">Status:</dt>
              <dd className="">
                {task?.status == true ? "Completed" : "Pending"}
              </dd>
            </div>

            <div className="flex flex-col gap-1 border border-gray-300  p-3">
              <dt className="font-[900] ">Description:</dt>
              <dd className="ml-6 ">{task?.description}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between">
            <p
              className="underline text-red-500 cursor-pointer"
              // onClick={() => setOption("Delete")}
            >
              Delete Task
            </p>
            <p
              className="text-blue-400 underline cursor-pointer"
              onClick={() => router.push(`/mytasks/edit/${taskId}`)}
            >
              Edit Task
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
