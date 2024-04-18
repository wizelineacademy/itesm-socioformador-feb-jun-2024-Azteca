import Link from "next/link";

export default function Forbbiden() {
  return (
    <div>
      <h2>403 - No Autorizado</h2>
      <p>No cuenta con los permisos para acceder a la página</p>
      <Link href="/profile" className="text-blue-400 hover:underline">
        Regresar a profile
      </Link>
    </div>
  );
}
