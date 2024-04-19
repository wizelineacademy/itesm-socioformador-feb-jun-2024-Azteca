import Slider from "../Slider";

const SprintStepOne = () => {
  return (
    <div className="mt-9 grid grid-flow-row grid-cols-2 gap-x-20 gap-y-16">
      <Slider
        className="w-full"
        label="Did you have enough resources to complete your activities?"
      />
      <Slider
        className="w-full"
        label="Do you agree with the responsibilities you were assigned with?"
      />
      <Slider
        className="w-full"
        label="Did you receive support from your manager regarding technical and/or emotional matters?"
      />
      <Slider
        className="w-full"
        label="Was the workload and initial project expectations fair according to the deadlines?"
      />
    </div>
  );
};

export default SprintStepOne;
