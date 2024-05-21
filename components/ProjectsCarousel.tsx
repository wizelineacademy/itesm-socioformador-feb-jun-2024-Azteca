"use client";

import React from "react";
import ProjectCard from "@/components/ProjectCard";
import NoDataCard from "@/components/NoDataCard";

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
        <NoDataCard text="No projects found" />
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
