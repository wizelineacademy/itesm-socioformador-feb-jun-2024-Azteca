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
          */}
      </Suspense>
    </main>
  );
};

export default Profile;
