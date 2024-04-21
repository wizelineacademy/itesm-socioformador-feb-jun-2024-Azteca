"use client";
import UserIcon from "../icons/UserIcon";
import Draggable from "../Draggable";
import Tooltip from "../Tooltip";
import { useState } from "react";
import { SurveyCoworker } from "@/constants";

const DraggableUser = ({ user }: { user: SurveyCoworker }) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <Draggable id={user.userId} data={user} setIsDragging={setIsDragging}>
      {isDragging ? (
        <UserIcon
          size="w-10 h-10"
          color={user.color || "text-primary"}
          className=" animate-[spin_1.5s_infinite]  rounded-full bg-white transition-all duration-100"
        />
      ) : (
        <Tooltip message={user.name}>
          {user.times > 1 && (
            <span className=" relative left-3 top-3 flex h-3 w-3 items-center justify-center rounded-full bg-primary-light p-2 font-medium text-white ">
              {user.times}
            </span>
          )}
          <UserIcon size="w-10 h-10" color={user.color || "text-primary"} />
        </Tooltip>
      )}
    </Draggable>
  );
};

export default DraggableUser;