"use client";
import { useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([
    {
      name: "Pedro Alonso",
      email: "pedroben123@gmail.com",
      role: "SuperAdmin",
    },
    { name: "Jose Sanchez", email: "josewwe@gmail.com", role: "Admin" },
    {
      name: "Adrian Ramirez",
      email: "adrianperfumes@icloud.com",
      role: "User",
    },
    {
      name: "Eduardo de Valle",
      email: "lalolavieja@hotmail.com",
      role: "Admin",
    },
  ]);

  const updateRole = (index: number, role: string) => {
    const newUsers = [...users];
    newUsers[index].role = role;
    setUsers(newUsers);
  };

  const roles = [
    { name: "SuperAdmin", value: "SuperAdmin" },
    { name: "Admin", value: "Admin" },
    { name: "User", value: "User" },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center">
      <p className="text-4xl font-medium">Dashboard Super Admin</p>
      <table className="mt-5 table-auto">
        <thead className="w-full bg-primary/80 text-white">
          <tr className="">
            <th className=" px-4 py-2 first-of-type:rounded-tl-xl">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className=" px-4 py-2 last-of-type:rounded-tr-xl">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <select
                  className="rounded bg-primary/50 px-3 py-1 text-white hover:bg-primary focus:bg-primary"
                  value={user.role}
                  onChange={(e) => updateRole(index, e.target.value)}
                >
                  {roles.map((role, index) => (
                    <option
                      key={index}
                      value={role.value}
                      className={` bg-indigo-300`}
                    >
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
