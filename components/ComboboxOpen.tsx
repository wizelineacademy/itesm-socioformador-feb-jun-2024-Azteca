import { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import Link from "next/link";
import UserProfileButton from "./UserProfileButton";

interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string | null;
  department: string | null;
  photoUrl: string | null;
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

type DataItem = User | Project;

const isUser = (item: DataItem): item is User => {
  return (item as User).email !== undefined;
};

const ComboboxOpen = ({ data }: { data: DataItem[] | undefined }) => {
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [query, setQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!data) {
    return <p>No data available</p>;
  }

  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        );

  if (!isMounted) return null;

  return (
    <Combobox<DataItem | null> value={selectedItem} onChange={setSelectedItem}>
      {({ open }) => (
        <>
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(item: DataItem | null) => (item ? item.name : "")}
            className="mb-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search..."
          />
          <div>
            <Combobox.Options static>
              {filteredData.map((item) => (
                <Combobox.Option key={item.id} value={item}>
                  {({ active, selected }) => (
                    <Link
                      href={
                        isUser(item)
                          ? `/profile/${item.id}`
                          : `/projects/${item.id}`
                      }
                    >
                      <div
                        className={`flex gap-2 px-3 py-2 ${active ? "items-center rounded-lg bg-primary text-white drop-shadow-lg" : ""}`}
                      >
                        {isUser(item) && (
                          <UserProfileButton
                            size="2xs"
                            photoUrl={item.photoUrl || ""}
                          />
                        )}
                        <p>{item.name}</p>
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
