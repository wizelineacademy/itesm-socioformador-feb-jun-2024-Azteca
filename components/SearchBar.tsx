"use client";

import { Combobox } from "@headlessui/react";
import { useEffect, useState, useRef } from "react";

interface SearchBarInterface {
  type?: "comboboxImput" | "searchBar";
  placeholder: string;
  expanded?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({
  placeholder,
  expanded = true,
  onChange,
  value,
  type = "searchBar",
}: SearchBarInterface) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (value === "" && document.activeElement !== inputRef.current) {
      setIsExpanded(false);
    }
  }, [value]);
  if (type === "comboboxImput") {
    return (
      type === "comboboxImput" && (
        <div
          className={`flex items-center overflow-hidden rounded-full bg-white p-2 drop-shadow-lg transition-all duration-500 ${isExpanded ? "w-64" : "w-10 hover:scale-[1.175]"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6 cursor-pointer text-primary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <div
            className={`transform transition-transform duration-700 ${isExpanded ? "-translate-x-0" : "hidden -translate-x-full"}`}
          >
            <Combobox.Input
              ref={inputRef}
              name="search"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="ml-2 h-full w-full rounded-full text-sm text-primary placeholder-primary focus:outline-none"
            />
          </div>
        </div>
      )
    );
  }

  return expanded ? (
    <div className="flex h-10 w-64 items-center rounded-full bg-white drop-shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="ml-5 mr-2 h-6 w-6 text-primary"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        name="search"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoCorrect="off"
        autoComplete="off"
        className=" h-full w-4/6 rounded-full text-sm text-primary placeholder-primary focus:outline-none"
      />
    </div>
  ) : (
    <div
      className={`flex items-center overflow-hidden rounded-full bg-white p-2 drop-shadow-lg transition-all duration-500 ${isExpanded ? "w-64" : "w-10 hover:scale-[1.175]"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6 cursor-pointer text-primary"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <div
        className={`transform transition-transform duration-700 ${isExpanded ? "-translate-x-0" : "hidden -translate-x-full"}`}
      >
        <input
          ref={inputRef}
          name="search"
          autoComplete="off"
          autoCorrect="off"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="ml-2 h-full w-full rounded-full text-sm text-primary placeholder-primary focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
