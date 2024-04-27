import { Coworker, SprintSurveyAnswer } from "@/types";

interface SprintStepFour {
  users: Coworker[];
  sprintSurveyAnswer: SprintSurveyAnswer;
  setSprintSurveyAnswer: (sprintSurveyAnswer: SprintSurveyAnswer) => void;
}

const SprintStepFour = ({
  users,
  sprintSurveyAnswer,
  setSprintSurveyAnswer,
}: SprintStepFour) => {
  const onChangeValue = (comment: string, userId: string) => {
    setSprintSurveyAnswer({
      ...sprintSurveyAnswer,
      coworkersComments: {
        ...sprintSurveyAnswer.coworkersComments,
        [userId]: comment,
      },
    });
  };
  return (
    <>
      <p className="mb-3 mt-2 text-base font-medium text-black ">
        Every answer field is optional
      </p>
      <div className="grid grid-flow-row grid-cols-2 gap-4">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-start"
          >
            <label className="w-full font-normal text-black">{user.name}</label>
            <textarea
              value={sprintSurveyAnswer.coworkersComments[user.userId] || ""}
              onChange={(e) => onChangeValue(e.target.value, user.userId)}
              placeholder="Type some feedback..."
              className="w-full rounded-lg border border-primary-light p-1 text-sm placeholder:left-1 placeholder:text-sm focus:outline-primary-dark"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SprintStepFour;
