"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import UserProfileButton from "@/components/UserProfileButton";
import Autoplay from "embla-carousel-autoplay";
import { Tooltip } from "@mantine/core";
import Link from "next/link";
import NoDataCard from "@/components/NoDataCard";

export default function EmblaCarousel({
  coworkers,
}: {
  coworkers: { name: string; id: string; photoUrl: string | null }[];
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000 }),
  ]);

  if (coworkers.length === 0) {
    return (
      <div className="mb-6 mt-3 flex flex-wrap items-center justify-center gap-5 rounded-lg bg-slate-300/20 py-4">
        <NoDataCard text="No coworkers found" />
      </div>
    );
  }

  return (
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container px-1 py-4">
        {coworkers.map((user, index) => (
          <Tooltip.Floating label={user.name} color="#6640D5" key={index}>
            <li className="embla__slide__coworker">
              <Link href={`/profile/${user.id}`} className="">
                <UserProfileButton size="md" photoUrl={user.photoUrl || ""} />
              </Link>
            </li>
          </Tooltip.Floating>
        ))}
      </ul>
    </div>
  );
}
