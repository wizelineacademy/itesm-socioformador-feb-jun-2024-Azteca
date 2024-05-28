"use client";
import React, { useState } from "react";
import DialogComponent from "../DialogComponent";

interface ProfileSectionProps {
  title: string;
  showMore: boolean;
  children: React.ReactNode;
  userId?: string;
  type?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  showMore,
  children,
  userId,
  type,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="mb-6">
      <div className="mx-auto flex justify-between">
        <h3 className="text-3xl font-medium text-black">{title}</h3>
        {showMore && (
          <button
            className="cursor-pointer self-center text-sm text-graySubtitle"
            onClick={openDialog}
          >
            Show More
          </button>
        )}
      </div>
      <div className="mt-2">{children}</div>

      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={title}
      >
        {type === "tasks" && <p>Tasks</p>}
        {type === "resources" && <p>Resources</p>}
      </DialogComponent>
    </div>
  );
};

export default ProfileSection;
