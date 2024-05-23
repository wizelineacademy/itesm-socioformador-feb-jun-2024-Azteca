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
