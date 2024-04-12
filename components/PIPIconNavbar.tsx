import Link from "next/link";
import PIPIcon from "./icons/PIPIcon";

interface PIPIconInterface {
  path: string;
  currentPath: string;
}
const PIPIconNavbar = ({ path, currentPath }: PIPIconInterface) => {
  const isActive = currentPath === path;
  return (
    <Link
      href={path}
      className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
    >
      <PIPIcon
        color={isActive ? "text-white" : "text-primary"}
        size="h-6 w-6"
      />
    </Link>
  );
};

export default PIPIconNavbar;
