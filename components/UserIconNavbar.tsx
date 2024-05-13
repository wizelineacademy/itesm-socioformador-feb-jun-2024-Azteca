"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "../components/icons/UserIcon";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/services/user";

interface UserIconInterface {
  path: string;
  currentPath: string;
}
const UserIconNavbar = ({ path, currentPath }: UserIconInterface) => {
  const onSite = currentPath === path;
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
        onClick={() => setIsClicked(!isClicked)}
        className={`${onSite || isClicked ? "bg-primary" : "bg-white transition-all delay-0 hover:scale-[1.175]"} group rounded-full p-2 drop-shadow-lg`}
      >
        <UserIcon
          size="h-6 w-6"
          color={onSite || isClicked ? "text-white" : "text-primary"}
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
                Hola {user?.name.split(" ")[0]}!
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
export default UserIconNavbar;
