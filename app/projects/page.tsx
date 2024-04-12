import React from "react";
import Link from "next/link";
import ProjectExtendedCard from "@/components/ProjectExtendedCard";
import { title } from "process";

const Projects = () => {
  const existingProjects = [
    {
      title: "Project 1",
      date: "Sep 2023 - Dec 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonrisus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    },
    {
      title: "Project 2",
      date: "Sep 2023 - Dec 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonrisus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    },
    {
      title: "Project 3",
      date: "Sep 2023 - Dec 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonrisus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    },
    {
      title: "Project 4",
      date: "Sep 2023 - Dec 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonrisus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    },
    {
      title: "Project 5",
      date: "Sep 2023 - Dec 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonrisus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    },
  ];

  return (
    <main className=" h-dvh w-dvw overflow-hidden">
      <section className="mt-12 flex flex-col">
        <div className="mb-8 flex justify-center gap-5">
          <h3 className="text-4xl font-medium">My Projects</h3>
          <Link
            href="/projects/create"
            className="rounded-full bg-primary px-5 py-2 font-medium text-white drop-shadow-lg"
          >
            <button className="">Create</button>
          </Link>
        </div>
        <div className="mx-auto flex max-w-[60%] flex-wrap items-center justify-center gap-6">
          {existingProjects.map((project, index) => (
            <ProjectExtendedCard
              key={index}
              title={project.title}
              date={project.title}
              description={project.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Projects;
