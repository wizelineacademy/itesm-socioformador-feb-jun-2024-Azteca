"use client";

import React from "react";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import UserProfileButton from "@/components/UserProfileButton";
import CalendarIcon from "@/components/icons/CalendarIcon";
import { createProject } from "@/services/project";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Coworker } from "@/types";
import {
  MultiSelect,
  MultiSelectProps,
  Avatar,
  Group,
  Text,
} from "@mantine/core";

const CreateProject = () => {
  const router = useRouter();

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: createProject,
  });

  const [rangeDates, setRangeDates] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const handleForm = (formData: FormData) => {
    const startDate = rangeDates[0]?.toISOString();
    const endDate = rangeDates[1]?.toISOString();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const sprintSurveyPeriodicityInDays = formData
      .get("sprint_survey_periodicity_in_days")
      ?.toString();

    if (
      !startDate ||
      !endDate ||
      !name ||
      !description ||
      !sprintSurveyPeriodicityInDays
    ) {
      throw new Error("User should fill all fields");
    }

    createProjectMutation.mutate({
      newProject: {
        name,
        startDate,
        endDate,
        description,
        sprintSurveyPeriodicityInDays: Number(sprintSurveyPeriodicityInDays),
      },
      members: [
        "6188a6d4-50b3-4c69-b0fc-41db46882b9d", // Pedro
        "5c0bbaeb-d54a-4fc3-a404-afaac7c7a47f", // Felipe
        "37837ee0-b671-42a5-83a7-763cb29a52db", // Adrian
      ],
    });
  };

  const [selectedMembers, setSelectedMembers] = useState<Coworker[]>([
    {
      name: "Pedro Alonso Moreno",
      userId: "6188a6d4-50b3-4c69-b0fc-41db46882b9d",
    },
    {
      name: "Felipe de Jesús",
      userId: "5c0bbaeb-d54a-4fc3-a404-afaac7c7a47f",
    },
    {
      name: "Adrián Ramírez",
      userId: "37837ee0-b671-42a5-83a7-763cb29a52db",
    },
  ]);
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
    <>
      <div className="mx-28 my-6">
        <h3 className="text-4xl font-medium">Project Creation</h3>
        <form action={handleForm} className="mt-4">
          <div className="my-10 flex flex-col">
            <label htmlFor="name" className="text-2xl font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter a name for your project"
              className="mt-2 rounded-xl p-2 drop-shadow-lg"
            />
          </div>

          <div className="my-10 flex gap-10">
            <div className="w-2/6">
              {/* Project Duration */}
              <div className="flex flex-col">
                <label htmlFor="duration" className="text-2xl font-medium">
                  Duration
                </label>
                <DatePickerInput
                  leftSection={<CalendarIcon size="h-6 w-6" color="grayText" />}
                  type="range"
                  aria-label="Duration"
                  placeholder="Pick dates range"
                  value={rangeDates}
                  onChange={setRangeDates}
                  minDate={new Date()}
                  className="mt-2 gap-2 drop-shadow-lg"
                  styles={{
                    input: {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "none",
                      color: "9E9E9E",
                      font: "inherit",
                    },
                  }}
                />
              </div>
              <div className="mt-10 flex flex-col">
                <label
                  htmlFor="sprint_survey_periodicity_in_days"
                  className="text-2xl font-medium"
                >
                  Sprint Survey Periodicity Days
                </label>
                <input
                  type="number"
                  id="sprint_survey_periodicity_in_days"
                  name="sprint_survey_periodicity_in_days"
                  className="mt-2 h-full w-full rounded-xl p-2 drop-shadow-lg"
                ></input>
              </div>
              {/* Members */}
              <div className="my-4 flex flex-col">
                <label htmlFor="members" className="text-2xl font-medium">
                  Members
                </label>
                <MultiSelect
                  data={[
                    "Emily Johnson",
                    "Ava Rodriguez",
                    "Olivia Chen",
                    "Ethan Barnes",
                    "Mason Taylor",
                  ]}
                  renderOption={renderMultiSelectOption}
                  maxDropdownHeight={180}
                  // label="Employees of the month"
                  placeholder="Search for employee"
                  searchable
                  nothingFoundMessage="Nothing found..."
                  hidePickedOptions
                  clearable
                  comboboxProps={{
                    transitionProps: { transition: "pop", duration: 200 },
                    shadow: "md",
                    // offset: 0,
                    position: "top",
                    middlewares: { flip: false, shift: false },
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
                  className="mt-2 gap-2 drop-shadow-lg"
                  styles={{
                    input: {
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "none",
                      color: "9E9E9E",
                      font: "inherit",
                      minHeight: "70px",
                      maxHeight: "70px",
                      overflowY: "scroll",
                      padding: "10px",
                    },
                    option: { padding: "10px" },
                    section: { padding: "0px 10px 0px 0px" },
                    pill: { fontSize: "14px" },
                    dropdown: { borderRadius: "12px" },
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex w-4/6 flex-col">
              <label htmlFor="description" className="text-2xl font-medium">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                // cols={30}
                // rows={10}
                placeholder="Enter a description for your project"
                className="mt-2 h-full w-full rounded-xl p-2 drop-shadow-lg"
              ></textarea>
            </div>
          </div>

          <div className="my-10 flex justify-center">
            {/* Action Buttons */}
            <div className="flex gap-10">
              <button
                className="h-fit w-fit self-end rounded-xl bg-white px-10 py-2 text-xl font-medium text-primary drop-shadow-lg"
                type="button"
                onClick={() => {
                  router.replace("/projects");
                }}
              >
                Cancel
              </button>
              <button
                className="h-fit w-fit self-end rounded-xl bg-primary px-10 py-2 text-xl font-medium text-white drop-shadow-lg"
                type="submit"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
