import { Coworker } from "@/types/types";
import Droppable from "../Droppable";
import Draggable from "../Draggable";
import UserProfileButton from "../UserProfileButton";
import UserIcon from "../icons/UserIcon";
import { useState } from "react";

interface SprintDropRowBoxProps {
  index: number;
  name: number;
  color: string;
  coworkers: Coworker[][];
}

const SprintDropRowBox = ({
  index,
  name,
  color,
  coworkers,
}: SprintDropRowBoxProps) => {
  const [showExpandedUsers, setShowExpandedUsers] = useState<boolean>(false);
  const MINIMUM_USERS = 3;

  const handleSetExpandedPosition = () => {
    setShowExpandedUsers((prev) => !prev);
  };

  const getUserPosition = (index: number, size: number) => {
    if (size === 1) {
      return "m-auto";
    } else if (size === 2) {
      if (index === 0) {
        return "left-0";
      } else {
        return "right-0";
      }
    }
    if (index === 0) {
      return "top-0 left-0";
    } else if (index === 1) {
      return "top-0 right-0";
    } else if (index === 2 && size === 3) {
      return "bottom-0 m-auto";
    } else if (index === 2 && size === 4) {
      return "bottom-0 left-0";
    } else if (index === 3) {
      return "bottom-0 right-0";
    }
  };

  const getExpandedBoxPosition = (index: number) => {
    return index > 5 ? "top-0 right-full" : "top-0 left-full";
  };

  return (
    <>
      <Droppable
        key={index}
        id={`${name}-${index}`}
        className={`${color} last-of-type:border-r-2xl relative flex h-auto w-20 flex-row items-center justify-center transition-all duration-100`}
      >
        {coworkers[index].length <= MINIMUM_USERS &&
          coworkers[index].map((person, personIndex) => (
            <Draggable
              key={personIndex}
              id={`${name}-${index}-${person.userId}`}
              data={person}
              className={`absolute z-50 ${getUserPosition(personIndex, coworkers[index].length)}`}
            >
              {person.photoUrl ? (
                <UserProfileButton
                  photoUrl={person.photoUrl}
                  size="sm"
                  key={personIndex}
                />
              ) : (
                <UserIcon
                  key={personIndex}
                  size="w-10 h-10"
                  color={person.color || "text-primary"}
                  className={`rounded-full bg-white`}
                />
              )}
            </Draggable>
          ))}
        {coworkers[index].length > MINIMUM_USERS && (
          <button
            onClick={handleSetExpandedPosition}
            className={`box-content h-10 w-10 rounded-full bg-gradient-radial from-white to-slate-200 p-1`}
          >
            <div className="flex h-full w-full rounded-full">
              <p className="m-auto cursor-pointer text-base font-medium">
                {coworkers[index].length}
              </p>
            </div>
          </button>
        )}
        {showExpandedUsers && coworkers[index].length > MINIMUM_USERS && (
          <div
            className={`absolute ${getExpandedBoxPosition(index)} z-[100] grid w-60 grid-flow-row grid-cols-4 place-items-center gap-1 rounded-lg bg-white p-2 shadow-md`}
          >
            {coworkers[index].map((person, personIndex) => (
              <Draggable
                key={personIndex}
                id={`${name}-${index}-${person.userId}`}
                data={person}
                className="z-50"
              >
                {person.photoUrl ? (
                  <UserProfileButton
                    photoUrl={person.photoUrl}
                    size="sm"
                    key={personIndex}
                  />
                ) : (
                  <UserIcon
                    key={personIndex}
                    size="w-10 h-10"
                    color={person.color || "text-primary"}
                    className={`rounded-full bg-white`}
                  />
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </>
  );
};

export default SprintDropRowBox;
