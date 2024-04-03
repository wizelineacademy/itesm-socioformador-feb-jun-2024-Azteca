"use client";
import { usePathname } from "next/navigation";
import PIPIcon from "./PIPIcon";
import DashboardIcon from "./DashboardIcon";
import UserIcon from "./UserIcon";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";

const NavigationBar = () => {
  const pathname = usePathname();

  // si estamos en el login o register no mostramos la navbar
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="flex items-center justify-between bg-bone p-4 ">
      <h1 className="text-3xl font-bold text-primary">FEEDBACK FLOW</h1>
      <div className="flex flex-row gap-5 p-1">
        <PIPIcon path="/pip" currentPath={pathname} />
        <DashboardIcon path="/dashboard" currentPath={pathname} />
        <UserIcon path="/profile" currentPath={pathname} />
        <SearchBar placeholder="Search Co-workers ..." />
        <Notifications />
      </div>
    </nav>
  );
};
export default NavigationBar;
