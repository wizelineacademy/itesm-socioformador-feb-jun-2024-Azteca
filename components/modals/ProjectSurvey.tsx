import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Slider from "../Slider";

interface ProjectSurveyProps {
  showModal: boolean;
  onClose: () => void;
}
const ProjectSurvey = ({ showModal, onClose }: ProjectSurveyProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
                  <div className="mt-3 flex flex-row flex-wrap justify-around">
                    <Slider
                      name="efforts"
                      label="Do you feel that your efforts were recognized?"
                      className=" pe-10"
                    />
                    <Slider
                      name="support"
                      label="Did you feel supported in your personal growth?"
                      className=" ps-10"
                    />
                    <Slider
                      name="decisions"
                      label="Were your ideas and creativity heard in decision-making?"
                      className="mt-8 pe-10"
                    />
                    <Slider
                      name="opportunities"
                      label="Were the challenges addressed with opportuninites for growth?"
                      className="mt-8 ps-10"
                    />
                  </div>
                  <Slider
                    name="respect"
                    label="Was there an atmosphere of respect and trust?"
                    className="mx-auto mt-8 flex-1 px-5"
                  />
                  <button
                    type="submit"
                    className=" mx-auto mt-12 rounded-full bg-primary px-7 py-2 text-base font-medium text-white transition-all duration-100 hover:bg-primary-dark hover:ring-2 hover:ring-primary-dark"
                  >
                    Submit
                  </button>
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
