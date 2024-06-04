"use client";
import ProgressBar from "@/components/ProgressBar";
import NoDataCard from "@/components/NoDataCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "@/services/project";
import {
  getCurrentSprintSurvey,
  getUserResourcesForCurrentSprint,
  getUserResourcesHistory,
  getUserTasksForCurrentSprintByProjectId,
  getUserTasksHistory,
  updateTask,
} from "@/services/tasks-and-resources";
import { useEffect, useState } from "react";
import DialogComponent from "@/components/DialogComponent";
import { Menu } from "@headlessui/react";
import { SelectPipResource, SelectPipTask } from "@/db/schema";
import InfoIcon from "@/components/icons/InfoIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import BookIcon from "@/components/icons/BookIcon";
import ArticleIcon from "@/components/icons/ArticleIcon";
import Link from "next/link";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

const statusOptions = [
  { label: "Pending", color: "bg-red-500", value: "PENDING" },
  { label: "In Progress", color: "bg-yellow-500", value: "IN_PROGRESS" },
  { label: "Done", color: "bg-blue-500", value: "DONE" },
];

const PCP = () => {
  const [projectId, setProjectId] = useState<number>();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!projectsQuery.data) return;
    setProjectId(projectsQuery.data[0].id);
  }, [projectsQuery.data]);

  const sprintSurveyQuery = useQuery({
    queryKey: ["sprintSurvey", projectId],
    queryFn: () => getCurrentSprintSurvey(projectId || 0),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const scheduledAt = sprintSurveyQuery.data?.scheduledAt;
  const formattedDate = scheduledAt
    ? new Date(scheduledAt).toLocaleDateString("es-ES")
    : "";

  const progressPercentage = 100;

  if (
    projectsQuery.isError ||
    (projectsQuery.data && projectsQuery.data.length === 0)
  ) {
    return (
      <NoDataCard text="You dont have projects or there was an error fetching the data" />
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
            {`Sprint ${formattedDate}`}
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
          <PCPResources projectId={projectId} />
        </>
      )}
    </div>
  );
};

const PCPTasks = ({ projectId }: { projectId: number }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getUserTasksForCurrentSprintByProjectId(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <section id="pip-tasks" className="mt-9 w-full">
      <div className="mb-6">
        <div className="mx-auto flex justify-between">
          <h3 className="text-3xl font-medium text-black">Tasks</h3>
          <button
            className="cursor-pointer self-center text-sm text-graySubtitle"
            onClick={openDialog}
          >
            Show History
          </button>
        </div>

        {tasksQuery.isLoading ? (
          <p>loading...</p>
        ) : tasksQuery.isError ? (
          <NoDataCard text={tasksQuery.error.message} />
        ) : (
          tasksQuery.data && (
            <div className="mt-2">
              <div className="mb-10 mt-2 flex w-full flex-row flex-wrap gap-12 overflow-x-auto pb-3">
                {tasksQuery.data.map((task) => (
                  <PCPTask key={task.id} task={task} projectId={projectId} />
                ))}
              </div>
            </div>
          )
        )}

        <DialogComponent
          isOpen={isDialogOpen}
          onClose={closeDialog}
          title="Tasks History"
        >
          <PCPTasksDialogContent projectId={projectId} />
        </DialogComponent>
      </div>
    </section>
  );
};

