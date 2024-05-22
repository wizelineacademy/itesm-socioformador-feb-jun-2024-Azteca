import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import UserProfileButton from "../UserProfileButton";
import { Coworker } from "@/types/types";
import {
  MultiSelect,
  MultiSelectProps,
  Avatar,
  Group,
  Text,
} from "@mantine/core";

interface ProjectSurveyProps {
  showModal: boolean;
  onClose: () => void;
  selectedMembers: Coworker[];
}

const ProjectSurvey = ({
  showModal,
  onClose,
  selectedMembers,
}: ProjectSurveyProps) => {
  const members: Record<string, { image: string; email: string }> = {
    "Emily Johnson": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
      email: "emily92@gmail.com",
    },
    "Ava Rodriguez": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
      email: "ava_rose@gmail.com",
    },
    "Olivia Chen": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
      email: "livvy_globe@gmail.com",
    },
    "Ethan Barnes": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
      email: "ethan_explorer@gmail.com",
    },
    "Mason Taylor": {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
      email: "mason_musician@gmail.com",
    },
  };

  const renderMultiSelectOption: MultiSelectProps["renderOption"] = ({
    option,
  }) => (
    <Group gap="sm">
      <Avatar src={members[option.value].image} size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {members[option.value].email}
        </Text>
      </div>
    </Group>
  );

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
                  Add Members
                </Dialog.Title>
                <MultiSelect
                  data={[
                    "Emily Johnson",
                    "Ava Rodriguez",
                    "Olivia Chen",
                    "Ethan Barnes",
                    "Mason Taylor",
                  ]}
                  renderOption={renderMultiSelectOption}
                  maxDropdownHeight={300}
                  // label="Employees of the month"
                  placeholder="Search for employee"
                  searchable
                  nothingFoundMessage="Nothing found..."
                  hidePickedOptions
                  clearable
                  comboboxProps={{
                    transitionProps: { transition: "pop", duration: 200 },
                    shadow: "md",
                  }}
                  onOptionSubmit={(value) => {
                    console.log("Added: ", value);
                  }}
                  onRemove={(value) => {
                    console.log("Removed: ", value);
                  }}
                  onClear={() => {
                    console.log("Cleared");
                  }}
                />

                <ul>
                  {selectedMembers.map((member, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <UserProfileButton size="sm" />
                      <p>{member.name}</p>
                    </li>
                  ))}
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectSurvey;
