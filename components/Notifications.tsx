"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import CloseIcon from "./icons/CloseIcon";

const Notifications = () => {
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

  useEffect(() => {
    const onClickOutsideButton = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".group")) {
        setIsActive(false);
      }
    };
    document.addEventListener("click", onClickOutsideButton);
    return () => document.removeEventListener("click", onClickOutsideButton);
  }, []);
  const handleClickNotification = (index: number) => {
    const newNotifications = [...notifications];
    newNotifications.splice(index, 1);
    setNotifications(newNotifications);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={`${isActive ? "bg-primary" : "bg-white"} group rounded-full p-2 drop-shadow-lg hover:bg-primary`}
      >
        <div onClick={() => setIsActive(!isActive)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className={`${isActive ? "text-white" : "text-primary"} h-6 w-6 group-hover:text-white`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          {notifications.length > 0 && (
            <span className=" absolute -right-px -top-px flex h-3 w-3 items-center justify-center rounded-full bg-red-700 " />
          )}
        </div>
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
                <div
                  key={notification.id}
                  className="w-full cursor-pointer py-1"
                  onClick={() => handleClickNotification(index)}
                >
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gray-200" : ""} flex w-full items-center rounded-t-md border-b-2 border-gray-200 p-2`}
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
                          <p className="text-md text-start font-bold">
                            {notification.type}
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
                    )}
                  </Menu.Item>
                </div>
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
