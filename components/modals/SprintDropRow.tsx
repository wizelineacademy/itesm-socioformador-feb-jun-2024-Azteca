import { Coworker } from "@/types/types";
import SprintDropRowBox from "./SprintDropRowBox";

interface SprintDropRowProps {
  title: string;
  colors: string[];
  className?: string;
  titlePadding?: string;
  name: number;
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
    <div className={`${className} flex min-h-20 w-full flex-row`}>
      <div
        className={`w-1/4 rounded-l-lg ${colors[0]} ${titlePadding} flex text-end text-sm`}
      >
        <p className="my-auto me-2 text-black">{title}</p>
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
