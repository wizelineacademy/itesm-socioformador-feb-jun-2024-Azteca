interface PlusIconInterface {
  color: string;
  size: string;
}

const PlusIcon = ({ color, size }: PlusIconInterface) => {
  return (
    <button
      disabled
      className={
        "group mx-[-6px] rounded-full bg-white p-2 text-primary drop-shadow-lg"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        // className="h-4 w-4"
        className={`${size} ${color}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  );
};

export default PlusIcon;
