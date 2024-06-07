interface InterfaceProgressBar {
  width: number;
  height: number;
}

const ProgressBar = ({ width, height }: InterfaceProgressBar) => {
  return (
    <div className="w-full rounded-full bg-gray-200 p-1.5">
      <div
        className={`h-${height} rounded-full bg-gradient-to-r from-primary to-secondary transition-all delay-100 ease-linear`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;
