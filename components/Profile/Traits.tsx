import React from "react";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import NoDataCard from "@/components/NoDataCard";

interface Trait {
  name: string | null;
  description: string | null;
}

interface TraitsProps {
  title: string;
  traits: Trait[];
  emptyMessage: string;
}

const Traits: React.FC<TraitsProps> = ({ title, traits, emptyMessage }) => (
  <div>
    <div className="mx-auto flex justify-between">
      <h3 className="text-2xl font-medium text-black">{title}</h3>
      <p className="cursor-pointer self-center text-sm text-graySubtitle">
        Show More
      </p>
    </div>
    <div
      className={
        traits.length === 0
          ? "mb-6 mt-3 flex flex-wrap items-center justify-center gap-5 rounded-lg bg-slate-300/20 py-4"
          : "mb-10 mt-5 flex flex-wrap gap-5"
      }
    >
      {traits.length === 0 ? (
        <NoDataCard text={emptyMessage} />
      ) : (
        traits.map((trait, index) => (
          <Tooltip
            message={trait.description ?? "No description available"}
            key={index}
          >
            <Badge text={trait.name ?? "No name"} />
          </Tooltip>
        ))
      )}
    </div>
  </div>
);

export default Traits;
