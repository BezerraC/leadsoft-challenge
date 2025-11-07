"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function CandidateDetailModal({ candidate, onClose, onDeleteComment }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalhes do Candidato</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coluna da Imagem */}
          <div className="space-y-2">
            <img
              src={`http://localhost:3001/api/candidates/${candidate.guid}/photo`}
              alt={`Foto de ${candidate.name}`}
              className="w-full rounded-lg object-cover aspect-square"
            />
            <h3 className="text-lg font-semibold">{candidate.name}</h3>
            <p className="text-sm text-gray-400 italic">"{candidate.legend}"</p>
          </div>

          {/* Coluna de Dados e Comentários */}
          <div className="space-y-4">
            {/* Dados Pessoais */}
            <div>
              <h4 className="font-semibold text-purple-300">Dados Pessoais</h4>
              <ul className="text-sm text-gray-300 space-y-1 mt-2">
                <li>
                  <strong>Email:</strong> {candidate.email}
                </li>
                <li>
                  <strong>CPF:</strong> {candidate.cpf}
                </li>
                <li>
                  <strong>Nasc.:</strong>{" "}
                  {new Date(candidate.birthDate).toLocaleDateString()}
                </li>
              </ul>
            </div>

            {/* Comentários */}
            <div>
              <h4 className="font-semibold text-purple-300">
                Comentários ({candidate.comments.length})
              </h4>
              <ul className="text-sm space-y-2 mt-2 max-h-48 overflow-y-auto pr-2">
                {candidate.comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="bg-gray-700 p-2 rounded flex justify-between items-start"
                  >
                    <div>
                      <strong>{comment.author}:</strong>
                      <p className="text-gray-300">{comment.text}</p>
                    </div>
                    <button
                      onClick={() =>
                        onDeleteComment(candidate.guid, comment.id)
                      }
                      className="text-red-400 text-xs font-bold hover:text-red-300"
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE MODAL DE CONFIRMAÇÃO ---
function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-sm w-full">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">{message}</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-md"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados dos Modais
  const [viewModalCandidate, setViewModalCandidate] = useState(null); // Guarda o objeto do candidato
  const [deleteModalCandidateId, setDeleteModalCandidateId] = useState(null); // Guarda o ID do candidato a deletar

  const router = useRouter();

  // Função para buscar os dados com o token
  const fetchData = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setLoading(true);
      // [CORREÇÃO] Buscar da nova rota de admin segura
      const res = await fetch("http://localhost:3001/api/admin/candidates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Falha ao buscar dados (token inválido?)");
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("token")) {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Busca os dados quando o componente carregar
  useEffect(() => {
    fetchData();
  }, []);

  // --- Funções de Deleção ---

  const handleDeleteCandidate = async () => {
    if (!deleteModalCandidateId) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/candidates/${deleteModalCandidateId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Falha ao deletar candidato");

      setDeleteModalCandidateId(null); // Fecha o modal de confirmação
      await fetchData(); // Recarrega os dados
    } catch (err) {
      alert(err.message); // [NOTA] Substitua por um toast/banner de erro
    }
  };

  const handleDeleteComment = async (candidateGuid, commentId) => {
    // [NOTA] Usando o 'alert' aqui para simplicidade, substitua pelo modal de confirmação
    if (!confirm("Tem certeza que deseja deletar este comentário?")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/candidates/${candidateGuid}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Falha ao deletar comentário");

      // Recarrega os dados para atualizar o modal
      await fetchData();

      // Atualiza o modal que está aberto (gambiarra rápida, idealmente atualize o estado)
      // Como o 'fetchData' atualiza 'candidates', precisamos re-setar o 'viewModalCandidate'
      // Esta parte é complexa, router.refresh() seria melhor se o fetch fosse no servidor
      setViewModalCandidate(null); // Fecha o modal, o admin terá que reabrir (simples)
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <p className="text-white p-8">Carregando dados do dashboard...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  return (
    <main className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Painel Admin</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Legenda</th>
              <th className="p-4 text-left">Comentários</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="p-4">{c.name}</td>
                <td className="p-4 text-gray-400">{c.email}</td>
                <td className="p-4">{c.comments.length}</td>
                <td className="p-4 text-center space-x-4">
                  <button
                    onClick={() => setViewModalCandidate(c)}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => setDeleteModalCandidateId(c.guid)}
                    className="text-red-400 hover:text-red-300 font-semibold"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CandidateDetailModal
        candidate={viewModalCandidate}
        onClose={() => setViewModalCandidate(null)}
        onDeleteComment={handleDeleteComment}
      />

      {deleteModalCandidateId && (
        <ConfirmationModal
          message="Tem certeza que deseja deletar este candidato? Esta ação é irreversível e deletará a foto e todos os comentários."
          onConfirm={handleDeleteCandidate}
          onCancel={() => setDeleteModalCandidateId(null)}
        />
      )}
    </main>
  );
}
