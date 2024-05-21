"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserInfoById, getUserTraitsById } from "@/services/user";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import Section from "@/components/Profile/Section";
import CoWorkersCarousel from "@/components/CoWorkersCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import Traits from "@/components/Profile/Traits";

const Profile: React.FC<{ params: { id: string } }> = ({ params }) => {
  const {
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
    return (
      <main>
        <h1 className="pt-20 text-center text-3xl">
          El usuario no fue encontrado :(
        </h1>
      </main>
    );
  }

  return (
    <main>
      <ProfileBanner user={user} />
      <section className="w-100 mx-auto flex justify-between space-x-10">
        <div className="w-7/12">
          <Section title="Co-workers" showMore={true}>
            <CoWorkersCarousel userId={params.id} />
          </Section>
          <Section title="Projects" showMore={true}>
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
