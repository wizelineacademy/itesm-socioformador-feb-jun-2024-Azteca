"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import SprintStepOne from "./SprintStepOne";
import SprintStepTwo from "./SprintStepTwo";
import { SprintSurveyAnswer, SurveyStepTwoAnswer } from "@/types/types";
import SprintStepThree from "./SprintStepThree";
import SprintStepFour from "./SprintStepFour";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCoworkersInProject } from "@/services/project";
import {
  getSprintSurveyQuestions,
  submitSprintSurveyAnswers,
} from "@/services/sprintSurvey";
import toast from "react-hot-toast";
import { getUserId } from "@/services/user";

interface SprintSurveyProps {
  showModal: boolean;
  onClose: () => void;
  sprintSurveyId: number;
}

const SprintSurvey = ({
  showModal,
  onClose,
  sprintSurveyId,
}: SprintSurveyProps) => {
  const [step, setStep] = useState<number>(1);
  const { data: users, isError } = useQuery({
    queryKey: ["coworkers", 34],
    queryFn: () => getCoworkersInProject(34),
  });

  const { data: userId } = useQuery({
    queryKey: ["userId"],
    queryFn: async () => await getUserId(),
  });

  const { data: sprintQuestions } = useQuery({
    queryKey: ["sprintQuestions"],
    queryFn: async () => await getSprintSurveyQuestions(),
  });

  console.log(sprintQuestions);

  const [sprintAnswer, setSprintAnswer] = useState<SprintSurveyAnswer>({
    userId: userId,
    sprintSurveyId: sprintSurveyId,
    projectAnswers: [
      {
        questionKey: "MS_RF",
        answer: 1,
      },
      {
        questionKey: "MS_RA",
        answer: 1,
      },
      {
        questionKey: "MS_LS",
        answer: 1,
      },
      {
        questionKey: "MS_WE",
        answer: 1,
      },
    ],
    coworkersAnswers: [],
    coworkersComments: [],
  });

  const [sprintSurveyStepTwoAnswer, setSprintSurveyStepTwoAnswer] =
    useState<SurveyStepTwoAnswer>({
      SS_CWPN: Array(10)
        .fill([])
        .map(() => []),
      SS_CWCM: Array(10)
        .fill([])
        .map(() => []),
      SS_CWSP: Array(10)
        .fill([])
        .map(() => []),
      SS_CWMT: Array(10)
        .fill([])
        .map(() => []),
    });

  const handleNavigation = (step: number) => {
    setStep(step);
  };

  const isSurveyCompleted = (): boolean => {
    const isStepTwoCompleted = Object.keys(sprintSurveyStepTwoAnswer).every(
      (key) => {
        const subArray =
          sprintSurveyStepTwoAnswer[key as keyof SurveyStepTwoAnswer];
        let usersInSubarray = 0;
        subArray.forEach((subArrayElement) => {
          usersInSubarray += subArrayElement.length;
        });
        return usersInSubarray === (users?.length ?? 0);
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

  const handleStepTwoAnswer = () => {
    if (!isSurveyCompleted()) {
      toast.error("Please fill all the fields before submitting the survey.");
      return;
    }
    setStep(3);
  };

  const submitSurveyAnswers = useMutation({
    mutationFn: () => submitSprintSurveyAnswers(sprintAnswer),
    onSuccess: () => {
      toast.success("Encuesta enviada exitosamente!");
    },
    onError: () => {
      toast.error("Error al enviar la encuesta");
    },
  });

  const handleSubmit = () => {
    parseStepTwoAnswer();
    submitSurveyAnswers.mutate();
    onClose();
  };

  const modalWidth = step === 3 ? "max-w-xl" : "max-w-5xl";
  useEffect(() => {
    const modal = document.querySelector(".sprint-survey");
    if (!modal) return;
    if (step === 3) modal.classList.remove("max-w-5xl");
    else modal.classList.remove("max-w-xl");
  }, [step]);

  //TODO: Render the loading state into the modal
  if (!users) return <div></div>;
  if (isError) return <div>Error loading data</div>;
  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogPanel
                className={`sprint-survey flex h-auto transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-500 ${modalWidth}`}
              >
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Sprint Survey
                </DialogTitle>
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
                      className="mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                      onClick={() => handleNavigation(2)}
                    >
                      Next
                    </button>
                  )}
                  {step === 2 && (
                    <>
                      <button
                        type="button"
                        className="mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={() => handleNavigation(1)}
                      >
                        Go back
                      </button>
                      <button
                        type="button"
                        className="mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={handleStepTwoAnswer}
                      >
                        Submit
                      </button>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <button
                        type="button"
                        className="mx-auto rounded-full bg-primary px-10 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={handleSubmit}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        className="mx-auto rounded-full bg-primary px-10 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                        onClick={() => handleNavigation(4)}
                      >
                        Yes
                      </button>
                    </>
                  )}
                  {step === 4 && (
                    <button
                      type="button"
                      className="mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                      onClick={handleSubmit}
                    >
                      Send feedback
                    </button>
                  )}
                </footer>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SprintSurvey;
