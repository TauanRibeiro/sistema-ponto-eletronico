import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { FaClock, FaChartLine, FaUsers, FaShieldAlt } from "react-icons/fa";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-12 fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 glass-card rounded-full">
                <FaClock className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                Sistema de Ponto Eletrônico
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow">
                Gestão moderna e eficiente do seu tempo de trabalho
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Link
                  href="/login"
                  className="glass-card px-8 py-4 rounded-xl text-lg font-semibold text-gray-800 hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Fazer Login
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Criar Conta
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-in">
              {/* Feature 1 */}
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                  <FaClock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Registro Rápido
                </h3>
                <p className="text-gray-600">
                  Registre entrada e saída com apenas um clique
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                  <FaChartLine className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Relatórios Detalhados
                </h3>
                <p className="text-gray-600">
                  Visualize e exporte relatórios completos
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-400 to-pink-600">
                  <FaUsers className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Gestão de Equipes
                </h3>
                <p className="text-gray-600">
                  Gerencie funcionários e escalas facilmente
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                  <FaShieldAlt className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Seguro e Confiável
                </h3>
                <p className="text-gray-600">
                  Dados protegidos com verificação de localização
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-16 text-white/80">
              <p className="text-sm">Sistema de Ponto Eletrônico © 2024 - Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    redirect("/dashboard");
  }
}

// npx ts-node scripts/create-admin.ts
