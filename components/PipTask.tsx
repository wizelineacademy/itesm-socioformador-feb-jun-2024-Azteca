"use client";
import { useState } from "react";

interface InterfacePipTask {
  title: string;
  description: string;
  isDone: boolean;
}

const PipTask = ({ title, description, isDone }: InterfacePipTask) => {
  const [done, setIsDone] = useState<boolean>(isDone);
  const handleDone = () => {
    setIsDone(!done);
  };
  return (
    <div className="box-border h-48 w-52 shrink-0 rounded-xl bg-white px-2 py-9 shadow-lg">
      <header className="flex items-center">
        <p className="text-md text-wrap font-semibold">{title}</p>
        <div className="ml-auto inline-flex items-center">
          <label
            className="relative flex cursor-pointer items-center"
            htmlFor="checkbox-pip-input"
          >
            <input
              type="checkbox"
              className="h-6 w-6 cursor-pointer appearance-none rounded-full border border-primary border-primary/80 bg-primary-light/20 outline-primary transition-all checked:bg-primary checked:before:bg-primary hover:scale-105"
              id="checkbox-pip-input"
            />
          </label>
        </div>
      </header>
      <p className="font-regular mt-2 text-ellipsis text-wrap text-xs text-[#9E9E9E]">
        {description}
      </p>
    </div>
  );
};

export default PipTask;
