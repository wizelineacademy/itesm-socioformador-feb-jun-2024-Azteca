"use client";

interface ProjectExtendedCardProps {
  title: string;
  date: string;
  description: string;
}

import React from "react";
import { usePathname } from "next/navigation";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import PlusIcon from "./icons/PlusIcon";

const ProjectExtendedCard = ({
  title,
  date,
  description,
}: ProjectExtendedCardProps) => {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-20 rounded-lg bg-white p-5">
      <div>
        <h3 className="pb-2 text-lg font-medium">{title}</h3>
        <p className="pb-4 text-sm text-graySubtitle">{date}</p>
        <p className="w-[30ch] pb-4 text-xs text-grayText">{description}</p>
        <div className="flex justify-between">
          <div className="ml-[6px]">
            <UserProfileButton size="xs" className="mx-[-6px]" />
            <UserProfileButton size="xs" className="mx-[-6px]" />
            <UserProfileButton size="xs" className="mx-[-6px]" />
            <PlusIcon size="h-4 w-4" color="primary" />
          </div>
          <ChevronRightIcon path="/projects/1" currentPath={pathname} />
        </div>
      </div>
    </div>
  );
};

export default ProjectExtendedCard;
