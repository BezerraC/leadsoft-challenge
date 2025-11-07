"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateDetailModal } from "../../components/CandidateDetailModal";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export default function DashboardPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewModalCandidate, setViewModalCandidate] = useState(null);
  const [deleteModalCandidateId, setDeleteModalCandidateId] = useState(null);
  const [deleteCommentData, setDeleteCommentData] = useState(null);
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
      // Buscar da nova rota de admin segura
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
      setDeleteModalCandidateId(null);
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTriggerDeleteComment = (candidateGuid, commentId) => {
    setDeleteCommentData({ candidateGuid, commentId });
  };

  const executeDeleteComment = async () => {
    if (!deleteCommentData) return;

    const { candidateGuid, commentId } = deleteCommentData;
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
      const newData = await fetch(
        "http://localhost:3001/api/admin/candidates",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((res) => res.json());
      setCandidates(newData);

      // Encontra o candidato atualizado nos novos dados e reabre o modal
      const updatedCandidate = newData.find((c) => c.guid === candidateGuid);
      if (updatedCandidate) {
        setViewModalCandidate(updatedCandidate);
      } else {
        setViewModalCandidate(null);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteCommentData(null);
    }
  };

  if (loading)
    return (
      <main className={`p-8 bg-gray-900 min-h-screen`}>
        <p className="font-mono text-cyan-300 text-center">
          // Carregando dados do painel de controle...
        </p>
      </main>
    );

  if (error)
    return (
      <main className={`p-8 bg-gray-900 min-h-screen`}>
        <p className="font-mono text-red-400 text-center">// ERRO: {error}</p>
      </main>
    );

  return (
    <main className="p-8 bg-gradient-to-b from-gray-900 to-gray-950 text-white min-h-screen">
      <section className="max-w-7xl mx-auto">
        <h1 className="font-orbitron text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Painel de Controle
        </h1>
        <div className="overflow-x-auto">
          <div className="w-full bg-gray-900/80 backdrop-blur-sm border border-blue-900/30 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-900/50">
                  <th className="p-4 text-left font-roboto-mono text-sm uppercase text-cyan-300">
                    Nome
                  </th>
                  <th className="p-4 text-left font-roboto-mono text-sm uppercase text-cyan-300">
                    Email
                  </th>
                  <th className="p-4 text-left font-roboto-mono text-sm uppercase text-cyan-300">
                    Comentários
                  </th>
                  <th className="p-4 text-center font-roboto-mono text-sm uppercase text-cyan-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="p-4 font-roboto text-gray-200">{c.name}</td>
                    <td className="p-4 font-roboto text-gray-400">{c.email}</td>
                    <td className="p-4 font-roboto text-gray-200">
                      {c.comments.length}
                    </td>
                    <td className="p-4 text-center space-x-4">
                      <button
                        onClick={() => setViewModalCandidate(c)}
                        className="font-roboto text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => setDeleteModalCandidateId(c.guid)}
                        className="font-roboto text-red-500 hover:text-red-400 font-semibold"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CandidateDetailModal
        candidate={viewModalCandidate}
        onClose={() => setViewModalCandidate(null)}
        onDeleteComment={handleTriggerDeleteComment}
      />

      {deleteModalCandidateId && (
        <ConfirmationModal
          message="Tem certeza que deseja deletar este candidato? Esta ação é irreversível."
          onConfirm={handleDeleteCandidate}
          onCancel={() => setDeleteModalCandidateId(null)}
        />
      )}

      {deleteCommentData && (
        <ConfirmationModal
          message="Tem certeza que deseja deletar este comentário?"
          onConfirm={executeDeleteComment}
          onCancel={() => setDeleteCommentData(null)}
        />
      )}
    </main>
  );
}
