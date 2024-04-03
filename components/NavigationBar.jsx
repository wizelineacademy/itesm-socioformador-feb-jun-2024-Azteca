"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const NavigationBar = () => {
  const pathname = usePathname();

  // si estamos en el login o register no mostramos la navbar
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="flex items-center justify-between bg-white p-4 ">
      <h1 className="text-3xl font-bold text-primary">FEEDBACK FLOW</h1>
      <UserButton afterSignOutUrl="/sign-in" />
      <div>
        <a className="mx-2" href="/login">
          Login
        </a>
        <a className="mx-2" href="/register">
          Register
        </a>
      </div>
    </nav>
  );
};
export default NavigationBar;
