import { Coworker } from "@/types/types";
import Droppable from "../Droppable";
import UserIcon from "../icons/UserIcon";
import UserProfileButton from "../UserProfileButton";
import DraggableUser from "./DraggableUser";
import Draggable from "../Draggable";

interface SprintDropRowProps {
  title: string;
  colors: string[];
  className?: string;
  titlePadding?: string;
  name: string;
  people: Coworker[][];
}

const SprintDropRow = ({
  colors,
  title,
  className = "mt-1",
  titlePadding = "p-4",
  name,
  people,
}: SprintDropRowProps) => {
  return (
    <div
      className={`${className} flex w-full flex-row overflow-auto md:overflow-hidden`}
    >
      <div
        className={`w-1/4 rounded-l-lg ${colors[0]} ${titlePadding} text-end text-sm`}
      >
        <p className="text-black">{title}</p>
      </div>

      {colors.map((color, index) => {
        return (
          <Droppable
            key={index}
            id={`${name}-${index}`}
            className={`${color} last-of-type:border-r-2xl flex h-auto w-20 flex-row items-center justify-center overflow-hidden bg-gradient-to-r transition-all duration-100`}
          >
            {people[index].length < 4 &&
              people[index].map((person, personIndex) => (
                <Draggable
                  key={personIndex}
                  id={`${name}-${index}-${person.userId}`}
                  data={person}
                >
                  {person.photoUrl ? (
                    <UserProfileButton
                      photoUrl={person.photoUrl}
                      size="sm"
                      key={personIndex}
                      className={`relative ${index > 0 ? "-ml-4" : "ml-0"} z-50`}
                    />
                  ) : (
                    <UserIcon
                      key={personIndex}
                      size="w-10 h-10"
                      color={person.color || "text-primary"}
                      className={`relative ${index > 0 ? "-ml-4" : "ml-0"} z-${50 - index * 10} rounded-full bg-white`}
                    />
                  )}
                </Draggable>
              ))}
            {people[index].length > 3 && (
              <>
                <div className="relative z-50 box-content flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <div className="rounded-full border-2 border-primary p-2">
                    <span>+{people[index].length - 2}</span>
                  </div>
                </div>
                {people[index].slice(0, 2).map((person, index) => {
                  person.photoUrl ? (
                    <UserProfileButton
                      photoUrl={person.photoUrl}
                      size="sm"
                      key={index}
                      className={`relative ${index > 0 ? "-ml-4" : "ml-0"} z-${50 - index * 10}`}
                    />
                  ) : (
                    <UserIcon
                      key={index}
                      size="w-10 h-10"
                      color={person.color || "text-primary"}
                      className={`relative ${index > 0 ? "-ml-4" : "ml-0"} z-${50 - index * 10} rounded-full bg-white`}
                    />
                  );
                })}
              </>
            )}
          </Droppable>
        );
      })}
    </div>
  );
};

export default SprintDropRow;
