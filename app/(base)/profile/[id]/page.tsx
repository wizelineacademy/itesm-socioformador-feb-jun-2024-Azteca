import React from "react";
import {
  getCoWorkers,
  getUserInfoById,
  getUserSkillsById,
} from "@/services/user";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import ProfileSection from "@/components/Profile/ProfileSection";
import CoWorkersCarousel from "@/components/CoWorkersCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import ProfileTraits from "@/components/Profile/ProfileTraits";

const Profile: React.FC<{ params: { id: string } }> = async ({ params }) => {
  const user = await getUserInfoById(params.id);
  const traits = await getUserSkillsById(params.id);
  const coworkers: { name: string; id: string; photoUrl: string | null }[] =
    await getCoWorkers(params.id);
  return (
    <main>
      <ProfileBanner user={user} />
      <section className="w-100 mx-auto flex justify-between space-x-10">
        <div className="w-7/12">
          <ProfileSection
            title="Co-workers"
            showMore={true}
            userId={params.id}
            type="coworkers"
          >
            <CoWorkersCarousel coworkers={coworkers} />
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
          <ProfileTraits
            title="Strengths"
            traits={traits.strengths}
            emptyMessage="No strengths available yet"
          />
          <ProfileTraits
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
