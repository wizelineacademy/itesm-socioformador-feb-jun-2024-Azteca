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
    return (
      <div className="flex flex-row items-center justify-between">
        <ProjectCard />
      </div>
    );
  }

  return (
    <ul className="overflow-x-auto">
      {projectsQuery.data.map((project, index) => (
        <li key={index}>
          <ProjectCard
            id={projectsQuery.data[index].id}
            name={projectsQuery.data[index].name}
          />
        </li>
      ))}
    </ul>
  );
}
