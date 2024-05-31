"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import RulerStepOne from "./RulerStepOne";
import { RulerSurveyAnswer } from "@/types/types";
import RulerStepTwo from "./RulerStepTwo";
import { getUserId } from "@/services/user";
import { submitRulerSurveyAnswer } from "@/services/rulerSurvey";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RulerSurveyProps {
  showModal: boolean;
  onClose: () => void;
  rulerSurveyId: number;
}

const RulerSurvey = ({ showModal, onClose }: RulerSurveyProps) => {
  const [step, setStep] = useState<number>(1);
  const { data: userId } = useQuery({
    queryKey: ["userId"],
    queryFn: async () => await getUserId(),
  });
  const [rulerSurveyAnswer, setRulerSurveyAnswer] = useState<RulerSurveyAnswer>(
    {
      userId: userId,
      emotion: null,
      comment: null,
    },
  );
  const modalWidth = step === 1 ? "max-w-4xl" : "max-w-lg";

  const getEmotionTextColor = () => {
    if (!rulerSurveyAnswer.emotion) return "";
    if (
      rulerSurveyAnswer.emotion.pleasantness < 0 &&
      rulerSurveyAnswer.emotion.energy < 0
    )
      return "text-blue-600";
    else if (
      rulerSurveyAnswer.emotion.pleasantness < 0 &&
      rulerSurveyAnswer.emotion.energy > 0
    )
      return "text-red-600";
    else if (
      rulerSurveyAnswer.emotion.pleasantness > 0 &&
      rulerSurveyAnswer.emotion.energy < 0
    )
      return "text-green-600";
    else return "text-yellow-500";
  };

  const submitRulerAnswers = useMutation({
    mutationFn: () => submitRulerSurveyAnswer(rulerSurveyAnswer),
    onSuccess: () => {
      toast.success("Encuesta enviada exitosamente!");
    },
    onError: () => {
      toast.error("Error al enviar la encuesta");
    },
  });

  const handleSubmit = () => {
    submitRulerAnswers.mutate();
    onClose();
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
          <div className="flex min-h-full w-auto items-center justify-center p-4 text-center transition-all duration-300">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                data-testid="ruler-survey"
                id="ruler-modal"
                className={`flex ${modalWidth} w-full transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-500`}
              >
                <Dialog.Title
                  as="h3"
                  className="flex flex-row items-center justify-between text-black"
                >
                  <p className="text-2xl font-semibold">Ruler Survey</p>
                  <div className="flex h-8 min-w-fit max-w-[40ch] flex-col justify-center self-end text-sm">
                    <span
                      data-testid="chosen-emotion"
                      className={
                        getEmotionTextColor() + " text-end font-medium"
                      }
                    >
                      {rulerSurveyAnswer.emotion?.name}
                    </span>
                    {step === 1 && (
                      <span>{rulerSurveyAnswer.emotion?.description}</span>
                    )}
                  </div>
                </Dialog.Title>
                {step === 1 && (
                  <RulerStepOne
                    setEmotion={setRulerSurveyAnswer}
                    nextStep={() => setStep(2)}
                    rulerSurveyAnswer={rulerSurveyAnswer}
                  />
                )}
                {step === 2 && (
                  <RulerStepTwo
                    rulerSurveyAnswer={rulerSurveyAnswer}
                    setComment={setRulerSurveyAnswer}
                    previousStep={() => setStep(1)}
                    onClose={handleSubmit}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RulerSurvey;