const PCPTasksDialogContent = ({ projectId }: { projectId: number }) => {
  const queryClient = useQueryClient();

  const tasksHistoryQuery = useQuery({
    queryKey: ["tasks-history", projectId],
    queryFn: () => getUserTasksHistory(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateTask,
  });

  if (tasksHistoryQuery.isError) {
    return <NoDataCard text={tasksHistoryQuery.error.message} />;
  }

  if (tasksHistoryQuery.isLoading || !tasksHistoryQuery.data) {
    return <p>loading...</p>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("default", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {tasksHistoryQuery.data.map((sprint) => (
        <div key={sprint.id}>
          {sprint.scheduledAt && (
            <p className="py-1 text-lg font-medium">{`Sprint ${formatDate(sprint.scheduledAt)}`}</p>
          )}
          {sprint.processed ? (
            sprint.tasks.map((task) => {
              const currentStatusOption =
                statusOptions.find((option) => option.value === task.status) ||
                statusOptions[0];

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-1"
                >
                  <p className="text-graySubtitle">{task.title}</p>
                  <div className="flex items-center space-x-4">
                    {/* Description Dropdown */}
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center text-sm text-blue-500 underline">
                          <InfoIcon color="text-black" size="h-6 w-6" />
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 z-50 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-1 text-sm text-gray-700">
                          {task.description}
                        </div>
                      </Menu.Items>
                    </Menu>

                    {/* Status Change Button */}
                    <Menu as="div" className="relative inline-block text-left">
                      <div className="flex items-center">
                        <Menu.Button
                          className={`h-6 w-6 transform cursor-pointer rounded-full border ${currentStatusOption.color} outline-${currentStatusOption.color} transition-all duration-200 ease-in-out hover:scale-110`}
                        >
                          <span className="sr-only">Change status</span>
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {statusOptions.map((option) => (
                            <Menu.Item key={option.value}>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                  onClick={async () => {
                                    await mutateAsync({
                                      taskId: task.id,
                                      newStatus:
                                        option.value as typeof task.status,
                                    });
                                    await queryClient.invalidateQueries({
                                      queryKey: ["tasks", projectId],
                                    });
                                    await queryClient.invalidateQueries({
                                      queryKey: ["tasks-history", projectId],
                                    });
                                  }}
                                >
                                  <span
                                    className={`mr-3 inline-block h-4 w-4 rounded-full ${option.color}`}
                                  ></span>
                                  {option.label}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-2">
              <NoDataCard text="Survey not procesed yet, ask your manager to do it" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PCPTask = ({
  task,
  projectId,
}: {
  task: SelectPipTask;
  projectId: number;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: updateTask,
  });

  const selectedStatus =
    statusOptions.find((option) => option.value === task.status) ||
    statusOptions[0];

  return (
    <div className="box-border h-48 w-52 shrink-0 rounded-xl bg-white p-4 shadow-lg">
      <header className="flex items-center">
        <p className="text-md text-wrap font-semibold">{task.title}</p>
        <div className="ml-auto inline-flex items-center">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                className={`h-6 w-6 transform cursor-pointer rounded-full border ${selectedStatus.color} outline-${selectedStatus.color} transition-all duration-200 ease-in-out hover:scale-110`}
              >
                <span className="sr-only">Change status</span>
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {statusOptions.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100" : ""
                        } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        onClick={async () => {
                          await mutateAsync({
                            taskId: task.id,
                            newStatus: option.value as typeof task.status,
                          });
                          await queryClient.invalidateQueries({
                            queryKey: ["tasks", projectId],
                          });
                          await queryClient.invalidateQueries({
                            queryKey: ["tasks-history", projectId],
                          });
                        }}
                      >
                        <span
                          className={`mr-3 inline-block h-4 w-4 rounded-full ${option.color}`}
                        ></span>
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </header>
      <p className="font-regular mt-2 text-ellipsis text-wrap text-xs text-[#9E9E9E]">
        {task.description}
      </p>
    </div>
  );
};

const PCPResources = ({ projectId }: { projectId: number }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const resourcesQuery = useQuery({
    queryKey: ["resources", projectId],
    queryFn: () => getUserResourcesForCurrentSprint(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <section id="pip-tasks" className="mt-9 w-full">
      <div className="mb-6">
        <div className="mx-auto flex justify-between">
          <h3 className="text-3xl font-medium text-black">Resources</h3>
          <button
            className="cursor-pointer self-center text-sm text-graySubtitle"
            onClick={openDialog}
          >
            Show History
          </button>
        </div>

        {resourcesQuery.isLoading ? (
          <p>loading...</p>
        ) : resourcesQuery.isError ? (
          <NoDataCard text={resourcesQuery.error.message} />
        ) : (
          resourcesQuery.data && (
            <div className="mt-2">
              <div className="mb-10 mt-2 flex w-full flex-row flex-wrap gap-12 overflow-x-auto pb-3">
                {resourcesQuery.data.map((resource) => (
                  <PCPResource key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )
        )}

        <DialogComponent
          isOpen={isDialogOpen}
          onClose={closeDialog}
          title="Tasks History"
        >
          <PCPResourcesDialogContent projectId={projectId} />
        </DialogComponent>
      </div>
    </section>
  );
};

const PCPResource = ({ resource }: { resource: SelectPipResource }) => {
  const renderIcon = () => {
    switch (resource.kind) {
      case "VIDEO":
        return <VideoIcon size="h-10 w-10" color="text-primary" />;
      case "BOOK":
        return <BookIcon size="h-10 w-10" color="text-primary" />;
      case "ARTICLE":
        return <ArticleIcon size="h-10 w-10" color="text-primary" />;
      default:
        return <ArticleIcon size="h-10 w-10" color="text-primary" />;
    }
  };

  const renderButtonLabel = () => {
    switch (resource.kind) {
      case "VIDEO":
        return "Watch it";
      case "BOOK":
        return "Get it";
      case "ARTICLE":
        return "Read it";
      default:
        return "Read it";
    }
  };

  return (
    <div className="box-border flex h-48 w-52 shrink-0 flex-col rounded-xl bg-white p-3 shadow-lg">
      <header className="flex items-center">
        {renderIcon()}
        <p className="text-md ms-3 text-wrap font-semibold">{resource.title}</p>
      </header>
      <p className="font-regular mb-2 mt-3 h-full overflow-hidden text-ellipsis text-xs  text-[#9E9E9E]">
        {resource.description}
      </p>
      <button className="mx-auto w-fit rounded-full bg-primary px-7 py-1 text-xs font-medium text-white">
        <Link
          target="_blank"
          href={`https://www.google.com/search?q=${resource.title}`}
        >
          {renderButtonLabel()}
        </Link>
      </button>
    </div>
  );
};

const PCPResourcesDialogContent = ({ projectId }: { projectId: number }) => {
  const resourcesHistoryQuery = useQuery({
    queryKey: ["resources-history", projectId],
    queryFn: () => getUserResourcesHistory(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (resourcesHistoryQuery.isError) {
    return <NoDataCard text={resourcesHistoryQuery.error.message} />;
  }

  if (resourcesHistoryQuery.isLoading || !resourcesHistoryQuery.data) {
    return <p>loading...</p>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("default", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {resourcesHistoryQuery.data.map((sprint) => (
        <div key={sprint.id}>
          {sprint.scheduledAt && (
            <p className="py-1 text-lg font-medium">{`Sprint ${formatDate(sprint.scheduledAt)}`}</p>
          )}
          {sprint.processed ? (
            sprint.resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between py-1"
              >
                <p className="text-graySubtitle">{resource.title}</p>
                <div className="flex items-center gap-4">
                  {/* Description Dropdown */}
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex items-center text-sm text-blue-500 underline">
                        <InfoIcon color="text-black" size="h-6 w-6" />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute right-0 z-50 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-1 text-sm text-gray-700">
                        {resource.description}
                      </div>
                    </Menu.Items>
                  </Menu>
                  <Link
                    href={`https://www.google.com/search?q=${resource.title}`}
                    target="_blank"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                  >
                    <ChevronRightIcon size="h-3 w-3" color="white" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-2">
              <NoDataCard text="Survey not procesed yet, ask your manager to do it" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PCP;
