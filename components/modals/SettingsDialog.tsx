"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Tabs } from "@mantine/core";
import ProfileImagePanel from "../ProfileImagePanel";
import BannerImagePanel from "../BannerImagePanel";
import ColorThemePanel from "../ColorThemePanel";

interface SettingsDialogProps {
  showModal: boolean;
  onClose: () => void;
}

const SettingsDialog = ({ showModal, onClose }: SettingsDialogProps) => {
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
                <Tabs color="violet" defaultValue="profileImage">
                  <Tabs.List grow justify="space-between">
                    <Tabs.Tab
                      value="profileImage"
                      style={{ fontWeight: 500, fontSize: "16px" }}
                    >
                      Profile Image
                    </Tabs.Tab>
                    <Tabs.Tab
                      data-testid="banner-tab"
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
                    <ProfileImagePanel closeModal={onClose} />
                  </Tabs.Panel>

                  <Tabs.Panel value="bannerImage">
                    <BannerImagePanel closeModal={onClose} />
                  </Tabs.Panel>

                  <Tabs.Panel value="colorTheme">
                    <ColorThemePanel />
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

export default SettingsDialog;
