"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useClerk } from "../node_modules/@clerk/nextjs";
import { useRouter } from "next/navigation";

interface UserIconInterface {
  path: string;
  currentPath: string;
}
const UserIcon = ({ path, currentPath }: UserIconInterface) => {
  const onSite = currentPath === path;
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { signOut } = useClerk();
  const router = useRouter();
  const handleSignOut = () => {
    signOut(() => router.push("/sign-in"));
  };

  useEffect(() => {
    const onCLickOutsideButton = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".group")) {
        setIsClicked(false);
      }
    };
    document.addEventListener("click", onCLickOutsideButton);
    return () => document.removeEventListener("click", onCLickOutsideButton);
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          onClick={() => setIsClicked(!isClicked)}
          className={`${onSite || isClicked ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${onSite || isClicked ? "text-white" : "text-primary"} h-6 w-6 `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              <p className="mx-auto items-center px-2 py-2 text-sm">
                Hola José Carlos!
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
                  Ir a perfil
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-primary/75 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Cambiar tema
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1" onClick={handleSignOut}>
            {" "}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-red-700 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Cerrar sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default UserIcon;
