"use client";
import Link from "next/link";
import PCPIcon from "./icons/PCPIcon";
import { usePathname } from "next/navigation";

interface PCPIconInterface {
  path: string;
}
const PCPIconNavbar = ({ path }: PCPIconInterface) => {
  const currentPath = usePathname();
  const isActive = currentPath === path;
  return (
    <Link
      href={path}
      className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
    >
      <PCPIcon
        color={isActive ? "text-white" : "text-primary"}
        size="h-6 w-6"
      />
    </Link>
  );
};

export default PCPIconNavbar;
