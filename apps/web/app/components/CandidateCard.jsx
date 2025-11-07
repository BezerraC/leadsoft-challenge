"use client";

import { useState } from "react";
import { CommentForm } from "./CommentForm";

export function CandidateCard({ candidate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl shadow-blue-500/10 border border-blue-900/30 flex flex-col overflow-hidden break-inside-avoid">
      {/* Imagem */}
      <div className="aspect-square relative border-b border-blue-900/30">
        <img
          src={`http://localhost:3001/api/candidates/${candidate.id}/photo`}
          alt={`Foto de ${candidate.name}`}
          className="object-cover w-full h-full rounded-t-xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Legenda */}
      <div className="p-5">
        <h3 className="font-orbitron font-bold text-xl text-white truncate">
          {candidate.name}
        </h3>
        <p className="font-roboto text-gray-300 text-sm mt-2 italic font-sans h-10">
          "{candidate.legend}"
        </p>
      </div>

      {/* Gatilho */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 flex justify-between items-center w-full text-left border-t border-blue-900/30 hover:bg-gray-800/50 transition-colors focus:outline-none rounded-b-xl"
      >
        <h4 className="font-roboto-mono text-sm font-semibold text-cyan-300">
          // LOG DE COMENTÁRIOS ({candidate.comments.length})
        </h4>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          {/* ícone de chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-right text-cyan-400"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </span>
      </button>

      {/*  O Conteúdo Colapsável */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        {/* Lista de Comentários */}
        <div className="px-5 pt-4 pb-2 space-y-3 flex-1">
          {candidate.comments.length === 0 ? (
            <p className="text-sm text-gray-500 italic font-roboto-mono">
              // Nenhum comentário no log...
            </p>
          ) : (
            <ul className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin  scrollbar-thumb-cyan-400  scrollbar-track-gray-800  hover:scrollbar-thumb-cyan-300">
              {candidate.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="text-sm p-3 bg-gray-800 rounded-md border border-gray-700"
                >
                  <strong className="text-cyan-400 font-roboto-mono">
                    {comment.author}:
                  </strong>
                  <p className="text-gray-300 font-roboto">{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulário para Comentários */}
        <CommentForm candidateId={candidate.id} />
      </div>
    </div>
  );
}
