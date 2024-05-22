// components/ComboboxOpen.tsx
import { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import Link from "next/link";
import UserProfileButton from "./UserProfileButton";

interface Person {
  id: number;
  name: string;
  url: string;
}

const people: Person[] = [
  { id: 1, name: "Durward Reynolds", url: "/profile/1" },
  { id: 2, name: "Kenton Towne", url: "/profile/2" },
  { id: 3, name: "Therese Wunsch", url: "/profile/3" },
  { id: 4, name: "Benedict Kessler", url: "/profile/4" },
  { id: 5, name: "Katelyn Rohan", url: "/profile/5" },
];

const ComboboxOpen = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        );

  if (!isMounted) return null;

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      {({ open }) => (
        <>
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(person: Person) => person?.name || ""}
            className="mb-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search for a person"
          />
          <div>
            <Combobox.Options static>
              {filteredPeople.map((person) => (
                <Combobox.Option key={person.id} value={person}>
                  {({ active, selected }) => (
                    <Link href={`/profile/${person.id}`}>
                      <div
                        className={`flex gap-2 px-3 py-2 ${active ? "items-center rounded-lg bg-primary text-white drop-shadow-lg" : ""}`}
                      >
                        <UserProfileButton
                          size="2xs"
                          photoUrl={person.url || ""}
                        />
                        <p>{person.name}</p>
                      </div>
                    </Link>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </>
      )}
    </Combobox>
  );
};

export default ComboboxOpen;
