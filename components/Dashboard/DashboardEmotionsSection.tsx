"use client";
import React from "react";
import { Tooltip } from "@mantine/core";
import GrowthCircle from "@/components/GrowthCircle";
import InfoToolTip from "@/components/InfoToolTip";
interface EmotionsSectionProps {
  emotionsData: {
    title: string;
    percentage: number;
    gradient: { start: string; end: string };
  }[];
}

const DashboardEmotionsSection: React.FC<EmotionsSectionProps> = ({
  emotionsData,
}) => (
  <div className="relative flex min-w-96 flex-col items-center rounded-xl bg-white px-10 py-5 drop-shadow-lg">
    <InfoToolTip
      description="Shows the percentage of each quadrant of the RULER Survey"
      size="lg"
    />
    <div className="flex">
      <p className="mx-auto text-center text-xl font-semibold text-graySubtitle">
        Emotions Summary
      </p>
    </div>
    <div className="emotion-box m-auto grid grid-cols-2 gap-10">
      {emotionsData.map((circle, index) => (
        <div
          key={index}
          className="emotion-circle flex items-center justify-center drop-shadow-lg transition-transform duration-300 ease-in-out"
        >
          <Tooltip.Floating label={circle.title} color={circle.gradient.end}>
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
);

export default DashboardEmotionsSection;
