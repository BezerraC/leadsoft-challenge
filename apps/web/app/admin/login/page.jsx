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
      setError("Serviço de reCAPTCHA ainda carregando. Tente novamente em um segundo.");
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
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-gray-800 rounded-lg shadow-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Login Admin
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="w-full py-2 bg-purple-600 rounded font-bold"
        >
          Entrar
        </button>
        {error && <p className="text-red-400 text-center">{error}</p>}
      </form>
    </main>
  );
}