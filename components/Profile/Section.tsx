import React from "react";

interface SectionProps {
  title: string;
  showMore: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, showMore, children }) => (
  <div className="mb-6">
    <div className="mx-auto flex justify-between">
      <h3 className="text-2xl font-medium text-black">{title}</h3>
      {showMore && (
        <p className="cursor-pointer self-center text-sm text-graySubtitle">
          Show More
        </p>
      )}
    </div>
    <div className="mt-2">{children}</div>
  </div>
);

export default Section;
