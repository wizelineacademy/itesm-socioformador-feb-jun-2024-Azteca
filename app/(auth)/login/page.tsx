"use client";
import { useEffect, useState } from "react";
import { loginAction } from "@/actions";
import FormTextInput from "@/components/FormTextInput";
import Link from "next/link";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const clientLoginAction = async (formData: FormData) => {
    const result = await loginAction(formData);
    if (result) {
      switch (result) {
        case "Invalid credentials.":
          setError("Email or password is not valid.");
          break;
        default:
          setError("Something went wrong. Try again.");
          break;
      }
    }
  };

  return (
    <main className="flex h-dvh items-center justify-center bg-gradient-to-r from-primary to-primary-light">
      <section className="flex h-fit w-[33%] flex-col justify-center divide-y divide-gray-500 rounded-[20px] bg-bone px-16 py-8 drop-shadow-md">
        <div className="flex w-full flex-col items-center justify-start gap-y-4 pb-8">
          <p className="mb-4 mt-6 text-center text-3xl font-semibold leading-normal text-black">
            Log in to Feedback Flow
          </p>
          <button className=" group flex w-7/12 flex-row rounded-full border border-primary-light px-4 py-2 transition-all duration-200 hover:bg-primary-dark">
            <i className="fi fi-brands-slack text-lg leading-[0px] text-primary-light group-hover:text-white" />
            <p className="mx-auto text-sm font-medium text-black group-hover:text-white">
              Continue with Slack
            </p>
          </button>
          <button className=" group flex w-7/12 flex-row rounded-full border border-primary-light px-4 py-2 transition-all duration-200 hover:bg-primary-dark">
            <i className="fi fi-brands-google text-lg leading-[0px] text-primary-light group-hover:text-white" />
            <p className="mx-auto text-sm font-medium text-black group-hover:text-white">
              Continue with Google
            </p>
          </button>
        </div>
        <div className="flex w-full flex-col items-center justify-center pb-6">
          <form
            action={clientLoginAction}
            className="flex w-full flex-col justify-center"
          >
            <FormTextInput name="email" type="email" label="Email" />
            <FormTextInput name="password" type="password" label="Password" />
            <label
              id="error"
              className="pt-1.5 text-sm font-medium text-red-600"
            >
              {error}
            </label>
            <button
              className="mx-auto mb-4 mt-12 h-10 w-28 rounded-2xl bg-primary font-medium text-bone shadow-2xl hover:bg-primary-dark"
              type="submit"
            >
              Log in
            </button>
          </form>
          <button className="text-dark border-primary-dark text-sm hover:text-primary-dark hover:underline focus:text-primary-dark focus:underline">
            Forgot your password?
          </button>
        </div>
        <div className="mx-auto mb-6 flex w-full justify-center pt-6 text-sm font-medium">
          <p className="text-black">Don&apos;t have an account? </p>
          <Link
            href="/register"
            className="ms-1 cursor-pointer text-primary hover:text-primary-dark hover:underline focus:text-primary-dark focus:underline"
          >
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
