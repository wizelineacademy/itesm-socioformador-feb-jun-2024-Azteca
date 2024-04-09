import React from "react";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
}

export default function Tooltip({ message, children }: TooltipProps) {
  return (
    <div className="group relative flex max-w-max flex-col items-center justify-center">
      {children}
      <div className="absolute bottom-7 left-1/2 z-10 ml-auto mr-auto min-w-max -translate-x-1/2 rotate-180 scale-0 transform rounded-xl px-3 py-2 text-xs font-medium transition-all duration-500 group-hover:scale-100">
        <div className="flex max-w-xs flex-col items-center shadow-lg">
          <div className="clip-bottom h-2 w-4 bg-primary/90"></div>
          <div className="w-[25ch] rotate-180 rounded bg-primary/90 p-2 text-center text-xs text-white">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
