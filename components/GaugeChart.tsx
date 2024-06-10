"use client";
import React, { useState, useEffect } from "react";

let gradientIdCounter = 0;

interface GradientColor {
  start: string;
  end: string;
}

interface GaugeChartProps {
  percentage: number;
  type: string;
  gradient: GradientColor;
}

const GaugeChart = ({ percentage, type, gradient }: GaugeChartProps) => {
  const [gradientId] = useState(`gradient${gradientIdCounter++}`);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    setAnimatedPercentage(percentage);
  }, [percentage]);

  const radius = 85;
  const strokeWidth = 20;
  const viewBoxHalf = "0 0 200 100";
  const viewBoxFull = "0 0 200 200";
  const circumference = Math.PI * (radius * 2);
  const halfCircumference = Math.PI * radius;
  const strokeDasharray = type === "full" ? circumference : halfCircumference;
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * animatedPercentage) / 100;

  return (
    <div className="relative">
      <svg
        width="200"
        height={type === "full" ? "200" : "100"}
        viewBox={type === "full" ? viewBoxFull : viewBoxHalf}
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientTransform={type === "full" ? "rotate(90)" : ""}
          >
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>
        </defs>
        {type === "half" && (
          <path
            d="M 15 100 A 85 85 0 0 1 185 100"
            fill="none"
            stroke="#d1d5db"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
        {type === "full" && (
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
        <path
          d={
            type === "full"
              ? "M 100,15 A 85,85 0 1 1 100,185 A 85,85 0 1 1 100,15"
              : "M 15 100 A 85 85 0 0 1 185 100"
          }
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
        <text
          x="100"
          y={type === "full" ? "110" : "90"}
          textAnchor="middle"
          fill={`url(#${gradientId})`}
          fontSize="32"
          fontWeight="bold"
          fontFamily="inherit"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

export default GaugeChart;
