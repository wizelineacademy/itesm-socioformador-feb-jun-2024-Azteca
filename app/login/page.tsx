import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import Link from "next/link";

const Login = () => {
  const loginAction = async (formData: FormData) => {
    "use server";
    try {
      await signIn("credentials", formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return "Invalid credentials.";
          default:
            return "Something went wrong.";
        }
      }
      throw error;
    }
  };

  return (
    <main className="flex h-dvh w-full items-center justify-center bg-gradient-to-r from-primary to-primary-light">
      <section className="h-5/6 w-[30%] rounded-[20px] bg-bone drop-shadow-md">
        <p className="mx-8 mt-10 text-center text-4xl font-medium leading-normal text-black">
          Welcome to Feedback Flow
        </p>
        <form
          className="mx-12 mt-8 flex flex-col justify-center"
          action={loginAction}
        >
          <label className="self-start text-xl text-black">Email</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="email"
            name="email"
            placeholder="mail@gmail.com"
          />
          <label className="mt-5 self-start text-xl text-black">Password</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            name="password"
            type="password"
            placeholder="********"
          />
          {/* Find a darker color for hover */}
          <button
            className="mx-auto my-8 h-12 w-28 rounded-3xl bg-primary text-bone shadow-2xl hover:bg-primary-dark"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mx-auto flex justify-center text-sm font-medium">
          <p className="text-black">Don&apos;t have an account? </p>
          <Link
            href="/register"
            className="ms-1 text-primary hover:text-primary-dark"
          >
            Register
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
