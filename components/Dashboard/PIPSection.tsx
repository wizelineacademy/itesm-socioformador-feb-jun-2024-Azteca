import React from "react";
import GaugeChart from "@/components/GaugeChart";

interface PIPSectionProps {
  PIPData: {
    percentage: number;
    type: string;
    gradient: { start: string; end: string };
  };
}

const PIPSection: React.FC<PIPSectionProps> = ({ PIPData }) => (
  <div className="flex flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg">
    <p className="mt-2 text-center text-xl font-semibold text-graySubtitle">
      Personal Career Plan
    </p>
    <div className="mx-auto py-5">
      <GaugeChart
        percentage={PIPData.percentage}
        type={PIPData.type}
        gradient={PIPData.gradient}
      />
    </div>
  </div>
);

export default PIPSection;
