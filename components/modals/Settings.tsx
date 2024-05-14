"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Tabs,
  rem,
  ColorInput,
  useMantineColorScheme,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import SunIcon from "../icons/SunIcon";
import MoonIcon from "../icons/MoonIcon";

interface SettingsProps {
  showModal: boolean;
  onClose: () => void;
}
const Settings = ({ showModal, onClose }: SettingsProps) => {
  const [file, setFile] = useState<FileWithPath[]>([]);
  const [color, setColor] = useState("#6640D5");
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();

  const preview = file.map((image, index) => {
    const imageUrl = URL.createObjectURL(image);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt="Image Preview"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        style={{
          width: rem(200),
          height: rem(200),
          margin: "auto",
        }}
      />
    );
  });

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
                    <Tabs.Tab
                      value="profileImage"
                      style={{ fontWeight: 500, fontSize: "16px" }}
                    >
                      Profile Image
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="bannerImage"
                      style={{ fontWeight: 500, fontSize: "16px" }}
                    >
                      Banner Image
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="colorTheme"
                      style={{ fontWeight: 500, fontSize: "16px" }}
                    >
                      Color Theme
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="profileImage">
                    <div className="mt-6">
                      {file.length === 0 ? (
                        <Dropzone
                          onDrop={(file) => {
                            console.log("accepted files", file);
                            setFile(file);
                          }}
                          onReject={(file) =>
                            console.log("rejected files", file)
                          }
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
                      ) : (
                        preview
                      )}
                      <div className="mt-2 flex justify-center gap-10">
                        <button
                          disabled={file.length === 0}
                          className={`${
                            file.length === 0
                              ? "bg-gray-300"
                              : "bg-white hover:bg-white/80"
                          } mt-4 rounded-lg px-10 py-2 font-medium text-primary drop-shadow-lg`}
                          onClick={() => {
                            setFile([]);
                            setFile([]);
                          }}
                        >
                          Reset
                        </button>
                        <button
                          disabled={file.length === 0}
                          className={`${
                            file.length === 0
                              ? "bg-gray-300"
                              : "bg-primary hover:bg-primary-dark"
                          } mt-4 rounded-lg px-10 py-2 font-medium text-white drop-shadow-lg`}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value="bannerImage">
                    Messages tab content
                  </Tabs.Panel>

                  <Tabs.Panel value="colorTheme">
                    <div className="my-6 flex justify-center gap-10">
                      <div>
                        <p className="text-grayText">Select a mode</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setColorScheme("light")}
                            className="flex gap-2 rounded-lg border bg-white p-2"
                          >
                            <SunIcon color="text-black" size="h-6 w-6" />
                            <p className="text-black">Light</p>
                          </button>
                          <button
                            onClick={() => setColorScheme("dark")}
                            className="flex gap-2 rounded-lg border bg-black p-2"
                          >
                            <MoonIcon color="text-white" size="h-6 w-6" />
                            <p className="text-white">Dark</p>
                          </button>
                        </div>
                      </div>
                      <div className=" w-56">
                        <p className="text-grayText">Select a color</p>
                        <ColorInput
                          size="md"
                          radius="xl"
                          aria-label="Theme Color"
                          value={color}
                          onChangeEnd={setColor}
                          format="hex"
                          swatches={[
                            "#2e2e2e",
                            "#868e96",
                            "#fa5252",
                            "#e64980",
                            "#be4bdb",
                            "#7950f2",
                            "#4c6ef5",
                            "#228be6",
                            "#15aabf",
                            "#12b886",
                            "#40c057",
                            "#82c91e",
                            "#fab005",
                            "#fd7e14",
                          ]}
                        />
                      </div>
                    </div>
                  </Tabs.Panel>
                </Tabs>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Settings;
