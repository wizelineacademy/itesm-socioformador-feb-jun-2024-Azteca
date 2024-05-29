"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Combobox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/services/user";
import SearchBar from "./SearchBar";
import UserProfileButton from "./UserProfileButton";

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
      setQuery("");
    } else {
      console.log("Usuario no seleccionado");
    }
  };

  return (
    <div className="relative">
      <Combobox value={null} onChange={handleSelect}>
        <SearchBar
          type="comboboxImput"
          value={query}
          placeholder="Search Co-workers..."
          onChange={(e) => setQuery(e.target.value)}
          expanded={false}
        />
        {/*        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          placeholder="Search Co-workers ..."
          className={`h-10 ${isExpanded ? "w-80" : "w-32"} rounded-full border border-gray-300 bg-white px-4 shadow-lg transition-all duration-300 focus:border-blue-500 focus:outline-none`}
        /> */}
        {query !== "" && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md border border-gray-300 bg-white p-2 shadow-lg empty:hidden">
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
                  className={`flex cursor-default select-none items-center gap-2 rounded-xl px-2 py-1 text-sm text-gray-900 data-[focus]:bg-primary-light data-[focus]:text-white`}
                >
                  <UserProfileButton size="2xs" photoUrl={person?.photoUrl} />
                  <span className="truncate">{person.name}</span>
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
