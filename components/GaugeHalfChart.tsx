interface GaugeFullChartProps {
  percentage: number;
}

const GaugeFullChart = ({ percentage }: GaugeFullChartProps) => {
  const strokeDasharray = Math.PI * 70; // Circunferencia para el radio del círculo SVG
  const strokeDashoffset =
    strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative h-32 w-64">
      <svg width="200" height="100" viewBox="0 0 200 100">
        {/* Fondo del medidor */}
        <path
          d="M 15 100 A 85 85 0 0 1 185 100"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Progreso del medidor */}
        <path
          d="M 15 100 A 85 85 0 0 1 185 100"
          fill="none"
          stroke="#facc15"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.6s ease 0s",
            transformOrigin: "center bottom",
          }}
        />
      </svg>
      {/* Texto del porcentaje centrado en la mitad del semicírculo */}
      <div
        className="absolute flex w-full items-center justify-center"
        style={{ top: "50%", transform: "translateY(-20%) translateX(-10%)" }}
      >
        <span className="text-3xl font-semibold text-[#facc15]">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
export default GaugeFullChart;
