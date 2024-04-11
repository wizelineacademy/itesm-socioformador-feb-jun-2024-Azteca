import Link from "next/link";
import DashboardIcon from "./icons/DashboardIcon";

interface DashboardIconInterface {
  path: string;
  currentPath: string;
}
const DashboardIconNavbar = ({ path, currentPath }: DashboardIconInterface) => {
  const isActive = currentPath === path;
  return (
    <Link
      href={path}
      className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
    >
      <DashboardIcon
        size="h-6 w-6"
        color={isActive ? "text-white" : "text-primary"}
      />
    </Link>
  );
};
export default DashboardIconNavbar;
