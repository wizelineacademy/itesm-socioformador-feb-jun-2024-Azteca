import React from "react";
import UserProfileButton from "@/components/UserProfileButton";

export default function ProjectCard() {
  return (
    <div className="flex items-center gap-20 rounded-lg bg-white p-4">
      <div>
        <h3 className="pb-2 text-lg font-medium">Project 1</h3>
        <p className="text-grayText pb-4 text-sm">In progress</p>
        <div className="ml-[6px]">
          <UserProfileButton size="xs" className="mx-[-6px]" />
          <UserProfileButton size="xs" className="mx-[-6px]" />
          <UserProfileButton size="xs" className="mx-[-6px]" />
          <button
            disabled
            className={
              "group mx-[-6px] rounded-full bg-white p-2 text-primary drop-shadow-lg"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
      <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary hover:bg-primary-dark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="white"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
