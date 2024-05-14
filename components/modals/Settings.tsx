"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Tabs, rem } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { Tab } from "@headlessui/react";

interface SettingsProps {
  showModal: boolean;
  onClose: () => void;
}
const Settings = ({ showModal, onClose }: SettingsProps) => {
  const [file, setFile] = useState<FileWithPath[]>([]);

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
                <Tabs color="violet" defaultValue="profileImage" style={{}}>
                  <Tabs.List grow justify="space-between">
                    <Tabs.Tab value="profileImage">Profile Image</Tabs.Tab>
                    <Tabs.Tab value="bannerImage">Banner Image</Tabs.Tab>
                    <Tabs.Tab value="colorTheme">Color Theme</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="profileImage">
                    <p>Profile Image</p>
                    <div>
                      <input
                        type="file"
                        onChange={(e) => {
                          // setFile(e.target.files?.[0]);
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
                  </Tabs.Panel>

                  <Tabs.Panel value="bannerImage">
                    Messages tab content
                  </Tabs.Panel>

                  <Tabs.Panel value="colorTheme">
                    Settings tab content
                  </Tabs.Panel>
                </Tabs>
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition 
                ${selected ? "bg-[#6640D5] text-white shadow" : "text-gray-700 hover:bg-gray-100 hover:text-[#6640D5]"}`}
                        >
                          Profile Image
                        </button>
                      )}
                    </Tab>
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition 
                ${selected ? "bg-[#6640D5] text-white shadow" : "text-gray-700 hover:bg-gray-100 hover:text-[#6640D5]"}`}
                        >
                          Banner Image
                        </button>
                      )}
                    </Tab>
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition 
                ${selected ? "bg-[#6640D5] text-white shadow" : "text-gray-700 hover:bg-gray-100 hover:text-[#6640D5]"}`}
                        >
                          Color Theme
                        </button>
                      )}
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    <Tab.Panel className="rounded-xl bg-white p-4 shadow">
                      <Dropzone
                        onDrop={(file) => {
                          console.log("accepted files", file);
                          setFile(file);
                        }}
                        onReject={(file) => console.log("rejected files", file)}
                        maxSize={5 * 1024 ** 2}
                        maxFiles={1}
                        accept={IMAGE_MIME_TYPE}
                      >
                        <div className="pointer-events-none flex min-h-56 flex-col items-center justify-center  text-center">
                          <p className=" text-xl">
                            Drag image here or click to select file
                          </p>
                          <p className="text-md text-grayText">
                            Attach one image to change your profile picture,
                            should not exceed 5mb
                          </p>
                        </div>
                      </Dropzone>
                      {/* if file lenght > 0 show upload button */}
                      {file.length > 0 && (
                        <button
                          onClick={() => {
                            console.log(file);
                          }}
                          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white"
                        >
                          Upload
                        </button>
                      )}
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white p-4 shadow">
                      <p>Content 2</p>
                    </Tab.Panel>
                    <Tab.Panel className="rounded-xl bg-white p-4 shadow">
                      <p>Content 3</p>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Settings;
