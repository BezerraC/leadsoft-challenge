import Link from "next/link";
import { CommentForm } from './components/CommentForm';

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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section (Landing Page) */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
         LeadSoft
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
          Estamos procurando os melhores talentos para embarcar nessa jornada
          inovadora. Você tem o que é preciso para fazer parte da nossa
          tripulação?
        </p>
        <div className="mt-8">
          <Link
            href="/register"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-semibold transition-all"
          >
            Publique Agora
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nossa Galeria
        </h2>

        {candidates.length === 0 ? (
          <p className="text-center text-gray-500">
            Ainda não há candidatos. Seja o primeiro!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
                
                {/* Imagem */}
                <div className="aspect-square relative">
                  <img 
                    src={`http://localhost:3001/api/candidates/${candidate.id}/photo`} 
                    alt={`Foto de ${candidate.name}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                
                {/* Legenda */}
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{candidate.name}</h3>
                  <p className="text-gray-400 text-sm mt-2 italic">"{candidate.legend}"</p>
                </div>

                {/* Lista de Comentários */}
                <div className="p-4 space-y-2 flex-1">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Comentários ({candidate.comments.length})
                  </h4>
                  {candidate.comments.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">Seja o primeiro a comentar!</p>
                  ) : (
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                      {candidate.comments.map((comment, index) => (
                        <li key={index} className="text-xs p-2 bg-gray-700 rounded-md">
                          <strong className="text-purple-300">{comment.author}:</strong>
                          <p className="text-gray-300">{comment.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Formulario para Comentários */}
                <CommentForm candidateId={candidate.id} />
                
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
