import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TaskDetailPage() {
    const params = useParams();
    const taskId = params.id;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <main className="pb-[3.6rem] sm:pb-0 relative w-full h-full">
            {isLoading && (
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

            <div className="py-4 sm:py-8 pb absolute left-1/2 top-4 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 z-10 bg-white shadow-xl   w-[90%] md:w-[80%] lmd:w-[48%] rounded-3xl">
                <div className=" w-[80%] lmd:w-[70%] mx-auto  px-4 py-2 border-b-2 border-dashed border-gray-500 ">
                    <h1 className="font-bold font-serif text-2xl sm:text-3xl text-center italic">
                        Task Details
                    </h1>
                </div>
            </div>
        </main>
    )
}