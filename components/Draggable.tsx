import { Coworker } from "@/types/types";
import { useDraggable } from "@dnd-kit/core";
import { useEffect } from "react";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  data: Coworker;
  setIsDragging?: (isDragging: boolean) => void;
}

const Draggable = ({
  id,
  children,
  className,
  data,
  setIsDragging,
}: DraggableProps) => {
  const { attributes, transform, setNodeRef, listeners, isDragging } =
    useDraggable({
      id: id,
      data: data,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  useEffect(() => {
    setIsDragging && setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={className}
      data-testid={`draggable-${data.userId}`}
    >
      {children}
    </div>
  );
};

export default Draggable;
