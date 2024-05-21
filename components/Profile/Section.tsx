"use client";
import React, { useState } from "react";
import DialogComponent from "../DialogComponent";

interface SectionProps {
  title: string;
  showMore: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, showMore, children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="mb-6">
      <div className="mx-auto flex justify-between">
        <h3 className="text-2xl font-medium text-black">{title}</h3>
        {showMore && (
          <button
            className="cursor-pointer self-center text-sm text-graySubtitle"
            onClick={openDialog}
          >
            Show More
          </button>
        )}
      </div>
      <div className="mt-2">{children}</div>

      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="More Information"
        description="Here is some more information about this section."
      >
        <p>This is additional information that is revealed in the dialog.</p>
      </DialogComponent>
    </div>
  );
};

export default Section;
