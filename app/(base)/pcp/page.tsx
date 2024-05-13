"use client";
import NavigationBar from "@/components/NavigationBar";
import PipResource from "@/components/PipResource";
import PipTask from "@/components/PipTask";
import ProgressBar from "@/components/Progressbar";
import {
  getUserTasks,
  getUserResources,
  updateTask,
} from "@/services/tasks-and-resources";
import { Resource, Task } from "@/types/types";
// import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from "react";

const PIP = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const handleCheckTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].isDone = !newTasks[index].isDone;
    setTasks(newTasks);
    updateTask(newTasks[index].id, newTasks[index].isDone);
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getUserTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    async function fetchResources() {
      try {
        const data = await getUserResources();
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchResources();
  }, []);

  const progressPercentage = Math.round(
    (tasks.filter((task) => task.isDone).length / tasks.length) * 100,
  );

  return (
    <div>
      <section id="pip-progressbar" className="mt-4">
        <p className=" mb-2 text-3xl font-semibold">Personal Career Plan</p>
        <ProgressBar width={progressPercentage} height={6} />
      </section>
      <section id="pip-tasks" className="mt-9 w-full">
        <p className="text-3xl font-medium">Tasks</p>
        <div className="flew-wrap mb-10 mt-2 flex w-full flex-row gap-12 overflow-x-auto pb-3">
          {tasks.length === 0 && (
            <p className="text-xl font-light">
              No tasks available. Ask your manager for an update.
            </p>
          )}
          {tasks.map((task, index) => (
            <PipTask
              title={task.title}
              description={task.description}
              isDone={task.isDone}
              handleCheck={() => handleCheckTask(index)}
              key={index}
            />
          ))}
        </div>
      </section>
      <section id="pip-resources" className="mt-9 w-full">
        <p className="text-3xl font-medium">Resources</p>
        <div className="flew-wrap mb-10 mt-2 flex w-full flex-row gap-12 overflow-x-auto pb-3">
          {resources.length === 0 && (
            <p className="text-xl font-medium">
              No tasks available. Ask your manager for an update.
            </p>
          )}
          {resources.map((task, index) => (
            <PipResource
              title={task.title}
              description={task.description}
              key={index}
              type={task.kind}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PIP;
