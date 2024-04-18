import React from "react";

interface GaugeChartProps {
  percentage: number;
  type: "half" | "full";
}

const GaugeChart = ({ percentage, type }: GaugeChartProps) => {
  const strokeDasharray = Math.PI * 70; // Circunferencia para el radio del círculo SVG
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div>
      {type === "half" ? (
        <div className="relative h-32 w-64">
          <svg width="200" height="100" viewBox="0 0 200 100">
            <path
              d="M 15 100 A 85 85 0 0 1 185 100"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 15 100 A 85 85 0 0 1 185 100"
              fill="none"
              stroke="#facc15"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: "stroke-dashoffset 0.6s ease 0s",
                transformOrigin: "center bottom",
              }}
            />
          </svg>
          <div
            className="absolute flex w-full items-center justify-center"
            style={{
              top: "50%",
              transform: "translateY(-20%) translateX(-10%)",
            }}
          >
            <span className="text-3xl font-semibold text-[#facc15]">
              {percentage}%
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-64 w-64 items-center justify-center">
          <svg
            className="-rotate-90 transform"
            width="200"
            height="200"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="70"
              stroke="#d1d5db"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              stroke="#facc15"
              strokeWidth="20"
              fill="none"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease 0s" }}
            />
          </svg>
          <div className="absolute text-3xl font-semibold text-[#facc15]">
            {percentage}%
          </div>
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
