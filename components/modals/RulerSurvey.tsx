import { Emotion } from "@/types";
import { rulerEmotionsMatrix } from "@/utils/constants";

const RulerSurvey = () => {
  return (
    <div className="w-full">
      {rulerEmotionsMatrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row gap-2">
          {row.map((emotion: Emotion, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1"
            >
              <p>{emotion.name}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RulerSurvey;
