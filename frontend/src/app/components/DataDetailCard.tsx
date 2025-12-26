import { FaExclamation, FaCalendar, FaCheck, FaFile } from "react-icons/fa6";
import { DataCountsType } from "../../../Interfaces";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

export default function DataDetailCard({
  counts,
  styles
}: {
  counts: DataCountsType | null;
  styles?: string
}) {

  const router = useRouter();

  if (!counts) {
    return (
      <section className="h-auto md:h-[25vh] w-full flex flex-wrap justify-between px-4 md:px-6 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border w-[49%] md:w-[24%] rounded-xl p-4 mb-3"
          >
            <Skeleton height={20} width={100} />
            <Skeleton height={40} width={60} className="my-3" />
            <div className="flex items-center justify-center gap-3">
              <Skeleton circle height={30} width={30} />
              <Skeleton height={20} width={100} />
            </div>
          </div>
        ))}
      </section>
    );
  }

  const dataOverview = [
    {
      name: "Overdue Tasks",
      count: counts.overdueTasks,
      text: "Urgent",
      bg: "bg-red-300",
      icon: FaExclamation,
      iconBg: "bg-red-500",
    },
    {
      name: "Today's Task",
      count: counts.todaysTasks,
      text: "Need attention",
      bg: "bg-blue-300",
      icon: FaCalendar,
      iconBg: "bg-blue-500",
    },
    {
      name: "Total Tasks",
      count: counts.totalTasks,
      text: "view tasks",
      bg: "bg-green-300",
      icon: FaCheck,
      iconBg: "bg-green-500",
    },
    {
      name: "Documents",
      count: counts.documents,
      text: "View documents",
      bg: "bg-gray-300",
      icon: FaFile,
      iconBg: "bg-gray-500",
    },
  ];

      const navigateToTasksPage = () => {
    router.push("/mytasks");
  };

  const navToTaskPageWithFiltering = (by: string) => {
    const url = `/mytasks?filter=${by}`;
    router.push(url);
  };

    const handleDisplayData = (type: string) => {
    switch (type) {
      case "Overdue Tasks":
        navToTaskPageWithFiltering("overdue");
        break;
      case "Today's Task":
        navToTaskPageWithFiltering("todays");
        break;
      case "Total Tasks":
        navigateToTasksPage();
        break;
      case "Documents":
        router.push("/documentation");
        break;
    }
  };

  return (
    <section
      className={`h-auto md:h-[25vh] w-full flex flex-wrap justify-between  ${styles}`}
    >
      {dataOverview.map((data) => {
        const Icon = data.icon;

        return (
          <div
            key={data.name}
            className={` border w-[49%] md:w-[24%] rounded-xl ${data.bg} text-center py-6 md:py-2 mb-2 sm:mb-4 md:mb-0 flex flex-col justify-evenly cursor-pointer`}
            onClick={() => handleDisplayData(data.name)}
          >
            <h3
              className={`font-bold text-sm sm:text-xl md:text-lg lmd:text-xl`}
            >
              {data.name}
            </h3>
            <p
              className={`text-2xl sm:text-4xl md:text-3xl lmd:text-5xl font-extrabold mb-2`}
            >
              {data.count}
            </p>

            <div
              className={`flex items-center justify-center gap-2 sm:gap-4 md:gap-1 lmd:gap-3`}
            >
              <div className={` ${data.iconBg} rounded-full p-1.5 `}>
                <Icon size={15} color={`white`} />
              </div>
              <p className={`text-xs sm:text-sm lmd:text-lg font-medium`}>
                {data.text}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
