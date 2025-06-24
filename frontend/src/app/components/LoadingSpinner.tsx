
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-24">
      <svg
        className="animate-spin -ml-1 mr-3 h-10 w-10 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
      </svg>
      <span className="text-black font-semibold text-[1.2rem]">Loading...</span>
    </div>
  );
}
