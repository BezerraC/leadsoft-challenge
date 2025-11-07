"use client";

export function CandidateDetailModal({ candidate, onClose, onDeleteComment }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-10 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900/90 rounded-2xl shadow-2xl shadow-cyan-500/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-900/30">
        <div className="p-4 border-b border-blue-900/30 flex justify-between items-center sticky top-0 bg-gray-900/90 backdrop-blur-sm z-10">
          <h2 className="font-orbitron text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Detalhes do Candidato
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-cyan-400 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da Imagem */}
          <div className="space-y-3">
            <div className="aspect-square relative">
              <img
                src={`http://localhost:3001/api/candidates/${candidate.guid}/photo`}
                alt={`Foto de ${candidate.name}`}
                fill="true"
                className="w-full rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h3 className="font-orbitron text-2xl font-bold text-white">
              {candidate.name}
            </h3>
            <p className="text-lg text-gray-300 italic font-roboto">
              "{candidate.legend}"
            </p>
          </div>

          {/* Coluna de Dados e Comentários */}
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <div>
              <h4 className="font-roboto-mono text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                // Dados Pessoais
              </h4>
              <ul className="text-sm text-gray-300 space-y-1 mt-3 font-roboto-mono">
                <li>
                  <strong className="text-gray-400">Email:</strong>{" "}
                  {candidate.email}
                </li>
                <li>
                  <strong className="text-gray-400">CPF:</strong>{" "}
                  {candidate.cpf?.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    "$1.$2.$3-$4"
                  )}
                </li>
                <li>
                  <strong className="text-gray-400">Nasc.:</strong>{" "}
                  {new Date(candidate.birthDate).toLocaleDateString()}
                </li>
              </ul>
            </div>

            {/* Comentários */}
            <div>
              <h4 className="font-roboto-mono text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                // Log de Comentários ({candidate.comments.length})
              </h4>
              <ul className="text-sm space-y-2 mt-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-800 hover:scrollbar-thumb-cyan-300">
                {candidate.comments.length === 0 ? (
                  <p className="text-gray-500 font-roboto-mono italic text-xs">
                    // Sem registros.
                  </p>
                ) : (
                  candidate.comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="bg-gray-800 p-3 rounded-md border border-gray-700 flex justify-between items-start"
                    >
                      <div>
                        <strong className="text-cyan-400 font-roboto-mono">
                          {comment.author}:
                        </strong>
                        <p className="text-gray-300 font-roboto">
                          {comment.text}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          onDeleteComment(candidate.guid, comment.id)
                        }
                        className="text-red-500 hover:text-red-400 font-mono text-xl font-bold"
                      >
                        &times;
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
