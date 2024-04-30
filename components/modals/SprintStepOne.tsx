import React from "react";
import Slider from "../Slider";
import { SprintSurveyAnswer } from "@/types";

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
        name="resources"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "resources",
          )?.answer || 0
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "resources")
        }
        className="w-full"
        label="Did you have enough resources to complete your activities?"
      />
      <Slider
        name="responsibilities"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "responsibilities",
          )?.answer || 0
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "responsibilities")
        }
        className="w-full"
        label="Do you agree with the responsibilities you were assigned with?"
      />
      <Slider
        name="support"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "support",
          )?.answer || 0
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "support")
        }
        className="w-full"
        label="Did you receive support from your manager regarding technical and/or emotional matters?"
      />
      <Slider
        name="workload"
        value={
          sprintSurveyAnswer.projectAnswers.find(
            (answer) => answer.questionKey === "workload",
          )?.answer || 0
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeValue(e, "workload")
        }
        className="w-full"
        label="Was the workload and initial project expectations fair according to the deadlines?"
      />
    </div>
  );
};

export default SprintStepOne;
