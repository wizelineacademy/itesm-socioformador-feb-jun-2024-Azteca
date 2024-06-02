"use client";

import React from "react";
import Link from "next/link";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import { useQuery } from "@tanstack/react-query";
import { getEmployeesInProjectById } from "@/services/project";

interface ProjectProps {
  id: number;
  name: string;
  date?: string;
  description?: string;
}

export default function ProjectCard({
  id,
  name,
  date,
  description,
}: ProjectProps) {
  const coworkersQuery = useQuery({
    queryKey: ["coworkers-in-project", id],
    queryFn: () => getEmployeesInProjectById(id),
  });

  if (!coworkersQuery.data) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex h-full max-h-40 w-fit items-center gap-10 rounded-lg bg-white p-4">
      <div className="flex h-full flex-col">
        <h3 className="w-[20ch] pb-2 text-base font-medium">{name}</h3>
        {date && <p className="pb-4 text-sm text-graySubtitle">{date}</p>}
        {description && (
          <p className="w-[30ch] pb-4 text-xs text-grayText">{description}</p>
        )}
        <p className="pb-4 text-sm text-graySubtitle">In progress</p>
        <div className="ml-[6px] mt-auto">
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
          </ul>
        </div>
      </div>
      <Link
        href={`/projects/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"
      >
        <ChevronRightIcon size="h-6 w-6" color="white" />
      </Link>
    </div>
  );
}
