import Link from "next/link";
import { CandidateCard } from "./components/CandidateCard";

async function getCandidates() {
  try {
    const res = await fetch("http://localhost:3001/api/candidates", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Falha ao buscar candidatos");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function LandingPage() {
  const candidates = await getCandidates();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 p-3">
          MISSÃO MARTE
        </h1>
        <p className="font-roboto-mono text-lg text-blue-200 max-w-2xl mx-auto">
          Estamos procurando os melhores talentos para embarcar nessa jornada
          inovadora. Você tem o que é preciso para fazer parte da nossa
          tripulação?
        </p>
        <div className="mt-8">
          <Link
            href="/register"
            className="font-orbitron uppercase tracking-wider px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-cyan-400 hover:to-blue-600 rounded-full text-lg text-white transition-all duration-300 shadow-lg shadow-cyan-500/20"
          >
            Alistar-se na Tripulação
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pb-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-orbitron text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          | Painel de Candidatos
        </h2>

        {candidates.length === 0 ? (
          <p className="font-roboto-mono text-center text-gray-500 font-mono">
            // NENHUM SINAL DETECTADO... SEJA O PRIMEIRO!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
