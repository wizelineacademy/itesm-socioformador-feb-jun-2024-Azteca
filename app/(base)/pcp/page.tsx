"use client";
import PCPResource from "@/components/PCP/PCPResource";
import PCPTask from "@/components/PCP/PCPTask";
import ProgressBar from "@/components/ProgressBar";
import { useState, useEffect } from "react";
import NoDataCard from "@/components/NoDataCard";
import { Task, Resource } from "@/types/types";
import PCPSection from "@/components/PCP/PCPSection";

// Datos dummy para las tareas
const dummyTasks: Task[] = [
  {
    id: 1,
    userId: null,
    title: "Complete project documentation",
    description: "Ensure all project documents are up to date.",
    status: "pending",
  },
  {
    id: 2,
    userId: null,
    title: "Code review session",
    description: "Participate in the weekly code review session.",
    status: "done",
  },
  {
    id: 3,
    userId: null,
    title: "Prepare presentation for client",
    description: "Create slides and prepare talking points for client meeting.",
    status: "pending",
  },
  {
    id: 4,
    userId: null,
    title: "Update software dependencies",
    description:
      "Check and update all software dependencies to the latest versions.",
    status: "done",
  },
];

// Datos dummy para los recursos
const dummyResources: Resource[] = [
  {
    id: 1,
    userId: null,
    title: "React Documentation",
    description: "Comprehensive guide and API reference for React.",
    kind: "documentation",
  },
  {
    id: 2,
    userId: null,
    title: "TypeScript Handbook",
    description: "A handbook covering all the essentials of TypeScript.",
    kind: "documentation",
  },
  {
    id: 3,
    userId: null,
    title: "Next.js Guide",
    description: "Official Next.js guide and tutorial.",
    kind: "guide",
  },
  {
    id: 4,
    userId: null,
    title: "Tailwind CSS Documentation",
    description: "Complete reference for Tailwind CSS framework.",
    kind: "documentation",
  },
];

const PCP = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    // Usar datos dummy en lugar de llamar a la API
    setTasks(dummyTasks);
  }, []);

  useEffect(() => {
    // Usar datos dummy en lugar de llamar a la API
    setResources(dummyResources);
  }, []);

  const handleStatusChange = (index: number, status: string) => {
    const newTasks = [...tasks];
    newTasks[index].status = status;
    setTasks(newTasks);
  };

  const progressPercentage = Math.round(
    ((tasks.filter((task) => task.status === "done").length +
      tasks.filter((task) => task.status === "in-progress").length / 2) /
      tasks.length) *
      100,
  );

  return (
    <div>
      <section id="pip-progressbar" className="mt-4">
        <div className="flex items-center justify-between">
          <p className=" mb-2 text-3xl font-semibold">Personal Career Plan</p>
          <p className=" mb-2 text-xl font-medium text-graySubtitle">
            Sprint 28/05/2024
          </p>
        </div>
        <ProgressBar width={progressPercentage} height={6} />
      </section>
      <section id="pip-tasks" className="mt-9 w-full">
        <PCPSection
          title="Tasks History"
          showMore={true}
          // userId={params.id}
          type="tasks"
        >
          <div className="mb-10 mt-2 flex w-full flex-row flex-wrap gap-12 overflow-x-auto pb-3">
            {tasks.length === 0 && (
              <div className="mx-auto flex justify-center">
                <NoDataCard text="No tasks available. Ask your manager for an update." />
              </div>
            )}
            {tasks.map((task, index) => (
              <PCPTask
                key={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                onStatusChange={(status) => handleStatusChange(index, status)}
              />
            ))}
          </div>
        </PCPSection>
      </section>

      <section id="pip-resources" className="mt-9 w-full">
        <PCPSection
          title="Resources History"
          showMore={true}
          // userId={params.id}
          type="resources"
        >
          <div className="mb-10 mt-2 flex w-full flex-row flex-wrap gap-12 overflow-x-auto pb-3">
            {resources.length === 0 && (
              <div className="mx-auto flex justify-center">
                <NoDataCard text="No resources available. Ask your manager for an update." />
              </div>
            )}
            {resources.map((resource) => (
              <PCPResource
                title={resource.title}
                description={resource.description}
                key={resource.id}
                type={resource.kind}
              />
            ))}
          </div>
        </PCPSection>
      </section>
    </div>
  );
};

export default PCP;
