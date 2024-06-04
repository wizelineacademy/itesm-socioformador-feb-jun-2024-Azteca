"use client";
import { registerAction } from "@/actions";
import FormTextInput from "@/components/FormTextInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Register = () => {
  const router = useRouter();
  const clientRegisterAction = async (formData: FormData) => {
    const result = await registerAction(formData);
    if (result) {
      if (result === "UniqueConstraintViolation")
        toast.error("Email already registered.");
      else if (result === "ConnectionError")
        toast.error("Network error. Try again.");
      else if (result === "GeneralError")
        toast.error("There was an error saving the data. Try again.");
    } else {
      toast.success("Account created successfully.");
      router.push("/profile");
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
        <form
          action={clientRegisterAction}
          className="flex flex-col justify-center"
        >
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
