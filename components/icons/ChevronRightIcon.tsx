import Link from "next/link";

interface ChevronRightIconInterface {
  path: string;
  currentPath: string;
}

const ChevronRightIcon = ({ path, currentPath }: ChevronRightIconInterface) => {
  const isActive = currentPath === path;

  return (
    <Link
      href={path}
      // className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="white"
        className={`${isActive ? "text-white" : "text-primary"} h-6 w-6`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </Link>
  );
};

export default ChevronRightIcon;
