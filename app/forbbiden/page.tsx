"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Forbbiden() {
  const pathName = usePathname();
  return (
    <main className="w-dvh flex h-dvh flex-col items-center justify-center">
      <Image
        src={"/FeedbackFlowLogo.png"}
        width={350}
        height={350}
        alt="Logo Feedback Flow"
        className="absolute -bottom-0 -right-0 hidden opacity-60 md:block"
      />
      <section className="relative flex w-full flex-col gap-4 from-primary to-primary-light  px-10 py-20 text-center text-white after:absolute after:inset-0 after:-z-10 after:-skew-y-6 after:bg-gradient-to-r">
        <h2 className="text-3xl font-bold">403 - No Autorizado</h2>
        <p className="text-xl font-semibold">
          No cuenta con los permisos para acceder a la página{" "}
          <code>{pathName}</code>{" "}
        </p>
        <Link
          href="/profile"
          className="text-lg text-white hover:underline focus:underline"
        >
          Regresar a profile
        </Link>
      </section>
    </main>
  );
}
