"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!executeRecaptcha) {
      setError(
        "Serviço de reCAPTCHA ainda carregando. Tente novamente em um segundo."
      );
      return;
    }

    try {
      const token = await executeRecaptcha("adminLogin");

      const res = await fetch("http://localhost:3001/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-recaptcha-token": token,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("admin_token", data.token);

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Falha no login");
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 p-4`}
    >
      {/* Card de Vidro (Glassmorphism) */}
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden border border-blue-900/30">
        {/* Imagem da LeadIA no topo */}


        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="font-orbitron text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 text-center">
            ACESSO RESTRITO
          </h2>

          {/* Input de Email */}
          <div>
            <label className="block text-sm font-medium text-blue-200 font-mono">
              Usuário
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email de admin"
              className="font-mono mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
            />
          </div>

          {/* Input de Senha */}
          <div>
            <label className="block text-sm font-medium text-blue-200 font-mono">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="font-mono mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
            />
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            className="font-orbitron uppercase tracking-wider w-full py-3 px-4 border border-transparent text-sm rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-cyan-400 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900 transition-all duration-300"
          >
            Autenticar
          </button>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 rounded-md bg-red-900 border border-red-700 text-center">
              <p className="text-red-300 text-sm font-roboto-mono">{error}</p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
