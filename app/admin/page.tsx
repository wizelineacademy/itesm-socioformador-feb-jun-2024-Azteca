"use client";
import { getRoles, getUsers, updateRole } from "../services/admin-page";
import { useQuery, useMutation } from "@tanstack/react-query";

const Admin = () => {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  // Mutations
  const { mutate } = useMutation({
    mutationFn: updateRole,
  });

  if (!usersQuery.data || !rolesQuery.data) {
    return <div>loading...</div>;
  }

  return (
    <main className="flex h-full w-full flex-col items-center bg-bone px-7 pb-4">
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
          {usersQuery.data.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <select
                  className="rounded bg-primary/50 px-3 py-1 text-white hover:bg-primary focus:bg-primary"
                  defaultValue={user.role}
                  onChange={(e) => {
                    mutate({ id: user.id, newRole: e.target.value });
                  }}
                >
                  {rolesQuery.data.map((role, index) => (
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
    </main>
  );
};

export default Admin;
