"use client";

import React from "react";
import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import AddMemberButton from "@/components/AddMemberButton";
import UserProfileButton from "@/components/UserProfileButton";
import CalendarIcon from "@/components/icons/CalendarIcon";

const CreateProject = () => {
  const [surveyPeriodicity, setSurveyPeriodicity] = useState("");
  const [rangeDates, setRangeDates] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  return (
    <div className="mx-28 my-6">
      <h3 className="text-4xl font-medium">Project Creation</h3>
      <form action="" className="mt-4">
        {/* Title */}
        <div className="my-10 flex flex-col">
          <label htmlFor="title" className="text-2xl font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter a title for your project"
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

            {/* Sprint Survey Periodicity */}
            <div className="mt-10 flex flex-col">
              <label htmlFor="periodicity" className="text-2xl font-medium">
                Sprint Survey Periodicity
              </label>
              <select
                name=""
                id="periodicity"
                className="mt-2 rounded-xl p-2 drop-shadow-lg"
                defaultValue="--- Select Periodicity ---"
              >
                <option disabled hidden>
                  --- Select Periodicity ---
                </option>
                <option value="everyWeek">Every Week</option>
                <option value="every2Week">Every Two Weeks</option>
                <option value="every3Week">Every Three Weeks</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex w-4/6 flex-col">
            <label htmlFor="description" className="text-2xl font-medium">
              Description
            </label>
            <textarea
              name=""
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
            <button className="h-fit w-fit self-end rounded-xl bg-white px-10 py-2 text-xl font-medium text-primary drop-shadow-lg">
              Cancel
            </button>
            <button className="h-fit w-fit self-end rounded-xl bg-primary px-10 py-2 text-xl font-medium text-white drop-shadow-lg">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
