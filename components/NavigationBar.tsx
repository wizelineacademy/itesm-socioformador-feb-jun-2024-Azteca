"use client";
import { usePathname } from "next/navigation";
import PIPIcon from "./PIPIconNavbar";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import ProjectNavbarIcon from "./ProjectNavbarIcon";
import UserIconNavbar from "./UserIconNavbar";
import DashboardIconNavbar from "./DashboardIconNavbar";
import ProjectSurvey from "./modals/ProjectSurvey";
import { useState } from "react";

const NavigationBar = () => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const validRoutes = [
    "/pip",
    "/dashboard",
    "/profile",
    "/projects",
    "/",
    "/projects/create",
    "/projects/1",
  ];

  if (!validRoutes.includes(pathname)) {
    return null;
  }

  const isManager = true;
  return (
    <>
      <ProjectSurvey
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
      <nav className="flex items-center justify-between bg-bone">
        <h1 className="text-3xl font-bold text-primary">FEEDBACK FLOW</h1>
        <div className="flex flex-row gap-5 p-1">
          <PIPIcon path="/pip" currentPath={pathname} />
          <DashboardIconNavbar path="/dashboard" currentPath={pathname} />
          {isManager && (
            <ProjectNavbarIcon path="/projects" currentPath={pathname} />
          )}
          <SearchBar placeholder="Search Co-workers ..." expanded={false} />
          <Notifications setShowModal={() => setShowModal(true)} />
          <UserIconNavbar path="/profile" currentPath={pathname} />
        </div>
      </nav>
    </>
  );
};
export default NavigationBar;
