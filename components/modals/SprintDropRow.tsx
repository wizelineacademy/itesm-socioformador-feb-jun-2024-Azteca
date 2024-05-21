import { Coworker } from "@/types/types";
import SprintDropRowBox from "./SprintDropRowBox";

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
    <div className={`${className} flex w-full flex-row`}>
      <div
        className={`w-1/4 rounded-l-lg ${colors[0]} ${titlePadding} text-end text-sm`}
      >
        <p className="text-black">{title}</p>
      </div>

      {colors.map((color, index) => {
        return (
          <SprintDropRowBox
            key={index}
            index={index}
            color={color}
            name={name}
            coworkers={people}
          />
        );
      })}
    </div>
  );
};

export default SprintDropRow;
