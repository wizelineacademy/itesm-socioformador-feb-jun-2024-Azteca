import React from "react";
import Link from "next/link";
import { getProjects } from "@/services/project";
import { getUserRole } from "@/services/user";
import ProjectCard from "@/components/ProjectCard";

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
};

const Projects = async () => {
  const projects = await getProjects();
  const role = await getUserRole();

  return (
    <div>
      <section className="mt-12 flex flex-col">
        <div className="mb-8 flex justify-center gap-5">
          <h3 className="text-4xl font-medium">My Projects</h3>
          {(role === "MANAGER" || role === "ADMIN") && (
            <Link
              href="/projects/create"
              className="rounded-full bg-primary px-5 py-2 font-medium text-white drop-shadow-lg"
            >
              <button className="">Create</button>
            </Link>
          )}
        </div>
        <div className="mx-auto flex max-w-[60%] flex-wrap items-center justify-center gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              date={`${formatDate(project.startDate)} - ${formatDate(project.endDate)}`}
              description={project.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
