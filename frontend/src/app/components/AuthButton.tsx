import { JSX } from "react";

const AuthButton = ({ label, styles }: { label: string | JSX.Element; styles?: string }) => {
  return (
    <div>
      <button
        type="submit"
        className={` 
            text-[1rem]  py-2 w-[100%] rounded-lg
            relative text-white hover:text-black border-2 border-black transition-colors duration-300
            bg-black  overflow-hidden
            before:absolute before:inset-0 before:bg-white
            before:translate-x-[-100%] hover:before:translate-x-0 
            before:transition-transform before:duration-500 before:ease-in-out
            ${styles}
        `}
      >
        <span className="relative z-10">{label}</span>
      </button>
    </div>
  );
};

export default AuthButton;
