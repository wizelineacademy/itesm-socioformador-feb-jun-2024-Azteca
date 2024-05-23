"use server";

import React from "react";
import { getUserId, getUserManagedBy, getUserInfoById } from "@/services/user";
import UserProfile from "@/components/Dashboard/UserProfile";
import GaugeSection from "@/components/Dashboard/GaugeSection";
import RadarSection from "@/components/Dashboard/RadarSection";
import EmotionsSection from "@/components/Dashboard/EmotionsSection";
import SurveyCalendar from "@/components/Dashboard/SurveyCalendar";
import PIPSection from "@/components/Dashboard/PIPSection";

const Dashboard = async ({ params }: { params: { userId: string } }) => {
  const activeUserId = await getUserId();
  const isManagedBy = await getUserManagedBy(activeUserId, params.userId);
  const user = await getUserInfoById(params.userId);

  const radarData = [
    { statistic: "Communication", punctuation: 90 },
    { statistic: "Motivation", punctuation: 68 },
    { statistic: "Coworker Support", punctuation: 74 },
    { statistic: "Manager Support", punctuation: 85 },
    { statistic: "Punctuality", punctuation: 89 },
  ];

  const gaugeData = [
    {
      title: "Productivity Level",
      percentage: 78,
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

  const PIPData = {
    percentage: 63,
    type: "full",
    gradient: { start: "#4598FB", end: "#6640D5" },
  };

  const emotionsData = [
    {
      title: "High Energy - Unpleasant",
      percentage: 16,
      gradient: { start: "#ee824e", end: "#e14a5f" },
    },
    {
      title: "High Energy - Pleasant",
      percentage: 22,
      gradient: { start: "#f4e37c", end: "#f4b745" },
    },
    {
      title: "Low Energy - Unpleasant",
      percentage: 37,
      gradient: { start: "#92bef6", end: "#7481f7" },
    },
    {
      title: "Low Energy - Pleasant",
      percentage: 25,
      gradient: { start: "#9feba8", end: "#6bc68c" },
    },
  ];

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
    <>
      {isManagedBy && (
        <UserProfile userId={params.userId} userName={user.name} />
      )}

      <div className="mt-2 flex justify-between">
        <div className="grid gap-7">
          <GaugeSection gaugeData={gaugeData} />
          <div className="flex justify-between">
            <RadarSection radarData={radarData} />
            <EmotionsSection emotionsData={emotionsData} />
          </div>
        </div>
        <div className="mt-4 grid gap-7">
          <SurveyCalendar completedSurveys={completedSurveys} />
          <PIPSection PIPData={PIPData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
