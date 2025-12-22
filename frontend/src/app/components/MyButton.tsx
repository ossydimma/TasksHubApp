const MyButton = ({
  label,
  styles,
  type = "button",
  disable = false,
  handleClickEvent,
}: {
  label: string;
  styles?: string;
  type?: "button" | "submit" | "reset";
  disable?: boolean,
  handleClickEvent?: () => void;
}) => {
  return (
    <div>
      <button
        onClick={handleClickEvent}
        type={type}
        disabled={disable}
        className={`   
            relative px-6 py-3 text-white hover:text-black border-2 border-black transition-colors duration-300
            bg-black rounded-3xl overflow-hidden
            before:absolute before:inset-0 before:bg-white
            before:translate-x-[-100%] hover:before:translate-x-0 
            before:transition-transform before:duration-500 before:ease-in-out
            ${styles}`}
      >
        <span className="relative z-10">{label}</span>
      </button>
    </div>
  );
};

export default MyButton;
