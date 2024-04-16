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
    <div className="text-2xl">
      <p>
        Showing the <strong>Project 1</strong>
      </p>
      <RadarChart
        h={300}
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
      <AreaChart
        h={300}
        data={areaData}
        dataKey="month"
        series={[
          { name: "growthSupport", label: "Growth Support", color: "indigo.6" },
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
  );
};

export default Project;
