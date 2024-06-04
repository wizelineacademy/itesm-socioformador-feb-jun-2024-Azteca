import React from "react";
import { getUserId, getUserManagedBy, getUserInfoById } from "@/services/user";
import UserProfile from "@/components/Dashboard/DashboardProfileLink";
import DashboardGaugeSection from "@/components/Dashboard/DashboardGaugeSection";
import DashboardRadarSection from "@/components/Dashboard/DashboardRadarSection";
import DashboardEmotionsSection from "@/components/Dashboard/DashboardEmotionsSection";
import DashboardSurveyCalendar from "@/components/Dashboard/DashboardSurveyCalendar";
import DashboardPCPSection from "@/components/Dashboard/DashboardPCPSection";
import {
  getCalendarInfo,
  getOverallStatistics,
  getPCPStatus,
  getProductivityScore,
  getRulerGraphInfo,
  getSelfPerceptionScore,
  getStressScore,
} from "@/services/user-dashboard";

const Dashboard = async ({ params }: { params: { userId: string } }) => {
  const activeUserId = await getUserId();
  const isManagedBy = await getUserManagedBy(activeUserId, params.userId);
  const user = await getUserInfoById(params.userId);
  const radarData = await getOverallStatistics(params.userId);

  const productivityScore = await getProductivityScore(params.userId);
  const selfPerceptionScore = await getSelfPerceptionScore(params.userId);
  const stressScore = await getStressScore(params.userId);
  const gaugeData = [
    {
      title: "Productivity Level",
      percentage: productivityScore,
      type: "half",
      gradient: { start: "#988511", end: "#FEDE1C" },
    },
    {
      title: "Self Perception Level",
      percentage: selfPerceptionScore,
      type: "half",
      gradient: { start: "#295A95", end: "#4598FB" },
    },
    {
      title: "Stress Level",
      percentage: stressScore,
      type: "half",
      gradient: { start: "#881931", end: "#EE2B55" },
    },
  ];

  const PCPData = await getPCPStatus(params.userId);

  const emotionsData = await getRulerGraphInfo(params.userId);
  getCalendarInfo(params.userId);

  const completedSurveys = await getCalendarInfo(params.userId);
  return (
    <>
      {isManagedBy && (
        <UserProfile userId={params.userId} userName={user.name} />
      )}

      <div className="mt-2 flex flex-row justify-between md:flex-row">
        <div className="grid gap-7">
          <DashboardGaugeSection gaugeData={gaugeData} />
          <div className="flex justify-between">
            <DashboardRadarSection radarData={radarData} />
            <DashboardEmotionsSection emotionsData={emotionsData} />
          </div>
        </div>
        <div className="mt-4 grid gap-7">
          <DashboardSurveyCalendar completedSurveys={completedSurveys} />
          <DashboardPCPSection PCPData={PCPData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
