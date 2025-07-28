import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Bem-vindo ao Sistema de Ponto Eletrônico
          </h2>
          <p className="text-center text-sm text-gray-600">
            Faça login ou registre-se para continuar
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Registrar
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    redirect("/dashboard");
  }
}

// npx ts-node scripts/create-admin.ts
