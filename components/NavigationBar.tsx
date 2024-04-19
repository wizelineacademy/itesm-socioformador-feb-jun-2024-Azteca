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
import SprintSurvey from "./modals/SprintSurvey";
import { useQuery } from "@tanstack/react-query";
import { getUserRole } from "@/services/navigation-bar-page";
import Link from "next/link";

const NavigationBar = () => {
  const userRoleQuery = useQuery({
    queryKey: ["user-role"],
    queryFn: () => getUserRole(),
  });

  const pathname = usePathname();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const validRoutes = [
    "/pcp",
    "/dashboard",
    "/profile",
    "/projects",
    "/",
    "/projects/create",
    "/projects/1",
    "/admin",
  ];

  if (!validRoutes.includes(pathname)) {
    return null;
  }

  const isManager = true;
  return (
    <>
      {showProjectModal && (
        <ProjectSurvey
          showModal={showProjectModal}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {showSprintModal && (
        <SprintSurvey
          showModal={showSprintModal}
          onClose={() => setShowSprintModal(false)}
        />
      )}
      <nav className="flex items-center justify-between bg-bone">
        <h1 className="text-3xl font-bold text-primary">FEEDBACK FLOW</h1>
        <div className="flex flex-row gap-5 p-1">
          {userRoleQuery.data && userRoleQuery.data == "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-xl bg-primary px-4 py-2 text-white"
            >
              Admin Dashboard
            </Link>
          )}
          <PIPIcon path="/pcp" currentPath={pathname} />
          <DashboardIconNavbar path="/dashboard" currentPath={pathname} />
          {isManager && (
            <ProjectNavbarIcon path="/projects" currentPath={pathname} />
          )}
          <SearchBar placeholder="Search Co-workers ..." expanded={false} />
          <Notifications
            showProjectModal={() => setShowProjectModal(true)}
            showSprintModal={() => setShowSprintModal(true)}
          />
          <UserIconNavbar path="/profile" currentPath={pathname} />
        </div>
      </nav>
    </>
  );
};
export default NavigationBar;
