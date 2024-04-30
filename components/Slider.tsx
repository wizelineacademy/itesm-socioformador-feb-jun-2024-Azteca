interface SliderProps {
  label: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  name: string;
  value?: number;
}
const Slider = ({ label, className, onChange, name, value }: SliderProps) => {
  return (
    <div className={`flex w-1/2 flex-col ${className}`}>
      <label className="mb-2 mt-4 block text-sm font-light text-black">
        {label}
      </label>
      <input
        type="range"
        step={50}
        min={0}
        max={100}
        name={name}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(e, name)
        }
        className="h-1.5 w-full appearance-none rounded-full bg-primary
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-[0_0_0_1px]
          [&::-webkit-slider-thumb]:shadow-gray-300
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:duration-1000
              [&::-webkit-slider-thumb]:ease-in-out
          [&::-webkit-slider-thumb]:hover:bg-bone
          [&::-webkit-slider-thumb]:active:bg-gray-200
          "
      />
      <div className="mt-3 flex w-full flex-row items-center justify-between px-2">
        <div className="h-4 w-[1.5px] bg-grayText" />
        <div className="h-4 w-[1.5px] bg-grayText" />
        <div className="h-4 w-[1.5px] bg-grayText" />
      </div>

      <div className="flex flex-row items-center justify-between px-2 text-center">
        <p className="text-sm text-graySubtitle">Disagree</p>
        <p className="me-3 text-sm text-graySubtitle">Medium</p>
        <p className="text-sm text-graySubtitle">Agree</p>
      </div>
    </div>
  );
};

export default Slider;
