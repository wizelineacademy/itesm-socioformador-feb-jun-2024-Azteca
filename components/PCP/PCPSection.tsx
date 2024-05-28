"use client";
import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import DialogComponent from "../DialogComponent";
import InfoIcon from "../icons/InfoIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import Link from "next/link";

interface PCPSectionProps {
  title: string;
  showMore: boolean;
  children: React.ReactNode;
  userId?: string;
  type?: string;
}

const statusOptions = [
  { label: "Pending", color: "bg-red-500", value: "pending" },
  { label: "In Progress", color: "bg-yellow-500", value: "in-progress" },
  { label: "Done", color: "bg-blue-500", value: "done" },
];

const PCPSection: React.FC<PCPSectionProps> = ({
  title,
  showMore,
  children,
  userId,
  type,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [tasks, setTasks] = useState([
    {
      sprintId: 1,
      date: "27-05-2024",
      tasks: [
        {
          id: 1,
          userId: "userid1",
          title: "title1",
          description: "description1",
          status: "pending",
        },
        {
          id: 2,
          userId: "userid2",
          title: "title2",
          description: "description2",
          status: "in-progress",
        },
        {
          id: 3,
          userId: "userid3",
          title: "title3",
          description: "description3",
          status: "done",
        },
        {
          id: 4,
          userId: "userid4",
          title: "title4",
          description: "description4",
          status: "pending",
        },
        {
          id: 5,
          userId: "userid5",
          title: "title5",
          description: "description5",
          status: "in-progress",
        },
      ],
    },
    {
      sprintId: 2,
      date: "03-06-2024",
      tasks: [
        {
          id: 6,
          userId: "userid6",
          title: "title6",
          description: "description6",
          status: "done",
        },
        {
          id: 7,
          userId: "userid7",
          title: "title7",
          description: "description7",
          status: "pending",
        },
        {
          id: 8,
          userId: "userid8",
          title: "title8",
          description: "description8",
          status: "in-progress",
        },
        {
          id: 9,
          userId: "userid9",
          title: "title9",
          description: "description9",
          status: "done",
        },
        {
          id: 10,
          userId: "userid10",
          title: "title10",
          description: "description10",
          status: "pending",
        },
      ],
    },
    {
      sprintId: 3,
      date: "10-06-2024",
      tasks: [
        {
          id: 11,
          userId: "userid11",
          title: "title11",
          description: "description11",
          status: "in-progress",
        },
        {
          id: 12,
          userId: "userid12",
          title: "title12",
          description: "description12",
          status: "done",
        },
        {
          id: 13,
          userId: "userid13",
          title: "title13",
          description: "description13",
          status: "pending",
        },
        {
          id: 14,
          userId: "userid14",
          title: "title14",
          description: "description14",
          status: "in-progress",
        },
        {
          id: 15,
          userId: "userid15",
          title: "title15",
          description: "description15",
          status: "done",
        },
      ],
    },
  ]);
  const [resources, setResources] = useState([
    {
      sprintId: 1,
      date: "27-05-2024",
      resources: [
        {
          id: 1,
          userId: "userid1",
          title: "resourceTitle1",
          description: "resourceDescription1",
          kind: "type1",
          url: "http://example.com/resource1",
        },
        {
          id: 2,
          userId: "userid2",
          title: "resourceTitle2",
          description: "resourceDescription2",
          kind: "type2",
          url: "http://example.com/resource2",
        },
        {
          id: 3,
          userId: "userid3",
          title: "resourceTitle3",
          description: "resourceDescription3",
          kind: "type3",
          url: "http://example.com/resource3",
        },
        {
          id: 4,
          userId: "userid4",
          title: "resourceTitle4",
          description: "resourceDescription4",
          kind: "type1",
          url: "http://example.com/resource4",
        },
        {
          id: 5,
          userId: "userid5",
          title: "resourceTitle5",
          description: "resourceDescription5",
          kind: "type2",
          url: "http://example.com/resource5",
        },
      ],
    },
    {
      sprintId: 2,
      date: "03-06-2024",
      resources: [
        {
          id: 6,
          userId: "userid6",
          title: "resourceTitle6",
          description: "resourceDescription6",
          kind: "type3",
          url: "http://example.com/resource6",
        },
        {
          id: 7,
          userId: "userid7",
          title: "resourceTitle7",
          description: "resourceDescription7",
          kind: "type1",
          url: "http://example.com/resource7",
        },
        {
          id: 8,
          userId: "userid8",
          title: "resourceTitle8",
          description: "resourceDescription8",
          kind: "type2",
          url: "http://example.com/resource8",
        },
        {
          id: 9,
          userId: "userid9",
          title: "resourceTitle9",
          description: "resourceDescription9",
          kind: "type3",
          url: "http://example.com/resource9",
        },
        {
          id: 10,
          userId: "userid10",
          title: "resourceTitle10",
          description: "resourceDescription10",
          kind: "type1",
          url: "http://example.com/resource10",
        },
      ],
    },
    {
      sprintId: 3,
      date: "10-06-2024",
      resources: [
        {
          id: 11,
          userId: "userid11",
          title: "resourceTitle11",
          description: "resourceDescription11",
          kind: "type2",
          url: "http://example.com/resource11",
        },
        {
          id: 12,
          userId: "userid12",
          title: "resourceTitle12",
          description: "resourceDescription12",
          kind: "type3",
          url: "http://example.com/resource12",
        },
        {
          id: 13,
          userId: "userid13",
          title: "resourceTitle13",
          description: "resourceDescription13",
          kind: "type1",
          url: "http://example.com/resource13",
        },
        {
          id: 14,
          userId: "userid14",
          title: "resourceTitle14",
          description: "resourceDescription14",
          kind: "type2",
          url: "http://example.com/resource14",
        },
        {
          id: 15,
          userId: "userid15",
          title: "resourceTitle15",
          description: "resourceDescription15",
          kind: "type3",
          url: "http://example.com/resource15",
        },
      ],
    },
  ]);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((sprint) => ({
        ...sprint,
        tasks: sprint.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      })),
    );
  };

  return (
    <div className="mb-6">
      <div className="mx-auto flex justify-between">
        <h3 className="text-3xl font-medium text-black">{title}</h3>
        {showMore && (
          <button
            className="cursor-pointer self-center text-sm text-graySubtitle"
            onClick={openDialog}
          >
            Show More
          </button>
        )}
      </div>
      <div className="mt-2">{children}</div>

      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={title}
      >
        <div>
          {type === "tasks" &&
            tasks.map((sprint) => (
              <div key={sprint.sprintId}>
                <p className="py-1 text-lg font-medium">{`Sprint ${sprint.date}`}</p>
                {sprint.tasks.map((task) => {
                  const currentStatusOption = statusOptions.find(
                    (option) => option.value === task.status,
                  );

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between py-1"
                    >
                      <p className="text-graySubtitle">{task.title}</p>
                      <div className="flex items-center space-x-4">
                        {/* Description Dropdown */}
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
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
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
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
                                      onClick={() =>
                                        handleStatusChange(
                                          task.id,
                                          option.value,
                                        )
                                      }
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
                })}
              </div>
            ))}

          {type === "resources" &&
            resources.map((resource) => (
              <div key={resource.sprintId}>
                <p className="py-1 text-lg font-medium">{`Sprint ${resource.date}`}</p>
                {resource.resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between py-1"
                  >
                    <p className="text-graySubtitle">{res.title}</p>
                    <div className="flex items-center gap-4">
                      {/* Description Dropdown */}
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="flex items-center text-sm text-blue-500 underline">
                            <InfoIcon color="text-black" size="h-6 w-6" />
                          </Menu.Button>
                        </div>
                        <Menu.Items className="absolute right-0 z-50 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-1 text-sm text-gray-700">
                            {res.description}
                          </div>
                        </Menu.Items>
                      </Menu>
                      <Link
                        href={res.url}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                      >
                        <ChevronRightIcon size="h-3 w-3" color="white" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </DialogComponent>
    </div>
  );
};

export default PCPSection;
