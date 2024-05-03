"use server";
import { signIn } from "@/auth";
import FormTextInput from "@/components/FormTextInput";
import { registerUser } from "@/services/user";
import { AuthError } from "next-auth";
import Link from "next/link";

const Register = () => {
  const registerAction = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const jobTitle = formData.get("jobTitle")?.toString();
    const department = formData.get("department")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    await registerUser(name, email, password, department, jobTitle);
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
    <div className="flex h-dvh items-center justify-center bg-gradient-to-r from-primary to-primary-light">
      <section className="flex h-fit w-[33%] flex-col justify-center rounded-[20px] bg-bone px-10 py-8 drop-shadow-md ">
        <p className="mt-6 text-center text-3xl font-semibold leading-normal text-black">
          Sign Up
        </p>
        <p className="mb-4 text-center text-xl">
          Start getting smart feedback today!
        </p>
        <form action={registerAction} className="flex flex-col justify-center">
          <FormTextInput name="name" type="text" label="Name" />
          <FormTextInput name="email" type="email" label="Email" />
          <FormTextInput name="password" type="password" label="Password" />
          <FormTextInput name="jobTitle" type="text" label="Job Title" />
          <FormTextInput name="department" type="text" label="Department" />

          <button
            className="mx-auto mb-2 mt-12 h-10 w-28 rounded-2xl bg-primary text-bone shadow-2xl hover:bg-primary-dark"
            type="submit"
          >
            Register
          </button>
        </form>
        <div className="mx-auto mb-6 flex justify-center text-sm font-medium">
          <p className="text-black">Already have an account? </p>
          <Link
            href="/login"
            className="ms-1 cursor-pointer text-primary hover:text-primary-dark hover:underline focus:text-primary-dark focus:underline"
          >
            Log in
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Register;
