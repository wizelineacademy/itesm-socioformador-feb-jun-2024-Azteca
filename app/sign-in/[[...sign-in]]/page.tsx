import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-gradient-to-r from-primary to-primary-light">
      <SignIn redirectUrl="/" />
    </div>
  );
}
