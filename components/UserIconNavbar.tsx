"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/user";
import UserProfileButton from "./UserProfileButton";

interface UserIconInterface {
  path: string;
  currentPath: string;
  showSettingsModal: () => void;
}
const UserIconNavbar = ({
  path,
  currentPath,
  showSettingsModal,
}: UserIconInterface) => {
  const onSite = currentPath.startsWith(path);
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserInfo(),
  });
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const onClickOutsideButton = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".group")) {
        setIsClicked(false);
      }
    };
    document.addEventListener("click", onClickOutsideButton);
    return () => document.removeEventListener("click", onClickOutsideButton);
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        as="div"
        onClick={() => setIsClicked(!isClicked)}
        className={`${onSite || isClicked ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} flex rounded-full drop-shadow-lg`}
      >
        {/*         <UserIcon
          size="h-6 w-6"
          color={onSite || isClicked ? "text-white" : "text-primary"}
        /> */}
        <UserProfileButton
          size="xs"
          active={onSite || isClicked}
          color={onSite || isClicked ? "text-white" : "text-primary"}
          photoUrl={user?.photoUrl || ""}
          className="m-auto bg-transparent"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              <p className="mx-auto items-center px-2 py-2 text-sm">
                Hello {user?.name.split(" ")[0]}!
              </p>
            </Menu.Item>
          </div>
          <div className="flex flex-col gap-1 px-1 py-1">
            <Menu.Item disabled={onSite}>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={`${
                    active
                      ? "bg-primary/75 text-white"
                      : onSite
                        ? "bg-primary text-white"
                        : "text-gray-900"
                  }  group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Go Profile
                </Link>
              )}
            </Menu.Item>
            <button
              onClick={() => {
                showSettingsModal();
              }}
            >
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-primary/75 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Settings
                  </button>
                )}
              </Menu.Item>
            </button>
          </div>
          <button className="w-full px-1 py-1" onClick={handleSignOut}>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-red-700 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </button>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default UserIconNavbar;
