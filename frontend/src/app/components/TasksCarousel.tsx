import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { GroupTasksCarousel, TasksCarousel } from "../../../Interfaces";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MyButton from "./MyButton";

import "swiper/css";
import { useRouter } from "next/navigation";

export default function TaskCarousel({
  tasks,
  handleDisplayData,
}: {
  tasks: GroupTasksCarousel | null;
  handleDisplayData: (type: string) => void;
}) {
  const router = useRouter();

  const labelMap: Record<string, string> = {
    allTasks: "All Tasks",
    overdueTasks: "Overdue Tasks",
    todayTasks: "Today's Tasks",
  };

  // Loading State
  if (!tasks) {
    return (
      <div className="md:mr-6 md:ml-2 w-full md:w-[58%] mb-10 md:mb-0 overflow-scroll">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="mb-8">
              <div className="flex justify-between items-center mb-5 font-serif px-5">
                <Skeleton width={120} height={25} />
                <Skeleton width={60} height={20} />
              </div>

              {Array(2)
                .fill(0)
                .map((_, j) => (
                  <div
                    key={j}
                    className="flex flex-col gap-4 pt-5 px-6 shadow-lg border-gray-400 border-t-2"
                  >
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={15} width="40%" />
                    <div className="flex items-center justify-between border-gray-400 border-t-2 py-4">
                      <Skeleton height={20} width="30%" />
                      <Skeleton height={30} width={80} />
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    );
  }

  // Validation Logic
  const hasNoTasks = Object.entries(tasks).every(([, arr]) => arr.length === 0);

  if (hasNoTasks) {
    return (
      <div className=" w-full md:w-[58%] mt-5 mb-10 md:my-0 flex justify-center items-center">
        <div className="h-full w-full flex flex-col gap-2.5 justify-center items-center font-bold text-[1rem] sm:text-[1.2rem] md:text-[0.9rem] lmd:text-[1.2rem]">
          <p>You have no task yet.</p>
          <div>
            <MyButton
              label="Create task"
              styles="text-lg"
              handleClickEvent={() => router.push("/mytasks/createtask")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      loop={true}
      autoplay={{
        delay: 5500,
        disableOnInteraction: true,
      }}
      className="mx- md:mr-6 md:ml-2 w-full md:w-[58%] mb-10 md:mb-0 h-auto"
    >
      {Object.entries(tasks)
        .filter(([, arr]) => arr.length > 0)
        .map(([name, arr]) => (
          <SwiperSlide key={name}>
            <div className="flex justify-between items-center text-black  md:mb-2 lmd:mb-2 font-serif px-5">
              <h2 className="font-bold text-xl sm:text-2xl">
                {labelMap[name] || name}
              </h2>
              <p
                className=" text-right text-sm sm:text-lg font-medium cursor-pointer"
                onClick={() => handleDisplayData(labelMap[name] || name)}
              >
                view all
              </p>
            </div>
            {arr.map((task: TasksCarousel) => (
              <div
                key={task.id}
                className=" flex flex-col mb-2 bg-[#020101] text-white border-gray-400 border-2 rounded-3xl rounded-tl-none rounded-br-none cursor-pointer "
                onClick={() => router.push(`mytasks/${task.id}`)}
              >
                <div className="pt-5 md:pt- lmd:pt-3 px-6 ">
                  <div className={`flex items-center justify-between pb-4`}>
                    <p className=" font-semibold text-sm sm:text-lg">
                      {task.title}
                    </p>
                    <p className="text-xs sm:text-sm font-medium mb-2">
                      {task.category} project
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-gray-400  border-t-2 py-4 md:py-2 lmd:py-4">
                    <p className="font-semibold text-sm sm:text-lg">
                      {task.deadline}
                    </p>
                    <div className="px-4 py-2 rounded-xl text-black bg-white cursor-pointer text-sm sm:text-lg">
                      {task.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
