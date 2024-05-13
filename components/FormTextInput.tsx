interface FormTextInputProps {
  name: string;
  type: string;
  label: string;
}

const FormTextInput = ({ name, type, label }: FormTextInputProps) => {
  const toggleInput = () => {
    if (type !== "password") return;
    const input = document.getElementById("password");
    const newType =
      input?.getAttribute("type") === "text" ? "password" : "text";
    input?.setAttribute("type", newType);
  };

  return (
    <div className="relative mt-6 flex w-full flex-col">
      <input
        autoComplete={type === "email" || name === "name" ? "on" : "off"}
        id={name}
        name={name}
        type={type}
        className=" text-md peer h-10 w-full border-b-2 border-primary-light bg-bone pt-3 text-gray-900 placeholder-transparent focus:outline-none"
        placeholder=""
        required
      />
      <label
        htmlFor={name}
        className="absolute -top-2 left-0 flex cursor-text flex-row items-center justify-between text-sm text-primary-dark transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500"
      >
        {label}
      </label>
      {type === "password" && (
        <button
          onClick={toggleInput}
          type="button"
          className="absolute -right-0.5 top-3.5 cursor-pointer text-primary hover:text-primary-dark focus:text-primary-dark"
        >
          Show
        </button>
      )}
    </div>
  );
};

export default FormTextInput;
