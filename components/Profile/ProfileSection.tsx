"use client";
import React, { useState } from "react";
import DialogComponent from "../DialogComponent";
import { useQuery } from "@tanstack/react-query";
import { getCoWorkers, getProjectsProfile } from "@/services/user";
import ComboboxOpen from "../ComboboxOpen";

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

  const fetchData = async () => {
    if (type === "coworkers") {
      return getCoWorkers(userId);
    } else if (type === "projects") {
      return getProjectsProfile(userId);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [type, userId],
    queryFn: fetchData,
  });

  return (
    <div className="mb-4">
      <div className="mx-auto flex justify-between">
        <h3 className="text-2xl font-medium text-black">{title}</h3>
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
        title={`${type === "coworkers" ? "Co-Workers" : "Projects"}`}
        description={`${type === "coworkers" ? "Select a person to go to their profile." : "Select a project to go to their dashboard."}`}
      >
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading data</p>}
        <ComboboxOpen data={data} />
        {/* {type === "coworkers" &&
          data?.map((user, index) => (
            <div key={index}>
              <p>{user.name}</p>
            </div>
          ))}
        {type === "projects" &&
          data?.map((project, index) => (
            <div key={index}>
              <p>{project.name}</p>
            </div>
          ))} */}
      </DialogComponent>
    </div>
  );
};

export default ProfileSection;
