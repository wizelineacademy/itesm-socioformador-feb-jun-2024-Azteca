"use client";

import React from "react";
import { usePathname } from "next/navigation";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
      <ChevronRightIcon path="/projects/1" currentPath={pathname} />
    </div>
  );
}
