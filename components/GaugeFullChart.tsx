interface GaugeFullChartProps {
  percentage: number;
}

const GaugeFullChart = ({ percentage }: GaugeFullChartProps) => {
  const strokeDasharray = Math.PI * 70; // Circunferencia para el radio del círculo SVG
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="flex h-64 w-64 items-center justify-center">
      <svg
        className="-rotate-90 transform"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="#d1d5db"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="#facc15"
          strokeWidth="20"
          fill="none"
          strokeDasharray="440"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease 0s" }}
        />
      </svg>
      <div className="absolute text-3xl font-semibold text-[#facc15]">
        {percentage}%
      </div>
    </div>
  );
};
export default GaugeFullChart;
