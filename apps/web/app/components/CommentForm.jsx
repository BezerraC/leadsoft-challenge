'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CommentForm({ candidateId }) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!author || !text) {
      setError('Nome e comentário são obrigatórios.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/candidates/${candidateId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Falha ao enviar comentário');
      }

      // Limpa os campos
      setAuthor('');
      setText('');
      
      router.refresh();

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2 border-t border-gray-700">
      <h4 className="text-sm font-semibold text-gray-300">Deixar um comentário</h4>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Seu nome"
        className="w-full p-2 rounded-md bg-gray-900 text-gray-300 border border-gray-600 text-sm"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Seu comentário..."
        rows={2}
        className="w-full p-2 rounded-md bg-gray-900 text-gray-300 border border-gray-600 text-sm"
      />
      <button type="submit" className="px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-semibold">
        Enviar
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </form>
  );
}