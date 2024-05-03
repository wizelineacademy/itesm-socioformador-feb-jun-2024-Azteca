"use client";

import React from "react";
import Link from "next/link";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import PlusIcon from "./icons/PlusIcon";

import { useQuery } from "@tanstack/react-query";
import { getEmployeesInProjectById } from "@/services/project";

interface ProjectProps {
  id?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
}

export default function ProjectCard({
  id,
  name,
  startDate,
  endDate,
}: ProjectProps) {
  const coworkersQuery = useQuery({
    queryKey: ["coworkersinproject"],
    queryFn: () => getEmployeesInProjectById(id!),
  });

  if (!coworkersQuery.data) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex items-center gap-10 rounded-lg bg-white p-4">
      <div>
        <h3 className="w-[15ch] pb-2 text-base font-medium">{name}</h3>
        <p className="pb-4 text-sm text-graySubtitle">In progress</p>
        <div className="ml-[6px]">
          <ul className="flex">
            {coworkersQuery.data.map((coworker, index) => (
              <li key={index}>
                <UserProfileButton
                  size="xs"
                  className="mx-[-6px]"
                  photoUrl={coworker.photoUrl || ""}
                />
              </li>
            ))}
            {/*             <button
              disabled
              className={
                "group mx-[-6px] rounded-full bg-white p-2 text-primary drop-shadow-lg"
              }
            >
              <PlusIcon size="h-4 w-4" color="primary" />
            </button> */}
          </ul>
        </div>
      </div>
      <Link
        href="/projects/1"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"
      >
        <ChevronRightIcon size="h-6 w-6" color="white" />
      </Link>
    </div>
  );
}
