import { DndContext, pointerWithin } from "@dnd-kit/core";
import { RenderOptions, render } from "@testing-library/react";
import React, { ReactElement } from "react";

const DndProvider = ({
  children,
  onDragEndMock,
}: {
  children: React.ReactNode;
  onDragEndMock: () => void;
}) => {
  return (
    <DndContext onDragEnd={onDragEndMock} collisionDetection={pointerWithin}>
      {children}
    </DndContext>
  );
};

export const customDndProvider = (
  ui: ReactElement,
  onDragEndMock: () => void,
  options?: Omit<RenderOptions, "wrapper">,
) =>
  render(ui, {
    wrapper: (props) => (
      <DndProvider {...props} onDragEndMock={onDragEndMock} />
    ),
    ...options,
  });

export * from "@testing-library/react";
