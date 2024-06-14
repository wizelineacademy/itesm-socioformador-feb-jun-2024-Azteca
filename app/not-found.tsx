"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathName = usePathname();
  return (
    <main className="w-dvh flex h-dvh flex-col items-center justify-center">
      <img
        src={"/FeedbackFlowLogo.png"}
        alt="Logo Feedback Flow"
        className="absolute -bottom-0 -right-0 hidden opacity-60 md:block"
      />
      <section className="relative flex w-full flex-col gap-4 from-primary to-primary-light px-10 py-20 text-center text-white after:absolute after:inset-0 after:-z-10 after:-skew-y-6 after:bg-gradient-to-r">
        <h2 className="text-3xl font-bold">404 -Ruta No Encontrada</h2>
        <p className="text-xl font-semibold">
          No se pudo encontrar la ruta <code>{pathName}</code>{" "}
        </p>
        <Link
          href="/dashboard"
          className="text-lg text-white hover:underline focus:underline"
        >
          Regresar a dashboard
        </Link>
      </section>
    </main>
  );
}
