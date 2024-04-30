"use client";

import { useState } from "react";
import ProjectSurvey from "./modals/ProjectSurvey";
import { Notification } from "@/types";

interface NotificationCardProps {
  notification: Notification;
  onClick: (index: number) => void;
  index: number;
}

const NotificationCard = ({
  notification,
  onClick,
  index,
}: NotificationCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const handleClickNotification = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    onClick(index);
    setShowModal(false);
  };
  return (
    <>
      <ProjectSurvey showModal={showModal} onClose={handleClose} />
      <button
        onClick={handleClickNotification}
        className={`flex w-full items-center rounded-t-md border-b-2 border-gray-200 p-2 hover:bg-gray-200`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className=" h-12 w-12 text-primary"
        >
          <path
            fillRule="evenodd"
            d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
            clipRule="evenodd"
          />
        </svg>
        <div className="ms-4 flex w-full flex-col justify-start">
          <p className="text-md text-start font-bold">{notification.type}</p>
          <p className="text-md text-start font-bold">
            {notification.projectName}
          </p>
          <p className="text-md text-start font-bold">
            {notification.date.toISOString()}
          </p>
          <p className="text-start text-xs">
            You have a pending survery.
            <strong> Click here </strong>
            and answer your
            <strong> {notification.type} </strong>
            survey{" "}
          </p>
        </div>
      </button>
    </>
  );
};

export default NotificationCard;
