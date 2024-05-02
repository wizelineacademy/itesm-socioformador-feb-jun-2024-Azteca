"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import UserProfileButton from "@/components/UserProfileButton";
import Autoplay from "embla-carousel-autoplay";

import { useQuery } from "@tanstack/react-query";

import { getCoWorkers } from "@/services/user";

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000 }),
  ]);

  const coworkersQuery = useQuery({
    queryKey: ["coworkers"],
    queryFn: () => getCoWorkers(),
  });

  if (!coworkersQuery.data) {
    return (
      <div className="flex flex-row items-center justify-between">
        <UserProfileButton
          size="md"
          className=" animate-pulse transition-all duration-200"
          color="text-grayText"
        />
        <UserProfileButton
          size="md"
          className=" animate-pulse transition-all  duration-200"
          color="text-grayText"
        />
        <UserProfileButton
          size="md"
          className=" animate-pulse transition-all duration-200"
          color="text-grayText"
        />
      </div>
    );
  }

  if (coworkersQuery.data.length === 0) {
    return (
      <div className="flex h-20 w-full flex-row items-center justify-between">
        <p className="text-lg text-black">
          No se encontraron compañeros de trabajo
        </p>
      </div>
    );
  }

  return (
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container px-1 py-3">
        {coworkersQuery.data.map((user, index) => (
          <li key={index} className="embla__slide__coworker">
            <UserProfileButton size="md" photoUrl={user.photoUrl || ""} />
          </li>
        ))}
      </ul>
    </div>
  );
}
