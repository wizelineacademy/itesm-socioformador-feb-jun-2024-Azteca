import React from "react";
import { RadarChart } from "@mantine/charts";
import InfoToolTip from "@/components/InfoToolTip";

interface RadarSectionProps {
  radarData: { statistic: string; punctuation: number }[];
}

const DashboardRadarSection: React.FC<RadarSectionProps> = ({ radarData }) => (
  <div className="flex w-fit flex-col items-center rounded-xl bg-white px-4 pt-5 drop-shadow-lg">
    <InfoToolTip
      description="This is a summary of your overall statistics."
      size="lg"
    />
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
