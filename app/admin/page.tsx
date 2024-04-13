"use client";
import { useEffect, useState } from "react";
import { getRoles, getUsers, updateRole } from "../services/admin-page";

const Admin = () => {
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getUsers>>>();
  const [roles, setRoles] = useState<Awaited<ReturnType<typeof getRoles>>>();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    };

    fetchData();
  }, []);

  if (!users || !roles) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center">
      <p className="text-4xl font-medium">Dashboard Super Super Admin</p>
      <table className="mt-5 table-auto">
        <thead className="w-full bg-primary/80 text-white">
          <tr className="">
            <th className=" px-4 py-2 first-of-type:rounded-tl-xl">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className=" px-4 py-2 last-of-type:rounded-tr-xl">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <select
                  className="rounded bg-primary/50 px-3 py-1 text-white hover:bg-primary focus:bg-primary"
                  defaultValue={user.role}
                  onChange={(e) => {
                    updateRole(user.id, e.target.value);
                  }}
                >
                  {roles.map((role, index) => (
                    <option key={index} className="bg-indigo-300">
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
