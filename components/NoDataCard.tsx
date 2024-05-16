import React from "react";
import Image from "next/image";
import NoData from "@/public/NoData.svg";

interface NoDataCardProps {
  text: string;
}

const NoDataCard = ({ text }: NoDataCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={NoData}
        alt="No Data Image"
        className="hidden md:block"
        priority
        height={70}
      />
      <p className="text-center text-sm font-medium text-grayText">{text}</p>
    </div>
  );
};

export default NoDataCard;
