"use client";

import React, { useState } from "react";
import { RadarChart, AreaChart } from "@mantine/charts";
import GaugeChart from "@/components/GaugeChart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProjectById } from "@/services/project";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/services/user";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

const Project = ({ params }: { params: { projectId: string } }) => {
  const router = useRouter();

  const [isUpdateFeedbackPopupOpen, setIsUpdateFeedbackPopupOpen] =
    useState(false);

  const { mutate } = useMutation({
    mutationFn: deleteProjectById,
    onSuccess: () => {
      router.replace("/projects");
      router.refresh();
    },
  });

  const userRoleQuery = useQuery({
    queryKey: ["user-role"],
    queryFn: () => getUserRole(),
  });

  const radarData = [
    {
      statistic: "Communication",
      punctuation: 90,
    },
    {
      statistic: "Motivation",
      punctuation: 68,
    },
    {
      statistic: "Coworker Support",
      punctuation: 74,
    },
    {
      statistic: "Manager Support",
      punctuation: 85,
    },
    {
      statistic: "Punctuality",
      punctuation: 89,
    },
  ];
  const areaData = [
    {
      month: "Jan",
      growthSupport: 89,
      growthOportunities: 70,
    },
    {
      month: "Feb",
      growthSupport: 76,
      growthOportunities: 82,
    },
    {
      month: "Mar",
      growthSupport: 95,
      growthOportunities: 89,
    },
    {
      month: "Apr",
      growthSupport: 72,
      growthOportunities: 85,
    },
    {
      month: "May",
      growthSupport: 83,
      growthOportunities: 78,
    },
  ];
  const gaugeData = [
    {
      title: "Resources Satisfaction",
      percentage: 78,
      type: "half",
      gradient: { start: "#988511", end: "#FEDE1C" },
    },
    {
      title: "Listening Feeling",
      percentage: 64,
      type: "half",
      gradient: { start: "#295A95", end: "#4598FB" },
    },
    {
      title: "Recognition Feeling",
      percentage: 56,
      type: "half",
      gradient: { start: "#881931", end: "#EE2B55" },
    },
    {
      title: "Respect and Trust Environment",
      percentage: 85,
      type: "half",
      gradient: { start: "#35216F", end: "#6640D5" },
    },
  ];
  const progressBarPercentage = 74;

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <p className="text-3xl font-medium">Project 1</p>
        {userRoleQuery.data &&
          (userRoleQuery.data === "MANAGER" ||
            userRoleQuery.data === "ADMIN") && (
            <div className="flex gap-2">
              {/* Update feedback */}
              <div className="relative z-10 flex items-center gap-1">
                {/* popup */}
                {isUpdateFeedbackPopupOpen && (
                  <div className="absolute right-full top-full z-0 text-nowrap rounded-xl bg-white p-4 drop-shadow-lg">
                    <h2 className="mb-10 text-xl font-medium">
                      Update History
                    </h2>
                    <div className="flex gap-20">
                      <p>Survey 04/04/2024</p>
                      <p className="text-green-600">Completed</p>
                    </div>
                    <div className="flex gap-20">
                      <p>Survey 04/04/2024</p>
                      <p className="text-green-600">Completed</p>
                    </div>
                  </div>
                )}

                {/* open-popup-button */}
                <button
                  className="h-7 w-7 rounded-lg border border-gray-400 text-primary"
                  onClick={() => {
                    setIsUpdateFeedbackPopupOpen(!isUpdateFeedbackPopupOpen);
                  }}
                >
                  <span className="sr-only">Update Feedback Details</span>
                  <ChevronDownIcon />
                </button>
                {/* update-button */}
                <button className="rounded-lg bg-primary px-3 py-2 text-white">
                  Update Feedback
                </button>
              </div>
              {/* Delete button */}
              <button
                className="rounded-lg bg-red-800 px-3 py-2 text-white"
                onClick={() => {
                  mutate(parseInt(params.projectId));
                }}
              >
                Delete
              </button>
            </div>
          )}
      </div>
      {/* Gauge Charts */}
      <div className="mt-4 flex justify-between">
        {gaugeData.map((gauge, index) => (
          <div
            key={index}
            className="flex w-fit flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg"
          >
            <GaugeChart
              percentage={gauge.percentage}
              type={gauge.type}
              gradient={gauge.gradient}
            />
            <p className="mx-auto mt-2 max-w-48 text-center text-xl font-medium text-graySubtitle">
              {gauge.title}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        {/* Radar Chart */}
        <div className="flex h-fit w-fit flex-col items-center rounded-xl bg-white px-4 pt-4 drop-shadow-lg">
          <h4 className="text-xl font-medium">Overall Statistics</h4>
          <RadarChart
            h={380}
            w={460}
            data={radarData}
            dataKey="statistic"
            series={[
              { name: "punctuation", color: "indigo", strokeColor: "indigo" },
            ]}
            withPolarGrid
            withPolarAngleAxis
            withPolarRadiusAxis
            polarRadiusAxisProps={{
              angle: 60,
            }}
          />
        </div>
        <div className="grid gap-7">
          {/* Progress Bar */}
          <div className="flex h-fit w-fit flex-col rounded-xl bg-white p-4 drop-shadow-lg">
            <div className="flex justify-between">
              <div>
                <p className="pb-2 text-lg font-medium">Employee Overload</p>
                <p className="pb-2 text-5xl font-semibold">{`${progressBarPercentage}%`}</p>
              </div>
              <div>
                <p className="text-md text-red-600">+ 3.1%</p>
                <p className="text-sm text-grayText">to last week</p>
              </div>
            </div>
            <div className="w-[780px] rounded-full bg-gray-200 p-1">
              <div
                className="h-6 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500"
                style={{ width: `70%` }}
              ></div>
            </div>
          </div>
          {/* Area Chart */}
          <div className="flex h-fit w-fit flex-col items-center rounded-xl bg-white px-4 pb-4 pt-6 drop-shadow-lg">
            <AreaChart
              h={200}
              w={780}
              data={areaData}
              dataKey="month"
              series={[
                {
                  name: "growthSupport",
                  label: "Growth Support",
                  color: "indigo.6",
                },
                {
                  name: "growthOportunities",
                  label: "Growth Oportunities",
                  color: "blue.6",
                },
              ]}
              curveType="natural"
              // type="stacked"
              // type="percent"
              withLegend
              xAxisLabel="Month"
              yAxisLabel="Growth"
              tooltipAnimationDuration={200}
              strokeWidth={3}
              fillOpacity={0.25}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
