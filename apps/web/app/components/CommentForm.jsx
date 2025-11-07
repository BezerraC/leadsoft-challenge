"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "./FormInput";
import { Button } from "./Button";

export function CommentForm({ candidateId }) {
  const [author, setAuthor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastCommentAuthor") || "";
    }
    return "";
  });
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!author || !text) {
      setError("Nome e comentário são obrigatórios.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/candidates/${candidateId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author, text }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao enviar comentário");
      }

      // Salva o nome do autor para a próxima vez
      localStorage.setItem("lastCommentAuthor", author);
      setText("");

      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 space-y-3 bg-gray-900 border-t border-blue-900/30"
    >
      <h4 className="text-sm font-semibold text-gray-300 font-roboto-mono">
        Deixar um comentário
      </h4>
      <FormInput
        label="Seu nome"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Seu nome"
        labelClassName="sr-only" 
      />
      <FormInput
        label="Sua mensagem"
        as="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Sua mensagem..."
        rows={2}
        labelClassName="sr-only"
      />

      <Button
        variant="secondary"
        className="w-full"
      >
        Enviar
      </Button>
      {error && <p className="text-red-400 text-xs font-roboto-mono">{error}</p>}
    </form>
  );
}
