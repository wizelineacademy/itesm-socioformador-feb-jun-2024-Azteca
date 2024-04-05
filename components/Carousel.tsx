"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import UserProfileButton from "@/components/UserProfileButton";
import Autoplay from "embla-carousel-autoplay";

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000 }),
  ]);

  return (
    <div className="embla" ref={emblaRef}>
      <ul className="embla__container px-1 py-3">
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
        <li className="embla__slide">
          <UserProfileButton size="md" />
        </li>
      </ul>
    </div>
  );
}
