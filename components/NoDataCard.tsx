import React from "react";
import Image from "next/image";

interface NoDataCardProps {
  text: string;
}

const NoDataCard = ({ text }: NoDataCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={"/NoData.svg"}
        alt="No Data Image"
        className="hidden md:block"
        priority
        height={70}
        width={100}
      />
      <p className="text-center text-sm font-medium text-grayText">{text}</p>
    </div>
  );
};

export default NoDataCard;
