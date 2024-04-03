"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const Login = () => {
  const router = useRouter();
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <main className="flex h-dvh w-full items-center justify-center bg-gradient-to-r from-primary to-primary-light">
      <section className="h-5/6 w-[30%] rounded-[20px] bg-bone drop-shadow-md">
        <p className="mx-8 mt-10 text-center text-4xl font-medium leading-normal text-black">
          Welcome to Feedback Flow
        </p>
        <Image
          className="mx-auto my-8 h-12 w-20 rounded-lg border border-black px-3 hover:bg-gray-300"
          src="/slack.svg"
          alt="slack-logo"
          width={65}
          height={20}
        />
        <div className="mx-12 flex items-center justify-center">
          <div className="flex-grow border-t border-black" />
          <span className="mx-4 text-sm text-black">OR</span>
          <div className="flex-grow border-t border-black" />
        </div>
        <form
          className="mx-12 mt-8 flex flex-col justify-center"
          onSubmit={(e) => handleLogin(e)}
        >
          <label className="self-start text-xl text-black">Email</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
            type="email"
            placeholder="mail@gmail.com"
          />
          <label className="mt-5 self-start text-xl text-black">Password</label>
          <input
            className="text-md mt-2 h-12 w-full rounded-2xl border border-black bg-bone px-2 text-black"
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
          <a
            href="/register"
            className="ms-1 text-primary hover:text-primary-dark"
          >
            Register
          </a>
        </div>
      </section>
    </main>
  );
};

export default Login;
