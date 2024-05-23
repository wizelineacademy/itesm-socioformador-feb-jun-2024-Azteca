import React from "react";
import { RadarChart } from "@mantine/charts";

interface RadarSectionProps {
  radarData: { statistic: string; punctuation: number }[];
}

const DashboardRadarSection: React.FC<RadarSectionProps> = ({ radarData }) => (
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
);

export default DashboardRadarSection;
