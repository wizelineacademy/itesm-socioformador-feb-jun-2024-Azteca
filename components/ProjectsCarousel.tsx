"use client";

import React from "react";
import ProjectCard from "@/components/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { getProjectsProfile } from "@/services/user";

export default function ProjectsCarousel() {
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsProfile(null),
  });

  if (!projectsQuery.data) {
    return <p>loading...</p>;
  }

  if (projectsQuery.data.length === 0) {
    return <p>There are no projects active, insert svg here</p>;
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
