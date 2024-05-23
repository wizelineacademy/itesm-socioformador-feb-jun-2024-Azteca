import React from "react";
import Link from "next/link";

interface UserProfileProps {
  userId: string;
  userName: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, userName }) => (
  <div className="flex items-center gap-2">
    <p className="text-3xl font-medium">{userName}</p>
    <Link
      href={`/profile/${userId}`}
      className="rounded-xl bg-primary px-4 py-2 text-white"
    >
      View Profile
    </Link>
  </div>
);

export default UserProfile;
