import { Dialog, Transition } from "@headlessui/react";
import { Slider } from "@mantine/core";
import { Fragment } from "react";

interface ProjectSurveyProps {
  showModal: boolean;
  onClose: () => void;
}
const ProjectSurvey = ({ showModal, onClose }: ProjectSurveyProps) => {
  const handleClose = () => {};
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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-black"
                >
                  Project Survey
                </Dialog.Title>
                <div className="w-1/2">
                  <label className="mb-2 mt-4 block text-sm font-light text-black">
                    Do you feel that your efforts were recognized?
                  </label>
                  <input
                    type="range"
                    step={50}
                    min={0}
                    max={100}
                    className="h-1.5 w-full appearance-none rounded-full bg-primary
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-[0_0_0_1px]
                    [&::-webkit-slider-thumb]:shadow-gray-300
                    [&::-webkit-slider-thumb]:transition-all
                    [&::-webkit-slider-thumb]:duration-150
                    [&::-webkit-slider-thumb]:ease-in-out
                    [&::-webkit-slider-thumb]:hover:bg-bone
                    [&::-webkit-slider-thumb]:active:bg-gray-200
                    "
                  />
                  <div className="mt-1 flex flex-row items-center justify-between">
                    <div className="h-4 w-[1.5px] bg-grayText" />
                    <div className="h-4 w-[1.5px] bg-grayText" />
                    <div className="h-4 w-[1.5px] bg-grayText" />
                  </div>

                  <div className="flex flex-row items-center justify-between text-center">
                    <p className="text-sm text-graySubtitle">Disagree</p>
                    <p className="me-5 text-sm text-graySubtitle">Medium</p>
                    <p className="text-sm text-graySubtitle">Agree</p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectSurvey;
