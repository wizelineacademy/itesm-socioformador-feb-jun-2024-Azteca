"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import UserProfileButton from "@/components/UserProfileButton";
import Autoplay from "embla-carousel-autoplay";
import { Tooltip } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import NoData from "@/public/NoData.svg";

import { useQuery } from "@tanstack/react-query";

import { getCoWorkers } from "@/services/user";

export default function EmblaCarousel({ userId }: { userId: string }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000 }),
  ]);

  const coworkersQuery = useQuery({
    queryKey: ["coworkers"],
    queryFn: () => getCoWorkers(userId),
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
      <div className="mb-6 mt-3 flex flex-wrap items-center justify-center gap-5 rounded-lg bg-slate-300/20 py-4">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={NoData}
            alt="No Data Image"
            className="hidden md:block"
            priority
            height={70}
          />
          <p className="text-center text-sm font-medium text-grayText">
            No coworkers found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container px-1 py-3">
        {coworkersQuery.data.map((user, index) => (
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
