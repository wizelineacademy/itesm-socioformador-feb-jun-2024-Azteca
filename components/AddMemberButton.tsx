import React from "react";
import PlusIcon from "./icons/PlusIcon";

const AddMemberButton = () => {
  return (
    <button className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-dashed border-grayText bg-white">
      <PlusIcon size="h-10 w-10" color="text-primary" />
    </button>
  );
};

export default AddMemberButton;
