"use client";

import React from "react";

const CreateProject = () => {
  return (
    <div className="mx-28 my-6">
      <h3 className="text-4xl font-medium">Project Creation</h3>
      <form action="" className="mt-4">
        {/* Title */}
        <div className="my-4 flex flex-col">
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

        <div className="my-4 flex">
          <div>
            {/* Project Duration */}
            <div className="flex flex-col">
              <label htmlFor="duration" className="text-2xl font-medium">
                Duration
              </label>
              <div className="flex gap-8">
                <input type="text" id="start" />
                <input type="date" id="end" />
              </div>
            </div>

            {/* Sprint Survey Periodicity */}
            <div className="my-4 flex flex-col">
              <label htmlFor="periodicity" className="text-2xl font-medium">
                Sprint Survey Periodicity
              </label>
              <select name="" id="periodicity">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-2xl font-medium">
              Description
            </label>
            <textarea name="" id="description" cols={30} rows={10}></textarea>
          </div>
        </div>

        <div className="flex justify-between">
          {/* Members */}
          <div className="my-4 flex flex-col">
            <label htmlFor="members" className="text-2xl font-medium">
              Members
            </label>
            <button>Add</button>
          </div>

          {/* Action Buttons */}
          <div className="my-4 flex">
            <button>Cancel</button>
            <button>Create</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
