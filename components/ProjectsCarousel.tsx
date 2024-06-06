import React from "react";
import ProjectCard from "@/components/ProjectCard";
import NoDataCard from "@/components/NoDataCard";

import { getProjectsProfile } from "@/services/user";

export default async function ProjectsCarousel({ userId }: { userId: string }) {
  const projectsQuery = await getProjectsProfile(userId);

  if (projectsQuery.length === 0) {
    return (
      <div className="mb-6 mt-3 flex flex-wrap items-center justify-center gap-5 rounded-lg bg-slate-300/20 py-4">
        <NoDataCard text="No projects found" />
      </div>
    );
  }

  return (
    <ul className="mt-2 flex w-full flex-row gap-4 overflow-x-auto pb-2">
      {projectsQuery.map((project, index) => (
        <li key={index}>
          <ProjectCard id={project.id} name={project.name} />
        </li>
      ))}
    </ul>
  );
}
