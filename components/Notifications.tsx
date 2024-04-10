"use client";

import { useState } from "react";

const Notifications = () => {
  const [isActive, setIsActive] = useState(false);
  const notificationsCount = 1;
  return (
    <div
      onClick={() => setIsActive(!isActive)}
      className={`${isActive ? "bg-primary" : "bg-white"} group rounded-full p-2 drop-shadow-lg hover:bg-primary`}
    >
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
      {notificationsCount > 0 && (
        <span className=" absolute -right-px -top-px flex h-3 w-3 items-center justify-center rounded-full bg-red-700 " />
      )}
    </div>
  );
};

export default Notifications;
