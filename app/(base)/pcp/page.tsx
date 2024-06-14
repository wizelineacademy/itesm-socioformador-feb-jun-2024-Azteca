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
import { Fragment, useEffect, useState } from "react";
import DialogComponent from "@/components/DialogComponent";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { SelectPipResource, SelectPipTask } from "@/db/schema";
import InfoIcon from "@/components/icons/InfoIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import BookIcon from "@/components/icons/BookIcon";
import ArticleIcon from "@/components/icons/ArticleIcon";
import Link from "next/link";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

const statusOptions = [
  { label: "Pending", color: "bg-red-500", value: "PENDING" },
  { label: "In Progress", color: "bg-yellow-500", value: "IN_PROGRESS" },
  { label: "Done", color: "bg-blue-500", value: "DONE" },
];

const PCP = () => {
  const [projectId, setProjectId] = useState<number>();
  const queryClient = useQueryClient();
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

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
  const { data: tasksData } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getUserTasksForCurrentSprintByProjectId(projectId || 0),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!projectId,
  });

  useEffect(() => {
    if (Array.isArray(tasksData)) {
      const doneTasks = tasksData.filter(
        (task) => task.status === "DONE",
      ).length;
      const totalTasks = tasksData.length;
      setProgressPercentage((doneTasks / totalTasks) * 100);
    } else {
      setProgressPercentage(0);
    }
  }, [tasksData]);

  useEffect(() => {
    if (projectId) {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["sprintSurvey", projectId] });
    }
  }, [projectId, queryClient]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("default", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (
    projectsQuery.isError ||
    (projectsQuery.data && projectsQuery.data.length === 0)
  ) {
    return (
      <NoDataCard text="You dont have projects or there was an error fetching the data" />
    );
  }

  if (projectsQuery.isLoading) {
    return (
      <section className="mt-4 h-[80dvh] w-full">
        <Loader />
      </section>
    );
  }

  return (
    <div>
      <section id="pip-progressbar" className="mt-4 w-full">
        <div className="flex items-center justify-between">
          <p className=" mb-2 text-3xl font-semibold">Personal Career Plan</p>
          <p className=" mb-2 text-xl font-medium text-graySubtitle">
            {sprintSurveyQuery.data &&
            typeof sprintSurveyQuery.data === "string"
              ? sprintSurveyQuery.data
              : sprintSurveyQuery.isLoading || !sprintSurveyQuery.data
                ? "loading..."
                : `Sprint ${formatDate(sprintSurveyQuery.data.scheduledAt as Date)}`}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between gap-4">
          <ProgressBar width={progressPercentage} height={6} />
          <Listbox value={projectId} onChange={setProjectId}>
            <div className="relative mt-1 w-1/4">
              <Listbox.Button className="relative flex w-full cursor-default items-center justify-between rounded-lg bg-white py-2 pl-3 pr-4 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <p className="truncate">
                  {(projectsQuery.data &&
                    projectsQuery.data.find((p) => p.id === projectId)?.name) ??
                    "Personal Improvement"}
                </p>
                <svg
                  className="h-4 w-4 fill-current text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.516 7.548a.75.75 0 011.06.025L10 10.704l3.424-3.13a.75.75 0 011.06-.024.75.75 0 01.024 1.06l-4 3.5a.75.75 0 01-1.084 0l-4-3.5a.75.75 0 01.024-1.06z" />
                </svg>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    key={-1}
                    value={-1}
                    className={({ active }) =>
                      `relative my-1 cursor-default select-none rounded-xl  ${
                        active ? "bg-gray-200 text-black" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate rounded-xl py-2 pl-10 pr-4 ${
                          selected
                            ? "bg-primary font-medium text-white"
                            : "font-normal"
                        }`}
                      >
                        Personal Improvement
                      </span>
                    )}
                  </Listbox.Option>
                  {projectsQuery.data &&
                    projectsQuery.data.map((project) => (
                      <Listbox.Option
                        key={project.id}
                        className={({ active }) =>
                          `relative my-1 cursor-default select-none rounded-xl  ${
                            active ? "bg-gray-200 text-black" : "text-gray-900"
                          }`
                        }
                        value={project.id}
                      >
                        {({ selected }) => (
                          <span
                            className={`block truncate rounded-xl py-2 pl-10 pr-4 ${
                              selected
                                ? "bg-primary font-medium text-white"
                                : "font-normal"
                            }`}
                          >
                            {project.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </section>

      {projectId && (
        <>
          <PCPTasks
            projectId={projectId}
            setProgressPercentage={setProgressPercentage}
          />
          <PCPResources projectId={projectId} />
        </>
      )}
    </div>
  );
};

const PCPTasks = ({
  projectId,
  setProgressPercentage,
}: {
  projectId: number;
  setProgressPercentage: (percentage: number) => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const queryClient = useQueryClient();

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getUserTasksForCurrentSprintByProjectId(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (Array.isArray(tasksData)) {
      const doneTasks = tasksData.filter(
        (task) => task.status === "DONE",
      ).length;
      const totalTasks = tasksData.length;
      setProgressPercentage((doneTasks / totalTasks) * 100);
    } else {
      setProgressPercentage(0);
    }
  }, [tasksData, setProgressPercentage]);

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["tasks-history", projectId],
      });
      toast.success("Task status updated successfully");

      const tasks = queryClient.getQueryData<SelectPipTask[]>([
        "tasks",
        projectId,
      ]);
      if (tasks) {
        const doneTasks = tasks.filter((task) => task.status === "DONE").length;
        const totalTasks = tasks.length;
        setProgressPercentage((doneTasks / totalTasks) * 100);
      }
    },
    onError: () => {
      toast.error("Error updating task status");
    },
  });

  return (
    <section id="pip-tasks" className="mt-5 w-full">
      <div className="mb-6">
        <div className="mx-auto flex justify-between">
          <h3 className="text-3xl font-medium text-black">Tasks</h3>
          <button
            data-testid="show-task-history"
            className="cursor-pointer self-center text-sm text-graySubtitle"
            onClick={openDialog}
          >
            Show History
          </button>
        </div>

        {tasksLoading ? (
          <p>loading...</p>
        ) : tasksData && typeof tasksData === "string" ? (
          <NoDataCard text={tasksData} />
        ) : (
          tasksData &&
          Array.isArray(tasksData) && (
            <div className="mt-2">
              <div className="mb-10 mt-2 flex flex-row gap-12 overflow-x-auto whitespace-nowrap pb-3">
                {tasksData.map((task) => (
                  <PCPTask
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    mutateAsync={mutation.mutateAsync}
                  />
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
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["tasks-history", projectId],
      });
      toast.success("Task status updated successfully");
    },
    onError: () => {
      toast.error("Error updating task status");
    },
  });

  if (tasksHistoryQuery.data && typeof tasksHistoryQuery.data === "string") {
    return <NoDataCard text={tasksHistoryQuery.data} />;
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
    <div data-testid="pcp-task-history">
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
                      <Menu.Items className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 drop-shadow-lg focus:outline-none">
                        <div className="px-4 py-1 text-justify text-sm text-gray-700">
                          {task.description}
                        </div>
                      </Menu.Items>
                    </Menu>

                    {/* Status Change Button */}
                    <Menu as="div" className="relative inline-block text-left">
                      <div className="flex items-center">
                        <Menu.Button
                          data-testid={``}
                          className={`h-6 w-6 transform cursor-pointer rounded-full border ${currentStatusOption.color} outline-${currentStatusOption.color} transition-all duration-200 ease-in-out hover:scale-110`}
                        >
                          <span className="sr-only">Change status</span>
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 drop-shadow-lg focus:outline-none">
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
  mutateAsync,
}: {
  task: SelectPipTask;
  projectId: number;
  mutateAsync: (data: {
    taskId: number;
    newStatus: "PENDING" | "IN_PROGRESS" | "DONE";
  }) => Promise<void>;
}) => {
  const selectedStatus: { label: string; color: string; value: string } =
    statusOptions.find((option) => option.value === task.status) ||
    statusOptions[0];
  const queryClient = useQueryClient(); // Asegúrate de obtener queryClient aquí

  return (
    <div className="box-border h-48 w-52 shrink-0 rounded-xl bg-white p-4 shadow-lg">
      <header className="flex items-center">
        <p className="text-md text-wrap font-semibold">{task.title}</p>
        <div className="ml-auto inline-flex items-center">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                data-testid="task-status-button"
                className={`h-6 w-6 transform cursor-pointer rounded-full border ${selectedStatus.color} outline-${selectedStatus.color} transition-all duration-200 ease-in-out hover:scale-110`}
              >
                <span className="sr-only">Change status</span>
              </Menu.Button>
            </div>
            <Menu.Items
              data-testid="task-status-options"
              className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                {statusOptions.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        data-testid={option.value}
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
    <section id="pip-tasks" className="mt-5 w-full">
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

        {resourcesQuery.isLoading || !resourcesQuery.data ? (
          <p>loading...</p>
        ) : resourcesQuery.data && typeof resourcesQuery.data === "string" ? (
          <NoDataCard text={resourcesQuery.data} />
        ) : (
          resourcesQuery.data && (
            <div className="mt-2">
              <div className="mb-10 mt-2 flex flex-row gap-12 overflow-x-auto whitespace-nowrap pb-3">
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
          data-testid="resource-link"
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

  if (
    resourcesHistoryQuery.data &&
    typeof resourcesHistoryQuery.data === "string"
  ) {
    return <NoDataCard text={resourcesHistoryQuery.data} />;
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
    <div data-testid="pcp-resource-history">
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
                    <Menu.Items className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 drop-shadow-lg focus:outline-none">
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
