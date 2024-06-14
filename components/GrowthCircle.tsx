import React, { useState } from "react";

let gradientIdCounter = 100; // Static counter outside the component

interface GradientColor {
  start: string;
  end: string;
}

interface GrowthCircleProps {
  percentage: number; // Expected to be between 0 and 100
  gradient: GradientColor;
  minSize?: number; // Optional minimum size
  maxSize?: number; // Optional maximum size
}

const GrowthCircle = ({
  percentage,
  gradient,
  minSize = 50,
  maxSize = 150,
}: GrowthCircleProps) => {
  const [gradientId] = useState(`gradient${gradientIdCounter++}`);

  // Calculate the radius based on percentage and ensure it is between minSize/2 and maxSize/2
  const radius = (maxSize / 2 - minSize / 2) * (percentage / 100) + minSize / 2;
  const size = radius * 2;
  // Calculate the font size as 40% of the radius
  const fontSize = radius * 0.4;

  return (
    <svg
      data-testid="growth-circle-svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="40%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={gradient.start} />
          <stop offset="100%" stopColor={gradient.end} />
        </linearGradient>
      </defs>
      <circle
        data-testid="growth-circle"
        cx={radius}
        cy={radius}
        r={radius}
        fill={`url(#${gradientId})`}
      />
      <text
        x="50%"
        y="50%"
        fill="white"
        fontSize={fontSize} // Dynamic font size
        fontWeight="bold"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{ cursor: "default" }}
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default GrowthCircle;
