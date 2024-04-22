import { signIn } from "@/auth";
import { registerUser } from "@/services/user";
import { AuthError } from "next-auth";
import Link from "next/link";

const Login = () => {
  const registerAction = async (formData: FormData) => {
    "use server";
    const name = formData.get("name")?.toString();
    const jobTitle = formData.get("jobTitle")?.toString();
    const department = formData.get("department")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    registerUser(name, email, password, department, jobTitle);
  };

  return (
    <main className="flex h-dvh w-full items-center justify-center bg-gradient-to-r from-primary to-primary-light">
      <section className="h-5/6 w-[30%] rounded-[20px] bg-bone drop-shadow-md">
        <p className="mx-8 mt-10 text-center text-4xl font-medium leading-normal text-black">
          Register
        </p>
        <form
          action={registerAction}
          className="mx-12 mt-8 flex flex-col justify-center"
        >
          <label className="self-start text-xl text-black">Name</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="text"
            name="name"
            placeholder="Juan Perez"
          />
          <label className="mt-5 self-start text-xl text-black">
            Job Title
          </label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="text"
            name="jobTitle"
            placeholder="Backend Developer"
          />
          <label className="mt-5 self-start text-xl text-black">
            Department
          </label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="text"
            name="department"
            placeholder="IT/Software"
          />
          <label className="mt-5 self-start text-xl text-black">Email</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="email"
            name="email"
            placeholder="mail@gmail.com"
          />
          <label className="mt-5 self-start text-xl text-black">Password</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="password"
            name="password"
            placeholder="********"
          />
          <button
            className="mx-auto my-8 h-12 w-28 rounded-3xl bg-primary text-bone shadow-2xl hover:bg-primary-dark"
            type="submit"
          >
            Register
          </button>
        </form>
        <div className="mx-auto flex justify-center text-sm font-medium">
          <p className="text-black">Already have an account? </p>
          <a
            href="/login"
            className="ms-1 text-primary hover:text-primary-dark"
          >
            Login
          </a>
        </div>
      </section>
    </main>
  );
};

export default Login;
