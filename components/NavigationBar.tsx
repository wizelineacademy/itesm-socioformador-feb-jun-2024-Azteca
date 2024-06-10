import PCPIcon from "./PCPIconNavbar";
import Notifications from "./Notifications";
import ProjectNavbarIcon from "./ProjectNavbarIcon";
import UserIconNavbar from "./UserIconNavbar";
import DashboardIconNavbar from "./DashboardIconNavbar";
import { getUserRole } from "@/services/user";
import Link from "next/link";
import ComboBoxSearch from "./ComboBoxSearch";

const NavigationBar = async () => {
  const userRoleQuery = await getUserRole();

  return (
    <nav
      className="flex items-center justify-between bg-bone"
      data-testid="navigation-bar"
    >
      <h1 className="text-3xl font-bold text-primary">FEEDBACK FLOW</h1>
      <div className="flex flex-row gap-5 p-1">
        {userRoleQuery === "ADMIN" && (
          <Link
            href="/admin"
            className="rounded-xl bg-primary px-4 py-2 text-white"
          >
            Admin Dashboard
          </Link>
        )}
        <PCPIcon path="/pcp" />
        <DashboardIconNavbar path="/dashboard" />
        <ProjectNavbarIcon path="/projects" />
        <ComboBoxSearch />
        <Notifications />
        <UserIconNavbar path="/profile" />
      </div>
    </nav>
  );
};
export default NavigationBar;
