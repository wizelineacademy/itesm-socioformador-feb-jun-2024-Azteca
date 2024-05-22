"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Combobox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/services/user";

interface Person {
  id: number;
  name: string;
  profileUrl: string;
  email: string;
  photoUrl: string;
}

const fetchFilteredUsers = async (query: string) => {
  const res = await searchUsers(query); // Llama directamente a la función del backend
  return res;
};

const ComboBoxSearch = () => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const useSearchUsers = (query: string) => {
    return useQuery({
      queryKey: ["search-users", query],
      queryFn: () => fetchFilteredUsers(query),
    });
  };

  const { data: people = [], isLoading } = useSearchUsers(query);

  const handleSelect = (person: Person | null) => {
    if (person) {
      router.push(`/profile/${person.id}`);
      setIsExpanded(false);
    } else {
      console.log("Usuario no seleccionado");
    }
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    // Delay to allow click selection
    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  return (
    <div className="relative">
      <Combobox value={null} onChange={handleSelect}>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search Co-workers ..."
          className={`h-10 ${isExpanded ? "w-80" : "w-32"} rounded-full border border-gray-300 bg-white px-4 shadow-lg transition-all duration-300 focus:border-blue-500 focus:outline-none`}
        />
        {isExpanded && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {isLoading ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Loading...
              </div>
            ) : people.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                No results found.
              </div>
            ) : (
              people.map((person) => (
                <Combobox.Option
                  key={person.id}
                  value={person}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ active }) => (
                    <div className="flex items-center">
                      <span className="block truncate">{person.name}</span>
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        )}
      </Combobox>
    </div>
  );
};

export default ComboBoxSearch;
