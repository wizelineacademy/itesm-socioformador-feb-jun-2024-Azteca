import { Coworker } from "@/types/types";
import Droppable from "../Droppable";
import Draggable from "../Draggable";
import UserProfileButton from "../UserProfileButton";
import UserIcon from "../icons/UserIcon";
import { MouseEvent, useEffect, useRef, useState } from "react";

interface SprintDropRowBoxProps {
  index: number;
  name: string;
  color: string;
  coworkers: Coworker[][];
}

const SprintDropRowBox = ({
  index,
  name,
  color,
  coworkers,
}: SprintDropRowBoxProps) => {
  type positionType = {
    x: number;
    y: number;
  };
  const [showExpandedUsers, setShowExpandedUsers] = useState<boolean>(false);
  const [position, setPosition] = useState<positionType>({ x: 0, y: 0 });
  const expandedBoxRef = useRef<HTMLDivElement>(null);

  const handleSetExpandedPosition = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    console.log(rect);
    setPosition({
      x: rect.x,
      y: rect.y,
    });
    setShowExpandedUsers((prev) => !prev);
  };

  useEffect(() => {
    if (showExpandedUsers && expandedBoxRef.current) {
      const modal = document
        .getElementsByClassName("sprint-survey-modal")[0]
        .getBoundingClientRect();
      const modalWidth = modal?.width,
        modalHeight = modal?.height;
      if (!modalWidth || !modalHeight) return;

      const expandedBoxRect = expandedBoxRef.current.getBoundingClientRect();
      const expandedBoxWidth = expandedBoxRect.width,
        expandedBoxHeight = expandedBoxRect.height;

      let newX = position.x,
        newY = position.y;

      const boxFitsHorizontally = modalWidth > position.x + expandedBoxWidth,
        boxFitsVertically = modalHeight - position.y > expandedBoxHeight;

      const windowWidth = window.innerWidth;
      const horizontalAspectRatio = windowWidth;
      if (boxFitsHorizontally) {
        newX = position.x;
      } else {
        // newX = modalWidth - (windowWidth - position.x) * 0.64;
        newX = modalWidth - expandedBoxWidth;
      }

      if (boxFitsVertically) {
        newY = position.y;
      } else {
        newY = position.y - expandedBoxHeight;
      }

      setPosition({
        x: newX,
        y: newY,
      });
    }
  }, [showExpandedUsers]);

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

  useEffect(() => {
    if (coworkers[index].length === 4) setShowExpandedUsers(false);
  }, [coworkers[index].length, coworkers, index]);

  return (
    <>
      <Droppable
        key={index}
        id={`${name}-${index}`}
        className={`${color} last-of-type:border-r-2xl relative flex h-auto w-20 flex-row items-center justify-center transition-all duration-100`}
      >
        {coworkers[index].length <= 4 &&
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
        {coworkers[index].length > 4 && (
          <div
            onClick={handleSetExpandedPosition}
            className={`box-content h-10 w-10 rounded-full bg-gradient-radial from-white to-slate-200 p-1`}
          >
            <div className="flex h-full w-full rounded-full">
              <p className="m-auto cursor-pointer text-base font-medium">
                {coworkers[index].length}
              </p>
            </div>
          </div>
        )}
      </Droppable>

      {showExpandedUsers && (
        <div
          ref={expandedBoxRef}
          style={{
            top: position.y,
            left: position.x,
          }}
          className="absolute z-[100] grid w-60 grid-flow-row grid-cols-4 place-items-center gap-1 rounded-lg bg-white p-2 shadow-md"
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
    </>
  );
};

export default SprintDropRowBox;
