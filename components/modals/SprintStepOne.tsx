import React from "react";
import Slider from "../Slider";
import { Questions, SprintSurveyAnswer } from "@/types/types";

interface SprintStepOneProps {
  sprintSurveyAnswer: SprintSurveyAnswer;
  setSprintSurveyAnswer: (sprintSurveyAnswer: SprintSurveyAnswer) => void;
  questions: Questions[] | undefined;
}

const SprintStepOne = ({
  sprintSurveyAnswer,
  setSprintSurveyAnswer,
  questions,
}: SprintStepOneProps) => {
  const onChangeValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const value = parseInt(event.target.value);
    const newProjectAnswers = [...sprintSurveyAnswer.projectAnswers];
    const index = newProjectAnswers.findIndex(
      (answer) => answer.questionId === id,
    );
    if (index === -1) {
      newProjectAnswers.push({ questionId: id, answer: value });
    } else {
      newProjectAnswers[index].answer = value;
    }
    const newSprintSurveyAnswer = {
      ...sprintSurveyAnswer,
      projectAnswers: newProjectAnswers,
    };
    setSprintSurveyAnswer(newSprintSurveyAnswer);
  };

  return (
    <div
      data-testid="sprint-step-one"
      className="mt-9 grid grid-flow-row grid-cols-2 gap-x-20 gap-y-16"
    >
      {questions &&
        questions.map((question, index) => (
          <Slider
            key={index}
            name={question.id.toString()}
            value={
              sprintSurveyAnswer.projectAnswers.find(
                (answer) => answer.questionId === question.id,
              )?.answer || 6
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeValue(e, question.id)
            }
            className="w-full"
            label={question.description}
          />
        ))}
      {/*       <Slider
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
      /> */}
    </div>
  );
};

export default SprintStepOne;
