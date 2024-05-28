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

  const dummyTasks = [
    {
      sprintId: 1,
      date: "27-05-2024",
      tasks: [
        {
          id: 1,
          userId: "userid1",
          title: "title1",
          description: "description1",
          status: "pending",
        },
        {
          id: 2,
          userId: "userid2",
          title: "title2",
          description: "description2",
          status: "in progress",
        },
        {
          id: 3,
          userId: "userid3",
          title: "title3",
          description: "description3",
          status: "done",
        },
        {
          id: 4,
          userId: "userid4",
          title: "title4",
          description: "description4",
          status: "pending",
        },
        {
          id: 5,
          userId: "userid5",
          title: "title5",
          description: "description5",
          status: "in progress",
        },
      ],
    },
    {
      sprintId: 2,
      date: "03-06-2024",
      tasks: [
        {
          id: 6,
          userId: "userid6",
          title: "title6",
          description: "description6",
          status: "done",
        },
        {
          id: 7,
          userId: "userid7",
          title: "title7",
          description: "description7",
          status: "pending",
        },
        {
          id: 8,
          userId: "userid8",
          title: "title8",
          description: "description8",
          status: "in progress",
        },
        {
          id: 9,
          userId: "userid9",
          title: "title9",
          description: "description9",
          status: "done",
        },
        {
          id: 10,
          userId: "userid10",
          title: "title10",
          description: "description10",
          status: "pending",
        },
      ],
    },
    {
      sprintId: 3,
      date: "10-06-2024",
      tasks: [
        {
          id: 11,
          userId: "userid11",
          title: "title11",
          description: "description11",
          status: "in progress",
        },
        {
          id: 12,
          userId: "userid12",
          title: "title12",
          description: "description12",
          status: "done",
        },
        {
          id: 13,
          userId: "userid13",
          title: "title13",
          description: "description13",
          status: "pending",
        },
        {
          id: 14,
          userId: "userid14",
          title: "title14",
          description: "description14",
          status: "in progress",
        },
        {
          id: 15,
          userId: "userid15",
          title: "title15",
          description: "description15",
          status: "done",
        },
      ],
    },
  ];

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
        <div>
          {dummyTasks.map((sprint) => (
            <div key={sprint.sprintId}>
              <p className="text-lg font-medium">{`Sprint ${sprint.date}`}</p>
              {sprint.tasks.map((task) => (
                <div key={task.id} className="flex justify-between">
                  <p className="text-graySubtitle">{task.title}</p>
                  <p>{task.description}</p>
                  <p>{task.status}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* {type === "tasks" && (
          <div>
            <p>Tasks History</p>
          </div>
        )}
        {type === "resources" && <p>Resources History</p>} */}
      </DialogComponent>
    </div>
  );
};

export default ProfileSection;
