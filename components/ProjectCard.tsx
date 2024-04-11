"use client";

import React from "react";
import { usePathname } from "next/navigation";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import PlusIcon from "./icons/PlusIcon";

export default function ProjectCard() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-20 rounded-lg bg-white p-4">
      <div>
        <h3 className="pb-2 text-lg font-medium">Project 1</h3>
        <p className="text-graySubtitle pb-4 text-sm">In progress</p>
        <div className="ml-[6px]">
          <UserProfileButton size="xs" className="mx-[-6px]" />
          <UserProfileButton size="xs" className="mx-[-6px]" />
          <UserProfileButton size="xs" className="mx-[-6px]" />
          <button
            disabled
            className={
              "group mx-[-6px] rounded-full bg-white p-2 text-primary drop-shadow-lg"
            }
          >
            <PlusIcon size="h-4 w-4" color="primary" />
          </button>
        </div>
      </div>
      <ChevronRightIcon path="/projects/1" currentPath={pathname} />
    </div>
  );
}
