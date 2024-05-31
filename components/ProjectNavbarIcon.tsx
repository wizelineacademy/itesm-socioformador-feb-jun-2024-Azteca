"use client";
import Link from "next/link";
import ProjectIcon from "../components/icons/ProjectIcon";
import { usePathname } from "next/navigation";

interface ProjectIconNavbarInterface {
  path: string;
}
const ProjectNavbarIcon = ({ path }: ProjectIconNavbarInterface) => {
  const currentPath = usePathname();
  const isActive = currentPath === path;
  return (
    <Link
      href={path}
      className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
    >
      <ProjectIcon
        color={`${isActive ? "text-white" : "text-primary"}`}
        size="h-6 w-6"
      />
    </Link>
  );
};
export default ProjectNavbarIcon;
