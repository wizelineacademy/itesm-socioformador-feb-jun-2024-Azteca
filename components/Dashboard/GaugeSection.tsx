import React from "react";
import GaugeChart from "@/components/GaugeChart";

interface GaugeSectionProps {
  gaugeData: {
    title: string;
    percentage: number;
    type: string;
    gradient: { start: string; end: string };
  }[];
}

const GaugeSection: React.FC<GaugeSectionProps> = ({ gaugeData }) => (
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
);

export default GaugeSection;
