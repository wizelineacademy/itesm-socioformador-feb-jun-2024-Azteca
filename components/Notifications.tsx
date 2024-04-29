"use client";
interface NotificationProps {
  showProjectModal: () => void;
  showSprintModal: () => void;
}

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import CloseIcon from "./icons/CloseIcon";
import NotificationIcon from "./icons/NotificationIcon";
import NotificationCard from "./NotificationCard";

const Notifications = ({
  showProjectModal,
  showSprintModal,
}: NotificationProps) => {
  const [isActive, setIsActive] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "RULER",
      type: "RULER",
    },
    {
      id: 2,
      title: "Sprint Survey",
      type: "SPRINT",
    },
    {
      id: 3,
      title: "Project Survey",
      type: "PROJECT",
    },
  ]);

  const onNotificationClick = (notificationType: string) => {
    switch (notificationType) {
      case "PROJECT":
        showProjectModal();
        break;

      case "SPRINT":
        showSprintModal();
        break;

      case "RULER":
        break;

      default:
        break;
    }
  };

  const handleClickNotification = (index: number, type: string): void => {
    onNotificationClick(type);
    const newNotifications = [...notifications];
    newNotifications.splice(index, 1);
    //setNotifications(newNotifications);
    setIsActive(false);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div onClick={() => setIsActive(!isActive)}>
        <Menu.Button
          className={`${isActive ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
        >
          <NotificationIcon
            size="h-6 w-6"
            color={isActive ? "text-white" : "text-primary"}
          />
          {notifications.length > 0 && (
            <span className=" absolute -right-px -top-px flex h-3 w-3 items-center justify-center rounded-full bg-red-700 " />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" absolute right-0 z-50 mt-2 box-content h-72 w-96 origin-top-right rounded-md bg-white px-4 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <Menu.Item>
            {({ close }) => (
              <div className="mt-3 flex flex-row items-center justify-between">
                <div className="flex flex-row gap-1">
                  <p className="text-md font-bold text-black">Notifications</p>
                  <p className="">({notifications.length})</p>
                </div>
                <CloseIcon size="h-6 w-6" closeFunction={close} />
              </div>
            )}
          </Menu.Item>
          {notifications.length > 0 &&
            notifications.map((notification, index) => {
              return (
                <Menu.Item key={index}>
                  {({ close }) => (
                    <div
                      onClick={() => {
                        close();
                        handleClickNotification(index, notification.type);
                      }}
                      className="w-full cursor-pointer py-1"
                    >
                      <NotificationCard
                        notification={notification}
                        onClick={() => {}}
                        index={index}
                      />
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          {notifications.length === 0 && (
            <div className="flex h-5/6 w-full items-center justify-center py-1">
              <Menu.Item>
                <p className="items-center py-2 text-sm">
                  No tienes ninguna notificación
                </p>
              </Menu.Item>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Notifications;
