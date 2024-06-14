"use client";
import UserIcon from "../icons/UserIcon";
import Draggable from "../Draggable";
import Tooltip from "../Tooltip";
import { useState } from "react";
import { Coworker } from "@/types/types";
import UserProfileButton from "../UserProfileButton";

interface DraggableUserProps {
  user: Coworker;
  times?: number;
}

const DraggableUser = ({ user, times = 0 }: DraggableUserProps) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <Draggable
      id={`base-${user.userId}`}
      data={user}
      setIsDragging={setIsDragging}
    >
      {isDragging ? (
        user.photoUrl ? (
          <UserProfileButton
            photoUrl={user.photoUrl}
            size="sm"
            className="infinite z-[100] animate-[spin_1.5s_infinite] duration-100"
          />
        ) : (
          <UserIcon
            size="w-10 h-10"
            color="text-blue-300"
            className="infinite z-[100] animate-[spin_1.5s_infinite] rounded-full bg-white duration-100"
          />
        )
      ) : (
        <Tooltip message={user.name}>
          {times > 1 && (
            <span
              data-testid={`user-${user.userId}-times`}
              className="relative left-3 top-3 z-10 flex h-3 w-3 cursor-move items-center justify-center rounded-full bg-primary-light p-2 text-[0.6rem] font-medium text-white"
            >
              x{times}
            </span>
          )}
          {user.photoUrl ? (
            <UserProfileButton photoUrl={user.photoUrl} size="sm" />
          ) : (
            <UserIcon size="w-10 h-10" color="text-blue-300" />
          )}
        </Tooltip>
      )}
    </Draggable>
  );
};

export default DraggableUser;
