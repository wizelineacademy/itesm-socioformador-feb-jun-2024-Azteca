import React from "react";
import GaugeChart from "@/components/GaugeChart";
import InfoToolTip from "@/components/InfoToolTip";
import Link from "next/link";

interface PCPSectionProps {
  PCPData: {
    percentage: number;
    type: string;
    gradient: { start: string; end: string };
  };
}

const DashboardPCPSection: React.FC<PCPSectionProps> = ({ PCPData }) => (
  <Link href="/pcp" className="cursor-pointer">
    <div className="flex flex-col rounded-xl bg-white px-10 py-4 drop-shadow-lg">
      <InfoToolTip description="Show the progress of your Personal Carreer Plan" />
      <p className="mt-2 text-center text-xl font-semibold text-graySubtitle">
        Personal Career Plan
      </p>
      <div className="mx-auto py-5">
        <GaugeChart
          percentage={PCPData.percentage}
          type={PCPData.type}
          gradient={PCPData.gradient}
        />
      </div>
    </div>
  </Link>
);

export default DashboardPCPSection;
