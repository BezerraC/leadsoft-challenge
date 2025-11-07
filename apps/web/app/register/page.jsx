"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cpf, setCpf] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  // Função para validar a imagem
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === 1080 && img.height === 1080) {
          resolve(true);
        } else {
          reject(
            new Error(
              `Dimensões inválidas: ${img.width}x${img.height}px. A imagem deve ser exatamente 1080x1080px.`
            )
          );
        }
      };
      img.onerror = () => reject(new Error("Arquivo não é uma imagem válida."));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCpfChange = (e) => {
    let value = e.target.value;

    // Remove tudo que não é dígito
    value = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    value = value.slice(0, 11);

    // Aplica a máscara (000.000.000-00)
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");

    // Atualiza o estado
    setCpf(value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const form = event.target;
    const formData = new FormData(form);

    if (!executeRecaptcha) {
      setError(
        "Serviço de reCAPTCHA ainda carregando. Tente novamente em um segundo."
      );
      return;
    }

    try {
      // Valida o formato do CPF
      if (!cpfValidator.isValid(cpf)) {
        throw new Error("O CPF digitado é inválido. Verifique os números.");
      }

      const photoFile = formData.get("photo");
      const token = await executeRecaptcha("adminLogin");

      try {
        await validateImageDimensions(photoFile);
      } catch (validationError) {
        setMessage(validationError.message);
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3001/api/candidates", {
        method: "POST",
        body: formData,
        headers: {
          "x-recaptcha-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar formulário");
      }

      setMessage(`Sucesso! ID: ${data.id}`);
      form.reset();
      setCpf("");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Fundo com gradiente
    <main
      className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-[#05246B] p-4`}
    >
      <div className="max-w-4xl w-full mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden border border-blue-800/50 md:grid md:grid-cols-2">
        {/* Coluna da Imagem */}
        <div className="hidden md:block relative min-h-[600px]">
          <NextImage
            src="/LeadIA.png"
            alt="Agente LeadIA - Missão Marte"
            fill
            className="opacity-90 object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h1 className="font-orbitron text-4xl font-bold text-white shadow-lg">
              MISSÃO MARTE
            </h1>
            <p className="font-roboto text-lg text-blue-200">
              Junte-se à tripulação.
            </p>
          </div>
        </div>

        {/* Coluna do Formulário */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#10D9E8] to-[#1458F5] font-orbitron">
            FORMULÁRIO DE ALISTAMENTO
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-blue-200 font-roboto">
                  Nome de Tripulante
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10D9E8] focus:border-[#10D9E8] sm:text-sm font-roboto-mono"
                  placeholder="Seu Nome"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-blue-200 font-roboto">
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10D9E8] focus:border-[#10D9E8] sm:text-sm font-roboto-mono"
                  placeholder="voce@dominio.com"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-blue-200 font-roboto">
                  Identificação (CPF)
                </label>
                <input
                  name="cpf"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10D9E8] focus:border-[#10D9E8] sm:text-sm font-roboto-mono"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-blue-200 font-roboto">
                  Data de Nascimento
                </label>
                <input
                  name="birthDate"
                  type="date"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10D9E8] focus:border-[#10D9E8] sm:text-sm font-roboto-mono"
                />
              </div>

              {/* Legenda */}
              <div>
                <label className="block text-sm font-medium text-blue-200 font-roboto">
                  Legenda Criativa
                </label>
                <textarea
                  name="legend"
                  rows={2}
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#10D9E8] focus:border-[#10D9E8] sm:text-sm font-roboto-mono"
                  placeholder="Por que você deve ir a Marte?"
                />
              </div>

              {/* Foto 1080x1080 */}
              <div>
                <label className="block text-sm font-medium text-blue-200 font-roboto">
                  Foto de Perfil (Traje Espacial - 1080x1080)
                </label>
                <input
                  name="photo"
                  type="file"
                  accept="image/png, image/jpeg"
                  required
                  className="mt-1 block w-full text-sm text-gray-400 font-roboto-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900 file:text-cyan-300 hover:file:bg-blue-800 transition-colors"
                />
              </div>
            </div>

            {/* Botão de Envio */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm rounded-full text-white ${
                  isLoading
                    ? "bg-gray-600"
                    : "bg-gradient-to-r from-[#1458F5] to-[#10D9E8] hover:from-[#10D9E8] hover:to-[#1458F5]"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10D9E8] focus:ring-offset-gray-900 transition-all duration-300 font-orbitron uppercase tracking-wider`}
              >
                {isLoading ? "Processando..." : "Enviar Candidatura"}
              </button>
            </div>

            {/* Mensagens de Status */}
            {message && (
              <div
                className={`p-4 rounded-md text-center font-roboto ${
                  message.startsWith("Sucesso")
                    ? "bg-green-900 border border-green-700 text-green-300"
                    : "bg-red-900 border border-red-700 text-red-300"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
