interface ChevronRightIconInterface {
  color: string;
  size: string;
}

const ChevronRightIcon = ({ color, size }: ChevronRightIconInterface) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke={`${color}`}
      className={`${size}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export default ChevronRightIcon;
