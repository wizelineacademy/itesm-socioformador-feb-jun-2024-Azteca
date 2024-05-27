import { useState } from "react";
import { Menu } from "@headlessui/react";

interface InterfacePCPTask {
  title: string | null;
  description: string | null;
  status: string | null;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { label: "Pending", color: "bg-red-500", value: "pending" },
  { label: "In Progress", color: "bg-yellow-500", value: "in-progress" },
  { label: "Done", color: "bg-blue-500", value: "done" },
];

const PCPTask = ({
  title,
  description,
  status,
  onStatusChange,
}: InterfacePCPTask) => {
  const [selectedStatus, setSelectedStatus] = useState(
    statusOptions.find((option) => option.value === status) || statusOptions[0],
  );

  return (
    <div className="box-border h-48 w-52 shrink-0 rounded-xl bg-white p-4 shadow-lg">
      <header className="flex items-center">
        <p className="text-md text-wrap font-semibold">{title}</p>
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
                        onClick={() => {
                          setSelectedStatus(option);
                          onStatusChange(option.value);
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
        {description}
      </p>
    </div>
  );
};

export default PCPTask;
