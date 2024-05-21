import React from "react";
import Slider from "../Slider";
import { SprintSurveyAnswer } from "@/types/types";

interface SprintStepOneProps {
  sprintSurveyAnswer: SprintSurveyAnswer;
  setSprintSurveyAnswer: (sprintSurveyAnswer: SprintSurveyAnswer) => void;
}

const SprintStepOne = ({
  sprintSurveyAnswer,
  setSprintSurveyAnswer,
}: SprintStepOneProps) => {
  const onChangeValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const value = parseInt(event.target.value);
    const newSprintSurveyAnswer = {
      ...sprintSurveyAnswer,
      projectAnswers: sprintSurveyAnswer.projectAnswers.map((answer) =>
        answer.questionKey === name ? { ...answer, answer: value } : answer,
      ),
    };
    setSprintSurveyAnswer(newSprintSurveyAnswer);
  };

  return (
    <div className="mt-9 grid grid-flow-row grid-cols-2 gap-x-20 gap-y-16">
      <Slider
        name="MS_RF"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "MS_RF",
          )?.answer || 6
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "MS_RF")
        }
        className="w-full"
        label="Did you have enough resources to complete your activities?"
      />
      <Slider
        name="MS_RA"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "MS_RA",
          )?.answer || 6
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "MS_RA")
        }
        className="w-full"
        label="Do you agree with the responsibilities you were assigned with?"
      />
      <Slider
        name="MS_LS"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "MS_LS",
          )?.answer || 6
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "MS_LS")
        }
        className="w-full"
        label="Did you receive support from your manager regarding technical and/or emotional matters?"
      />
      <Slider
        name="MS_WE"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "MS_WE",
          )?.answer || 6
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "MS_WE")
        }
        className="w-full"
        label="Was the workload and initial project expectations fair according to the deadlines?"
      />
    </div>
  );
};

export default SprintStepOne;
