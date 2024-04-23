"use client";

import UserProfileButton from "@/components/UserProfileButton";
import CoWorkersCarousel from "@/components/CoWorkersCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import Image from "next/image";
import JobSVG from "@/public/Job-Profile-Image.svg";

// Services imports
import { getInfoById, getTraits } from "@/services/user";
import BadgeSkeleton from "@/components/skeletons/BadgeSkeleton";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const userQuery = useQuery({
    queryKey: ["userData"],
    queryFn: () => getInfoById(),
  });

  const traitsQuery = useQuery({
    queryKey: ["traits"],
    queryFn: () => getTraits(),
  });

  return (
    <main>
      {/* Banner */}
      <section className="w-100 mx-auto mb-24 mt-6 flex h-52 rounded-xl bg-primary">
        <UserProfileButton
          size="lg"
          className="absolute left-20 top-60 h-fit"
          // photoUrl={BitmojiAdrian}
          // photoUrl="https://static.wikia.nocookie.net/heroe/images/0/08/Lucario_SSBU.png/revision/latest?cb=20200104023610&path-prefix=es"
        />
        <div className="flex w-5/6 flex-row items-center justify-between">
          <div className="w-full ps-56 leading-tight text-white">
            {userQuery.isLoading && (
              <div className=" flex flex-col gap-4">
                <div className="h-10 w-80 animate-pulse rounded-full bg-primary-light transition-all duration-100" />
                <div className="flex flex-row items-center gap-2">
                  <div className="h-5 w-36 animate-pulse rounded-full bg-primary-light transition-all duration-100" />
                  <p className="font-normal">-</p>
                  <div className="h-5 w-36 animate-pulse rounded-full bg-primary-light transition-all duration-100" />
                </div>
                <div className="h-5 w-32 animate-pulse rounded-full bg-primary-light transition-all duration-100" />
              </div>
            )}
            {userQuery.data && (
              <>
                <h2 className=" text-3xl font-semibold">
                  {userQuery.data.name}
                </h2>
                <div className="flex flex-row items-center gap-2 text-xl">
                  <p className="font-medium">{userQuery.data.role}</p>
                  <p className="font-normal">-</p>
                  <p className="font-normal">{userQuery.data.department}</p>
                </div>
                <p className="font-light">{userQuery.data.email}</p>
              </>
            )}
          </div>
          <Image src={JobSVG} alt="image" className="hidden md:block" />
        </div>
      </section>

      {/* Data */}
      <section className="w-100 mx-auto flex justify-between space-x-10">
        <div className="w-7/12">
          {/* Co-workers */}
          <div className="mb-6">
            <div className="mx-auto flex justify-between">
              <h3 className="text-2xl font-medium text-black">Co-workers</h3>
              <p className="cursor-pointer self-center text-sm text-graySubtitle">
                Show More
              </p>
            </div>
            <div className="mt-2">
              <CoWorkersCarousel />
            </div>
          </div>
          {/* Projects */}
          <div>
            <div className="mx-auto flex justify-between">
              <h3 className="text-2xl font-medium text-black">Projects</h3>
              <p className="cursor-pointer self-center text-sm text-graySubtitle">
                Show More
              </p>
            </div>
            <div className="mt-2 flex gap-4">
              <ProjectsCarousel />
            </div>
          </div>
        </div>

        <div className="w-5/12">
          {/* Strenghts */}
          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium text-black">Strengths</h3>
            <p className="cursor-pointer self-center text-sm text-graySubtitle">
              Show More
            </p>
          </div>
          <div className="mb-10 mt-5 flex flex-wrap gap-5">
            {traitsQuery.isLoading && (
              <>
                {Array(12)
                  .fill(0)
                  .map((item, index) => (
                    <BadgeSkeleton key={index} />
                  ))}
              </>
            )}
            {traitsQuery.data &&
              traitsQuery.data.strengths.map((strength, index) => (
                <Tooltip message={strength.description!} key={index}>
                  <Badge text={strength.name!} />
                </Tooltip>
              ))}
          </div>
          {/* Oportunity Areas */}
          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium text-black">
              Oportunity Areas
            </h3>
            <p className="cursor-pointer self-center text-sm text-graySubtitle">
              Show More
            </p>
          </div>
          <div className="mb-10 mt-5 flex flex-wrap gap-5">
            {traitsQuery.isLoading && (
              <>
                {Array(12)
                  .fill(0)
                  .map((item, index) => (
                    <BadgeSkeleton key={index} />
                  ))}
              </>
            )}
            {traitsQuery.data &&
              traitsQuery.data.areasOfOportunity.map((area, index) => (
                <Tooltip message={area.description!} key={index}>
                  <Badge text={area.name!} />
                </Tooltip>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
