import React from "react";

interface BadgeProps {
  text: string;
}

export default function Badge({ text }: BadgeProps) {
  return (
    <div className="w-fit rounded-xl bg-white px-3 py-2 text-sm drop-shadow-lg">
      <p>{text}</p>
    </div>
  );
}
