"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import Slider from "../Slider";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  submitProjectAnswer,
  getProjectQuestions,
} from "@/services/projectSurvey";
import { getUserId } from "@/services/user";
import toast from "react-hot-toast";
import Loader from "../Loader";

interface ProjectSurveyProps {
  showModal: boolean;
  onClose: () => void;
  projectSurveyId: number;
}
const ProjectSurvey = ({
  showModal,
  onClose,
  projectSurveyId,
}: ProjectSurveyProps) => {
  const { mutate } = useMutation({
    mutationFn: submitProjectAnswer,
    onSuccess: () => {
      console.log("Encuesta enviada");
      toast.success("Encuesta enviada exitosamente!");
      onClose();
    },
    onError: () => {
      console.log("Error al enviar la encuesta");
      toast.error("Error al enviar la encuesta");
      onClose();
    },
  });

  const { data: userId } = useQuery({
    queryKey: ["userId"],
    queryFn: async () => await getUserId(),
  });

  const questions = useQuery({
    queryKey: ["finalProjectquestions"],
    queryFn: async () => await getProjectQuestions(),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !questions.data) return;
    // TODO: handle failure cases for this surveys
    const formData = new FormData(event.target as HTMLFormElement);
    const formsAnswers = questions.data.map((question) => ({
      questionKey: question.id,
      answer: parseInt(
        (formData.get(`Question ${question.id}`) || "None").toString(),
      ),
    }));
    let commentId = 1;
    for (let c = 0; c < questions.data.length; c++) {
      if (questions.data[c].type == "FINAL_PROJECT_COMMENT") {
        commentId = questions.data[c].id;
      }
    }
    const finalAnswers = formsAnswers.filter(
      (answerObj) => !isNaN(answerObj.answer),
    );
    mutate({
      userId: userId,
      finalSurveyId: projectSurveyId,
      answers: finalAnswers,
      comment: {
        questionKey: commentId,
        text:
          (
            formData.get(
              `Question ${questions.data[questions.data.length - 1].id}`,
            ) || "None"
          ).toString() || "None",
      },
    });
  };

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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="flex w-full max-w-5xl transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Project Survey
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                  <div className="mt-3 grid w-full grid-cols-2 gap-10">
                    {questions.isLoading && (
                      <div className="col-span-2 pb-4 pt-10">
                        <Loader />
                      </div>
                    )}
                    {questions.data &&
                      questions.data.map((question, index) =>
                        question.type === "FINAL_PROJECT_COMMENT" ? (
                          <div key={index}>
                            <p className="text-sm font-light text-black">
                              General comments on the project
                            </p>
                            <textarea
                              name={`Question ${question.id}`}
                              id="comments"
                              className="mt-2 h-auto w-full rounded-md border border-black p-2 focus:outline-primary"
                              placeholder="Optional"
                            ></textarea>
                          </div>
                        ) : (
                          <Slider
                            key={index}
                            name={`Question ${question.id}`}
                            label={
                              question.description
                                ? question.description
                                : "NO Question"
                            }
                          />
                        ),
                      )}
                    {/* <Slider
                      name="efforts"
                      label="Do you feel that your efforts were recognized?"
                    />
                    <Slider
                      name="support"
                      label="Did you feel supported in your personal growth?"
                    />
                    <Slider
                      name="decisions"
                      label="Were your ideas and creativity heard in decision-making?"
                    />
                    <Slider
                      name="opportunities"
                      label="Were the challenges addressed with opportuninites for growth?"
                    />
                    <Slider
                      name="respect"
                      label="Was there an atmosphere of respect and trust?"
                    /> */}
                  </div>
                  <div className="mt-12 flex w-full justify-center">
                    {!questions.isLoading && (
                      <button
                        type="submit"
                        className="rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectSurvey;
