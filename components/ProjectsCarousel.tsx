"use client";

import React from "react";
import ProjectCard from "@/components/ProjectCard";
import Image from "next/image";
import NoData from "@/public/NoData.svg";

import { useQuery } from "@tanstack/react-query";
import { getProjectsProfile } from "@/services/user";

export default function ProjectsCarousel({ userId }: { userId: string }) {
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsProfile(userId),
  });

  if (!projectsQuery.data) {
    return <p>loading...</p>;
  }

  if (projectsQuery.data.length === 0) {
    return (
      <div className="mb-6 mt-3 flex flex-wrap items-center justify-center gap-5 rounded-lg bg-slate-300/20 py-4">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={NoData}
            alt="No Data Image"
            className="hidden md:block"
            priority
            height={70}
          />
          <p className="text-center text-sm font-medium text-grayText">
            No coworkers found
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="mt-2 flex w-full flex-row gap-4 overflow-x-auto">
      {projectsQuery.data.map((project, index) => (
        <li key={index}>
          <ProjectCard id={project.id} name={project.name} />
        </li>
      ))}
    </ul>
  );
}
