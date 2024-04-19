"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import UserProfileButton from "@/components/UserProfileButton";
import Autoplay from "embla-carousel-autoplay";

import { useQuery, useMutation } from "@tanstack/react-query";

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
    return <div>loading...</div>;
  }

  return (
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container px-1 py-3">
        {coworkersQuery.data.map((user, index) => (
          <li key={index} className="embla__slide__coworker">
            <UserProfileButton size="md" />
          </li>
        ))}
      </ul>
    </div>
  );
}
