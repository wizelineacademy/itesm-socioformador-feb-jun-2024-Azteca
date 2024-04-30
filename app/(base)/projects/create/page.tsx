"use client";

import React from "react";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import AddMemberButton from "@/components/AddMemberButton";
import UserProfileButton from "@/components/UserProfileButton";
import CalendarIcon from "@/components/icons/CalendarIcon";
import { createProject } from "@/services/project";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
        "fe033269-0851-4257-bf66-de5079892ea7", // Pedro
      ],
    });
  };

  return (
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

        <div className="my-10 flex justify-between">
          {/* Members */}
          <div className="my-4 flex flex-col">
            <label htmlFor="members" className="text-2xl font-medium">
              Members
            </label>
            <div className="mt-2 flex gap-6">
              <UserProfileButton size="md" />
              <UserProfileButton size="md" />
              <UserProfileButton size="md" />
              <AddMemberButton />
            </div>
          </div>

          {/* Action Buttons */}
          {/* place it at the end */}
          <div className="flex gap-4">
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
  );
};

export default CreateProject;
