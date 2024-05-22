import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserInfoById, getUserTraitsById } from "@/services/user";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import Section from "@/components/Profile/ProfileSection";
import CoWorkersCarousel from "@/components/CoWorkersCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import Traits from "@/components/Profile/Traits";

const Profile: React.FC<{ params: { id: string } }> = async ({ params }) => {
  const user = await getUserInfoById(params.id);
  const traits = await getUserTraitsById(params.id);
  /*   const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserInfoById(params.id),
  });

  const {
    data: traits,
    error: traitsError,
    isLoading: traitsLoading,
  } = useQuery({
    queryKey: ["traits", params.id],
    queryFn: () => getUserTraitsById(params.id),
  });

  if (userLoading || traitsLoading) {
    return (
      <main>
        <h1 className="pt-20 text-center text-3xl">Cargando...</h1>
      </main>
    );
  }

  if (userError || traitsError || !user || !traits) {
    // import Tooltip from "@/components/Tooltip";
    // import Badge from "@/components/Badge";
    // import Image from "next/image";
    // import JobSVG from "@/public/Job-Profile-Image.svg";
    // import {
    //   getUserId,
    //   getUserInfoById,
    //   getUserManagedBy,
    //   getUserTraitsById,
    // } from "@/services/user";
    // import NoDataCard from "@/components/NoDataCard";
    // import Link from "next/link";

    // const Profile = async ({ params }: { params: { id: string } }) => {
    //   let user,
    //     traits,
    //     activeUserId: string = "",
    //     isManagedBy;

    //   try {
    //     user = await getUserInfoById(params.id);
    //     traits = await getUserTraitsById(params.id);
    //     activeUserId = await getUserId();
    //     isManagedBy = await getUserManagedBy(activeUserId, params.id);
    //   } catch (e) {
    return (
      <main>
        <h1 className="pt-20 text-center text-3xl">
          El usuario no fue encontrado :(
        </h1>
      </main>
    );
  } */

  return (
    <main>
      <ProfileBanner user={user} />
      {/* Banner */}
      {/*        
      <section className="w-100 mx-auto mb-24 mt-6 flex h-52 rounded-xl bg-primary">
        <UserProfileButton
          photoUrl={user.photoUrl!}
          size="lg"
          className="absolute left-20 top-60 h-fit"
        />
        <div className="flex w-5/6 flex-row items-center justify-between">
          <div className="w-full ps-56 leading-tight text-white">
            <h2 className=" text-3xl font-semibold">{user.name}</h2>
            <div className="flex flex-row items-center gap-2 text-xl">
              <p className="font-medium">{user.role}</p>
              <p className="font-normal">-</p>
              <p className="font-normal">{user.department}</p>
            </div>
            <p className="font-light">{user.email}</p>
            // {(activeUserId === params.id || isManagedBy) && (
              <Link
                className="mt-4 inline-block rounded-xl bg-white px-6 py-4 font-medium text-primary drop-shadow-lg"
                href={`/dashboard/${user.id}`}
              >
                View dashboard
              </Link>
            )}
          </div>

          <Image
            src={JobSVG}
            alt="Banner Image"
            className="hidden md:block"
            priority
          />
        </div>
      </section>
      */}

      {/* Data */}
      <section className="w-100 mx-auto flex justify-between space-x-10">
        <div className="w-7/12">
          <Section
            title="Co-workers"
            showMore={true}
            userId={params.id}
            type="coworkers"
          >
            <CoWorkersCarousel userId={params.id} />
          </Section>
          <Section
            title="Projects"
            showMore={true}
            userId={params.id}
            type="projects"
          >
            <ProjectsCarousel userId={params.id} />
          </Section>
        </div>
        <div className="w-5/12">
          <Traits
            title="Strengths"
            traits={traits.strengths}
            emptyMessage="No strengths available yet"
          />
          <Traits
            title="Opportunity Areas"
            traits={traits.areasOfOportunity}
            emptyMessage="No areas of opportunity available yet"
          />
        </div>
      </section>
    </main>
  );
};

export default Profile;
