"use client";
import React, { useState, useEffect } from "react";

let gradientIdCounter = 0; // Contador estático fuera del componente

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
  const [gradientId, setGradientId] = useState(
    `gradient${gradientIdCounter++}`,
  );

  const radius = 85;
  const strokeWidth = 20;
  const viewBoxHalf = "0 0 200 100";
  const viewBoxFull = "0 0 200 200";
  const circumference = Math.PI * (radius * 2);
  const halfCircumference = Math.PI * radius;
  const strokeDasharray = type === "full" ? circumference : halfCircumference;
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * percentage) / 100;

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
            <stop offset="0%" stop-color={gradient.start} />
            <stop offset="100%" stop-color={gradient.end} />
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
        />
        <text
          x="100" // Centered in X axis
          y={type === "full" ? "110" : "90"} // Adjust y position depending on type
          text-anchor="middle" // Align text in the center horizontally
          fill={`url(#${gradientId})`} // Apply gradient using dynamic ID
          font-size="32"
          font-weight="bold"
          font-family="inherit"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

export default GaugeChart;
