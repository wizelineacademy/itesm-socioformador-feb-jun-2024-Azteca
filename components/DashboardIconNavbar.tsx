"use client";
import Link from "next/link";
import DashboardIcon from "../components/icons/DashboardIcon";
import { usePathname } from "next/navigation";

interface DashboardIconInterface {
  path: string;
}
const DashboardIconNavbar = ({ path }: DashboardIconInterface) => {
  const currentPath = usePathname();
  const isActive = currentPath.startsWith(path);
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
