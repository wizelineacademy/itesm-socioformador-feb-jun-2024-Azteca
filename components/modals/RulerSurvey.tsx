import { Emotion } from "@/types";
import { rulerEmotionsMatrix } from "@/utils/constants";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface RulerSurveyProps {
  showModal: boolean;
  onClose: () => void;
}

const RulerSurvey = ({ showModal, onClose }: RulerSurveyProps) => {
  //TODO: Start working on the modal for the survey, use a bfs to scale the emotions
  const getBgColor = (emotion: Emotion) => {
    if (emotion.pleasantness < 0 && emotion.energy < 0)
      return "bg-blue-400 text-white";
    else if (emotion.pleasantness < 0 && emotion.energy > 0)
      return "bg-red-400 text-white";
    else if (emotion.pleasantness > 0 && emotion.energy < 0)
      return "bg-green-400 text-white";
    else return "bg-yellow-400 text-black";
  };

  const expandSize = (rowIndex: number, colIndex: number) => {
    const isPositionValid = (rowIndex: number, colIndex: number) => {
      return (
        rowIndex >= 0 &&
        rowIndex < rulerEmotionsMatrix.length &&
        colIndex >= 0 &&
        colIndex < rulerEmotionsMatrix[0].length &&
        !visited.has(`${rowIndex}-${colIndex}`)
      );
    };
    removeSize();

    const element = document.getElementById(`${rowIndex}-${colIndex}`);
    if (element) {
      element.classList.add("scale-150");
      element.classList.remove("text-transparent");
    }

    const getSizeTimes = (
      times: number,
    ): "" | "scale-[1.3]" | "scale-[1.2]" | "scale-[1.1]" | "scale-[1.05]" => {
      switch (times) {
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

    const queue: number[][] = [];
    const visited: Set<string> = new Set();
    queue.push([rowIndex, colIndex]);
    visited.add(`${rowIndex}-${colIndex}`);
    let times = 4;

    while (queue.length && times != 0) {
      const n = queue.length;
      const [i, j] = queue.shift() || [];
      const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
      for (const [dx, dy] of directions) {
        const newRow = i + dx;
        const newCol = j + dy;
        if (isPositionValid(newRow, newCol)) {
          const element = document.getElementById(`${newRow}-${newCol}`);
          if (element) {
            element.classList.add(getSizeTimes(times));
          }
          queue.push([newRow, newCol]);
          visited.add(`${newRow}-${newCol}`);
        }
      }
      times -= 1;
    }
  };

  const removeSize = () => {
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
          element.classList.remove("scale-[1.05]");
          element.classList.add("text-transparent");
        }
      }
    }
  };

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="scae flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-fit transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Ruler Survey
                </Dialog.Title>
                <p className="my-2 text-sm text-graySubtitle">
                  How do you feel today?
                </p>
                <section
                  id="ruler-survey"
                  className="flex flex-col gap-4 self-center"
                >
                  {rulerEmotionsMatrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex w-full flex-row gap-4">
                      {row.map((emotion: Emotion, colIndex) => (
                        <div
                          id={`${rowIndex}-${colIndex}`}
                          key={colIndex}
                          onMouseEnter={() => expandSize(rowIndex, colIndex)}
                          onMouseLeave={() => removeSize()}
                          className={`${getBgColor(emotion)} flex h-10 w-10 cursor-pointer flex-col items-center justify-center truncate rounded-full bg-red-200 text-center text-transparent transition-transform duration-500 hover:scale-150`}
                        >
                          <p className="text-xs duration-500">{emotion.name}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RulerSurvey;
