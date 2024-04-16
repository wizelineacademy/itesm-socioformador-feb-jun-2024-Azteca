import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Slider from "../Slider";

interface ProjectSurveyProps {
  showModal: boolean;
  onClose: () => void;
}
const ProjectSurvey = ({ showModal, onClose }: ProjectSurveyProps) => {
  const handleClose = () => {};
  const marks = ["Disagree", "Medium", "Agree"];
  const label = "How likely are you to recommend this project to a friend?";
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
                <section>
                  <div className="mt-3 flex flex-row flex-wrap justify-around">
                    <Slider
                      label="Do you feel that your efforts were recognized?"
                      className=" pe-10"
                    />
                    <Slider
                      label="Did you feel supported in your personal growth?"
                      className=" ps-10"
                    />
                    <Slider
                      label="Were your ideas and creativity heard in decision-making?"
                      className="mt-8 pe-10"
                    />
                    <Slider
                      label="Were the challenges addressed with opportuninites for growth?"
                      className="mt-8 ps-10"
                    />
                  </div>
                  <Slider
                    label="Was there an atmosphere of respect and trust?"
                    className="mx-auto mt-8 flex-1 px-5"
                  />
                </section>
                <button
                  type="button"
                  className=" mx-auto mt-12 rounded-full bg-primary px-7 py-2 text-base font-medium text-white"
                  onClick={onClose}
                >
                  Submit
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectSurvey;
