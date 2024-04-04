"use client";
import { usePathname, useRouter } from "next/navigation";
import PIPIcon from "./PIPIcon";
import DashboardIcon from "./DashboardIcon";
import UserIcon from "./UserIcon";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import { useClerk } from "@clerk/nextjs";

const NavigationBar = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <nav className="mx-8 mt-10 flex items-center justify-between bg-bone">
      <h1 className="text-3xl font-bold text-primary">FEEDBACK FLOW</h1>
      <div className="flex flex-row gap-5 p-1">
        <button onClick={() => signOut(() => router.push("/sign-in"))}>
          sign out
        </button>
        <PIPIcon path="/pip" currentPath={pathname} />
        <DashboardIcon path="/dashboard" currentPath={pathname} />
        <UserIcon path="/profile" currentPath={pathname} />
        <SearchBar placeholder="Search Co-workers ..." expanded={true} />
        <Notifications />
      </div>
    </nav>
  );
};
export default NavigationBar;
