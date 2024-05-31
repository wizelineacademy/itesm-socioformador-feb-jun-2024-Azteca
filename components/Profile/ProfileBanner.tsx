import React from "react";
import UserProfileButton from "@/components/UserProfileButton";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/types";
import { getUserId, getUserManagedBy } from "@/services/user";
interface ProfileBannerProps {
  user: User;
}

const ProfileBanner: React.FC<ProfileBannerProps> = async ({ user }) => {
  const activeUserId = await getUserId();
  const isManagedBy = await getUserManagedBy(activeUserId, user.id);

  return (
    <section className="w-100 mx-auto mb-24 mt-6 flex h-52 rounded-xl bg-primary">
      <UserProfileButton
        photoUrl={user.photoUrl || ""}
        size="lg"
        className="absolute left-20 top-60 h-fit"
      />
      <div className="flex w-5/6 flex-row items-center justify-between">
        <div className="w-full ps-56 leading-tight text-white">
          <h2 className="text-3xl font-semibold">{user.name}</h2>
          <div className="flex flex-row items-center gap-2 text-xl">
            <p className="font-medium">{user.role}</p>
            <p className="font-normal">-</p>
            <p className="font-normal">{user.department ?? "No department"}</p>
          </div>
          <p className="font-light">{user.email}</p>
          {isManagedBy && (
            <Link
              className="mt-4 inline-block rounded-xl bg-white px-6 py-4 font-medium text-primary drop-shadow-lg"
              href={`/dashboard/${user.id}`}
            >
              View dashboard
            </Link>
          )}
        </div>
        <Image
          data-testid={user.bannerId}
          src={`/${user.bannerId}` || "/Banner1.svg"}
          alt="Banner Image"
          width={100}
          height={100}
          className="hidden h-auto w-56 md:block"
          priority
        />
      </div>
    </section>
  );
};

export default ProfileBanner;
