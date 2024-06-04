import React from "react";
import GaugeChart from "@/components/GaugeChart";
import InfoToolTip from "@/components/InfoToolTip";

interface GaugeSectionProps {
  gaugeData: {
    title: string;
    percentage: number;
    type: string;
    gradient: { start: string; end: string };
  }[];
}

const getTooltipDescription = (title: string) => {
  switch (title) {
    case "Productivity Level":
      return "Represents the current productivity feeling rate.<br />Higher percentage indicates greater productivity.";
    case "Self Perception Level":
      return "Shows how individuals perceive their own performance.<br />Higher values indicate greater self-confidence.";
    case "Stress Level":
      return "Indicates the current stress level.<br />Higher percentages reflect higher stress.";
    default:
      return "This is a summary of your overall statistics.";
  }
};

const DashboardGaugeSection: React.FC<GaugeSectionProps> = ({ gaugeData }) => (
  <div className="mt-4 flex justify-between gap-16">
    {gaugeData.map((gauge, index) => (
      <div
        key={index}
        className="flex w-fit flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg"
      >
        <InfoToolTip
          description={getTooltipDescription(gauge.title)}
          size="sm"
        />
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
);

export default DashboardGaugeSection;
