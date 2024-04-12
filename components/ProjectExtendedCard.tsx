"use client";

interface ProjectExtendedCardProps {
  title: string;
  date: string;
  description: string;
}

import React from "react";
import Link from "next/link";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import PlusIcon from "./icons/PlusIcon";

const ProjectExtendedCard = () => {
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
            <button
              disabled
              className={
                "group mx-[-6px] rounded-full bg-white p-2 text-primary drop-shadow-lg"
              }
            >
              <PlusIcon size="h-4 w-4" color="primary" />
            </button>
          </div>
          <Link
            href="/projects/1"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"
          >
            <ChevronRightIcon size="h-6 w-6" color="white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectExtendedCard;
