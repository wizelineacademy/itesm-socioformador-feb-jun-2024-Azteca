"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import SprintStepOne from "./SprintStepOne";
import SprintStepTwo from "./SprintStepTwo";
import { Coworker, SprintSurveyAnswer, SurveyStepTwoAnswer } from "@/types";
import SprintStepThree from "./SprintStepThree";
import SprintStepFour from "./SprintStepFour";

interface SprintSurveyProps {
  showModal: boolean;
  onClose: () => void;
}

const SprintSurvey = ({ showModal, onClose }: SprintSurveyProps) => {
  const [step, setStep] = useState<number>(1);
  const handleNavigation = (step: number) => {
    setStep(step);
  };

  const users: Coworker[] = [
    {
      name: "Pedro Alonso",
      photoUrl: "",
      userId: "eorjioerji",
      color: "text-blue-300",
    },
    {
      name: "Alejandro Mendoza",
      photoUrl: "",
      userId: "inenrvoerni",
      color: "text-red-300",
    },
    {
      name: "Felipe González",
      photoUrl: "",
      userId: "wefiweo",
      color: "text-yellow-300",
    },
    {
      name: "Adrian Ramírez",
      photoUrl: "",
      userId: "woiejiew",
      color: "text-green-300",
    },
  ];

  const [sprintAnswer, setSprintAnswer] = useState<SprintSurveyAnswer>({
    userId: "placeholder",
    sprintSurveyId: 0,
    projectAnswers: [
      {
        questionKey: "resources",
        answer: 50,
      },
      {
        questionKey: "responsibilities",
        answer: 50,
      },
      {
        questionKey: "support",
        answer: 50,
      },
      {
        questionKey: "workload",
        answer: 50,
      },
    ],
    coworkersAnswers: [],
    coworkersComments: {},
  });

  const [sprintSurveyStepTwoAnswer, setSprintSurveyStepTwoAnswer] =
    useState<SurveyStepTwoAnswer>({
      punctuality: Array(10)
        .fill([])
        .map(() => []),
      cooperation: Array(10)
        .fill([])
        .map(() => []),
      support: Array(10)
        .fill([])
        .map(() => []),
      motivates: Array(10)
        .fill([])
        .map(() => []),
    });

  const isSurveyCompleted = (): boolean => {
    const isStepTwoCompleted = Object.keys(sprintSurveyStepTwoAnswer).every(
      (key) => {
        const subArray =
          sprintSurveyStepTwoAnswer[key as keyof SurveyStepTwoAnswer];
        let usersInSubarray = 0;
        subArray.forEach((subArrayElement) => {
          usersInSubarray += subArrayElement.length;
        });
        return usersInSubarray === users.length;
      },
    );
    return isStepTwoCompleted;
  };

  const parseStepTwoAnswer = () => {
    Object.keys(sprintSurveyStepTwoAnswer).forEach((key) => {
      const answersArray =
        sprintSurveyStepTwoAnswer[key as keyof SurveyStepTwoAnswer];
      const questionObject: {
        questionKey: keyof SurveyStepTwoAnswer;
        answers: { coworkerId: string; answer: number }[];
      } = {
        questionKey: key as keyof SurveyStepTwoAnswer,
        answers: [],
      };
      for (let i = 0; i < answersArray.length; i++) {
        answersArray[i].forEach((answer) => {
          questionObject.answers.push({
            coworkerId: answer.userId,
            answer: i + 1,
          });
        });
      }
      sprintAnswer.coworkersAnswers.push(questionObject);
    });
  };

  const handleSubmit = () => {
    if (!isSurveyCompleted()) {
      return;
    }
    parseStepTwoAnswer();
    // Send data to the server
    console.log(sprintAnswer);
    console.log("Completed");
    //onClose();
  };

  const modalWidth =
    step === 3
      ? "max-w-xl h-30 transition-all duration-500"
      : "max-w-5xl transition-all duration-500";

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel
                className={`flex h-auto w-full transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${modalWidth}`}
              >
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Sprint Survey
                </Dialog.Title>
                {step === 1 && (
                  <SprintStepOne
                    sprintSurveyAnswer={sprintAnswer}
                    setSprintSurveyAnswer={setSprintAnswer}
                  />
                )}
                {step === 2 && (
                  <SprintStepTwo
                    users={users}
                    sprintSurveyStepTwoAnswer={sprintSurveyStepTwoAnswer}
                    setSprintSurveyStepTwoAnswer={setSprintSurveyStepTwoAnswer}
                  />
                )}
                {step === 3 && <SprintStepThree />}
                {step === 4 && (
                  <SprintStepFour
                    users={users}
                    sprintSurveyAnswer={sprintAnswer}
                    setSprintSurveyAnswer={setSprintAnswer}
                  />
                )}

                <footer className="mt-8 flex justify-center">
                  {step === 1 && (
                    <button
                      type="button"
                      className=" mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                      onClick={() => handleNavigation(2)}
                    >
                      Next
                    </button>
                  )}
                  {step === 2 && (
                    <>
                      <button
                        type="button"
                        className=" mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={() => handleNavigation(1)}
                      >
                        Go back
                      </button>

                      <button
                        type="button"
                        className=" mx-auto  rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={() => handleNavigation(3)}
                      >
                        Submit
                      </button>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <button
                        type="button"
                        className=" mx-auto rounded-full bg-primary px-10 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={handleSubmit}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        className=" mx-auto  rounded-full bg-primary px-10 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={() => handleNavigation(4)}
                      >
                        Yes
                      </button>
                    </>
                  )}
                  {step === 4 && (
                    <button
                      type="button"
                      className=" mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                      onClick={handleSubmit}
                    >
                      Send feedback
                    </button>
                  )}
                </footer>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SprintSurvey;
