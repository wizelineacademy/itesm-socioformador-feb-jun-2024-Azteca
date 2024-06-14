import React from "react";

interface NoDataCardProps {
  text: string;
}

const NoDataCard = ({ text }: NoDataCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={"/NoData.svg"}
        alt="NoDataSVG"
        className="hidden md:block"
        height={70}
        width={100}
      />
      <p className="text-center text-sm font-medium text-grayText">{text}</p>
    </div>
  );
};

export default NoDataCard;
