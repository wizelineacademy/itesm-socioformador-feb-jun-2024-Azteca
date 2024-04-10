"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProjectCard from "@/components/ProjectCard";

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, []);

  return (
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container">
        <li className="embla__slide__project">
          <ProjectCard />
        </li>
        <li className="embla__slide__project">
          <ProjectCard />
        </li>
        <li className="embla__slide__project">
          <ProjectCard />
        </li>
        <li className="embla__slide__project">
          <ProjectCard />
        </li>
        <li className="embla__slide__project">
          <ProjectCard />
        </li>
      </ul>
    </div>
  );
}
