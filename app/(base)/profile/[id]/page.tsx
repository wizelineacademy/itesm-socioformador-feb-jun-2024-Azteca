import React, { Suspense } from "react";
import { getUserInfoById, getUserTraitsById } from "@/services/user";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import ProfileSection from "@/components/Profile/ProfileSection";
import CoWorkersCarousel from "@/components/CoWorkersCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import Traits from "@/components/Profile/Traits";
import Loader from "@/components/Loader";

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
      <Suspense
        fallback={
          <div className="h-[80dvh] w-full">
            <Loader />
          </div>
        }
      >
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
        }
      >
        <ProfileBanner user={user} />

        {/* Data */}
        <section className="w-100 mx-auto flex justify-between space-x-10">
          <div className="w-7/12">
            <ProfileSection title="Co-workers" showMore={true}>
              <CoWorkersCarousel userId={params.id} />
            </ProfileSection>
            <ProfileSection title="Projects" showMore={true}>
              <ProjectsCarousel userId={params.id} />
            </ProfileSection>
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
        {/*
          TODO: @adrian and @jose are going to fix this

          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium text-black">Strengths</h3>
            <p className="cursor-pointer self-center text-sm text-graySubtitle">
              Show More
            </p>
          </div>
          <div
            className={
              traits.strengths.length === 0
                ? "mb-6 mt-3 flex flex-wrap items-center justify-center gap-5 rounded-lg bg-slate-300/20 py-4"
                : "mb-10 mt-5 flex flex-wrap gap-5"
            }
          >
            {traits.strengths.length === 0 && (
              <NoDataCard text="No strengths available yet" />
            )}
            {traits.strengths.map((strength, index) => (
              <Tooltip message={strength.description || ""} key={index}>
                <Badge text={strength.name || ""} />
              </Tooltip>
            ))}
          </div>

      {/* Data */}
        <section className="w-100 mx-auto flex justify-between space-x-10">
          <div className="w-7/12">
            <ProfileSection
              title="Co-workers"
              showMore={true}
              userId={params.id}
              type="coworkers"
            >
              <CoWorkersCarousel userId={params.id} />
            </ProfileSection>
            <ProfileSection
              title="Projects"
              showMore={true}
              userId={params.id}
              type="projects"
            >
              <ProjectsCarousel userId={params.id} />
            </ProfileSection>
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
      </Suspense>
    </main>
  );
};

export default Profile;
