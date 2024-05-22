interface InterfacePipTask {
  title: string | null;
  description: string | null;
  isDone: boolean | null;
  handleCheck: () => void;
}

const PipTask = ({
  title,
  description,
  isDone,
  handleCheck,
}: InterfacePipTask) => {
  return (
    <div className="box-border h-48 w-52 shrink-0 rounded-xl bg-white px-2 py-9 shadow-lg">
      <header className="flex items-center">
        <p className="text-md text-wrap font-semibold">{title}</p>
        <div className="ml-auto inline-flex items-center">
          <label className="relative flex cursor-pointer items-center">
            <input
              type="checkbox"
              onChange={handleCheck}
              className="h-6 w-6 transform cursor-pointer appearance-none rounded-full border border-primary border-primary/80 bg-primary-light/20 outline-primary transition-all duration-200 ease-in-out checked:bg-primary hover:scale-110"
              checked={isDone || false} // default to false if isDone is null
            />
            <span className="sr-only">Check Pip Task</span>
          </label>
        </div>
      </header>
      <p className="font-regular mt-2 text-ellipsis text-wrap text-xs text-[#9E9E9E]">
        {description}
      </p>
    </div>
  );
};

export default PipTask;
