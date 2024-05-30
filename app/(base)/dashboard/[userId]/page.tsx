import React, { Suspense } from "react";
import { getUserId, getUserManagedBy, getUserInfoById } from "@/services/user";
import UserProfile from "@/components/Dashboard/DashboardProfileLink";
import DashboardGaugeSection from "@/components/Dashboard/DashboardGaugeSection";
import DashboardRadarSection from "@/components/Dashboard/DashboardRadarSection";
import DashboardEmotionsSection from "@/components/Dashboard/DashboardEmotionsSection";
import DashboardSurveyCalendar from "@/components/Dashboard/DashboardSurveyCalendar";
import PCPSection from "@/components/Dashboard/DashboardPCPSection";
import Loader from "@/components/Loader";
import {
  getOverallStatistics,
  getPCPStatus,
  getProductivityScore,
  getRulerGraphInfo,
} from "@/services/user-dashboard";

const Dashboard = async ({ params }: { params: { userId: string } }) => {
  const activeUserId = await getUserId();
  const isManagedBy = await getUserManagedBy(activeUserId, params.userId);
  const user = await getUserInfoById(params.userId);
  const radarData = await getOverallStatistics(params.userId);

  const productivityScore = await getProductivityScore(params.userId);
  const gaugeData = [
    {
      title: "Productivity Level",
      percentage: productivityScore,
      type: "half",
      gradient: { start: "#988511", end: "#FEDE1C" },
    },
    {
      title: "Self Perception Level",
      percentage: 64,
      type: "half",
      gradient: { start: "#295A95", end: "#4598FB" },
    },
    {
      title: "Stress Level",
      percentage: 56,
      type: "half",
      gradient: { start: "#881931", end: "#EE2B55" },
    },
  ];

  const PCPData = await getPCPStatus(params.userId);

  const emotionsData = await getRulerGraphInfo(params.userId);

  const completedSurveys = [
    { date: new Date(2024, 0, 5), color: "red" },
    { date: new Date(2024, 3, 5), color: "red" },
    { date: new Date(2024, 3, 5), color: "green" },
    { date: new Date(2024, 3, 5), color: "yellow" },
    { date: new Date(2024, 3, 16), color: "yellow" },
    { date: new Date(2024, 3, 23), color: "blue" },
    { date: new Date(2024, 4, 15), color: "blue" },
  ];

  return (
    <Suspense
      fallback={
        <div className="h-[80dvh] w-full">
          <Loader />
        </div>
      }
    >
      {isManagedBy && (
        <UserProfile userId={params.userId} userName={user.name} />
      )}

      <div className="mt-2 flex justify-between">
        <div className="grid gap-7">
          <DashboardGaugeSection gaugeData={gaugeData} />
          <div className="flex justify-between">
            <DashboardRadarSection radarData={radarData} />
            <DashboardEmotionsSection emotionsData={emotionsData} />
          </div>
        </div>
        <div className="mt-4 grid gap-7">
          <DashboardSurveyCalendar completedSurveys={completedSurveys} />
          <PCPSection PCPData={PCPData} />
        </div>
      </div>
    </Suspense>
  );
};

export default Dashboard;
