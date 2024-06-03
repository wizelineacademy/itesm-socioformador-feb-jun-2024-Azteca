"use client";

import React, { useState } from "react";
import { RadarChart, AreaChart } from "@mantine/charts";
import GaugeChart from "@/components/GaugeChart";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteProjectById,
  getUpdateFeedbackHistory,
  getProjectById,
  updateFeedback,
} from "@/services/project";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/services/user";
import {
  getOverallStatistics,
  getDetailedProjectStatistics,
  getGrowthData, // Importar el nuevo servicio
} from "@/services/sprintSurvey";

import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import NoDataCard from "@/components/NoDataCard";
import Loader from "@/components/Loader";

const Project = ({ params }: { params: { projectId: string } }) => {
  const router = useRouter();
  const projectId = parseInt(params.projectId);

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

  const { data: projectData, isLoading: isLoadingProjectData } = useQuery({
    queryKey: ["project-data", projectId],
    queryFn: () => getProjectById(projectId),
  });

  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ["project-overall-statistics", projectId],
    queryFn: () => getOverallStatistics(projectId),
  });

  const { data: detailedStatistics, isLoading: isLoadingDetailedStatistics } =
    useQuery({
      queryKey: ["project-detailed-statistics", projectId],
      queryFn: () => getDetailedProjectStatistics(projectId),
    });

  const { data: growthData, isLoading: isLoadingGrowthData } = useQuery({
    queryKey: ["project-growth-data", projectId],
    queryFn: () => getGrowthData(projectId), // Consumir el nuevo servicio
  });
  const radarData = statistics
    ? [
        {
          statistic: "Communication",
          punctuation: statistics.communication,
        },
        {
          statistic: "Motivation",
          punctuation: statistics.motivation,
        },
        {
          statistic: "Coworker Support",
          punctuation: statistics.coworkerSupport,
        },
        {
          statistic: "Manager Support",
          punctuation: statistics.managerSupport,
        },
        {
          statistic: "Punctuality",
          punctuation: statistics.punctuality,
        },
      ]
    : [];
  const areaData = growthData
    ? growthData.growthSupportData.map((item, index) => ({
        month: item.month,
        growthSupport: item.averageAnswer,
        growthOportunities:
          growthData.growthOpportunitiesData[index]?.averageAnswer || 0,
      }))
    : [];

  const gaugeData = detailedStatistics
    ? [
        {
          title: "Resources Satisfaction",
          percentage: detailedStatistics.resourcesSatisfaction,
          type: "half",
          gradient: { start: "#988511", end: "#FEDE1C" },
        },
        {
          title: "Listening Feeling",
          percentage: detailedStatistics.listeningFeeling,
          type: "half",
          gradient: { start: "#295A95", end: "#4598FB" },
        },
        {
          title: "Recognition Feeling",
          percentage: detailedStatistics.recognitionFeeling,
          type: "half",
          gradient: { start: "#881931", end: "#EE2B55" },
        },
        {
          title: "Respect and Trust Environment",
          percentage: detailedStatistics.respectTrustEnvironment,
          type: "half",
          gradient: { start: "#35216F", end: "#6640D5" },
        },
      ]
    : [];
  const progressBarPercentage = 74;

  if (
    isLoadingStatistics ||
    isLoadingDetailedStatistics ||
    isLoadingProjectData ||
    isLoadingGrowthData // Agregar el estado de carga de los datos de crecimiento
  ) {
    return (
      <div className="h-[80dvh]">
        <Loader />
      </div>
    );
  }
  console.log(gaugeData);

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <p className="text-3xl font-medium">{projectData?.name}</p>
        {userRoleQuery.data &&
          (userRoleQuery.data === "MANAGER" ||
            userRoleQuery.data === "ADMIN") && (
            <div className="flex gap-2">
              {/* Update feedback */}
              <div className="relative z-10 flex items-center gap-1">
                {/* popup */}
                {isUpdateFeedbackPopupOpen && (
                  <UpdateFeedbackHistoryPopup projectId={projectId} />
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
                <button
                  className="rounded-lg bg-primary px-3 py-2 text-white"
                  onClick={async () => {
                    await updateFeedback(parseInt(params.projectId));
                  }}
                >
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
              percentage={Number(gauge.percentage)}
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

const UpdateFeedbackHistoryPopup = ({ projectId }: { projectId: number }) => {
  const updateFeedbackHistoryQuery = useQuery({
    queryKey: ["update-feedback-history"],
    queryFn: () => getUpdateFeedbackHistory({ projectId }),
    retry: false,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (updateFeedbackHistoryQuery.isError) {
    return <NoDataCard text={updateFeedbackHistoryQuery.error.message} />;
  }

  if (
    updateFeedbackHistoryQuery.isLoading ||
    !updateFeedbackHistoryQuery.data
  ) {
    return <p>Loading...</p>;
  }

  return (
    <div className="absolute right-full top-full z-0 text-nowrap rounded-xl bg-white p-4 drop-shadow-lg">
      <h2 className="mb-4 text-xl font-medium">Update History</h2>
      {updateFeedbackHistoryQuery.data.map((survey, idx) => (
        <div key={idx} className="flex justify-between gap-20">
          <p>
            {survey.type === "SPRINT"
              ? "Sprint Survey"
              : survey.type === "FINAL"
                ? "Final Survey"
                : "UNREACHABLE"}{" "}
            -{" "}
            <span className="text-gray-500">
              {formatDate(survey.scheduledAt)}
            </span>
          </p>
          {survey.status === "COMPLETED" ? (
            <p className="text-green-600">Completed</p>
          ) : survey.status === "PENDING" ? (
            <p className="text-red-600">Pending</p>
          ) : survey.status === "NOT_AVAILABLE" ? (
            <p className="text-gray-600">Pending</p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Project;
