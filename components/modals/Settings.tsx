"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface SettingsProps {
  showModal: boolean;
  onClose: () => void;
}
const Settings = ({ showModal, onClose }: SettingsProps) => {
  const [file, setFile] = useState<File>();

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
                  Settings
                </Dialog.Title>
                <div>
                  <ul>
                    <li>
                      <p>Profile Image</p>
                      <div>
                        <input
                          type="file"
                          onChange={(e) => {
                            setFile(e.target.files?.[0]);
                          }}
                        />
                        <button
                          onClick={() => {
                            console.log(file);
                          }}
                        >
                          Upload
                        </button>
                      </div>
                    </li>
                    <li>
                      <button className="flex items-center gap-2">
                        <p>Banner Image</p>
                      </button>
                    </li>
                    <li>
                      <button className="flex items-center gap-2">
                        <p>Theme Color</p>
                      </button>
                    </li>
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Settings;
