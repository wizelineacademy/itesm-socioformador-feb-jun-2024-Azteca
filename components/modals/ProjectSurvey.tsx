"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Slider from "../Slider";
import { useMutation } from "@tanstack/react-query";
import { submitProjectAnswer } from "@/services/projectSurvey";
import { ProjectAnswer } from "@/types";

interface ProjectSurveyProps {
  showModal: boolean;
  onClose: () => void;
}
const ProjectSurvey = ({ showModal, onClose }: ProjectSurveyProps) => {
  const { mutate } = useMutation({
    mutationFn: submitProjectAnswer,
    onSuccess: onClose,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: handle failure cases for this surveys
    const formData = new FormData(event.target as HTMLFormElement);
    mutate({
      finalSurveyId: 1, // TODO: Harcoded for now (waiting for notifications to be implemented)
      answers: [
        {
          questionKey: "efforts",
          answer: parseInt(formData.get("efforts")!.toString()),
        },
        {
          questionKey: "support",
          answer: parseInt(formData.get("support")!.toString()),
        },
        {
          questionKey: "decisions",
          answer: parseInt(formData.get("support")!.toString()),
        },
        {
          questionKey: "opportunities",
          answer: parseInt(formData.get("support")!.toString()),
        },
        {
          questionKey: "respect",
          answer: parseInt(formData.get("support")!.toString()),
        },
      ],
      comment: formData.get("comments")!.toString(),
    });
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-5xl transform flex-col overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Project Survey
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="mt-3 grid grid-cols-2 gap-10">
                    <Slider
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
                    />
                    <div>
                      <p className="text-sm font-light text-black">
                        General comments on the project
                      </p>
                      <textarea
                        name="comments"
                        id="comments"
                        className="mt-2 h-auto w-full rounded-md border border-black p-2 focus:outline-primary"
                        placeholder="Optional"
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-12 flex w-full justify-center">
                    <button
                      type="submit"
                      className="rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectSurvey;
