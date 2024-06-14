"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import SprintStepOne from "./SprintStepOne";
import SprintStepTwo from "./SprintStepTwo";
import {
  QuestionType,
  Questions,
  SprintSurveyAnswer,
  SurveyStepTwoAnswer,
} from "@/types/types";
import SprintStepThree from "./SprintStepThree";
import SprintStepFour from "./SprintStepFour";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoworkersInProject } from "@/services/project";
import {
  getSprintSurveyQuestions,
  submitSprintSurveyAnswers,
} from "@/services/sprintSurvey";
import toast from "react-hot-toast";
import { getUserId } from "@/services/user";
import Loader from "../Loader";
import { useRouter } from "next/navigation";

interface SprintSurveyProps {
  showModal: boolean;
  onClose: () => void;
  sprintSurveyId: number;
  projectId: number;
}

const SprintSurvey = ({
  showModal,
  onClose,
  sprintSurveyId,
  projectId,
}: SprintSurveyProps) => {
  const [step, setStep] = useState<number>(1);
  const { data: users, isError } = useQuery({
    queryKey: ["coworkers", projectId],
    queryFn: () => getCoworkersInProject(projectId),
    enabled: !!projectId,
  });

  const { data: userId } = useQuery({
    queryKey: ["userId"],
    queryFn: async () => await getUserId(),
  });

  const { data: allSprintQuestions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["sprintQuestions"],
    queryFn: async () => await getSprintSurveyQuestions(),
  });

  const router = useRouter();

  const sprintQuestions: Questions[] | undefined = useMemo(() => {
    return allSprintQuestions?.filter(
      (question) => question.type === ("SPRINT_QUESTION" as QuestionType),
    ) as Questions[];
  }, [allSprintQuestions]);

  const coworkerQuestions: Questions[] | undefined = useMemo(() => {
    return allSprintQuestions?.filter(
      (question) => question.type === ("COWORKER_QUESTION" as QuestionType),
    ) as Questions[];
  }, [allSprintQuestions]);

  const [sprintAnswer, setSprintAnswer] = useState<SprintSurveyAnswer>({
    userId: userId,
    sprintSurveyId: sprintSurveyId,
    projectAnswers: [],
    coworkersAnswers: [],
    commentId: 0,
    coworkersComments: [],
  });
  const sprintSurveyStepTwoAnswerBase: SurveyStepTwoAnswer = useMemo(() => {
    const questions = coworkerQuestions
      ? coworkerQuestions.reduce((acc, question) => {
          acc[question.id] = Array(10)
            .fill([])
            .map(() => []);
          return acc;
        }, {} as SurveyStepTwoAnswer)
      : {};
    return questions;
  }, [coworkerQuestions]);

  const [sprintSurveyStepTwoAnswer, setSprintSurveyStepTwoAnswer] =
    useState<SurveyStepTwoAnswer>({});

  useEffect(() => {
    setSprintSurveyStepTwoAnswer(sprintSurveyStepTwoAnswerBase);
  }, [sprintSurveyStepTwoAnswerBase]);

  const handleNavigation = (step: number) => {
    setStep(step);
  };

  const isSurveyCompleted = (): boolean => {
    const isStepTwoCompleted = Object.keys(sprintSurveyStepTwoAnswer).every(
      (key) => {
        const subArray =
          sprintSurveyStepTwoAnswer[parseInt(key) as keyof SurveyStepTwoAnswer];
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
        sprintSurveyStepTwoAnswer[parseInt(key) as keyof SurveyStepTwoAnswer];
      const questionObject: {
        questionId: keyof SurveyStepTwoAnswer;
        answers: { coworkerId: string; answer: number }[];
      } = {
        questionId: parseInt(key) as keyof SurveyStepTwoAnswer,
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
      sprintAnswer.commentId = allSprintQuestions?.find(
        (type) => type.type === "COWORKER_COMMENT",
      )?.id as number;
      sprintAnswer.coworkersAnswers.push(questionObject);
    });
  };

  const handleStepOneAnswer = () => {
    const projectQuestions = [...sprintAnswer.projectAnswers];
    sprintQuestions?.forEach((question) => {
      const wasAnswered = projectQuestions.find(
        (answer) => answer.questionId === question.id,
      );
      if (!wasAnswered) {
        projectQuestions.push({
          questionId: question.id,
          answer: 6,
        });
      }
    });
    setSprintAnswer({ ...sprintAnswer, projectAnswers: projectQuestions });
    setStep(2);
  };

  const handleStepTwoAnswer = () => {
    if (!isSurveyCompleted()) {
      toast.error("Please fill all the fields before submitting the survey.");
      return;
    }
    setStep(3);
  };

  const queryClient = useQueryClient();

  const submitSurveyAnswers = useMutation({
    mutationFn: () => submitSprintSurveyAnswers(sprintAnswer),
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Survey submitted!");
    },
    onError: () => {
      toast.error("Error submitting the survey.");
    },
  });

  const handleSubmit = () => {
    parseStepTwoAnswer();
    submitSurveyAnswers.mutate();
    onClose();
  };

  const modalWidth = step === 3 ? "max-w-xl" : "max-w-5xl";
  if (isError) return <div>Error loading data</div>;

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
                data-testid="sprint-survey"
                className={`sprint-survey flex h-auto transform flex-col rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-500 ${modalWidth}`}
              >
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Sprint Survey
                </Dialog.Title>
                {isLoadingQuestions && <Loader />}
                {allSprintQuestions && users && (
                  <>
                    {step === 1 && (
                      <SprintStepOne
                        questions={sprintQuestions}
                        sprintSurveyAnswer={sprintAnswer}
                        setSprintSurveyAnswer={setSprintAnswer}
                      />
                    )}
                    {step === 2 && (
                      <SprintStepTwo
                        users={users}
                        questions={coworkerQuestions}
                        sprintSurveyStepTwoAnswer={sprintSurveyStepTwoAnswer}
                        setSprintSurveyStepTwoAnswer={
                          setSprintSurveyStepTwoAnswer
                        }
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
                  </>
                )}
                <footer className="mt-8 flex justify-center">
                  {step === 1 && (
                    <button
                      type="button"
                      className={`${isLoadingQuestions && "hidden"} mx-auto rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark`}
                      onClick={handleStepOneAnswer}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SprintSurvey;
