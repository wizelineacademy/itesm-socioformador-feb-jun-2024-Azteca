import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-gradient-to-r from-primary to-primary-light">
      <SignUp
        redirectUrl="/profile"
        appearance={{
          variables: {
            colorPrimary: "#6640D5",
          },
        }}
      />
    </div>
  );
}
