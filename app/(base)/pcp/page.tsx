"use client";
import NavigationBar from "@/components/NavigationBar";
import PipResource from "@/components/PipResource";
import PipTask from "@/components/PipTask";
import ProgressBar from "@/components/Progressbar";
import { getUserTasks, getUserResources, updateTask } from "@/services/tasks-and-resources";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from "react";

const PIP = () => {
  
  const [tasks, setTasks] = useState([]);
  const tasksQuery =  

  const handleCheckTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].isDone = !newTasks[index].isDone;
    setTasks(newTasks);
  };

  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Define an async function within the useEffect
    async function fetchTasks() {
      try {
        const data = await getUserTasks();
        console.log(data);
        setTasks(data); // Assuming getUserTasks() fetches your data correctly
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    }

    // Call the async function
    fetchTasks();
  }, []);

  useEffect(() => {
    // Define an async function within the useEffect
    async function fetchResources() {
      try {
        const data = await getUserResources();
        console.log(data);
        setResources(data); // Assuming getUserTasks() fetches your data correctly
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    }

    // Call the async function
    fetchResources();
  }, []);

  const progressPercentage = Math.round(
    (tasks.filter((task) => task.isDone).length / tasks.length) * 100,
  );

  return (
    <main>
      <section id="pip-progressbar" className="mt-4">
        <p className=" mb-2 text-3xl font-semibold">Personal Career Plan</p>
        <ProgressBar width={progressPercentage} height={6} />
      </section>
      <section id="pip-tasks" className="mt-9 w-full">
        <p className="text-3xl font-medium">Tasks</p>
        <div className="flew-wrap mb-10 mt-2 flex w-full flex-row gap-12 overflow-x-auto pb-3">
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
          {resources.map((task, index) => (
            <PipResource
              title={task.title}
              description={task.description}
              key={index}
              type={task.type}
              link={task.title}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PIP;
