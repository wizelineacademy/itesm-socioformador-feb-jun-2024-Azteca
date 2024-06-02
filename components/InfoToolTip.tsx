import React from "react";
import { Tooltip } from "@mantine/core";
import InfoIcon from "@/components/icons/InfoIcon";

interface InfoToolTipProps {
  description: string;
  size?: "sm" | "md" | "lg";
}

const InfoToolTip = ({ description, size }: InfoToolTipProps) => {
  let tooltipWidth;
  switch (size) {
    case "sm":
      tooltipWidth = 220;
      break;
    case "md":
      tooltipWidth = 280;
      break;
    case "lg":
      tooltipWidth = 360;
      break;
    default:
      tooltipWidth = 280;
  }

  return (
    <div className="absolute right-6 top-6">
      <Tooltip
        label={<span dangerouslySetInnerHTML={{ __html: description }} />}
        position="left-start"
        multiline
        w={tooltipWidth}
        transitionProps={{ duration: 200 }}
        offset={{ mainAxis: -20, crossAxis: 28 }}
        color="gray"
      >
        <button className="group">
          <InfoIcon
            color="text-grayText group-hover:text-black transition-colors duration-200"
            size="h-6 w-6"
          />
        </button>
      </Tooltip>
    </div>
  );
};

export default InfoToolTip;
