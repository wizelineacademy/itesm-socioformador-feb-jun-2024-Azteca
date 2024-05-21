"use client";

import { Emotion, RulerSurveyAnswer } from "@/types/types";
import { Dispatch } from "react";

interface RulerStepTwoProps {
  previousStep: () => void;
  onClose: () => void;
  setComment: Dispatch<RulerSurveyAnswer>;
  rulerSurveyAnswer: RulerSurveyAnswer;
}

const RulerStepTwo = ({
  previousStep,
  onClose,
  setComment,
  rulerSurveyAnswer,
}: RulerStepTwoProps) => {
  const getEmotionColorBorder = (emotion: Emotion | null) => {
    if (!emotion) return "";
    if (emotion.pleasantness < 0 && emotion.energy < 0)
      return "border-blue-300 bg-blue-100/50 focus:outline-blue-500 focus-within:outline-blue-500";
    else if (emotion.pleasantness < 0 && emotion.energy > 0)
      return "border-red-300 bg-red-100/50 focus:outline-red-500 focus-within:outline-red-500";
    else if (emotion.pleasantness > 0 && emotion.energy < 0)
      return "border-green-300 bg-green-100/50 focus:outline-green-500 focus-within:outline-green-500";
    else
      return "border-yellow-100 bg-yellow-100/20 focus:outline-yellow-200 focus-within:outline-yellow-200";
  };
  return (
    <form action={onClose} className={`flex h-40 flex-col`}>
      <div className="mt-4 flex flex-col items-center ">
        <label
          htmlFor="emotion-description"
          className="self-start text-base font-medium text-black"
        >
          Why did you feel this way? (Optional)
        </label>
        <textarea
          id="emotion-description"
          name="emotion-description"
          placeholder="Explain more about your emotion..."
          value={rulerSurveyAnswer.comment || ""}
          onChange={(e) =>
            setComment({ ...rulerSurveyAnswer, comment: e.target.value })
          }
          className={`w-full rounded-lg border ${getEmotionColorBorder(rulerSurveyAnswer.emotion)} p-1 text-sm placeholder:left-1 placeholder:text-sm `}
        />
      </div>
      <div className="mt-10 flex flex-row justify-between">
        <button
          type="button"
          className=" mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
          onClick={previousStep}
        >
          Go back
        </button>
        <button
          type="submit"
          className=" mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default RulerStepTwo;
