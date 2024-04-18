import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>404 - No Encontrado</h2>
      <p>No se pudo encontrar la pagina</p>
      <Link href="/profile" className="text-blue-400 hover:underline">
        Regresar a profile
      </Link>
    </div>
  );
}
