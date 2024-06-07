"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import CloseIcon from "./icons/CloseIcon";
import NotificationIcon from "./icons/NotificationIcon";
import NotificationCard from "./NotificationCard";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notifications";
import { Notification } from "@/types/types";
import ProjectSurvey from "./modals/ProjectSurvey";
import SprintSurvey from "./modals/SprintSurvey";
import RulerSurvey from "./modals/ruler/RulerSurvey";

const Notifications = () => {
  const [isActive, setIsActive] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showSprintModal, setShowSprintModal] = useState<boolean>(false);
  const [showRulerModal, setShowRulerModal] = useState<boolean>(false);
  const [notificationId, setNotificationId] = useState<number>(0);

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  const onNotificationClick = (notificationType: string) => {
    switch (notificationType) {
      case "FINAL":
        setShowProjectModal(true);
        break;

      case "SPRINT":
        setShowSprintModal(true);
        break;

      case "RULER":
        setShowRulerModal(true);
        break;

      default:
        break;
    }
  };

  const handleClickNotification = (
    index: number,
    notification: Notification,
  ): void => {
    setNotificationId(notification.id);
    onNotificationClick(notification.type);
    setIsActive(false);
  };

  if (!notificationsQuery.data) {
    return (
      <button
        className={`group cursor-not-allowed rounded-full bg-white p-2 drop-shadow-lg`}
      >
        <NotificationIcon size="h-6 w-6" color="text-primary" />
      </button>
    );
  }

  return (
    <>
      {showProjectModal && (
        <ProjectSurvey
          showModal={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          projectSurveyId={notificationId}
        />
      )}

      {showSprintModal && (
        <SprintSurvey
          showModal={showSprintModal}
          onClose={() => setShowSprintModal(false)}
          sprintSurveyId={notificationId}
        />
      )}

      {showRulerModal && (
        <RulerSurvey
          showModal={showRulerModal}
          onClose={() => setShowRulerModal(false)}
        />
      )}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          data-testid="notification-button"
          onClick={() => setIsActive(!isActive)}
          className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
        >
          <NotificationIcon
            size="h-6 w-6"
            color={isActive ? "text-white" : "text-primary"}
          />
          {notificationsQuery.data.length > 0 && (
            <span className=" absolute -right-px -top-px flex h-3 w-3 items-center justify-center rounded-full bg-red-700 " />
          )}
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className=" absolute right-0 z-50 mt-2 box-content max-h-72 min-h-fit w-96 origin-top-right overflow-auto rounded-md bg-white px-4 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <Menu.Item>
              {({ close }) => (
                <div className="sticky top-0 z-50 flex flex-row items-center justify-between bg-white pt-3">
                  <div className="flex flex-row gap-1">
                    <p className="text-md font-medium text-black">
                      Notifications
                    </p>
                    <p className="">({notificationsQuery.data.length})</p>
                  </div>
                  <CloseIcon
                    size="h-6 w-6"
                    closeFunction={close}
                    color="text-black hover:text-red-600"
                  />
                </div>
              )}
            </Menu.Item>
            {notificationsQuery.data.length > 0 &&
              notificationsQuery.data.map((notification, index) => {
                return (
                  <Menu.Item key={index}>
                    {({ close }) => (
                      <button
                        onClick={() => {
                          close();
                          handleClickNotification(index, notification);
                        }}
                        className="w-full cursor-pointer overflow-auto py-1"
                      >
                        <NotificationCard notification={notification} />
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
            {notificationsQuery.data.length === 0 && (
              <div className="flex h-5/6 w-full items-center justify-center py-1">
                <Menu.Item>
                  <NotificationCard empty={true} />
                </Menu.Item>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default Notifications;
