"use client";

import React from "react";
import { RadarChart, AreaChart } from "@mantine/charts";

// const Project = ({ params: { project_id } }) => {
const Project = () => {
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

  return (
    <div className="flex flex-wrap">
      <p className="text-3xl font-medium">Project 1</p>
      <div className="flex h-fit w-fit flex-col items-center rounded-xl bg-white p-5 drop-shadow-lg">
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
      <div className="flex h-fit w-fit flex-col items-center rounded-xl bg-white px-5 py-7 drop-shadow-lg">
        <AreaChart
          h={220}
          w={600}
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
      <div className="flex h-fit w-fit flex-col rounded-xl bg-white p-5 drop-shadow-lg">
        <div className="flex justify-between">
          <div>
            <p className="pb-2 text-lg font-medium">Employee Overload</p>
            <p className="pb-2 text-5xl font-semibold">76%</p>
          </div>
          <div>
            <p className="text-md text-red-600">+ 3.1%</p>
            <p className="text-sm text-grayText">to last week</p>
          </div>
        </div>
        <div className="w-[600px] rounded-full bg-gray-200 p-1">
          <div
            className="h-6 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500"
            style={{ width: `70%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Project;
