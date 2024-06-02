"use client";

import { Emotion, RulerSurveyAnswer } from "@/types/types";
import { rulerEmotionsMatrix } from "@/utils/constants";
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
  const emotionBgColor = (emotion: Emotion) => {
    if (emotion.pleasantness < 0 && emotion.energy < 0) return "bg-blue-400";
    else if (emotion.pleasantness < 0 && emotion.energy > 0)
      return "bg-red-400";
    else if (emotion.pleasantness > 0 && emotion.energy < 0)
      return "bg-green-400";
    else return "bg-yellow-400";
  };

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
          element.classList.remove("z-50");
          element.classList.add("text-transparent");
        }
      }
    }
  };
  return (
    <div
      className="flex flex-col"
      id="ruler-step-one"
      data-testid="ruler-step-one"
    >
      <p className="my-2 text-sm text-graySubtitle">How do you feel today?</p>
      <div className="absolute left-[-17rem] top-[53%] z-50 flex w-[70%] -rotate-90 flex-row items-center  gap-5  leading-none">
        <p>Low</p>
        <div className="h-0.5 w-1/3 bg-gradient-to-r from-blue-800 to-blue-500" />
        <p className="">Energy</p>
        <div className="flex w-[30%] flex-row items-center">
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 to-red-300" />
          <div
            id="triange"
            className="h-0.5 w-0 rotate-90 border-b-[15px] border-l-[7.5px] border-r-[7.5px] border-b-red-300 border-l-transparent border-r-transparent"
          />
        </div>
        <p>High</p>
      </div>

      <div className="flex w-full flex-row items-center justify-end gap-5 py-2 pe-3 leading-none">
        <p>Low</p>
        <div className="h-0.5 w-1/3 bg-gradient-to-r from-red-800 to-red-500" />
        <p className="">Pleasentness</p>
        <div className="flex w-[30%] flex-row items-center">
          <div className="h-0.5 w-full bg-gradient-to-r from-yellow-600 to-yellow-300" />
          <div
            id="triange"
            className="h-0.5 w-0 rotate-90 border-b-[15px] border-l-[7.5px] border-r-[7.5px] border-b-yellow-300 border-l-transparent border-r-transparent"
          />
        </div>
        <p>High</p>
      </div>

      <section id="ruler-survey" className="flex flex-col text-center">
        <div className="flex flex-col gap-3 self-end">
          {rulerEmotionsMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-3">
              {row.map((emotion: Emotion, colIndex) => (
                <button
                  data-testid={`emotion-${rowIndex}-${colIndex}`}
                  id={`${rowIndex}-${colIndex}`}
                  key={colIndex}
                  onMouseEnter={() => expandSize(rowIndex, colIndex)}
                  onMouseLeave={() => removeSize()}
                  onClick={() => handleClick(emotion)}
                  className={`${emotionBgColor(emotion)} z-10 h-10 w-14 cursor-pointer rounded-full text-center text-transparent transition-transform duration-500 hover:z-50 hover:scale-150 hover:text-white`}
                >
                  <p
                    data-testid={`emotion-name-${rowIndex}-${colIndex}`}
                    className="text-[0.5rem] font-semibold duration-500"
                  >
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
