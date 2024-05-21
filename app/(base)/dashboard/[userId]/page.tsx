"use client";

import React from "react";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { RadarChart } from "@mantine/charts";
import GaugeChart from "@/components/GaugeChart";
import GrowthCircle from "@/components/GrowthCircle";
import { Tooltip } from "@mantine/core";
import Link from "next/link";

const Dashboard = ({ params }: { params: { userId: string } }) => {
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
      title: "High Energy - Unpleasent",
      percentage: 16,
      gradient: { start: "#ee824e", end: "#e14a5f" },
    },
    {
      title: "High Energy - Pleasent",
      percentage: 22,
      gradient: { start: "#f4e37c", end: "#f4b745" },
    },
    {
      title: "Low Energy - Unpleasent",
      percentage: 37,
      gradient: { start: "#92bef6", end: "#7481f7" },
    },
    {
      title: "Low Energy - Pleasent",
      percentage: 25,
      gradient: { start: "#9feba8", end: "#6bc68c" },
    },
  ];

  // Define the survey types with their respective colors
  type Survey = {
    date: Date;
    color: string; // Color could represent different survey types
  };

  // Example survey data indicating completed surveys
  const completedSurveys: Survey[] = [
    { date: new Date(2024, 0, 5), color: "red" },
    { date: new Date(2024, 3, 5), color: "red" },
    { date: new Date(2024, 3, 5), color: "green" },
    { date: new Date(2024, 3, 5), color: "yellow" },
    { date: new Date(2024, 3, 16), color: "yellow" },
    { date: new Date(2024, 3, 23), color: "blue" },
    { date: new Date(2024, 4, 15), color: "blue" },
  ];

  // Check if dates match
  const dateMatches = (d1: Date, d2: Date): boolean => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <>
      <Link
        href={`/profile/${params.userId}`}
        className="rounded-xl bg-primary px-4 py-2 text-white"
      >
        View Profile
      </Link>
      <div className=" mt-2 flex justify-between">
        <div className="grid gap-7">
          {/* Gauge Charts */}
          <div className="mt-4 flex justify-between gap-16">
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
                <p className="mx-auto mt-4 max-w-56 text-center text-xl font-medium text-graySubtitle">
                  {gauge.title}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {/* Radar Chart */}
            <div className="flex w-fit flex-col items-center rounded-xl bg-white px-4 pt-10 drop-shadow-lg">
              <h4 className="text-xl font-medium">Overall Statistics</h4>
              <RadarChart
                h={380}
                w={460}
                data={radarData}
                dataKey="statistic"
                series={[
                  {
                    name: "punctuation",
                    color: "indigo",
                    strokeColor: "indigo",
                  },
                ]}
                withPolarGrid
                withPolarAngleAxis
                withPolarRadiusAxis
                polarRadiusAxisProps={{
                  angle: 60,
                }}
              />
            </div>

            {/* Emotions Summary */}
            <div className="flex min-w-96 flex-col items-center rounded-xl bg-white px-10 py-5 drop-shadow-lg">
              <p className="mx-auto mt-2 text-center text-xl font-semibold text-graySubtitle">
                Emotions Summary
              </p>
              <div className="grid grid-cols-2 gap-5 pt-10">
                {emotionsData.map((circle, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center drop-shadow-lg"
                  >
                    <Tooltip.Floating
                      label={circle.title}
                      color={circle.gradient.end}
                    >
                      <div>
                        <GrowthCircle
                          percentage={circle.percentage}
                          gradient={circle.gradient}
                        />
                      </div>
                    </Tooltip.Floating>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-7">
          {/* Calendar */}
          <div className="flex w-fit flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg">
            <Calendar
              renderDay={(date: Date) => {
                // Filter surveys that match the date
                const surveysToday = completedSurveys.filter((survey) =>
                  dateMatches(survey.date, date),
                );

                return (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div>{date.getDate()}</div>
                    {surveysToday.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          width: "24px",
                        }}
                      >
                        {surveysToday.map((survey, index) => (
                          <Indicator
                            key={index}
                            position="bottom-center"
                            size={6}
                            color={survey.color}
                            disabled={false}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>
          {/* PIP */}
          <div className="flex flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg">
            <p className="mt-2 max-w-48 text-xl font-semibold text-graySubtitle">
              Performance Improvement Plan
            </p>
            <div className="mx-auto py-5">
              <GaugeChart
                percentage={PIPData.percentage}
                type={PIPData.type}
                gradient={PIPData.gradient}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
