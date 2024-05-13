"use client";
import { Coworker, SurveyCoworker } from "@/types/types";
import DraggableUser from "./DraggableUser";

interface SelectableDragUsersProps {
  users: Array<SurveyCoworker>;
}

const SelectableDragUsers = ({ users }: SelectableDragUsersProps) => {
  return (
    <div className={`flex flex-row items-center justify-around`}>
      {users.map(
        (user, index) =>
          user.times > 0 && <DraggableUser key={index} user={user} />,
      )}
    </div>
  );
};

export default SelectableDragUsers;
