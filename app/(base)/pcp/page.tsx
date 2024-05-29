"use client";
import PCPResource from "@/components/PCP/PCPResource";
import PCPTask from "@/components/PCP/PCPTask";
import ProgressBar from "@/components/ProgressBar";
import NoDataCard from "@/components/NoDataCard";
import { Task, Resource } from "@/types/types";
import PCPSection from "@/components/PCP/PCPSection";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/project";
import { getUserTasksForCurrentSprintByProjectId } from "@/services/tasks-and-resources";
import { useEffect, useState } from "react";

const PCP = () => {
  const [projectId, setProjectId] = useState<number>();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  useEffect(() => {
    if (!projectsQuery.data) return;
    setProjectId(projectsQuery.data[0].id);
  }, [projectsQuery.data]);

  const progressPercentage = 100;

  if (
    projectsQuery.isError ||
    (projectsQuery.data && projectsQuery.data.length === 0)
  ) {
    return (
      <p>You dont have projects or there was an error fetching the data</p>
    );
  }

  if (projectsQuery.isLoading) {
    return <p>loading...</p>;
  }

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

      <section id="pip-selectproject">
        <select
          onChange={(e) => {
            console.log(e.target.value);
            setProjectId(parseInt(e.target.value));
          }}
        >
          {projectsQuery.data &&
            projectsQuery.data.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
        </select>
      </section>

      {projectId && (
        <>
          <PCPTasks projectId={projectId} />
        </>
      )}
    </div>
  );
};

const PCPTasks = ({ projectId }: { projectId: number }) => {
  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getUserTasksForCurrentSprintByProjectId(projectId),
  });

  if (tasksQuery.isError) {
    return <NoDataCard text={tasksQuery.error.message} />;
  }

  if (tasksQuery.isLoading || !tasksQuery.data) {
    return <p>loading...</p>;
  }

  if (tasksQuery.data.length === 0) {
    <NoDataCard text="No tasks available. Ask your manager for an update." />;
  }

  return (
    <section id="pip-tasks" className="mt-9 w-full">
      <PCPSection title="Tasks History" showMore={true} type="tasks">
        <div className="mb-10 mt-2 flex w-full flex-row flex-wrap gap-12 overflow-x-auto pb-3">
          {tasksQuery.data.map((task) => (
            <PCPTask key={task.id} task={task} />
          ))}
        </div>
      </PCPSection>
    </section>
  );
};

/* export const PCPResources = () => {
  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getUserTasksForCurrentSprintByProjectId(projectId),
    retry: false,
  });

  return (
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
  );
}; */

export default PCP;
