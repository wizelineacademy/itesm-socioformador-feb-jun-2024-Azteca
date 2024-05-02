import { Emotion, RulerSurveyAnswer } from "@/types";
import { rulerEmotionsMatrix } from "@/utils/constants";
import { emotionBgColor } from "@/utils/utils";
import { Dispatch } from "react";

interface RulerStepOneProps {
  setEmotion: Dispatch<RulerSurveyAnswer>;
  rulerSurveyAnswer: RulerSurveyAnswer;
  nextStep: () => void;
}

const RulerStepOne = ({
  setEmotion,
  nextStep,
  rulerSurveyAnswer,
}: RulerStepOneProps) => {
  const handleClick = (emotion: Emotion) => {
    const section = document.getElementById("ruler-survey");
    if (section) {
      section.classList.add("dissolve");
    }
    setEmotion({ ...rulerSurveyAnswer, emotion: emotion });
    setTimeout(() => {
      nextStep();
    }, 350);
  };

  const expandSize = (rowIndex: number, colIndex: number) => {
    removeSize();
    setEmotion({
      ...rulerSurveyAnswer,
      emotion: rulerEmotionsMatrix[rowIndex][colIndex],
    });
    const isPositionValid = (rowIndex: number, colIndex: number) => {
      return (
        rowIndex >= 0 &&
        rowIndex < rulerEmotionsMatrix.length &&
        colIndex >= 0 &&
        colIndex < rulerEmotionsMatrix[0].length &&
        !visited.has(`${rowIndex}-${colIndex}`)
      );
    };

    const element = document.getElementById(`${rowIndex}-${colIndex}`);
    if (element) {
      element.classList.add("scale-150");
      element.classList.add("z-50");
      element.classList.remove("text-transparent");
    }

    const getSizeTimes = (
      times: number,
    ):
      | ""
      | "scale-[1.35]"
      | "scale-[1.3]"
      | "scale-[1.2]"
      | "scale-[1.1]"
      | "scale-[1.05]" => {
      switch (times) {
        case 5:
          return "scale-[1.35]";
        case 4:
          return "scale-[1.3]";
        case 3:
          return "scale-[1.2]";
        case 2:
          return "scale-[1.1]";
        case 1:
          return "scale-[1.05]";
        default:
          "";
      }
      return "";
    };

    const getNeighbors = (row: number, col: number): number[][] => {
      return [
        [row + 1, col],
        [row - 1, col],
        [row, col + 1],
        [row, col - 1],
        [row + 1, col + 1],
        [row + 1, col - 1],
        [row - 1, col + 1],
        [row - 1, col - 1],
      ];
    };

    const queue: number[][] = [];
    const visited: Set<string> = new Set();
    queue.push([rowIndex, colIndex]);
    let times = 5;

    while (queue.length && times != 0) {
      const n = queue.length;

      for (let i = 0; i < n; i++) {
        const [row, col] = queue.shift() as number[];
        if (isPositionValid(row, col)) {
          const element = document.getElementById(`${row}-${col}`);
          if (element) {
            element.classList.add(getSizeTimes(times));
          }
          for (const [dRow, dCol] of getNeighbors(row, col))
            queue.push([dRow, dCol]);

          visited.add(`${row}-${col}`);
        }
      }
      times -= 1;
    }
  };

  const removeSize = () => {
    setEmotion({ ...rulerSurveyAnswer, emotion: null });
    const m = rulerEmotionsMatrix.length,
      n = rulerEmotionsMatrix[0].length;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const element = document.getElementById(`${i}-${j}`);
        if (element) {
          element.classList.remove("scale-150");
          element.classList.remove("scale-[1.3]");
          element.classList.remove("scale-[1.2]");
          element.classList.remove("scale-[1.1]");
          element.classList.remove("scale-[1.35]");
          element.classList.remove("scale-[1.05]");
          element.classList.add("text-transparent");
        }
      }
    }
  };
  return (
    <div className="flex flex-col" id="ruler-step-one">
      <p className="my-2 text-sm text-graySubtitle">How do you feel today?</p>
      <section id="ruler-survey" className="flex flex-col text-center">
        <div className="flex flex-col gap-4">
          {rulerEmotionsMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-4">
              {row.map((emotion: Emotion, colIndex) => (
                <button
                  id={`${rowIndex}-${colIndex}`}
                  key={colIndex}
                  onMouseEnter={() => expandSize(rowIndex, colIndex)}
                  onMouseLeave={() => removeSize()}
                  onClick={() => handleClick(emotion)}
                  className={`${emotionBgColor(emotion)} h-10 w-14 cursor-pointer rounded-full text-center text-transparent transition-transform duration-500 hover:z-50 hover:scale-150 hover:text-white`}
                >
                  <p className="text-[0.5rem] font-semibold duration-500">
                    {emotion.name}
                  </p>
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RulerStepOne;
