"use client";

import React, { useState } from "react";
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
import { Employee } from "@/types";

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
    const startDate = rangeDates[0];
    const endDate = rangeDates[1];
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

  const [selectedMembers, setSelectedMembers] = useState<Employee[]>([]);

  const membersData: Employee[] = [
    {
      id: "1",
      name: "Adrián Ramírez",
      email: "adrian-rmz@gmail.com",
      photoUrl:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png",
    },
    {
      id: "2",
      name: "Pedro Alonso Moreno",
      email: "pedro-moreno@gmail.com",
      photoUrl:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png",
    },
    {
      id: "3",
      name: "Felipe de Jesús",
      email: "felipe-jesus@gmail.com",
      photoUrl:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png",
    },
    {
      id: "4",
      name: "Jose Sanchez",
      email: "jose-sanchez@gmail.com",
      photoUrl:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png",
    },
    {
      id: "5",
      name: "Eduardo de Valle",
      email: "eduardo-valle@gmail.com",
      photoUrl:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
    },
  ];

  const handleOptionSubmit = (selectedOption: string) => {
    // Suponemos que el value seleccionado es el nombre del empleado
    const employeeToAdd = membersData.find(
      (employee) => employee.name === selectedOption,
    );

    // Verificar si se encontró un empleado
    if (employeeToAdd) {
      // Comprobar si el empleado ya está en selectedMembers para evitar duplicados
      const isAlreadySelected = selectedMembers.some(
        (member) => member.id === employeeToAdd.id,
      );
      if (!isAlreadySelected) {
        // Añadir el empleado al estado de selectedMembers
        setSelectedMembers((currentMembers) => [
          ...currentMembers,
          employeeToAdd,
        ]);
        console.log("Added: ", employeeToAdd);
      } else {
        console.log("Employee already selected:", employeeToAdd);
      }
    } else {
      console.log("No employee found with the name:", selectedOption);
    }
    console.log(selectedMembers);
  };

  const handleOptionRemove = (selectedOption: string) => {
    // Suponemos que el value seleccionado es el nombre del empleado
    const employeeToRemove = membersData.find(
      (employee) => employee.name === selectedOption,
    );

    // Verificar si se encontró un empleado
    if (employeeToRemove) {
      // Filtrar el empleado para eliminarlo de selectedMembers
      setSelectedMembers((currentMembers) =>
        currentMembers.filter((member) => member.id !== employeeToRemove.id),
      );
      console.log("Removed: ", employeeToRemove);
    } else {
      console.log("No employee found with the name to remove:", selectedOption);
    }
    console.log(selectedMembers);
  };

  const renderMultiSelectOption: MultiSelectProps["renderOption"] = ({
    option,
  }) => {
    const member = membersData.find((member) => member.name === option.value);
    if (!member) {
      return null; // or some fallback UI component
    }

    return (
      <Group gap="sm">
        <Avatar src={member.photoUrl} size={36} radius="xl" />
        <div>
          <Text size="sm">{member.name}</Text>
          <Text size="xs" opacity={0.5}>
            {member.email}
          </Text>
        </div>
      </Group>
    );
  };

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
                  data={membersData.map((member) => member.name)}
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
                  onOptionSubmit={(selectedOption) => {
                    handleOptionSubmit(selectedOption);
                  }}
                  onRemove={(selectedOption) => {
                    handleOptionRemove(selectedOption);
                  }}
                  onClear={() => {
                    setSelectedMembers([]);
                    console.log("Cleared all selected members");
                    console.log(selectedMembers);
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
                onClick={() => {
                  console.log(selectedMembers);
                }}
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
