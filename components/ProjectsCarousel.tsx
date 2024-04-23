"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProjectCard from "@/components/ProjectCard";

import { useQuery } from "@tanstack/react-query";
import { getProjectsProfile } from "@/services/user";

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, []);

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
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container">
        {projectsQuery.data.map((project, index) => (
          <li key={index} className="embla__slide__project">
            <ProjectCard
              id={projectsQuery.data[index].id}
              name={projectsQuery.data[index].name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
