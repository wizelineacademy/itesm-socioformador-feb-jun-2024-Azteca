import React from "react";
import Link from "next/link";
import UserProfileButton from "@/components/UserProfileButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import { getEmployeesInProjectById } from "@/services/project";

interface ProjectProps {
  id: number;
  name: string;
  date?: string;
  description?: string;
}

export default async function ProjectCard({
  id,
  name,
  date,
  description,
}: ProjectProps) {
  const coworkersQuery = await getEmployeesInProjectById(id);

  return (
    <div
      className="flex h-full min-h-40 w-fit items-center gap-4 rounded-lg bg-white p-4"
      data-testid={`project-${id}`}
    >
      <div className="flex h-full flex-col">
        <h3
          className="w-[20ch] pb-2 text-base font-medium"
          data-testid="project-name"
        >
          {name}
        </h3>
        {date && (
          <p
            className="pb-4 text-sm text-graySubtitle"
            data-testid="project-date"
          >
            {date}
          </p>
        )}
        {description && (
          <p
            className="w-[30ch] pb-4 text-xs text-grayText"
            data-testid="project-description"
          >
            {description}
          </p>
        )}
        <p className="pb-4 text-sm text-graySubtitle">In progress</p>
        <div className="ml-[6px] mt-auto">
          <ul className="flex">
            {coworkersQuery &&
              coworkersQuery.map((coworker, index) => (
                <li key={index} data-testid="project-coworker">
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
        data-testid={`project-${id}-link`}
        href={`/projects/${id}`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary hover:bg-primary-dark"
      >
        <ChevronRightIcon size="h-6 w-6" color="white" />
      </Link>
    </div>
  );
}
